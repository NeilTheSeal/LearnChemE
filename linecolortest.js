canvas = document.getElementById("cv");        
ctx = this.canvas.getContext('2d');

ctx.strokeStyle = "green";
ctx.lineWidth = 10;
ctx.moveTo(50, 50);
ctx.lineTo(300, 50);
ctx.stroke();

// hacky clear
canvas.width = canvas.width;

ctx.beginPath();
ctx.strokeStyle = "black";
ctx.lineWidth = 10;
ctx.moveTo(10, 10);
ctx.lineTo(300, 300);
ctx.lineTo(150, 300);
ctx.stroke();

//ctx.closePath();

ctx.beginPath();
ctx.strokeStyle = "red";
ctx.lineWidth = 2;
ctx.moveTo(300, 10);
ctx.lineTo(10, 300);
ctx.lineTo(10, 150);
ctx.stroke();

