/*

TO DO:

GraphElement
    add support for drawing:
        multisegment line (length n)
        multisegment straight line (length n)
        horizontal line
        vertical line
        point slope line drawing
    move element
        lock certain axes
    reset button
    const elements
    default elements




*/


// ##### Misc functions #####
function getDist(...args) {
    if (args.length === 4) {
        let x1 = args[0];
        let y1 = args[1];
        let x2 = args[2];
        let y2 = args[3];
        return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
    } else if (args.length === 2 || args.length === 3) {
        if (args[0] instanceof Point) {
            let x1 = args[0].calx;
            let y1 = args[0].caly;
            let x2 = args[1].calx;
            let y2 = args[1].caly;
            if (args.length === 3) {
                if (args[2] === "raw") {
                    x1 = args[0].rawx;
                    y1 = args[0].rawy;
                    x2 = args[1].rawx;
                    y2 = args[1].rawy;
                }
            }
            return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
        }
    }
}

function getRandom(low, high) {
    return Math.random() * (high - low) + low;
}

function roundTo(num, digits) {
    let mul = Math.pow(10, digits);
    return Math.round(num * mul) / mul;
}

// TODO restructure all geometric objects to be based on points
// TODO write more comprehensive constructors for various inputs
// TODO write actual move drag/drop code

// ##### Geometric objects #####
class Point {
    /*
        rawx    <float> canvas-based x position of point
        rawy    <float> canvas-based y position of point
        calx    <float> graph-based x position of point
        caly    <float> graph-based y position of point
        movex   <bool> is point movable in the x direction?
        movey   <bool> is point movable in the y direction?
        cal     <dict> calibration data between canvas and graph
    */
    constructor(args) {
        this.ID = String(Math.random());
        if (args.rawx != undefined) {
            this.rawx = args.rawx
        }
        if (args.calx != undefined) {
            this.calx = args.calx;
        }
        if (args.rawy != undefined) {
            this.rawy = args.rawy;
        }
        if (args.caly != undefined) {
            this.caly = args.caly;
        }
        if (args.movex != undefined) {
            this.movex = args.movex;
        } else {
            this.movex = false;
        }
        if (args.movey != undefined) {
            this.movey = args.movey;
        } else {
            this.movey = false;
        }
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
        this.rawx = (this.calx / (cal.points[1].calx - cal.points[0].calx) * (cal.points[1].rawx - cal.points[0].rawx) + cal.points[0].rawx);
        this.rawy = (this.caly / (cal.points[1].caly - cal.points[0].caly) * (cal.points[1].rawy - cal.points[0].rawy) + cal.points[0].rawy);
    }
    
    get data() {
        return {"rawx":this.rawx, "rawy":this.rawy, "calx":this.calx, "caly":this.caly, "movex":this.movex, "movey":this.movey};
    }
    
    get toArray() {
        return [this.x, this.y];
    }
}

class Line {
    constructor(points) {
        this.points = points;
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

class Line2D {
    constructor(args) {
        if (args.pt1 != undefined) {
            this.pt1 = args.pt1;
        } else {
            let pt1args = {};
            for (let k of Object.keys(args)) {
                if (k.includes("1")) {
                    let kr = k.replace("1","");
                    pt1args[kr] = args[k];
                }
            }
            this.pt1 = new Point(pt1args);
        }
        if (args.pt2 != undefined) {
            this.pt2 = args.pt2;
        } else {
            let pt2args = {};
            for (let k of Object.keys(args)) {
                if (k.includes("2")) {
                    let kr = k.replace("2","");
                    pt2args[kr] = args[k];
                }
            }
            this.pt2 = new Point(pt2args);
        }
        if (args.cal != undefined) {
            this.pt1.calibratemissing(args.cal);
            this.pt2.calibratemissing(args.cal);
        }
        if (args.movept1 != undefined) {
            this.pt1.movex = args.movept1;
            this.pt1.movey = args.movept1;
        } else {
            if (args.movex1 != undefined) {
                this.pt1.movex = args.movex1;
            }
            if (args.movey1 != undefined) {
                this.pt1.movey = args.movey1;
            }
        }
        if (args.movept2 != undefined) {
            this.pt2.movex = args.movept2;
            this.pt2.movey = args.movept2;
        } else {
            if (args.movex2 != undefined) {
                this.pt2.movex = args.movex2;
            }
            if (args.movey2 != undefined) {
                this.pt2.movey = args.movey2;
            }
        }
    }
    
    calibrate(cal) {
        this.pt1.calibrate(cal);
        this.pt2.calibrate(cal);
    }
    
    inversecalibrate(cal) {
        this.pt1.inversecalibrate(cal);
        this.pt2.inversecalibrate(cal);
    }
    
    get toArray() {
        //return [this.x1, this.y1, this.x2, this.y2];
    }
    
    get toPoints() {
        return [this.pt1, this.pt2];
    }
    
    get rawLength() {
        return Math.pow(Math.pow(this.p1.rawx - this.pt2.rawx, 2) + Math.pow(this.pt1.rawy - this.pt2.rawy, 2), 0.5)
    }
    
    get calLength() {
        return Math.pow(Math.pow(this.p1.calx - this.pt2.calx, 2) + Math.pow(this.pt1.caly - this.pt2.caly, 2), 0.5)
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    
    calibrate(cal) {
        let newcenter = new Point(this.x, this.y).calibrate(cal);
        return new Circle(...newcenter.toArray, this.r);
    }
    
    inversecalibrate(cal) {
        let newcenter = new Point(this.x, this.y).inversecalibrate(cal);
        return new Circle(...newcenter.toArray, this.r);
    }
    
    get toArray() {
        return [this.x, this.y, this.r];
    }
    
    get center() {
        return new Point(this.x, this.y);
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
        this.canvas.size = new Point(this.img.width, this.img.height);
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
        this.ctx = this.canvas.getContext('2d');
        //this.canvas.focus();
        this.imgcalibration = imgcal;
        
        // State variables
        this.interactable = true;
        this.mode = mode;
        this.mode = "move";
        /* Valid modes are "move", "point", "line", "circle", "calibrate" */
        this.drawing = false; /* True when not finished drawing */
        this.dragging = false; /* holds object being moved */
        
        // Constants
        this.pointradius = 2;
        this.grabradius = 10;
        
        // Graph element variables
        this.finished = [];
        if (maxelements != undefined) {
            this.max = maxelements;
        } else {
            this.max = [];
        }
        if (defaults != undefined) {
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
            for (let ptdata of data) {
                ptdata.cal = this.imgcalibration;
                let pt = new Point(ptdata);
                ptlist.push(pt);
                this.finished.push(pt);
                
            }
            return new Line(ptlist);
            //return new Line2D(data);
        } else if (type === "circle") {
            return new Circle(data);
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
            //console.log('whats this');
            //console.log(this);
            this.ctx.drawImage(this.img, 0, 0);
        }
        this.img.onload = sync.call(this);
        //this.ctx.drawImage(this.img, 0, 0);
    }
    draw(element, color="black") {
        // Draws geometric elements to the canvas
        //console.log("Drawing:")
        //console.log(element);
        if (element instanceof Point) {
            this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(element.rawx, element.rawy, this.pointradius, 2*Math.PI, false);
            this.ctx.stroke();
        } else if (element instanceof Line2D) {
            this.ctx.strokeStyle = color;
            this.ctx.moveTo(element.pt1.rawx, element.pt1.rawy);
            this.ctx.lineTo(element.pt2.rawx, element.pt2.rawy);
            this.ctx.stroke();
        } else if (element instanceof Line) {
            // Connect points
            this.ctx.strokeStyle = color;
            let first = true;
            for (let pt of element.points) {
                if (first) {
                    this.ctx.moveTo(pt.rawx, pt.rawy);
                } else {
                    this.ctx.lineTo(pt.rawx, pt.rawy);
                    this.ctx.stroke();
                }
                first = false;
            }
        } else if (element instanceof Circle) {
            this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(element.x, element.y, element.r, 2*Math.PI, false);
            this.lineWidth = 5;
            this.ctx.stroke();
        }
    }
    trimLists() {
        // Removes the oldest element of each type if the limit is surpassed
        
        /*
        if (Object.keys(this.finished).length > 0) {
            for (let type of Object.keys(this.finished)) {
                while (this.finished[type].length > this.max[type]) {
                    this.finished[type].shift();
                }
            }
        }
        */
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
        return this.finished;
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
            this.draw(answer, "red");
        }
    }
    mouseMove(e) {
        // Whenever the mouse is moved over the canvas object
        this.currentpoint = this.getMousePoint(e);
        this.reportPoint(this.currentpoint);
        this.update();
        if (this.interactable) {
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
                            this.draw(p);
                        }
                        // Show held line
                        this.draw(this.held);
                    }
                }
            } else if (this.drawing) {
                if (this.mode === "point") {
                    this.draw(pt);
                } else if (this.mode === "line") {
                    //this.draw(new Line2D({"pt1":this.pt1, "pt2":pt}));
                    this.draw(new Line([this.pt1, pt]));
                } else if (this.mode === "circle") {
                    var r = getDist(...this.pt1.toArray, ...pt.toArray);
                    this.draw(new Circle(...this.pt1.toArray, r));
                } else if (this.mode === "calibrate") {
                    // calibration routine
                    this.draw(new Line([this.pt1, pt]));
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
                            this.finished.push(p);
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
                    //this.finished.push(new Line2D({"pt1":this.pt1, "pt2":pt}));
                    this.finished.push(new Line([this.pt1, pt]));
                } else if (this.mode === "circle") {
                    var r = getDist(...this.pt1.toArray, ...pt.toArray);
                    this.finished["circle"].push(new Circle(...this.pt1.toArray, r));
                } else if (this.mode === "calibrate") {
                    // calibration routine
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
                        let d = getDist(pt, this.finished[i], "raw");
                        if (d <= this.grabradius) {
                            if (d < grabdist) {
                                grabindex = i;
                                grabdist = d;
                            }
                        }
                    } else if (this.finished[i] instanceof Line) {
                        for (let j = 1; j < this.finished[i].points.length; j++) {
                            let pt1 = this.finished[i].points[j];
                            let pt2 = this.finished[i].points[j-1]
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
        } else if (key === "c") {
            this.mode = "circle";
        } else if (key === "x") {
            this.mode = "point";
            this.calibrating = true;
            console.log("Click (0,0)");
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
            answercount: {"point": 1, "line": 0, "circle": 0}, named list of expected
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
        this.tolerance = inputarguments.tolerance;
        this.points = inputarguments.points;
        this.showanswer = inputarguments.showanswer;
    }
    
    checkanswer(answer) {
        let score = {"max": 0,
                     "got": 0,
                     "pct": 0};
        let used = [];
        if (this.answercount["point"] > 0) {
            let points = answer;
            for (let i in this.answer.point) {
                score.max += 1;
                for (let j in points) {
                    if (used.indexOf(j) === -1) {
                        if (getDist(points[j], this.answer.point[i]) <= this.tolerance) {
                            score.got += 1;
                            used.push(j);
                            //points.splice(j);
                            break;
                        }
                    }
                }
            }
        } else if (this.answercount["line"] > 0) {
            let lines = answer.line;
            for (let i in this.answer.line) {
                score.max += 1;
                // line matching logic
            }
        } else if (this.answercount["circle"] > 0) {
            let circles = answer.circle;
            for (let i in this.answer.circle) {
                score.max += 1;
                // circle matching logic
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
            for (let variable of Object.keys(this.variablevalues)) {
                exp = exp.replace(`%${variable}%`, this.variablevalues[variable]);
            }
            // Evaluate expression
            this.variablevalues[name] = eval(exp);
        }
    }
    
    assignVariables() {
        // Replace variables in all elements
        for (let element of this.elements) {
            for (let variable of Object.keys(this.variablevalues)) {
                if ("label" in element) {
                    // Replace in label
                    element.label = element.label.replace(`%${variable}%`, this.variablevalues[variable]);
                }
                if ("answer" in element) {
                    // Replace in answer
                    if (element instanceof TextboxElement) {
                        element.answer = element.answer.replace(`%${variable}%`, this.variablevalues[variable]);
                    } else if (element instanceof GraphElement) {
                        for (let geotype in element.answer) {
                            for (let geoobject in element.answer[geotype]) {
                                for (let geostring in element.answer[geotype][geoobject]) {
                                    element.answer[geotype][geoobject][geostring] = element.answer[geotype][geoobject][geostring].replace(`%${variable}%`, this.variablevalues[variable]);
                }
    }}}}}}}
    
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
        let container = document.querySelector("." + DOM.elementdivclass);
        
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
        this.insertContainers(DOM, this.instruction);
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
            "instructiondivclass": "instruction",
                "instructionspanclass": "instructionspan",
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
            for (let variable of Object.keys(variablevalues)) {
                exp = exp.replace(`%${variable}%`, variablevalues[variable]);
            }
            // Evaluate expression
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
        console.log(`Total: ${got}/${max} = ${roundTo(got/max,2)*100}%`);
    }
}