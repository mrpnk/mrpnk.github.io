
function getAbsoluteHeight(el)
{
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
        parseFloat(styles['marginBottom']);

    return Math.ceil(el.offsetHeight + margin);
}
function getAbsoluteWidth(el) {
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginLeft']) +
        parseFloat(styles['marginRight']);

    return Math.ceil(el.offsetWidth+ margin);
}

function layoutGallery()
{
    var container = document.getElementById('gallery');
    var a = container.offsetWidth;
    var b = getAbsoluteWidth(container.children[0]);

    var COL_COUNT = Math.floor(a / b);
    var col_heights = [];

    for (var i = 0; i <= COL_COUNT; i++) {
        col_heights.push(0);
    }
    for (var i = 0; i < container.children.length; i++) {
        var order = (i + 1) % COL_COUNT || COL_COUNT;
        container.children[i].style.order = order;
        col_heights[order] += parseFloat(getAbsoluteHeight(container.children[i]));
    }
    var highest = Math.max.apply(Math, col_heights);
    container.style.height = (highest + 5) + 'px';
}
const myObserver = new ResizeObserver(layoutGallery);

function onloadGallery()
{
    console.log("orderGallery");
    
    myObserver.observe(document.getElementById('gallery'));
}

