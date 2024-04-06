function settingVariables() {
    var x = prompt("Zadej první číslo:", "");
    var width = parseInt(x);
    var y = prompt("Zadej druhé číslo:", "");
    var height = parseInt(y);
    //    console.log(x + "   " y);
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
            // Výsledek je zde zobrazen v divu s id "crosswordResult"
            $("#crosswordResult").html(result);
        }
    });


    // začne generovat křížovku a zapíše jí do vytvořené mřížky
    if (true) {
        $.ajax({
            url: "/Home/Generate",
            type: "POST",
            data: { width: width, height: height },
            success: function (response) {
                const data = response.crossword;
                const legendsHor = response.legendsHorizontal;
                const legendsVer = response.legendsVertical;
                console.log(legendsHor);
                console.log(legendsVer);
                //printLegends(legendsHor, legendsVer);


                var index = 0;
                for (let i = 0; i < height; i++) {
                    for (let j = 0; j < width; j++) {
                        const cellContent = data[index];
                        console.log(cellContent);
                        index++;
                        if (cellContent != " " && cellContent != null) {
                            setCellContent(cellContent, j, i);
                        }
                    }
                }
                /* document.getElementsByName("legendsHorizontal")[0].value = legendsHor;
                 document.getElementsByName("legendsVertical")[0].value = legendsVer;*/

            }
        });
    }
}


function setCellContent(content, x, y) {
    console.log(content + " " + x + " " + y)
    const cell = document.querySelector('[data-row="' + y + '"][data-col="' + x + '"]');
    cell.textContent = content;
}

function printLegends(legendsHor, legendsVer) {

    const ulHor = document.createElement('ul');
    var i = 0;
    while (legendsHor[i] !== null) {
        console.log(i);
        const li = document.createElement('li');
        const text = document.createTextNode(legendsHor[i].legend);
        li.appendChild(text);
        ulHor.appendChild(li);
        i++;
    }
    const ulVer = document.createElement('ul');
    var j = 0;
    while (legendsVer[j] !== null) {
        const li = document.createElement('li');
        const text = document.createTextNode(legendsVer[j].legend);
        li.appendChild(text);
        ulVer.appendChild(li);
        j++;
    }

    document.getElementById('legendsHorizontalContainer').appendChild(ulHor);
    document.getElementById('legendsVerticalContainer').appendChild(ulVer);

}