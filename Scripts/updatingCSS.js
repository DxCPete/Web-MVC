+function settingVariables() {
    var x = prompt("Zadej první číslo:", "");
    var y = prompt("Zadej druhé číslo:", "");
    if (x != null && y != null) {
        updateCrosswordGridSize(x, y);
        document.getElementById("ViewBag.width").value = x;
        document.getElementById("ViewBag.height").value = y;
        document.documentElement.style.setProperty('--rows', x);
        document.documentElement.style.setProperty('--columns', y);
    }

}