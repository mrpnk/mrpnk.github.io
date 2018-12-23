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
    console.log("startAni");
    timer = setInterval(frame, frametime * 1000.0);
}

function pauseAni()
{
    clearInterval(timer);
}


//----------------------------------------------------------------------------

var pltimer;
var pltime = 0.0;
var queue = [];
var towers = [[5,4,3, 2, 1], [], []];
var startTime;


function plframe() {
    var canvas = document.getElementById("prolog_view");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var timePassed = (Date.now() - startTime)/1000;
    startTime = Date.now();
    pltime += timePassed;

    var steptime = 0.8;
    if (pltime > steptime) {
        if (queue.length > 0) {
            var action = queue[0];
            queue.shift();
            towers[action[1]].push(towers[action[0]][towers[action[0]].length - 1]);
            towers[action[0]].pop();
            pltime -= steptime;
        }
        else { clearInterval(pltimer); }
    }

    var w = canvas.width;
    var h = canvas.height;

    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(20, h-20);
    ctx.lineTo(w-20, h-20);
    ctx.stroke();

    ctx.fillStyle = "white";
    for (var i = 0; i < towers.length; i++) {
        var cx = w / 6 + i*w/3;
        ctx.beginPath();
        ctx.moveTo(cx, h - 20);
        ctx.lineTo(cx, h - 80);
        ctx.stroke();
        for (var j = 0; j < towers[i].length; j++) {
            var s = towers[i][j];
            var cy = h - 30 - j * 15;
            ctx.beginPath();
            ctx.rect(cx - 8*s, cy - 5, 16*s, 10);
            ctx.fill();
        }
    }

}

function plcb(from,to)
{
    //var plOut = document.getElementById("prolog_out");
    //var wr = document.createElement("div");
    //wr.setAttribute("style", " border-radius: 6px; border: 2px solid red; padding: 2px; margin: 3px;");
    //var tn = document.createTextNode("move " + from + " to " + to);
    //wr.appendChild(tn);
    //plOut.appendChild(wr);

    queue.push([from,to]);
}

function startPL()
{
    var iFrame = document.getElementById("frdummy");
    var stringContent = iFrame.contentWindow.document.body.childNodes[0].innerHTML;
    var session = pl.create();
    session.consult(stringContent);

    var plView = document.getElementById("prolog_view");
    var plOut = document.getElementById("prolog_out");

    plOut.innerText = "";
    var lines = stringContent.split('\n');
    var found;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] == "%takehere")
            found = true;
        else if (lines[i] == "%takeend") break;
        else if (found) {
            //var tn = document.createTextNode(lines[i]);
            //plOut.appendChild(tn);
            plOut.innerText += lines[i] + "\n";
        }
    }
        
    //var callback = function (subst)
    //{
    //    var wr = document.createElement("div");
    //    wr.setAttribute("style", " border-radius: 6px; border: 1px solid black; padding: 2px; margin: 3px;");
    //    var tn = document.createTextNode(pl.format_answer(subst));
    //    wr.appendChild(tn);
    //    plOut.appendChild(wr);
    //};
    session.query("moveac(0,1,2,5).");
    session.answer();
    //for (var i = 0; i < 5; i++)
    //    session.answer(callback);

    startTime = Date.now();
    pltimer = setInterval(plframe, frametime * 1000.0);
}
