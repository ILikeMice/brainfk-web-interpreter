const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

class Token {
    constructor(type) {
        this.type = type;
    }
}

class Interpreter {
    constructor(text, inp) {
        this.input = inp || ""; // Default to an empty string if input is not provided
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
            this.pos++; // Skip invalid characters
            return this.next_token();
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
        let output = "";
        let usrinput = this.input;
        this.current_token = this.next_token();

        while (this.current_token && this.current_token.type != "EOF") {
            let currtokentype = this.current_token.type;
            if (currtokentype == "]") {
                if (
                    this.loops.hasOwnProperty(this.pos - 1) &&
                    this.memory[this.loops[this.pos - 1][1]] != 0
                ) {
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
                if (usrinput.length > 0) {
                    this.memory[this.current_pointer] = usrinput.shift().charCodeAt(0);
                } else {
                    this.memory[this.current_pointer] = 0; 
                }
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
        return output;
    }
}

router.get("/", async (req, res) => {
    let code = req.query.code ? req.query.code.trim() : "";
    let input = req.query.input || "";

    try {
        const result = new Interpreter(code, input).expr();
        res.send(result);
    } catch (error) {
        console.error("Error during interpretation:", error);
        res.status(500).send("An error occurred during code interpretation.");
    }
});

app.use("/.netlify/functions/interpreter", router);
module.exports.handler = serverless(app);           