var [EOF, PLUS, MINUS, RIGHT, LEFT, LOOPSTART, LOOPEND, INPUT, OUTPUT] = ["EOF", "PLUS", "MINUS", "RIGHT", "LEFT", "LOOPSTART", "LOOPEND", "INPUT", "OUTPUT"];
let TokenTypes = [EOF, PLUS, MINUS, RIGHT, LEFT, LOOPSTART, LOOPEND, INPUT, OUTPUT]


class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Interpreter {
    constructor(text) {
        this.text = text
        this.pos = 0
        this.current_token = null
        this.loops = {}
        this.loop_pointers = []
        this.current_pointer = 0
        this.memory = {}
    }

    makeError(num) {
        console.error("Error! code: " + num)
    }

    next_token() {
        let text = this.text

        if (this.pos > text.length - 1) {
            return new Token(EOF, null)
        }

        let current_char = text[self.pos]

        if (current_char in TokenTypes) {
            this.pos++
            return new Token(current_char, current_char)
        } else {
            this.makeError(1)
        }

    }

    find_loops() {
        
    }
}