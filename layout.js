
function getAbsoluteHeight(el)
{
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
        parseFloat(styles['marginBottom']);

    return Math.ceil(el.offsetHeight + margin);
}


var COL_COUNT = 3; // set this to however many columns you want
var col_heights = [],
    container = document.getElementById('mygrid');

for (var i = 0; i <= COL_COUNT; i++) {
    col_heights.push(0);
}
for (var i = 0; i < container.children.length; i++) {
    var order = (i + 1) % COL_COUNT || COL_COUNT;
    container.children[i].style.order = order;
    col_heights[order] += parseFloat(getAbsoluteHeight(container.children[i]));
}
var highest = Math.max.apply(Math, col_heights);
container.style.height = (highest+5) + 'px';



