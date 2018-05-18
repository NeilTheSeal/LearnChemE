var canvas1size = 300;
var canvas1b = document.getElementById("cvs1back");
canvas1b.height = canvas1size;
canvas1b.width = canvas1size+100;
var ctx1b = canvas1b.getContext("2d");
ctx1b.fillStyle = "red";
ctx1b.fillRect(0, 0, canvas1b.width, canvas1b.height);

var canvas1f = document.getElementById("cvs1front");
canvas1f.height = canvas1size;
canvas1f.width = canvas1size+100;
var ctx1f = canvas1b.getContext("2d");
ctx1f.fillStyle = "black";
ctx1f.fillRect(10, 10, canvas1f.width-20, canvas1f.height-20);

canvas2size = 100;
var canvas2b = document.getElementById("cvs2back");
canvas2b.height = canvas2size;
canvas2b.width = canvas2size;
var ctx2b = canvas2b.getContext("2d");
ctx2b.fillStyle = "gray";
ctx2b.fillRect(0, 0, canvas2b.width, canvas2b.height);