var emptyField = " ";
function settingVariables() {
    var x = 15; //prompt("Zadej první číslo:", "");
    var width = parseInt(x);
    var y = 15;// prompt("Zadej druhé číslo:", "");
    var height = parseInt(y);
    //typ křížovky 
    console.log("Start");
    var isBritish = true;
    var isCzechLanguage = true;
    if (height > 0 && width > 0) {
        document.documentElement.style.setProperty('--rows', x);
        document.documentElement.style.setProperty('--columns', y);
        document.documentElement.style.setProperty('--max-table-height', (y * 80) + "px");
    }
    else {
        console.error("Chybně zadané vstupní hodnoty!");
        return;
    }

    generateGrid(width, height);
    $.ajax({
        url: "/Home/Generate",
        type: "POST",
        data: { width: width, height: height, isBritish: isBritish, isCzechLanguage: isCzechLanguage },
        success: function (response) {
            const data = response.crossword;
            var cluesHorizontal;
            var cluesVertical;
            if (isBritish) {
                cluesHorizontal = response.cluesHorizontal;
                cluesVertical = response.cluesVertical;
                printLegends(cluesHorizontal, cluesVertical, isCzechLanguage);
            }

            var index = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const cellContent = data[x * height + y];
                    index++;
                    if (cellContent != null) {
                        if (cellContent.length < 3) {
                            if (cellContent != emptyField) {
                                letter(x, y);
                                setCellContent(cellContent, x, y);
                                lockMaxInputLength(x, y, isCzechLanguage);

                            } else if (isBritish) {
                                setCellBackgroundCollor("black", x, y);

                            }
                        } else {
                            clueCell(cellContent, x, y);
                        }
                    }
                }
            }
            if (isBritish) {
                setCluesIndexes(data, width, height);
            } else {
                CellsWithSecret(data, width, height, isCzechLanguage);
            }

        }
    });
}

function letter(x, y) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    const textArea = document.createElement('textarea');
    textArea.classList.add("letter");
    cell.appendChild(textArea);
}

function setCluesIndexes(data, width, height) {
    var indexHor = 1;
    var indexVer = 1;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            if (data[x * height + y] == emptyField) continue;
            if (x > 0 && x + 1 < width && data[(x - 1) * height + y] == emptyField && data[(x + 1) * height + y] != emptyField) {
                setClueIndex(x, y, indexHor);
                indexHor++;
            }
            if (x == 0 && data[(x + 1) * height + y] != emptyField) {
                setClueIndex(x, y, indexHor);
                indexHor++;
            }

            if (y > 0 && y + 1 < height && data[x * height + y - 1] == emptyField && data[x * height + y + 1] != emptyField) {
                setClueIndex(x, y, indexVer);
                indexVer++;
            }

            if (y == 0 && data[x * height + y + 1] != emptyField) {
                setClueIndex(x, y, indexVer);
                indexVer++;
            }
        }
    }
}

function setClueIndex(x, y, index) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    const existingIndex = cell.querySelector('.clue-index');
    if (!existingIndex) {
        const indexEl = document.createElement('span');
        indexEl.classList.add("clue-index");
        indexEl.textContent = index;
        indexEl.contentEditable = false;
        cell.appendChild(indexEl);
    }
    else {
        existingIndex.textContent = existingIndex.textContent + ", " + index;
    }
}

function CellsWithSecret(data, width, height, isCzechLanguage) {
    var index = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
            var content = cell.textContent; 
            if (content.includes("TAJENKA 1") || content.includes("TAJENKA 2") ||
                content.includes("SECRET 1") || content.includes("SECRET 2")) {
                var i = 1;
                if (content.includes("/TAJENKA ") || content.includes("/SECRET ")) {
                    var clueCell;
                    while (y + i < height && data[x * height + y + i].length < 3) {
                        clueCell = document.querySelector('[data-row="' + x + '"][data-col="' + (y + i) + '"]');
                        clueCell.classList.add("cell-secret");
                        i++;
                    }
                } else {
                    var clueCell;
                    while (x + i < width && data[(x + i) * height + y].length < 3) {
                        clueCell = document.querySelector('[data-row="' + (x + i) + '"][data-col="' + y + '"]');
                        clueCell.classList.add("cell-secret");
                        i++;
                    }
                }
            }
        }
    }
}

function clueCell(content, x, y) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    cell.classList.add("cell-clue");
    cell.textContent = content;
    insertDivider(content, x, y);
}


function allowEditting(x, y) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    cell.setAttribute("id", "editableDiv");
    cell.contentEditable = true;
    lockMaxInputLength(x, y, isCzechLanguage);
}

//vytvoření mřížky na webu
function generateGrid(width, height) {
    $.ajax({
        url: "/Home/GenerateCrossword",
        type: "GET",
        data: { width: width, height: height },
        success: function (result) {
            $("#crosswordResult").html(result);
        }
    });
}

function setCellContent(content, x, y) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    const child = cell.querySelector('textarea');
    child.textContent = content;
}

function setCellBackgroundCollor(color, x, y) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    cell.style.backgroundColor = color;
    cell.contentEditable = false;
}

function printLegends(cluesHor, cluesVer, isCzechLanguage) {

    const ulHor = document.createElement('ul');
    var cluesTextHor = "Clues horizontal: ";
    if (isCzechLanguage) {
        cluesTextHor = "Legendy vodorovné: ";
    }
    var cluesTextVer = "Clues vertical: ";
    if (isCzechLanguage) {
        cluesTextVer = "Legendy svislé: ";
    }
    ulHor.textContent = cluesTextHor;
    var i = 0;
    for (var i = 0; i < cluesHor.length; i++) {
        const li = document.createElement('li');
        const text = document.createTextNode((i + 1) + " " + cluesHor[i]);
        li.appendChild(text);
        ulHor.appendChild(li);
    }
    const ulVer = document.createElement('ul');
    ulVer.textContent = cluesTextVer;

    for (var i = 0; i < cluesVer.length; i++) {
        const li = document.createElement('li');
        const text = document.createTextNode((i + 1) + " " + cluesVer[i]);
        li.appendChild(text);
        ulVer.appendChild(li);
    }

    document.getElementById('cluesHorizontalContainer').appendChild(ulHor);
    document.getElementById('cluesVerticalContainer').appendChild(ulVer);

}

function lockMaxInputLength(x, y, isCzechLanguage) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    const child = cell.querySelector('.letter');
    child.addEventListener('input', () => {
        var content = child.value.toUpperCase();
        if (isCzechLanguage && content.startsWith("CH")) {
            child.value = content.substring(0, 2);
        } else {
            child.value = content.substring(0, 1);
        }
    });
}

function insertDivider(clue, x, y) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    var text = clue;
    if (text.includes('/')) {
        const parts = text.split('/');
        if (parts[0].length < 2) {
            cell.textContent = text.replace("/", "");
            return;
        }
        cell.textContent = "";
        cell.classList.add("both-directions-clue");
        const upperPart = document.createElement('span');
        upperPart.className = 'upper-part';
        upperPart.textContent = parts[0];
        cell.appendChild(upperPart);


        const bottomPart = document.createElement('span');
        bottomPart.className = 'bottom-part';
        bottomPart.textContent = parts[1];
        cell.appendChild(bottomPart);
    }
}


function printCrossword() {
    /*var element = document.getElementById('crosswordResult');
    var printWindow = window.open('', '');
    //printWindow.document.write('<html><head><title>Tisk</title></head><body>');
    printWindow.document.write(element.innerHTML);
    //printWindow.document.write('</body></html>');
    printWindow.document.close();
   
    printWindow.print();
   */
    window.print();
}
document.addEventListener("focus", function (event) {
    if (event.target.closest('.crossword')) {
        lastSelectedElement = event.target;
    }
}, true);

function help() {
    if (lastSelectedElement) {
        console.log("Vybraný prvek:", lastSelectedElement.textContent);
    } else {
        console.log("Žádný prvek není vybrán.");
    }
}