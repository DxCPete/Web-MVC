function settingVariables() {
    var x = prompt("Zadej první číslo:", "");
    var width = parseInt(x);
    var y = prompt("Zadej druhé číslo:", "");
    var height = parseInt(y);
    //typ křížovky 
    var isBritish = false;
    if (height > 0 && width > 0) {
        document.documentElement.style.setProperty('--rows', x);
        document.documentElement.style.setProperty('--columns', y);
    }
    else {
        console.error("Chybně zadané vstupní hodnoty!");
        return;
    }

    //vytvoření mřížky na webu
    $.ajax({
        url: "/Home/GenerateCrossword",
        type: "GET",
        data: { width: width, height: height },
        success: function (result) {
            $("#crosswordResult").html(result);
        }
    });


    // začne generovat křížovku a zapíše jí do vytvořené mřížky



    $.ajax({
        url: "/Home/Generate",
        type: "POST",
        data: { width: width, height: height, british: false },
        success: function (response) {
            GenerateGrid();
            const data = response.crossword;
            if (isBritish) {
                const legendsHor = response.cluesHorizontal;
                const legendsVer = response.cluesVertical;
                console.log(legendsHor);
                console.log(legendsVer);
                printLegends(legendsHor, legendsVer);
            }


            var index = 0;
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const cellContent = data[index];
                    index++;
                    if (cellContent != " " && cellContent != null) {
                        setCellContent(cellContent, i, j);
                    }
                }
            }
        }
    });

}

function GenerateGrid() {

}

function setCellContent(content, x, y) {
    const cell = document.querySelector('[data-row="' + y + '"][data-col="' + x + '"]');
    cell.textContent = content;
}

function setCellBackgroundCollor(color, x, y) {
    const cell = document.querySelector('[data-row="' + y + '"][data-col="' + x + '"]');
    cell.style.backgroundColor = color;
}

function printLegends(cluesHor, cluesVer) {

    const ulHor = document.createElement('ul');
    var i = 0;
    for (var i = 0; i < cluesHor.length; i++) {
        const li = document.createElement('li');
        const text = document.createTextNode((i+1) + " " + cluesHor[i]);
        li.appendChild(text);
        ulHor.appendChild(li);
    }
    const ulVer = document.createElement('ul');

    for (var i = 0; i < cluesVer.length; i++) {
        const li = document.createElement('li');
        const text = document.createTextNode((i+1) + " " + cluesVer[i]);
        li.appendChild(text);
        ulVer.appendChild(li);
    }

    document.getElementById('legendsHorizontalContainer').appendChild(ulHor);
    document.getElementById('legendsVerticalContainer').appendChild(ulVer);

}