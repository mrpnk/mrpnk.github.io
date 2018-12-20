// animations

var timer;
var time = 0.0;
var frametime = 0.02;
var graph = new Path2D();

function f(x)
{
    return (Math.sin(x/10) + 1) * 200;
}
function frame()
{
    var canvas = document.getElementById("anim_container");   
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    time += frametime;

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(400, 20);
    ctx.lineTo(400, 380);
    ctx.stroke();

    ctx.strokeStyle = "gray";
    var oldx = 200;
    var oldy = 200;
    for (var i = 1; i <= 6; i++)
    {
        var freq = (2 * i - 1);
        var coeff = 1 / (2 * i - 1);

        var x = oldx + Math.cos(time * 0.5 * freq) * 100 * coeff;
        var y = oldy + Math.sin(time * 0.5 * freq) * 100 * coeff;

        ctx.beginPath();
        ctx.arc(oldx, oldy, 100 * coeff, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();

        oldx = x;
        oldy = y;
    }
   
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(400, oldy);
    ctx.stroke();

    var xshift = time * 10;
    graph.lineTo(400 - xshift, oldy);
    ctx.translate(xshift, 0);
    ctx.strokeStyle = "red";
    ctx.stroke(graph);
    ctx.resetTransform();
}


function continueAni()
{
    timer = setInterval(frame, frametime*1000.0);
}


function pauseAni()
{
    clearInterval(timer);

    var canvas = document.getElementById("anim_container");
    var ctx = canvas.getContext("2d");

    //ctx.clearRect(0, 0, canvas.width, canvas.height);
}




