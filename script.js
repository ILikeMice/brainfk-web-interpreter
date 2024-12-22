const separator = document.getElementById("separator");
const codeWrapper = document.getElementById("codewrapper");
const output = document.getElementById("output");
const code = document.getElementById("code");
const inputtext = document.getElementById("inputtext");
const lineNums = document.getElementById("linenums");
const runBtn = document.getElementById("runbtn");
const files = document.getElementsByClassName("filediv");
const addfilebtn = document.getElementById("addfilebtn");

var currentfile;
var selectedfile = 1;
var filecontent = {1: ""}


separator.addEventListener("mousedown", (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
});

runBtn.addEventListener("click", async function () {
    output.innerHTML = "";
    let codetxt = code.value.replace(/\+/g, "%2B");
    let input = inputtext.value;
    console.log(code);
    let res = await fetch(
        `/.netlify/functions/interpreter?code=${codetxt}&input=${input}`
    );

    res.text().then(function (text) {
        console.log(text);
        output.innerText = text;
    });
});

document.addEventListener("mouseup", function (e) {
    //console.log("currentfile:", currentfile)
    //console.log(e.target)
    //console.log(e.target.className)
    if (e.target != currentfile && e.target.className != "filenameinp") {
        try {
            var filename =
                currentfile.getElementsByClassName("filenameinp")[0].value;
            //console.log(filename.length)
            //console.log(filename.length)
            //console.log("a", currentfile.parentNode)
            if (filename.length > 0) {
                //console.log("closing")
                currentfile.innerHTML = "";
                currentfile.innerText = filename;
                currentfile = "";
            } else {
                console.log("removing");
                currentfile.parentNode.removeChild(currentfile);
            }
        } catch {}
    }
});

for (let i = 0; i < files.length; i++) {
    files[i].addEventListener("dblclick", function (e) {
        if (e.target != currentfile) {
            currentfile = e.target;
            //console.log(e.target.innerHTML);
            let input = document.createElement("input");
            input.type = "text";
            input.className = "filenameinp";
            input.value = e.target.innerText;
            input.addEventListener("keypress", function (b) {
                console.log("g");
                if (b.code == "Enter") {
                    console.log("abx");
                    if (input.value.length > 0) {
                        input.parentNode.innerText = input.value;
                        currentfile = "";
                    } else {
                        input.parentNode.remove();
                    }
                }
            });
            e.target.innerHTML = "";
            e.target.appendChild(input);
        }
    });

    files[i].addEventListener("click", function (v) {
        for (let i = 0; i < document.getElementsByClassName("filediv").length; i++) {
            document.getElementsByClassName("filediv")[i].style.backgroundColor = "#333"
        }
        files[i].style.backgroundColor = "#242424"
        filecontent[selectedfile] = code.value
        selectedfile = files[i].id
        code.value = filecontent[files[i].id]
    })
}

addfilebtn.onclick = () => {
    var newfile = document.createElement("div");
    newfile.className = "filediv";
    newfile.id = document.getElementsByClassName("filediv").length + 1;
    filecontent[newfile.id] = ""
    selectedfile = newfile.id
    code.value = ""
    newfile.addEventListener("dblclick", function (e) {
        console.log("1233214");
        if (e.target != currentfile) {
            currentfile = e.target;
            //console.log(e.target.innerHTML);
            let input = document.createElement("input");
            input.type = "text";
            input.className = "filenameinp";
            input.addEventListener("keypress", function (b) {
                if (b.code == "Enter") {
                    console.log("abx");
                    if (input.value.length > 0) {
                        input.parentNode.innerText = input.value;
                        currentfile = "";
                    } else {
                        input.parentNode.remove();
                    }
                }
            });
            input.value = e.target.innerText;
            e.target.innerHTML = "";
            e.target.appendChild(input);
        }
    });

    newfile.addEventListener("click", function (v) {
        for (let i = 0; i < document.getElementsByClassName("filediv").length; i++) {
            document.getElementsByClassName("filediv")[i].style.backgroundColor = "#333"
        }
        newfile.style.backgroundColor = "#242424"
        console.log(selectedfile, filecontent)
        filecontent[selectedfile] = code.value
        selectedfile = newfile.id
        
        code.value = filecontent[selectedfile]
    });

    var fileinp = document.createElement("input");
    fileinp.type = "text";
    fileinp.className = "filenameinp";
    fileinp.addEventListener("keypress", function (b) {
        if (b.code == "Enter") {
            console.log("abx");
            if (fileinp.value.length > 0) {
                fileinp.parentNode.innerText = fileinp.value;
                currentfile = "";
            } else {
                fileinp.parentNode.remove();
            }
        }
    });

    newfile.appendChild(fileinp);

    document.getElementById("addfilebtn").remove();
    document.getElementById("filebar").appendChild(newfile);
    document.getElementById("filebar").appendChild(addfilebtn);
    currentfile = newfile;
};

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
