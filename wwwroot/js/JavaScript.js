function settingVariables() {
    var x = prompt("Zadej první číslo:", "");
    var width = parseInt(x);
    var y = prompt("Zadej druhé číslo:", "");
    var height = parseInt(y);
    //typ křížovky 
    var isBritish = false;
    var isCzechLanguage = true;
    if (height > 0 && width > 0) {
        document.documentElement.style.setProperty('--rows', x);
        document.documentElement.style.setProperty('--columns', y);
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
            if (isBritish) {
                const legendsHor = response.cluesHorizontal;
                const legendsVer = response.cluesVertical;
                console.log(legendsHor);
                console.log(legendsVer);
                printLegends(legendsHor, legendsVer);
            }

            var index = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const cellContent = data[x * height + y];
                    index++;
                    if (cellContent != null) {
                        setCellContent(cellContent, x, y);
                        if (cellContent.length < 3) {
                            allowEditting(x, y);
                        }
                    }
                }
            }
            if (!isBritish) {
                clueCells(data, width, height);
                SecretCells(data, width, height, isCzechLanguage);
            }
        }
    });
}

function SecretCells(data, width, height, isCzechLanguage) {
    var index = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
            var content = cell.textContent; //data[x * height + y];
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

function clueCells(data, width, height) {
    var index = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
            var content = cell.textContent;
            if (content.length > 2) {
                cell.classList.add("cell-clue");
            }
        }
    }
}

function allowEditting(x, y) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    cell.contentEditable = "true";
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
    cell.textContent = content;
}

function setCellBackgroundCollor(color, x, y) {
    const cell = document.querySelector('[data-row="' + x + '"][data-col="' + y + '"]');
    cell.style.backgroundColor = color;
}

function printLegends(cluesHor, cluesVer) {

    const ulHor = document.createElement('ul');
    var i = 0;
    for (var i = 0; i < cluesHor.length; i++) {
        const li = document.createElement('li');
        const text = document.createTextNode((i + 1) + " " + cluesHor[i]);
        li.appendChild(text);
        ulHor.appendChild(li);
    }
    const ulVer = document.createElement('ul');

    for (var i = 0; i < cluesVer.length; i++) {
        const li = document.createElement('li');
        const text = document.createTextNode((i + 1) + " " + cluesVer[i]);
        li.appendChild(text);
        ulVer.appendChild(li);
    }

    document.getElementById('legendsHorizontalContainer').appendChild(ulHor);
    document.getElementById('legendsVerticalContainer').appendChild(ulVer);

}