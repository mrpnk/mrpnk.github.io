// animations

var timer;
var time = 0.0;
var frametime = 0.02;
var graph = new Path2D();
var modus = 0;

function getfreq(i) {
    if (modus == 0) {
        return (2 * i - 1); // rectangle
    }
    else if (modus == 1) {
        return i; // sawtooth
    }
    else if (modus == 2) {
        return i+Math.floor((i-1)/2); // doublestep
    }
    else return 0;
}
function getcoeff(i) {
    if (modus == 0) {
        return 2 / (2 * i - 1); // rectangle
    }
    else if (modus == 1) {
        return 3 / (2 * i); // sawtooth
    }
    else if (modus == 2) {
        return 1.5/(i + Math.floor((i - 1) / 2)); // doublestep
    }
    else return 1;
}


function frame()
{
    var canvas = document.getElementById("anim_canvas");   
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    time += frametime;

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(400, 20);
    ctx.lineTo(400, 380);
    ctx.stroke();

    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1;
    var oldx = 200;
    var oldy = 200;
    ctx.beginPath();
    ctx.arc(oldx, oldy, 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
    ctx.fillStyle = "rgb(255,30,20)";
    for (var i = 1; i <= 6; i++)
    {
        var freq = getfreq(i);
        var coeff = getcoeff(i);

        var x = oldx + Math.cos(time * 0.5 * freq) * 50 * coeff;
        var y = oldy + Math.sin(time * 0.5 * freq) * 50 * coeff;

        ctx.beginPath();
        ctx.arc(oldx, oldy, 50 * coeff, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
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
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.stroke(graph);
    ctx.resetTransform();
}

function changeMode(m) {
    modus = m;
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

var numblocks = 6;
var pltimer;
var pltime;
var queue;
var towers;
var startTime;
var stringContent = "";

function plframe() {
    let canvas = document.getElementById("prolog_view");
    let ctx = canvas.getContext("2d");

    let dpi = window.devicePixelRatio;
    let w = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2) * dpi;
    let h = w / 2;
    canvas.setAttribute("width", Math.floor(w));
    canvas.setAttribute("height", h);
    

    //canvas.setAttribute("width", "300");
    //canvas.setAttribute("height", "100");

    ctx.clearRect(0, 0, w, h);

    var timePassed = (Date.now() - startTime)/1000;
    startTime = Date.now();
    pltime += timePassed;

    var steptime = 0.3;
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

    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(20, h-20.5);
    ctx.lineTo(w-20, h-20.5);
    ctx.stroke();

    ctx.fillStyle = "white";
    for (var i = 0; i < towers.length; i++) {
        var cx = w / 6 + i*w/3;
        ctx.beginPath();
        ctx.moveTo(Math.floor(cx)+0.5, h - 20);
        ctx.lineTo(Math.floor(cx)+0.5, h - 80);
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
    queue.push([from,to]);
}

function wrap(str, parts, pre, post)
{
    parts.forEach(function (part) {
        str = str.replace(part, pre + part + post);
    });
    return str;
}
function initTowers() {
    queue = [];
    towers = [[], [], []];
    for (var i = 0; i < numblocks; i++) { towers[0].push(numblocks - i); }
}
function startPL()
{
    if (stringContent == "") return;

    var session = pl.create();
    session.consult(stringContent);

    initTowers();

    //var callback = function (subst)
    //{
    //    var wr = document.createElement("div");
    //    wr.setAttribute("style", " border-radius: 6px; border: 1px solid black; padding: 2px; margin: 3px;");
    //    var tn = document.createTextNode(pl.format_answer(subst));
    //    wr.appendChild(tn);
    //    plOut.appendChild(wr);
    //};
    session.query("moveac(0,1,2,"+numblocks.toString()+").");
    session.answer();
    //for (var i = 0; i < 5; i++)
    //    session.answer(callback);

   
    pltime = 0;
    startTime = Date.now();
    pltimer = setInterval(plframe, frametime * 1000.0);
}
function loadplcode()
{
    var iFrame = document.getElementById("frdummy");
    stringContent = iFrame.contentWindow.document.body.childNodes[0].innerHTML;
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
            //lines[i] = lines[i].replace("\t", "hallo");
            lines[i] = wrap(lines[i], [":-", "."], "<span style=\"color: yellow\">", "</span>");
            plOut.innerHTML += lines[i] + "\n";
        }
    }
    var query = "?- moveac(a,b,c," + numblocks.toString() + ")."
    query = wrap(query, ["?-", "."], "<span style=\"color: yellow\">", "</span>");
    plOut.innerHTML += query + "\n";
}
function firstFrame()
{
    frame();

    initTowers();
    plframe();
}

function pauseContinueTowers() {
    if (pltimer) {
        clearInterval(pltimer);
        pltimer = null;
    }
    else {
        startTime = Date.now();
        pltimer = setInterval(plframe, frametime * 1000.0);
    }
}


