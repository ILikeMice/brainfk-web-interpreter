const separator = document.getElementById("separator");
const codeWrapper = document.getElementById("codewrapper");
const output = document.getElementById("output");
const code = document.getElementById("code");
const inputtext = document.getElementById("inputtext");
const lineNums = document.getElementById("linenums");
const runBtn = document.getElementById("runbtn");
const files = document.getElementsByClassName("filediv");
const addfilebtn = document.getElementById("addfilebtn");
const cat = document.getElementById("cat");

var currentfile;
var selectedfile = 1;
var filecontent = { 1: "" };

code.addEventListener("input", function () {
    filecontent[selectedfile] = code.value;
});

separator.addEventListener("mousedown", (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
});

let controller = new AbortController(); // Create a new AbortController instance
let signal = controller.signal; // Get the signal from the controller

async function runCode() {
    output.innerHTML = "";

    let codetxt = code.value.replace(/\+/g, "%2B");
    let input = inputtext.value;
    console.log(code);

    try {
        let res = await fetch(
            `/.netlify/functions/interpreter?code=${codetxt}&input=${input}`,
            { signal: signal }
        );

        let text = await res.text();
        console.log(text);
        output.innerText = text;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Fetch error:', error);
        }
    }
};

function stopCode() {
    console.log("Aborted!");
    controller.abort();
    output.value = "Stopped!";

    // Create a new AbortController for the next fetch operation
    controller = new AbortController();
    signal = controller.signal;
}


document.addEventListener("mousedown", function (e) {
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

    console.log(e.target.className);
    if (e.target.className != "dropcontent") {
        console.log("abx");
        let dropdowns = document.getElementsByClassName("dropcontent");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.maxHeight = 0;
        }
    }
});

// i love writing barely readable code

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
        for (
            let i = 0;
            i < document.getElementsByClassName("filediv").length;
            i++
        ) {
            document.getElementsByClassName("filediv")[
                i
            ].style.backgroundColor = "#333";
        }
        files[i].style.backgroundColor = "#242424";
        filecontent[selectedfile] = code.value;
        selectedfile = files[i].id;
        code.value = filecontent[files[i].id];
    });
}

addfilebtn.onclick = () => {
    var newfile = document.createElement("div");
    newfile.className = "filediv";
    newfile.id = document.getElementsByClassName("filediv").length + 1;
    filecontent[newfile.id] = "";
    selectedfile = newfile.id;
    code.value = "";
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
        for (
            let i = 0;
            i < document.getElementsByClassName("filediv").length;
            i++
        ) {
            document.getElementsByClassName("filediv")[
                i
            ].style.backgroundColor = "#333";
        }
        newfile.style.backgroundColor = "#242424";
        console.log(selectedfile, filecontent);
        filecontent[selectedfile] = code.value;
        selectedfile = newfile.id;

        code.value = filecontent[selectedfile];
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

function showdropdown(id) {
    var dropdown = document.getElementById(id);
    console.log(dropdown);
    let dropdownitems = dropdown.children.length;
    let height = 20 * dropdownitems;

    dropdown.style.maxHeight = height + "px";
}

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

function exportCurrent() {
    let linkcontent = code.value;
    let linkname = document.getElementById(selectedfile).innerText;
    let blob = new Blob([linkcontent], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = linkname;

    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
}

function exportAll() {
    for (let i = 1; i <= Object.keys(filecontent).length; i++) {
        let linkcontent = filecontent[i];
        let linkname = document.getElementById(i).innerText;
        let blob = new Blob([linkcontent], { type: "text/plain" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = linkname;

        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
    }
}

function importFile(usrdata, filename) {
    const file = usrdata.files[0];
    if (!file) {
        alert("No file selected!");
        return;
    }
    console.log("importing");
    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            var impfilecontent = event.target.result;
            console.log(filecontent);

            //  this makes new file div trust
            let newfile = document.createElement("div");
            newfile.className = "filediv";
            newfile.innerText = filename;
            newfile.id = document.getElementsByClassName("filediv").length + 1;
            filecontent[newfile.id] = impfilecontent;
            selectedfile = newfile.id;
            code.value = impfilecontent;
            newfile.addEventListener("dblclick", function (e) {
                console.log("1233214");
                if (e.target != currentfile) {
                    currentfile = e.target;
                    //console.log("123", e.target.innerHTML);
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
                for (
                    let i = 0;
                    i < document.getElementsByClassName("filediv").length;
                    i++
                ) {
                    document.getElementsByClassName("filediv")[
                        i
                    ].style.backgroundColor = "#333";
                }
                newfile.style.backgroundColor = "#242424";
                console.log(selectedfile, filecontent);
                filecontent[selectedfile] = code.value;
                selectedfile = newfile.id;

                code.value = filecontent[selectedfile];
            });

            document.getElementById("addfilebtn").remove();
            document.getElementById("filebar").appendChild(newfile);
            document.getElementById("filebar").appendChild(addfilebtn);
            currentfile = newfile;
        } catch (e) {
            alert("Error reading JSON file: " + e.message);
        }
    };

    reader.readAsText(file);
}

async function showCat() {
    let cat = document.getElementById("cat");
    var containerwrapper = document.getElementById("container");
    let space = containerwrapper.getBoundingClientRect().left;
    console.log(
        containerwrapper.offsetLeft,
        containerwrapper.offsetWidth,
        window.innerWidth
    );
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    if (cat.style.left == 0) {
        cat.style.left = "-" + space + "px";

        await delay(5000);

        cat.style.height = space + "px";
    } else {
        console.log("shrinking");
        cat.style.height = "20px";
        await delay(5000);
        cat.style.left = "0";
    }
}
