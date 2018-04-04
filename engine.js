/*
    Structure:
    
    ProblemController
        Question[]
            Element[]
*/

/*
TODO:
GraphElement
    add support for drawing:
        multisegment line (length n)
        multisegment straight line (length n)
        point slope line drawing

    add alpha option to elements
    add region element (defined by lines?)
    
    graph/axis making page
*/

// ##### Constants (default values) #####

const IDLENGTH = 16;
const POINTRADIUS = 5;
const POINTCOLOR = "black";
const LINEWIDTH = 2;
const LINECOLOR = "black";
const GRABRADIUS = 10;
const FONTSTYLE = "20px Arial";
const FONTCOLOR = "black";

// ##### Misc functions #####

/*
    Calculates the straight-line distance between two 2D points
    @param {Point} pt1
    @param {Point} pt2
    @param {string} [mode] "cal" or "raw"
*/
function getDist(pt1, pt2, mode="cal") {
    if (mode === "cal") {
        return Math.pow(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2), 0.5);
    } else if (mode === "raw") {
        return Math.pow(Math.pow(pt1.rawx - pt2.rawx, 2) + Math.pow(pt1.rawy - pt2.rawy, 2), 0.5);
    }
}

/*
    Gets a random float between two values
    @param {float} low Lowest value
    @param {float} high Highest value
*/
function getRandom(low, high) {
    return Math.random() * (high - low) + low;
}

/*
    Rounds a float to a given number of decimal places
    @param {float} num Number to round
    @param {int} digits Number of digits to round to
*/
function roundTo(num, digits) {
    let mul = Math.pow(10, digits);
    return Math.round(num * mul) / mul;
}

/*
    Returns one of two results based on a condition
    @param {string} condition
    @param {} iftrue
    @param {} iffalse
*/
function ifTF(condition, iftrue, iffalse) {
    if (condition) {
        return iftrue;
    } else {
        return iffalse;
    }
}

/*
    Generates a string of random digits
    @param {int} digits Number of digits in ID
*/
function randomID(digits=16) {
    let str = ""
    while (digits > 17) {
        str += String(Math.random()*10**17);
        digits -= 17;
    }
    str += String(Math.round(Math.random()*10**digits));
    while (str.length < digits) {
        str = "0" + str;
    }
    return str;
}

/*
    Performs a replacement on all strings contained in an object
    @param {object} obj Object to replace in
    @param {string} pattern String to find
    @param {string} replacement String to insert
*/
function recursiveReplace(obj, pattern, replacement) {
    
    if (typeof(obj) === "string") {
        while (obj.indexOf(pattern) != -1) {
            obj = obj.replace(pattern, replacement);
        }
    } else if (typeof(obj) === "object"){
        for (let child of Object.keys(obj)) {
            obj[child] = recursiveReplace(obj[child], pattern, replacement);
        }
    }
    return obj;
}

/*
    Recursively converts all number-like strings into numbers
    @param {object} obj Object to numberfy
*/
function recursiveNumberfy(obj) {
    if (typeof(obj) === "string" && !isNaN(obj)) {
        obj = parseFloat(obj);
    } else if (typeof(obj) === "object"){
        for (let child of Object.keys(obj)) {
            obj[child] = recursiveNumberfy(obj[child]);
        }
    }
    return obj;
}


// ##### Canvas objects #####

class Point {
    /*
        rawx    <float> canvas-based x position of point
        rawy    <float> canvas-based y position of point
        x       <float> graph-based x position of point
        y       <float> graph-based y position of point
        movex   <bool> is point movable in the x direction?
        movey   <bool> is point movable in the y direction?
        cal     <dict> calibration data between canvas and graph
        color   <str> color of point
        radius  <float> radius of point
        answer  <bool> should point be submitted as an answer
        show    <bool> should point be shown as part of a line
    */
    constructor(args) {
        this.ID = randomID(IDLENGTH);
        // Default values
        this.movex = false;
        this.movey = false;
        this.color = POINTCOLOR;
        this.radius = POINTRADIUS;
        this.answer = false;
        this.show = true;
        // Fill values from arguments
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        // Conditional actions from values
        if (args.cal != undefined) {
            this.calibratemissing(args.cal);
        }
    }
    
    calibratemissing(cal) {
        if (this.rawx != undefined && this.rawy != undefined) {
            this.calibrate(cal);
        } else if (this.x != undefined && this.y != undefined) {
            this.inversecalibrate(cal);
        }
    }
    
    calibrate(cal) {
        this.x = (this.rawx - cal.pt1.rawx + cal.pt1.x) * cal.pt2.x / (cal.pt2.rawx - cal.pt1.rawx + cal.pt1.x);
        this.y = (this.rawy - cal.pt1.rawy + cal.pt1.y) * cal.pt2.y / (cal.pt2.rawy - cal.pt1.rawy + cal.pt1.y);
    }
    
    inversecalibrate(cal) {
        this.rawx = (this.x - cal.pt1.x) / (cal.pt2.x - cal.pt1.x) * (cal.pt2.rawx - cal.pt1.rawx) + cal.pt1.rawx;
        this.rawy = (this.y - cal.pt1.y) / (cal.pt2.y - cal.pt1.y) * (cal.pt2.rawy - cal.pt1.rawy) + cal.pt1.rawy;
    }
    
    get data() {
        let r = {};
        for (let k of Object.keys(this)) {
            r[k] = this[k];
        }
        return r;
    }
}

class Line {
    /*
        points          <list> List of point constructor argument objects
        color           <str> Color of line
        width           <float> Width of line
        answer          <bool> should point be submitted as an answer
        correctanswer   <bool> is this a shown correct answer?
    */
    constructor(args) {
        // Default values
        this.ID = randomID(IDLENGTH);
        this.color = LINECOLOR;
        this.width = LINEWIDTH;
        this.answer = false;
        // Argument values
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
    }
    
    get segments() {
        return this.points.length-1;
    }
    
    get length() {
        sum = 0;
        for (let i = 1; i < this.points.length; i++) {
            sum += getDist(this.points[i-1], this.points[i]);
        }
        return sum;
    }
    
    get data() {
        let r = {};
        for (let k of Object.keys(this)) {
            r[k] = this[k];
        }
        return r;
    }
}

class Calibration {
    constructor(args) {
        // Argument values
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        // Convert other objects
        if (this.pt1 === undefined && this.pt2 === undefined) {
            this.pt1 = this.line[0];
            this.pt2 = this.line[1];
        } else if (this.line === undefined) {
            this.line = new Line({"points":[this.pt1, this.pt2]});
        }
        // Calculate scaling values
        this.scalex = Math.abs((this.pt2.rawx - this.pt1.rawx) / (this.pt2.x - this.pt1.x));
        this.scaley = Math.abs((this.pt2.rawy - this.pt1.rawy) / (this.pt2.y - this.pt1.y));
    }
}

class Text {
    /*
        text        <str> Text to display
        font        <str> ex. "italic 20px Arial"
        align       <str> "left", "right", or "center"
        color       <str> color of text
        position    <Point> location on canvas (cal or raw)
    */
    constructor(args) {
        // Default values
        this.text = "";
        this.font = FONTSTYLE;
        this.align = "left";
        this.color = FONTCOLOR;
        // Argument values
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        // Convert data to point if not
        if (!(this.position instanceof Point)) {
            this.position = new Point(this.position);
        }
    }
    
    get data() {
        let r = {};
        for (let k of Object.keys(this)) {
            r[k] = this[k];
        }
        return r;
    }
}

// ##### Controllers #####

class CanvasController {
    /*
        Controller class for HTML canvas objects
    */
    constructor(DOM, index, args) {
        // Load arguments
        this.img = new Image();
        this.img.src = args.imgsrc;
        this.imgcalibration = args.imgcal;
        /* Valid modes are "move", "point", "line", "calibrate" */
        this.mode = args.mode;
        if (args.cursor != undefined) {
            if (args.cursor.show != undefined) {
                this.showcursor = args.cursor.show;
            } else {
                this.showcursor = true;
            }
            if (this.showcursor) {
                if (args.cursor.digits != undefined) {
                    this.cursordigits = args.cursor.digits;
                } else {
                    this.cursordigits = 2;
                }
                if (args.cursor.bounds != undefined) {
                    this.cursorbounds = args.cursor.bounds;
                }
            }
        }
        
        // HTML element ids
        this.index = index;
        this.canvasid = DOM.canvasid.replace(/%id%/g, index);
        this.pointinfoid = DOM.canvaspointid.replace(/%id%/g, index);
        this.modeinfoid = DOM.canvasmodeid.replace(/%id%/g, index);
        
        // DOM elements
        this.canvas = document.getElementById(this.canvasid);
        this.pointspan = document.getElementById(this.pointinfoid);
        this.modespan = document.getElementById(this.modeinfoid);
        
        // Canvas objects
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
        this.ctx = this.canvas.getContext('2d');
        
        // State variables
        this.interactable = true;
        this.drawing = false; /* True when not finished drawing */
        
        // Constants
        this.grabradius = GRABRADIUS;
        
        // Graph element variables
        if (args.answercount != undefined) {
            this.max = args.answercount;
        } else {
            this.max = [];
        }
        this.finished = [];
        if (args.default != undefined) {
            //console.log("Creating defaults:",defaults);
            this.default = [];
            for (let type of Object.keys(args.default)) {
                for (let d of args.default[type]) {
                    this.finished.push(this.dataToElement(type, d));
                }
            }
        }
        
        // Setup mouse events
        this.canvas.addEventListener("mousemove", e => this.mouseMove(e));
        this.canvas.addEventListener("mousedown", e => this.mouseDown(e));
        this.canvas.addEventListener("mouseup", e => this.mouseUp(e));
        
        // Calibration setup
        if (this.mode === "calibrate") {
            this.x1 = DOM.textboxid.replace(/%id%/g, 2);
            this.y1 = DOM.textboxid.replace(/%id%/g, 3);
            this.x2 = DOM.textboxid.replace(/%id%/g, 4);
            this.y2 = DOM.textboxid.replace(/%id%/g, 5);
        }
  
        // Initialize
        this.init();
    }
    init() {
        // Initializes the canvas
        //this.reportCurrentMode();
        this.update();
    }
    clear() {
        // Clears the canvas
        //this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.canvas.width = this.canvas.width; // Hacky workaround
    }
    update() {
        // Updates the canvas to the current state
        this.clear();
        // Trim objects over limits
        this.trimLists();
        // Draw background image
        this.drawImage();
        // Draw lines
        for (let obj of this.finished) {
            if (obj instanceof Line) {
                this.draw(obj);
            }
        }
        // Draw points
        for (let obj of this.finished) {
            if (obj instanceof Point) {
                this.draw(obj);
            }
        }
        // Draw text
        for (let obj of this.finished) {
            if (obj instanceof Text) {
                this.draw(obj);
            }
        }
    }
    dataToElement(type, data) {
        // Creates geometric class object from input data
        // Append calibration data
        data.cal = this.imgcalibration;
        // Create appropriate object
        if (type === "point") {
            return new Point(data);
        } else if (type === "line") {
            let ptlist = [];
            for (let ptdata of data.points) {
                ptdata.cal = this.imgcalibration;
                let pt = new Point(ptdata);
                ptlist.push(pt);
                if (pt.show) {
                    this.finished.push(pt);
                }
            }
            data.points = ptlist;
            return new Line(data);
        } else if (type === "text") {
            data.position.cal = this.imgcalibration;
            return new Text(data);
        }
    }
    getMousePoint(e) {
        // Returns a point object at the current location of the cursor
        return new Point({"rawx":e.pageX - this.canvas.offsetLeft,
                          "rawy":e.pageY - this.canvas.offsetTop,
                          "cal":this.imgcalibration});
    }
    drawImage() {
        /*this.img.onload = function(a) {
            console.log('whats this');
            console.log(a);
            this.ctx.drawImage(this.img, 0, 0);
        }*/
        this.ctx.drawImage(this.img, 0, 0);
    }
    draw(element) {
        // Draws geometric elements to the canvas
        //console.log("Drawing:", element);
        this.ctx.save();
        if (element instanceof Point) {
            // Black border
            this.ctx.beginPath();
            this.ctx.fillStyle = "black";
            this.ctx.globalAlpha = 1;
            this.ctx.arc(element.rawx, element.rawy, element.radius, 2*Math.PI, false);
            this.ctx.fill();
            // Colored interior
            this.ctx.beginPath();
            this.ctx.fillStyle = element.color;
            this.ctx.arc(element.rawx, element.rawy, element.radius-1, 2*Math.PI, false);
            this.ctx.fill();
            if (element.correctanswer) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = "green";
                this.ctx.ellipse(element.rawx, element.rawy, element.tolerance.x*this.imgcalibration.scalex, element.tolerance.y*this.imgcalibration.scaley, 0, 0, 2*Math.PI, false);
                this.ctx.stroke();
            }
        } else if (element instanceof Line) {
            // Connect points
            this.ctx.beginPath();
            this.ctx.globalAlpha = 1;
            this.ctx.strokeStyle = element.color;
            this.ctx.lineWidth = element.width;
            let first = true;
            for (let pt of element.points) {
                if (first) {
                    // Move to start of line
                    this.ctx.moveTo(pt.rawx, pt.rawy);
                } else {
                    // Draw segment
                    this.ctx.lineTo(pt.rawx, pt.rawy);
                    this.ctx.stroke();
                }
                first = false;
            }
            this.ctx.fillStyle = "black";
            this.ctx.globalAlpha = 0.1;
            this.ctx.fill();
        } else if (element instanceof Text) {
            this.ctx.fillStyle = element.color;
            this.ctx.globalAlpha = 1;
            this.ctx.font = element.font;
            this.ctx.textAlign = element.align;
            this.ctx.fillText(element.text, element.position.rawx, element.position.rawy);
        }
        this.ctx.restore();
    }
    trimLists() {
        // Removes the oldest element of each type if the limit is surpassed
        let quota = {};
        for (let type of Object.keys(this.max)) {
            quota[type] = this.max[type];
        }
        for (let i = this.finished.length-1; i >= 0; i--) {
            let obj = this.finished[i];
            if (obj.answer) {
                if (obj instanceof Point) {
                    if (quota["point"] != undefined) {
                        if (quota["point"] > 0) {
                            quota["point"] -= 1;
                        } else {
                            this.finished.splice(this.finished.indexOf(obj),1);
                        }
                    }
                } else if (obj instanceof Line) {
                    if (quota["line"] != undefined) {
                        if (quota["line"] > 0) {
                            quota["line"] -= 1;
                        } else {
                            this.finished.splice(this.finished.indexOf(obj),1);
                        }
                    }
                }
            }
        }
    }
    getPointByID(ID) {
        for (let pt of this.finished) {
            if (pt instanceof Point) {
                if (pt.ID === ID) {
                    return pt;
                }
            }
        }
    }
    deletePointByID(ID) {
        for (let pt of this.finished) {
            if (pt instanceof Point) {
                if (pt.ID === ID) {
                    this.finished.splice(this.finished.indexOf(pt),1);
                }
            }
        }
    }
    reportCurrentMode() {
        // Prints current mode to sub-graph span
        this.modespan.textContent = `${this.mode} mode`;
    }
    getanswers() {
        // Report user-submitted answers to GraphQuestion
        this.interactable = false;
        let answers = [];
        for (let element of this.finished) {
            if (element.answer) {
                answers.push(element);
            }
        }
        return answers;
    }
    showanswers(answers) {
        let answerselements = []
        // Convert answer data into geometric object elements
        for (let type of Object.keys(answers)) {
            for (let data of answers[type]) {
                data["correctanswer"] = true;
                let ans = this.dataToElement(type, data);
                answerselements.push(ans);
            }
        }
        // Draw all answers
        for (let answer of answerselements) {
            // Reverse calibration and draw
            this.draw(answer);
        }
    }
    mouseMove(e) {
        // Whenever the mouse is moved over the canvas object
        this.currentpoint = this.getMousePoint(e);
        if (this.interactable) {
            this.update();
            let pt = this.getMousePoint(e);
            if (this.showcursor) {
                let inbounds = true;
                // Check if cursor is between bounding limits
                // Will break if bounding line is not a positive slope
                if (this.cursorbounds != undefined) {
                    if (pt.x < this.cursorbounds.pt1.x ||
                        pt.x > this.cursorbounds.pt2.x ||
                        pt.y < this.cursorbounds.pt1.y ||
                        pt.y > this.cursorbounds.pt2.y) {
                        inbounds = false;
                    }
                }
                // Cursor position is valid
                if (inbounds) {
                    let cursorpt = new Point(pt.data);
                    let cursoralign = "";
                    // Constants align box position around crosshair cursor nicely
                    if (cursorpt.rawx < this.canvas.width/2) {
                        cursoralign = "left";
                        cursorpt.rawx += 5;
                    } else {
                        cursoralign = "right";
                        cursorpt.rawx -= 5;
                    }
                    if (cursorpt.rawy < this.canvas.height/2) {
                        cursorpt.rawy += 13;
                    } else {
                        cursorpt.rawy -= 5;

                    }
                    
                    this.draw(new Text({"text":`${cursorpt.x.toFixed(this.cursordigits)}, ${cursorpt.y.toFixed(this.cursordigits)}`,
                                        "color":"black",
                                        "font":"bold 14px arial",
                                        "align":cursoralign,
                                        "position":cursorpt}));
                }
            }
            if (this.mode === "move") {
                // drag object
                if (this.held) {
                    if (this.held instanceof Point) {
                        // Copy current location data to point
                        if (this.held.movex) {
                            this.held.rawx = pt.rawx;
                            this.held.x = pt.x;
                        }
                        if (this.held.movey) {
                            this.held.rawy = pt.rawy;
                            this.held.y = pt.y;
                        }
                        // Show held point
                        this.draw(this.held);
                    } else if (this.held instanceof Line) {
                        // Update location data
                        // qwer
                        let rawdx = pt.rawx - this.grabpoint.rawx;
                        let caldx = pt.x - this.grabpoint.x;
                        let rawdy = pt.rawy - this.grabpoint.rawy;
                        let caldy = pt.y - this.grabpoint.y;
                        for (let p of this.held.points) {
                            if (p.movex) {
                                p.rawx = this.origins[p.ID].rawx + rawdx;
                                p.x = this.origins[p.ID].x + caldx;
                            }
                            if (p.movey) {
                                p.rawy = this.origins[p.ID].rawy + rawdy;
                                p.y = this.origins[p.ID].y + caldy;
                            }
                            // Show points
                            if (p.show) {
                                this.draw(p);
                            }
                            
                        }
                        // Show held line
                        this.draw(this.held);
                    }
                }
            } else if (this.drawing) {
                if (this.mode === "point") {
                    this.draw(pt);
                } else if (this.mode === "line") {
                    this.draw(new Line({"points":[this.pt1, pt]}));
                } else if (this.mode === "calibrate") {
                    this.draw(new Line({"points":[this.pt1, pt]}));
                }
            }
        }
    }
    mouseUp(e) {
        if (this.interactable) {
            let pt = this.getMousePoint(e);
            if (this.mode === "move") {
                // drop held object
                if (this.held) {
                    if (this.held instanceof Point) {
                        // Copy current location data to point
                        if (this.held.movex) {
                            this.held.rawx = pt.rawx;
                            this.held.x = pt.x;
                        }
                        if (this.held.movey) {
                            this.held.rawy = pt.rawy;
                            this.held.y = pt.y;
                        }
                        // Add point to finished list
                        this.finished.push(this.held);
                    } else if (this.held instanceof Line) {
                        let rawdx = pt.rawx - this.grabpoint.rawx;
                        let caldx = pt.x - this.grabpoint.x;
                        let rawdy = pt.rawy - this.grabpoint.rawy;
                        let caldy = pt.y - this.grabpoint.y;
                        for (let p of this.held.points) {
                            if (p.movex) {
                                p.rawx = this.origins[p.ID].rawx + rawdx;
                                p.x = this.origins[p.ID].x + caldx;
                            }
                            if (p.movey) {
                                p.rawy = this.origins[p.ID].rawy + rawdy;
                                p.y = this.origins[p.ID].y + caldy;
                            }
                            if (p.show) {
                                this.finished.push(p);
                            }
                        }
                        // Add line to finished list
                        this.finished.push(this.held);
                        this.origins = undefined;
                        this.grabpoint = undefined;
                    }
                    // Reset holding
                    this.held = undefined;
                }
            } else {
                this.drawing = false;
                if (this.mode === "point") {
                    this.finished.push(pt);
                } else if (this.mode === "line") {
                    this.finished.push(new Line({"points":[this.pt1, pt]}));
                } else if (this.mode === "calibrate") {
                    // calibration routine
                    this.finished.push(new Line({"points":[this.pt1, pt]}));
                    let x1 = document.getElementById(this.x1).value;
                    let y1 = document.getElementById(this.y1).value;
                    let x2 = document.getElementById(this.x2).value;
                    let y2 = document.getElementById(this.y2).value;
                    let str = `let calibration = new Line({"points":[new Point({"rawx":${this.pt1.rawx}, "rawy":${this.pt1.rawy}, "x":${x1}, "y":${y1}})`
                    str += `, new Point({"rawx":${pt.rawx}, "rawy":${pt.rawy}, "x":${x2}, "y":${y2}})]});`;
                    console.log("Copy and paste the line between the bars to use this calibration:");
                    console.log("-----");
                    console.log(str);
                    console.log("-----");
                }
            }
        }
    }
    mouseDown(e) {
        // Whenever the mouse is clicked on the canvas object
        if (this.interactable) {
            let pt = this.getMousePoint(e);
            if (this.mode === "move") {
                let grabindex = -1;
                let grabdist = 99999;
                // Check which object is being picked up
                for (let i in this.finished) {
                    if (this.finished[i] instanceof Point) {
                        // Check if movable
                        if (this.finished[i].movex || this.finished[i].movey) {
                            // Check if in grabbing distance
                            let d = getDist(pt, this.finished[i], "raw");
                            if (d <= this.grabradius) {
                                if (d < grabdist) {
                                    grabindex = i;
                                    grabdist = d;
                                }
                            }
                        }
                    } else if (this.finished[i] instanceof Line) {
                        for (let j = 1; j < this.finished[i].points.length; j++) {
                            let pt1 = this.finished[i].points[j];
                            let pt2 = this.finished[i].points[j-1]
                            // If neither point is movable, line isn't movable
                            if (!pt1.movex && !pt1.movey && !pt2.movex && !pt2.movey) {
                                break;
                            }
                            let minx = Math.min(pt1.rawx, pt2.rawx) + this.grabradius;
                            let maxx = Math.max(pt1.rawx, pt2.rawx) - this.grabradius;
                            // Check if x is between bounds
                            if (pt.rawx > minx && pt.rawx < maxx) {
                                let ytarget = (pt.rawx - pt1.rawx) * (pt2.rawy - pt1.rawy) / (pt2.rawx - pt1.rawx) + pt1.rawy;
                                let d = Math.abs(pt.rawy - ytarget);
                                // Check if in grabbing range of the line
                                if (d <= this.grabradius) {
                                    // Check if this is the closest object
                                    if (d < grabdist) {
                                        grabindex = i;
                                        grabdist = d;
                                    }
                                }
                            }                            
                        }
                    }
                }
                if (grabindex > -1) {
                    this.grabpoint = pt;
                    this.held = this.finished[grabindex];
                    this.finished.splice(grabindex, 1);
                    if (this.held instanceof Line) {
                        this.origins = {};
                        for (let p of this.held.points) {
                            this.origins[p.ID] = new Point(p.data);
                            this.deletePointByID(p.ID);
                        }
                    }
                }
            } else {
                this.pt1 = this.getMousePoint(e);
                this.drawing = true;
            }
            this.update();
        }
    }
    
    keyPress(key) {
        this.drawing = false;
        this.calibrating = false;
        if (key === "p") {
            this.mode = "point";
        } else if (key === "l") {
            this.mode = "line";
        }
        //this.reportCurrentMode()
        this.update();
    }
}

// ##### Problem/question classes #####

class GraphElement {
    /*
        Container class for graph-entry questions
    */
    constructor(inputarguments) {
        /*
            imgsrc: image source file
            imgcal: calibration for image file
            mode: mode for the canvascontroller to be in
            answercount: {"point": 1, "line": 0}, named list of expected
            answer: correct answers
            default: default graph objects
            tolerance: range near answer to count as correct
            points: number of points question is worth
        */
        for (let key of Object.keys(inputarguments)) {
            this[key] = inputarguments[key];
        }
    }
    
    checkanswer(answer) {
        let score = {"max": 0,
                     "got": 0,
                     "pct": 0};
        let used = [];
        if (this.answercount["point"] > 0) {
            // Each answer being looked for
            for (let i in this.answer.point) {
                score.max += 1;
                // Each answer provided
                for (let j in answer) {
                    if (answer[j] instanceof Point) {
                        // If unused
                        if (used.indexOf(j) === -1) {
                            // If close enough
                            if (Math.abs(answer[j].x - this.answer.point[i].x) <= this.answer.point[i].tolerance.x && Math.abs(answer[j].y - this.answer.point[i].y) <= this.answer.point[i].tolerance.y) {
                                score.got += 1;
                                used.push(j);
                                //points.splice(j);
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (this.answercount["line"] > 0) {
            // Eachanswer being looked for
            for (let i in this.answer.line) {
                score.max += 1;
                // Each answer provided
                for (let j in answer) {
                    if (answer[j] instanceof Line) {
                        // If unused
                        if (used.indexOf(j) === -1) {
                            // If same line size
                            if (this.answer.line[i].points.length === answer[j].points.length) {
                                // Assume line matches
                                let fullmatch = true;
                                // Each point in the line
                                for (let k in answer[j].points) {
                                    // If point is not close enough
                                    let ansx = this.answer.line[i].points[k].x;
                                    let inpx = answer[j].points[k].x;
                                    let tolx = this.answer.line[i].tolerance.x;
                                    let ansy = this.answer.line[i].points[k].y;
                                    let inpy = answer[j].points[k].y;
                                    let toly = this.answer.line[i].tolerance.y;
                                    if (Math.abs(ansx - inpx) > tolx || Math.abs(ansy - inpy) > toly ) {
                                        fullmatch = false;
                                        break;
                                    }
                                }
                                if (fullmatch) {
                                    score.got += 1;
                                    used.push(j);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        score.pct = score.got / score.max;
        return score.pct;
    }
}

class TextElement {
    /*
        Container class for text display
    */
    constructor(inputarguments) {
        /*
            label: Text to display before textbox
            style: CSS style to apply
        */
        this.label = inputarguments.label;
        this.style = inputarguments.style;
    }
}

class TextboxElement {
    /*
        Container class for textbox-entry questions
    */
    constructor(inputarguments) {
        /*
            label: Text to display before textbox
            placeholder: Placeholder text in textbox
            answertype: "number" or "text"
            answer: correct answer
            tolerance: range above or below answer to count as correct
            points: number of points question is worth
        */
        this.label = inputarguments.label;
        this.placeholder = inputarguments.placeholder;
        this.answertype = inputarguments.answertype;
        this.answer = inputarguments.answer;
        this.tolerance = inputarguments.tolerance;
        this.points = inputarguments.points;
    }
    
    checkanswer(answer) {
        if (this.answertype === "number") {
            if (parseFloat(answer) >= this.answer - this.tolerance && parseFloat(answer) <= this.answer + this.tolerance) {
                return 1;
            } else {
                return 0;
            }
        } else if (this.answertype === "text") {
            if (answer.toUpperCase().trim() === this.answer.toUpperCase().trim()) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}

class Question {
    /*
        Container class for each question
        Consists of elements displayed sequentially on the page
    */
    constructor(inputarguments) {
        /*
            variables: list of variables in problem
            elements: array of question elements
            requiredscore: required % score to move on
        */
        this.elements = inputarguments.questionelements;
        this.variablevalues = {};
        this.inputvariables = inputarguments.variables;
        this.requiredscore = inputarguments.requiredscore;
        
        this.canvasControllers = {};
    }
    
    importVariables(variables) {
        for (let name of Object.keys(variables)) {
            this.variablevalues[name] = variables[name];
        }
    }
    
    generateVariables() {
        // Assign constants
        for (let name of Object.keys(this.inputvariables.constants)) {
            this.variablevalues[name] = this.inputvariables.constants[name];
        }
        // Assign random variables
        for (let name of Object.keys(this.inputvariables.random)) {
            let low = this.inputvariables.random[name].min;
            let high = this.inputvariables.random[name].max;
            let digits = this.inputvariables.random[name].digits;
            let r = getRandom(low, high);
            this.variablevalues[name] = roundTo(r, digits);
        }
        // Assign calculated variables
        for (let name of Object.keys(this.inputvariables.calculated)) {
            // Construct expression, fill in variable values
            let exp = this.inputvariables.calculated[name];
            // Keep replacing until no variables remain
            let maxloops = 10;
            let loops = 0;
            while (exp.indexOf("%") != -1 && loops < maxloops) {
                for (let variable of Object.keys(this.variablevalues)) {
                    exp = exp.replace(`%${variable}%`, this.variablevalues[variable]);
                }
                loops++;
            }
            if (loops >= maxloops) {
                console.log("Error, maximum loops exceeded, variable not found.");
            }
            // Evaluate expression
            //console.log("Evaluating",exp);
            this.variablevalues[name] = eval(exp);
        }
    }
    
    get totalPoints() {
        let total = 0;
        for (let element of this.elements) {
            if (element.points) {
                total += element.points;
            }
        }
        return total;
    }
    
    assignVariables() {
        // Replace variables with values in all elements
        for (let element of this.elements) {
            for (let variable of Object.keys(this.variablevalues)) {
                // Replace variable strings with values
                element = recursiveReplace(element, `%${variable}%`, this.variablevalues[variable]);
            }
            // Convert number-like strings into numbers
            element = recursiveNumberfy(element);
        }
    }
    
    keyPress(key) {
        if (key === "q") {
            console.log("Question: pressed q");
        }
    }
    
    insertContainers(DOM) {
        let container = document.querySelector("#" + DOM.questiondivid);
        let html = `<div class="${DOM.elementdivclass}">`;
        html += '</div>';
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    insertCanvas(DOM, id, imgsrc) {
        let container = document.querySelector("." + DOM.elementdivclass);
        
        let html = `<div class="${DOM.canvasdivclass}">`;
        html += `<canvas class="${DOM.canvasclass}" id="${DOM.canvasid}"></canvas>`;
        html += `<br>`;
        html += `<div class="${DOM.canvasinfodivclass}">`;
        //html += `<span class="${DOM.canvaspointclass}" id="${DOM.canvaspointid}">(x, y)</span>`;
        //html += `<span class="${DOM.canvasmodeclass}" id="${DOM.canvasmodeid}">mode</span>`;
        html += `</div></div>`;
        
        html = html.replace(/%id%/g, id);
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    insertTextbox(DOM, id, label, placeholder) {
        let container = document.querySelector("." + DOM.elementdivclass);
        
        let html = `<div class="${DOM.textboxdivclass}">`;
        html += `<span class="${DOM.textboxspanclass}">${label}</span>`;
        html += `<br>`;
        html += `<input class="${DOM.textboxclass}" placeholder="${placeholder}" id="${DOM.textboxid}">`;
        html += `<span class="${DOM.textboxanswerclass}" id="${DOM.textboxanswerid}"></span>`;
        html+= `</input></div>`;
        
        html = html.replace(/%id%/g, id);
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    insertText(DOM, label, style) {
        let container = document.querySelector("." + DOM.elementdivclass);
        
        let html = `<span class="${DOM.textspanclass}`;
        if (style != undefined) {
            html += ` ${style}`;
        }
        html += `">${label}</span>`;
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    display(DOM, variables) {
        // Assign and create variables
        this.importVariables(variables);
        this.generateVariables();
        this.assignVariables();
        // Create display elements
        this.insertContainers(DOM, this.instruction);
        for (let i in this.elements) {
            let element = this.elements[i];
            // Text
            if (element instanceof TextElement) {
                this.insertText(DOM, element.label, element.style);
            // Textbox input
            } else if (element instanceof TextboxElement) {
                this.insertTextbox(DOM, i, element.label, element.placeholder);
            // Graph input
            } else if (element instanceof GraphElement) {
                this.insertCanvas(DOM, i, element.imgsrc);
                this.canvasControllers[i] = new CanvasController(DOM, i, element);
            }
        }
        //console.log(this.variablevalues);
        //this.insertHintButton(DOM);
        //this.removeNextButton(DOM);
        //this.insertSubmitButton(DOM);
    }
    
    submit(DOM) {
        // Add up score and reveal answers
        let score = {"max": 0,
                     "got": 0,
                     "pct": 0};
        for (let i in this.elements) {
            let element = this.elements[i];
            if (element instanceof TextboxElement) {
                // Disable textbox
                document.getElementById(DOM.textboxid.replace(/%id%/g, i)).disabled = true;
                // Get answer from textbox
                let ans = document.getElementById(DOM.textboxid.replace(/%id%/g, i)).value;
                // Check answer
                score.max += element.points;
                score.got += (element.points * element.checkanswer(ans));
                document.getElementById(DOM.textboxanswerid.replace(/%id%/g, i)).textContent = element.answer;
            } else if (element instanceof GraphElement) {
                // Get answers from canvas
                let ans = this.canvasControllers[i].getanswers();
                // Check answers
                score.max += element.points;
                score.got += (element.points * element.checkanswer(ans));
                this.canvasControllers[i].showanswers(element.answer);
            }
            score.pct = score.got / score.max;
        }
        //this.removeSubmitButton(DOM);
        //this.insertNextButton(DOM);
        return score;
    }
}

class ProblemController{
    /*
        Master class for controlling page
        Consists of a series of questions
    */
    constructor(title, variables) {
        this.title = title;
        this.DOM = this.getDOM;
        //this.variablevalues = this.generateVariables(variables);
        
        this.questions = [];
        this.score = {};
        this.currentquestion = -1;
        this.inputvariables = variables;
        
        // Set page title
        document.title = title;
        // Catch keyboard events
        document.addEventListener("keydown", e => this.keyEvent(e));
    }
    
    get getDOM() {
        return {
        "questiondivid": "question",
            "canvasdivclass": "canvasarea",
                "canvasclass": "canvas",
                "canvasid": "canvas--%id%",
                "canvasinfodivclass": "canvasinfo",
                    "canvaspointclass": "canvaspoint",
                    "canvaspointid": "canvaspoint--%id%",
                    "canvasmodeclass": "canvasmode",
                    "canvasmodeid": "canvasmode--%id%",
            "textboxdivclass": "textentry",
                "textboxspanclass": "textboxlabel",
                "textboxclass": "textbox",
                "textboxid": "textbox--%id%",
                "textboxanswerclass": "textboxanswer",
                "textboxanswerid": "textboxanswer--%id%",
            "textspanclass": "textspan",
            "hintbuttonid": "hintbutton",
            "submitbuttonid": "submitbutton",
            "nextbuttonid": "nextbutton",
        "nextdivid": "next",
        "scoredivid": "score",
        "scoretitleid": "scoretitle",
        "restartdivid": "restart",
            "restartbuttonid": "restartbutton",
        "hiddentextclass": "hiddentext",
        "hiddenbuttonclass": "hiddenbutton"
        };
    }
    
    refresh() {
        if (confirm("Really start a new problem?")) {
            // Refresh the page
            location = location;
        }
    }
    
    begin() {
        // Initialize scores
        for (let i in this.questions) {
            this.score[i] = {"max": this.questions[i].totalPoints,
                             "got": 0,
                             "pct": 0};
        }
        
        // Create buttons
        this.insertHintButton(this.DOM);
        this.insertSubmitButton(this.DOM);
        this.insertNextButton(this.DOM);
        this.toggleNextButton(this.DOM);
        this.insertRestartButton(this.DOM);
        
        // Create variables
        this.variablevalues = this.generateVariables(this.inputvariables);
        
        // Start question sequence
        this.currentquestion = -1;
        this.nextQuestion();
    }
    
    nextQuestion() {
        // Proceed to next question in sequence
        this.currentquestion++;
        this.display();
    }
    
    generateVariables(variables) {
        let variablevalues = {};
        // Assign constants
        for (let name of Object.keys(variables.constants)) {
            variablevalues[name] = variables.constants[name];
        }
        // Assign random variables
        for (let name of Object.keys(variables.random)) {
            let low = variables.random[name].min;
            let high = variables.random[name].max;
            let digits = variables.random[name].digits;
            let r = getRandom(low, high);
            variablevalues[name] = roundTo(r, digits);
        }
        // Assign calculated variables
        for (let name of Object.keys(variables.calculated)) {
            // Construct expression, fill in variable values
            let exp = variables.calculated[name];
            // Keep replacing until no variables remain
            let maxloops = 10;
            let loops = 0;
            while (exp.indexOf("%") != -1 && loops < maxloops) {
                for (let variable of Object.keys(variablevalues)) {
                    exp = exp.replace(`%${variable}%`, variablevalues[variable]);
                }
                loops++;
            }
            if (loops >= maxloops) {
                console.log("Error, maximum loops exceeded, variable not found.");
            }
            // Evaluate expression
            //console.log("Evaluating",exp);
            variablevalues[name] = eval(exp);
        }
        return variablevalues;
    }
    
    keyEvent(e) {
        //console.log(`ProblemController: pressed ${e.key}`);
        if (e.key === "Enter") {
            //this.submit();
        }
    }
    
    addQuestion(question) {
        // Adds a question to the problem in sequence
        this.questions.push(question)
    }
    
    setFinish(finish) {
        this.finishquestion = finish;
        console.log('set finish to', this.finishquestion);
    }
    
    clearPage() {
        // Clear question objects from html
        let container = document.querySelector("#" + this.DOM.questiondivid);
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }
    }
    
    insertHintButton(DOM) {
        let container = document.querySelector("#" + DOM.nextdivid);
        let html = `<button id="${DOM.hintbuttonid}">Hint</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.hintbuttonid).addEventListener("click", e => this.showhint(e));
    }
    
    insertSubmitButton(DOM) {
        let container = document.querySelector("#" + DOM.nextdivid);
        let html = `<button id="${DOM.submitbuttonid}">Submit Answers</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.submitbuttonid).addEventListener("click", e => this.submit(e));
    }
    
    insertNextButton(DOM) {
        let container = document.querySelector("#" + DOM.nextdivid);
        let html = `<button id="${DOM.nextbuttonid}">Next Part</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.nextbuttonid).addEventListener("click", e => this.next(e));
    }
    
    insertRestartButton(DOM) {
        // Add button
        let container = document.querySelector("#" + DOM.restartdivid);
        let html = `<button id="${DOM.restartbuttonid}">New Problem</button>`;
        container.insertAdjacentHTML("beforeend", html);
        // Add event listener to button
        document.querySelector("#" + this.DOM.restartbuttonid).addEventListener("click", e => this.refresh(e));
    }
    
    enableHintButton(DOM) {
        document.getElementById(DOM.hintbuttonid).disabled = false;
    }
    
    disableHintButton(DOM) {
        document.getElementById(DOM.hintbuttonid).disabled = true;
    }
    
    toggleSubmitButton(DOM) {
        document.getElementById(DOM.submitbuttonid).classList.toggle(DOM.hiddenbuttonclass);
    }
    
    toggleNextButton(DOM) {
        document.getElementById(DOM.nextbuttonid).classList.toggle(DOM.hiddenbuttonclass);
    }
    
    toggleHintButton(DOM) {
        document.getElementById(DOM.hintbuttonid).classList.toggle(DOM.hiddenbuttonclass);
    }
    
    updateScores(DOM, score, show) {
        let container = document.querySelector("#" + DOM.scoredivid);
        
        // Clear score objects from html
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }
        
        let sumscore = 0;
        let sumpoints = 0;
        
        // Create new score object
        let html = `<span id=${DOM.scoretitleid}>SCORES</span>`;
        html += "<table>";
        html += "<tr><th>Part</th><th>Points</th><th>Total</th><th>Pct</th></tr>";
        for (let i in score) {
            html += `<tr><td>${parseFloat(i)+1}</td><td>${score[i].got}</td><td>${score[i].max}</td><td>${score[i].pct*100}%</td></tr>`;
            sumscore += score[i].got;
            sumpoints += score[i].max;
        }
        html += `<tr><td>Total</td><td>${sumscore}</td><td>${sumpoints}</td><td>${roundTo(sumscore/sumpoints*100,0)}%</td></tr>`;
        html += "</table>";
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    display() {
        // Display current question
        // Clear current page elements
        this.clearPage();
        if (this.currentquestion > -1) {
            // Add current question objects to html
            this.questions[this.currentquestion].display(this.DOM, this.variablevalues);
            // Add listening event to buttons
            //document.querySelector("#" + this.DOM.submitbuttonid).addEventListener("click", e => this.submit(e));
        }
        this.updateScores(this.DOM, this.score);
        document.getElementById(this.DOM.scoredivid).classList.remove("showscore");
    }
    
    showhint() {
        this.disableHintButton(this.DOM);
        let elements = document.getElementsByClassName(this.DOM.hiddentextclass);
        while (elements[0]) {
            elements[0].classList.remove(this.DOM.hiddentextclass);
        }
    }
    
    submit() {
        // Submit current answers
        // Clear previous output
        //console.clear(); TODO
        // Update score for this question, call Question.submit
        this.score[this.currentquestion] = this.questions[this.currentquestion].submit(this.DOM);
        if (this.score[this.currentquestion].pct >= this.questions[this.currentquestion].requiredscore) {
            // Add listening event to Next button
            //document.querySelector("#" + this.DOM.nextbuttonid).addEventListener("click", e => this.next(e));
            // Adjust label to Finish if on last question
            if (this.currentquestion == this.questions.length - 1) {
                document.querySelector("#" + this.DOM.nextbuttonid).textContent = "Finish";
            }
        } else {
            // Add listening event to Next button
            //document.querySelector("#" + this.DOM.nextbuttonid).addEventListener("click", e => this.repeat(e));
            // Adjust label to Retry
            document.querySelector("#" + this.DOM.nextbuttonid).textContent = "Retry";
        }
        this.toggleSubmitButton(this.DOM);
        this.toggleNextButton(this.DOM);
        this.showhint();
        this.updateScores(this.DOM, this.score);
        document.getElementById(this.DOM.scoredivid).classList.add("showscore");
    }
    
    repeat() {
        // Repeat current question
        this.currentquestion--;
        this.nextQuestion();
    }
    
    next() {
        // End question, go to next
        this.toggleSubmitButton(this.DOM);
        this.toggleNextButton(this.DOM);
        this.enableHintButton(this.DOM);
        if (this.currentquestion < this.questions.length - 1) {
            this.nextQuestion();
        } else {
            this.finish();
        }
    }
    
    finish() {
        // End problem
        this.clearPage();
        this.updateScores(this.DOM, this.score);
        document.getElementById(this.DOM.nextdivid).remove();
        this.finishquestion.display(this.DOM, this.variablevalues);
        document.getElementById(this.DOM.scoredivid).classList.add("showscore");
    }
}