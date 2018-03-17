/*
TODO:
GraphElement
    add support for drawing:
        multisegment line (length n)
        multisegment straight line (length n)
        point slope line drawing
    reset button

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
        return Math.pow(Math.pow(pt1.calx - pt2.calx, 2) + Math.pow(pt1.caly - pt2.caly, 2), 0.5);
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
        calx    <float> graph-based x position of point
        caly    <float> graph-based y position of point
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
        } else if (this.calx != undefined && this.caly != undefined) {
            this.inversecalibrate(cal);
        }
    }
    
    calibrate(cal) {
        this.calx = (this.rawx - cal.points[0].rawx + cal.points[0].calx) * cal.points[1].calx / (cal.points[1].rawx - cal.points[0].rawx + cal.points[0].calx);
        this.caly = (this.rawy - cal.points[0].rawy + cal.points[0].caly) * cal.points[1].caly / (cal.points[1].rawy - cal.points[0].rawy + cal.points[0].caly);
    }
    
    inversecalibrate(cal) {
        this.rawx = (this.calx - cal.points[0].calx) / (cal.points[1].calx - cal.points[0].calx) * (cal.points[1].rawx - cal.points[0].rawx) + cal.points[0].rawx;
        this.rawy = (this.caly - cal.points[0].caly) / (cal.points[1].caly - cal.points[0].caly) * (cal.points[1].rawy - cal.points[0].rawy) + cal.points[0].rawy;
    }
    
    get data() {
        return {"ID":this.ID,
                "rawx":this.rawx,
                "rawy":this.rawy,
                "calx":this.calx,
                "caly":this.caly,
                "movex":this.movex,
                "movey":this.movey,
                "color":this.color,
                "radius":this.radius};
    }
}

class Line {
    /*
        points      <list> List of point constructor argument objects
        color       <str> Color of line
        width       <float> Width of line
        answer      <bool> should point be submitted as an answer
    */
    constructor(args) {
        this.ID = randomID(IDLENGTH);
        this.points = args.points;
        if (args.color != undefined) {
            this.color = args.color;
        } else {
            this.color = LINECOLOR;
        }
        if (args.width != undefined) {
            this.width = args.width;
        } else {
            this.width = LINEWIDTH;
        }
        if (args.answer != undefined) {
            this.answer = args.answer;
        } else {
            this.answer = false;
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
}

class Text {
    /*
        text        <str> Text to display
        font        <str> ex. "italic 20px Arial"
        color       <str> color of text
        position    <Point> location on canvas (cal or raw)
    */
    constructor(args) {
        this.text = args.text;
        if (args.position instanceof Point) {
            this.position = args.position;
        } else {
            this.position = new Point(args.position);
        }
        if (args.font) {
            this.font = args.font;
        } else {
            this.font = FONTSTYLE;
        }
        if (args.color) {
            this.color = args.color;
        } else {
            this.color = FONTCOLOR;
        }
    }
}

// ##### Controllers #####

class CanvasController {
    /*
        Controller class for HTML canvas objects
    */
    constructor(DOM, index, imgsrc, imgcal, mode, maxelements, defaults) {
        // HTML element ids
        this.index = index;
        this.canvasid = DOM.canvasid.replace(/%id%/g, index);
        this.pointinfoid = DOM.canvaspointid.replace(/%id%/g, index);
        this.modeinfoid = DOM.canvasmodeid.replace(/%id%/g, index);
        
        // DOM elements
        this.canvas = document.getElementById(this.canvasid);
        this.pointspan = document.getElementById(this.pointinfoid);
        this.modespan = document.getElementById(this.modeinfoid);
        
        // Canvas element
        this.img = new Image();
        this.img.src = imgsrc;
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
        this.ctx = this.canvas.getContext('2d');
        //this.canvas.focus();
        this.imgcalibration = imgcal;
        
        // State variables
        this.interactable = true;
        this.mode = mode;
        /* Valid modes are "move", "point", "line", "calibrate" */
        this.drawing = false; /* True when not finished drawing */
        this.dragging = false; /* holds object being moved */
        
        // Constants
        this.grabradius = GRABRADIUS;
        
        // Graph element variables
        if (maxelements != undefined) {
            this.max = maxelements;
        } else {
            this.max = [];
        }
        this.finished = [];
        if (defaults != undefined) {
            //console.log("Creating defaults:",defaults);
            this.default = [];
            for (let type of Object.keys(defaults)) {
                for (let d of defaults[type]) {
                    this.finished.push(this.dataToElement(type, d));
                }
            }
        }
        
        // Setup mouse events
        this.canvas.addEventListener("mousemove", e => this.mouseMove(e));
        this.canvas.addEventListener("mousedown", e => this.mouseDown(e));
        this.canvas.addEventListener("mouseup", e => this.mouseUp(e));
        
        // Calibration setup
        if (mode === "calibrate") {
            this.calx1 = DOM.textboxid.replace(/%id%/g, 2);
            this.caly1 = DOM.textboxid.replace(/%id%/g, 3);
            this.calx2 = DOM.textboxid.replace(/%id%/g, 4);
            this.caly2 = DOM.textboxid.replace(/%id%/g, 5);
        }
  
        // Initialize
        this.init();
    }
    init() {
        // Initializes the canvas
        this.reportCurrentMode();
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
        // Draw geometric objects
        for (let obj of this.finished) {
            this.draw(obj);
        }
    }
    dataToElement(type, data) {
        // Converts data to a geometric class object
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
        function sync() {
            //console.log('THIS is', this);
            this.ctx.drawImage(this.img, 0, 0);
        }
        this.img.onload = sync.call(this);
        //this.ctx.drawImage(this.img, 0, 0);
    }
    draw(element) {
        // Draws geometric elements to the canvas
        //console.log("Drawing:", element);
        if (element instanceof Point) {
            // Black border
            this.ctx.fillStyle = "black";
            this.ctx.beginPath();
            this.ctx.arc(element.rawx, element.rawy, element.radius, 2*Math.PI, false);
            this.ctx.fill();
            // Colored interior
            this.ctx.fillStyle = element.color;
            this.ctx.beginPath();
            this.ctx.arc(element.rawx, element.rawy, element.radius-1, 2*Math.PI, false);
            this.ctx.fill();
        } else if (element instanceof Line) {
            // Connect points
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
        } else if (element instanceof Text) {
            this.ctx.fillStyle = element.color;
            this.ctx.font = element.font;
            //this.ctx.fontweight = "bold";
            this.ctx.fillText(element.text, element.position.rawx, element.position.rawy);
        }
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
    reportPoint(point) {
        // Prints current calibrated coordinates to sub-graph span
        this.pointspan.textContent = `(${roundTo(point.calx,2)}, ${roundTo(point.caly,2)})`;
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
        this.reportPoint(this.currentpoint);
        if (this.interactable) {
            this.update();
            let pt = this.getMousePoint(e);
            if (this.mode === "move") {
                // drag object
                if (this.held) {
                    if (this.held instanceof Point) {
                        // Copy current location data to point
                        if (this.held.movex) {
                            this.held.rawx = pt.rawx;
                            this.held.calx = pt.calx;
                        }
                        if (this.held.movey) {
                            this.held.rawy = pt.rawy;
                            this.held.caly = pt.caly;
                        }
                        // Show held point
                        this.draw(this.held);
                    } else if (this.held instanceof Line) {
                        // Update location data
                        let rawdx = pt.rawx - this.grabpoint.rawx;
                        let caldx = pt.calx - this.grabpoint.calx;
                        let rawdy = pt.rawy - this.grabpoint.rawy;
                        let caldy = pt.caly - this.grabpoint.caly;
                        for (let p of this.held.points) {
                            if (p.movex) {
                                p.rawx = this.origins[p.ID].rawx + rawdx;
                                p.calx = this.origins[p.ID].calx + caldx;
                            }
                            if (p.movey) {
                                p.rawy = this.origins[p.ID].rawy + rawdy;
                                p.caly = this.origins[p.ID].caly + caldy;
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
                            this.held.calx = pt.calx;
                        }
                        if (this.held.movey) {
                            this.held.rawy = pt.rawy;
                            this.held.caly = pt.caly;
                        }
                        // Add point to finished list
                        this.finished.push(this.held);
                    } else if (this.held instanceof Line) {
                        let rawdx = pt.rawx - this.grabpoint.rawx;
                        let caldx = pt.calx - this.grabpoint.calx;
                        let rawdy = pt.rawy - this.grabpoint.rawy;
                        let caldy = pt.caly - this.grabpoint.caly;
                        for (let p of this.held.points) {
                            if (p.movex) {
                                p.rawx = this.origins[p.ID].rawx + rawdx;
                                p.calx = this.origins[p.ID].calx + caldx;
                            }
                            if (p.movey) {
                                p.rawy = this.origins[p.ID].rawy + rawdy;
                                p.caly = this.origins[p.ID].caly + caldy;
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
                    let calx1 = document.getElementById(this.calx1).value;
                    let caly1 = document.getElementById(this.caly1).value;
                    let calx2 = document.getElementById(this.calx2).value;
                    let caly2 = document.getElementById(this.caly2).value;
                    let str = `let calibration = new Line({"points":[new Point({"rawx":${this.pt1.rawx}, "rawy":${this.pt1.rawy}, "calx":${calx1}, "caly":${caly1}})`
                    str += `, new Point({"rawx":${pt.rawx}, "rawy":${pt.rawy}, "calx":${calx2}, "caly":${caly2}})]});`;
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
        this.reportCurrentMode()
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
        this.imgsrc = inputarguments.imgsrc;
        this.imgcal = inputarguments.imgcal;
        this.mode = inputarguments.mode;
        this.answercount = inputarguments.answercount;
        this.answer = inputarguments.answer;
        this.default = inputarguments.default;
        this.points = inputarguments.points;
        this.showanswer = inputarguments.showanswer;
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
                            if (Math.abs(answer[j].calx - this.answer.point[i].calx) <= this.answer.point[i].tolerance.calx && Math.abs(answer[j].caly - this.answer.point[i].caly) <= this.answer.point[i].tolerance.caly) {
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
                                    let ansx = this.answer.line[i].points[k].calx;
                                    let inpx = answer[j].points[k].calx;
                                    let tolx = this.answer.line[i].tolerance.calx;
                                    let ansy = this.answer.line[i].points[k].caly;
                                    let inpy = answer[j].points[k].caly;
                                    let toly = this.answer.line[i].tolerance.caly;
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
            size: Font size
        */
        this.label = inputarguments.label;
        this.size = inputarguments.size;
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
            if (answer === this.answer) {
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
        let container = document.querySelector("." + DOM.questiondivclass);
        let html = `<div class="${DOM.elementdivclass}">`;
        html += '</div>';
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    insertSubmitButton(DOM) {
        let container = document.querySelector("." + DOM.questiondivclass);
        let html = `<button class="${DOM.submitbuttonclass}">Submit</button>`;
        container.insertAdjacentHTML("beforeend", html);
    }
    
    removeSubmitButton(DOM) {
        let submit = document.querySelector("." + DOM.submitbuttonclass);
        submit.remove();
    }
    
    insertNextButton(DOM) {
        let container = document.querySelector("." + DOM.questiondivclass);
        let html = `<button class="${DOM.nextbuttonclass}">Next</button>`;
        container.insertAdjacentHTML("beforeend", html);
    }
    
    insertCanvas(DOM, id, imgsrc) {
        let container = document.querySelector("." + DOM.elementdivclass);
        
        let html = `<hr><div class="${DOM.canvasdivclass}">`;
        html += `<canvas class="${DOM.canvasclass}" id="${DOM.canvasid}" width="400" height="400"></canvas>`;
        html += `<br>`;
        html += `<div class="${DOM.canvasinfodivclass}">`;
        html += `<span class="${DOM.canvaspointclass}" id="${DOM.canvaspointid}">(x, y)</span>`;
        html += `<span class="${DOM.canvasmodeclass}" id="${DOM.canvasmodeid}">mode</span>`;
        html += `</div></div><hr>`;
        
        html = html.replace(/%id%/g, id);
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    insertTextbox(DOM, id, label, placeholder) {
        let container = document.querySelector("." + DOM.elementdivclass);
        
        let html = `<div class="${DOM.textboxdivclass}">`;
        html += `<span class="${DOM.textboxspanclass}">${label}</span>`;
        html += `<input class="${DOM.textboxclass}" placeholder="${placeholder}" id="${DOM.textboxid}">`;
        html += `<span class="${DOM.textboxanswerclass}" id="${DOM.textboxanswerid}"></span>`;
        html+= `</input></div>`;
        
        html = html.replace(/%id%/g, id);
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    insertText(DOM, label, size) {
        console.log('text',label,size);
        let container = document.querySelector("." + DOM.elementdivclass);
        console.log(container);
        let html = `<span class="${DOM.textspanclass}"`;
        if (size != undefined) {
            html += ` style="font-size:${size}"`
        }
        html += `>${label}</span>`;
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    display(DOM, variables) {
        // Assign and create variables
        this.importVariables(variables);
        this.generateVariables();
        this.assignVariables();
        // Create display elements
        for (let i in this.elements) {
            let element = this.elements[i];
            // Text
            if (element instanceof TextElement) {
                this.insertText(DOM, element.label, element.size);
            // Textbox input
            } else if (element instanceof TextboxElement) {
                this.insertTextbox(DOM, i, element.label, element.placeholder);
            // Graph input
            } else if (element instanceof GraphElement) {
                this.insertCanvas(DOM, i, element.imgsrc);
                this.canvasControllers[i] = new CanvasController(DOM, i, element.imgsrc, element.imgcal, element.mode, element.answercount, element.default);
            }
        }
        //console.log(this.variablevalues);
        this.insertSubmitButton(DOM);
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
        this.removeSubmitButton(DOM);
        this.insertNextButton(DOM);
        console.log(`Score: ${score.got}/${score.max}`);
        // TODO display score somewhere
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
        this.variablevalues = this.generateVariables(variables);
        
        this.questions = [];
        this.score = {};
        this.currentquestion = -1;
        
        // Set page title
        document.title = title;
        // Catch keyboard events
        document.addEventListener("keydown", e => this.keyEvent(e));
    }
    
    get getDOM() {
        return {
        "questiondivclass": "question",
            "elementdivclass": "questionelements",
                "canvasdivclass": "canvasarea",
                    "canvaslabelclass": "canvaslabel",
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
            "submitbuttonclass": "submitbutton",
            "nextbuttonclass": "nextbutton",
        };
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
    
    begin() {
        this.currentquestion = -1;
        this.nextQuestion();
    }
    
    nextQuestion() {
        // Proceed to next question in sequence
        this.currentquestion++;
        this.display();
    }
    
    clearPage() {
        // Clear question objects from html
        let container = document.querySelector("." + this.DOM.questiondivclass);
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }
        
    }
    
    display() {
        // Display current question
        // Clear current page elements
        this.clearPage();
        if (this.currentquestion > -1) {
            // Add current question objects to html
            this.questions[this.currentquestion].display(this.DOM, this.variablevalues);
            // Add listening event to Submit button
            document.querySelector("." + this.DOM.submitbuttonclass).addEventListener("click", e => this.submit(e));
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
            document.querySelector("." + this.DOM.nextbuttonclass).addEventListener("click", e => this.next(e));
            // Adjust label to Finish if on last question
            if (this.currentquestion == this.questions.length - 1) {
                document.querySelector("." + this.DOM.nextbuttonclass).textContent = "Finish";
            }
        } else {
            // Add listening event to Next button
            document.querySelector("." + this.DOM.nextbuttonclass).addEventListener("click", e => this.repeat(e));
            // Adjust label to Retry
            document.querySelector("." + this.DOM.nextbuttonclass).textContent = "Retry";
        }
        
    }
    
    repeat() {
        // Repeat current question
        this.currentquestion--;
        this.nextQuestion();
    }
    
    next() {
        // End question, go to next
        if (this.currentquestion < this.questions.length - 1) {
            this.nextQuestion();
        } else {
            this.finish();
        }
    }
    
    finish() {
        // End problem
        let max = 0;
        let got = 0;
        console.log("--------------------");
        for (let i in this.score) {
            max += this.score[i].max;
            got += this.score[i].got;
            console.log(`Question ${i}: ${this.score[i].got}/${this.score[i].max}`);
        }
        console.log("--------------------");
        console.log(`Total: ${got}/${max} = ${roundTo(got/max*100,2)}%`);
    }
}