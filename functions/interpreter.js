const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

router.get("/", async (req, res) => {
    let code = req.query.code
    let input = req.query.input

    class Token {
        constructor(type) {
            this.type = type;
        }
    }
    
    class Interpreter {
        constructor(text, inp) {
            this.input = inp
            this.text = text;
            this.pos = 0;
            this.current_token = null;
            this.loops = {};
            this.loop_pointers = [];
            this.current_pointer = 0;
            this.memory = {
                0: 0,
            };
        }
    
        makeError(num) {
            console.error("Error! code: " + num);
        }
    
        next_token() {
            let text = this.text;
    
            if (this.pos > text.length - 1) {
                return new Token("EOF");
            }
    
            let current_char = text[this.pos];
    
            if (["+", "-", ">", "<", "[", "]", ",", "."].includes(current_char)) {
                this.pos++;
                return new Token(current_char, current_char);
            } else {
                this.makeError(1);
            }
        }
    
        find_loops() {
            let used = [];
            let pointer = 0;
            let code = this.text;
    
            for (let i = 0; i < code.length; i++) {
                let startends = 0;
                if (code[i] == ">") {
                    pointer++;
                } else if (code[i] == "<") {
                    pointer--;
                } else if (code[i] == "[" && !used.includes(i)) {
                    for (let b = i; b < code.length; b++) {
                        if (used.includes(b)) {
                            break;
                        } else {
                            if (code[b] == "[") {
                                startends++;
                            }
                            if (code[b] == "]") {
                                startends--;
                            }
    
                            if (startends == 0) {
                                this.loops[b] = [i, pointer];
                                used.push(i, b);
                                break;
                            }
                        }
                    }
                }
            }
        }
    
        expr() {
            this.find_loops();
            console.log(this.loops);
            let output = "";
            let usrinput = this.input; // add the input from get req here
            this.current_token = this.next_token();
    
            while (this.current_token.type != "EOF") {
                let currtokentype = this.current_token.type;
                if (currtokentype == "]") {
                    if (
                        this.loops.hasOwnProperty(this.pos - 1) &&
                        this.memory[this.loops[this.pos - 1][1]] != 0
                    ) {
                        console.log(
                            "looping",
                            this.memory[this.loops[this.pos - 1][1]]
                        );
                        this.pos = this.loops[this.pos - 1][0];
                    }
                }
    
                if (currtokentype == "+") {
                    this.memory[this.current_pointer]++;
                }
    
                if (currtokentype == "-") {
                    this.memory[this.current_pointer]--;
                }
    
                if (currtokentype == ".") {
                    output += String.fromCharCode(
                        this.memory[this.current_pointer]
                    );
                }
    
                if (currtokentype == ",") {
                    this.memory[this.current_pointer] = String.fromCodePoint(
                        usrinput[0]
                    );
                    usrinput[0] = "";
                }
    
                if (currtokentype == ">") {
                    this.current_pointer++;
                    if (!this.memory.hasOwnProperty(this.current_pointer)) {
                        this.memory[this.current_pointer] = 0;
                    }
                }
    
                if (currtokentype == "<") {
                    this.current_pointer--;
                    if (!this.memory.hasOwnProperty(this.current_pointer)) {
                        this.memory[this.current_pointer] = 0;
                    }
                }
    
                this.current_token = this.next_token();
            }
            console.log(this.memory);
            return output;
        }
    }

   return new Interpreter(code, input).expr()
})


app.use("/.netlify/functions/interpreter", router);
module.exports.handler = serverless(app);