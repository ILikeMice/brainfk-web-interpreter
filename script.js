const separator = document.getElementById("separator");
const codeWrapper = document.getElementById("codewrapper");
const output = document.getElementById("output");
const code = document.getElementById("code");
const lineNums = document.getElementById("linenums");
const runBtn = document.getElementById("runbtn");

separator.addEventListener("mousedown", (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
});

runBtn.addEventListener("click", async function () {
    output.innerHTML = "";
    let res = await fetch("/interpreter");
    
    console.log(res);
});

function resize(e) {
    const container = document.querySelector(".container");
    const containerWidth = container.offsetWidth;
    const containerLeft = container.getBoundingClientRect().left;
    const newWidth = ((e.pageX - containerLeft) / containerWidth) * 100;

    if (newWidth >= 0 && newWidth <= 100) {
        codeWrapper.style.width = newWidth + "%";
        output.style.width = 100 - newWidth + "%";
    }
}

function stopResize() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
}

function updateLineNumbers() {
    const lines = code.value.split("\n").length;
    lineNums.innerHTML = "";
    for (let i = 1; i <= lines; i++) {
        const lineNumber = document.createElement("div");
        lineNumber.className = "number";
        lineNumber.textContent = i;
        lineNums.appendChild(lineNumber);
    }
}

code.addEventListener("input", updateLineNumbers);
code.addEventListener("scroll", () => {
    lineNums.scrollTop = code.scrollTop;
});

document.addEventListener("DOMContentLoaded", updateLineNumbers);
