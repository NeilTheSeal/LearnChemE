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
    
    allow multiple answers in textboxes
    boolean to set case sensitivity
    allow line construction with a function instead of points
    allow region based on set of inequalities
    add user score submission at the end
*/


// var p = JSON.parse(json_string);


// ##### Constants (default values) #####

const VAR = "@";
const SPVAR = "~";
const HIDESCOREWINDOWWIDTH = 975;
const IDLENGTH = 16;
const LINEWIDTH = 2;
const LINECOLOR = "black";
const GRABRADIUS = 5;

// ##### Misc functions #####

/**
    Calculates the straight-line distance between two 2D points
    @param {Point} pt1
    @param {Point} pt2
    @param {string} [mode] "cal" or "raw"
    @return {float} The distance between the points
*/
function getDist(pt1, pt2, mode="cal") {
    if (mode === "cal") {
        return Math.pow(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2), 0.5);
    } else if (mode === "raw") {
        return Math.pow(Math.pow(pt1.rawx - pt2.rawx, 2) + Math.pow(pt1.rawy - pt2.rawy, 2), 0.5);
    }
}

/**
    Gets a random float between two values
    @param {float} low Lowest value
    @param {float} high Highest value
    @return {float} A float between high and low
*/
function getRandom(low, high) {
    return Math.random() * (high - low) + low;
}

/**
    Rounds a float to a given number of decimal places
    @param {float} num Number to round
    @param {int} digits Number of digits to round to
    @return {float} Rounded number
*/
function roundTo(num, digits) {
    let mul = Math.pow(10, digits);
    return Math.round(num * mul) / mul;
}

/**
    Returns one of two results based on a condition
    @param {string} condition Condition to be tested
    @param {} iftrue Action to take if condition is true
    @param {} iffalse Action to take if condition is false
    @return {boolean} True or false
*/
function ifTF(condition, iftrue, iffalse) {
    if (condition) {
        return iftrue;
    } else {
        return iffalse;
    }
}

/**
    Generates a string of random digits
    @param {int} digits Number of digits in ID
    @return {string} A string of random digits
*/
function randomID(digits=16) {
    let str = ""
    // Math.random() generates a 17 digit number between 0 and 1
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

/**
    Determines whether or not an object is iterable
    @param {object} Object to test for iterability
    @return {boolean} True or False
*/
function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

/**
    Performs a replacement on all strings contained in an object
    @param {object} obj Object to replace in
    @param {string} pattern String to find
    @param {string} replacement String to insert
    @return {object} Post-replacement object
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

/**
    Recursively converts all number-like strings in an object into numbers
    @param {object} obj Object to numberfy
    @return {object} Post-conversion object
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

/**
    Tests if a pattern exists on any string contained in an object
    @param {object} obj Object to replace in
    @param {string} pattern String to find
    @return {boolean} True or false
*/
function recursiveExists(obj, pattern) {
    
    if (typeof(obj) === "string") {
        while (obj.indexOf(pattern) != -1) {
            return true;
        }
    } else if (typeof(obj) === "object"){
        for (let child of Object.keys(obj)) {
            if (recursiveExists(obj[child], pattern)) {
                return true;
            }
        }
    }
    return false;
}

/**
    Attempts to find a pattern in any string contained in an object
    @param {object} obj Object to replace in
    @param {string} pattern String to find
    @return {list} List of strings containing specified string inside object somewhere
*/
function recursiveFind(obj, pattern) {
    let findlist = [];
    if (typeof(obj) === "string") {
        while (obj.indexOf(pattern) != -1) {
            return obj;
        }
    } else if (typeof(obj) === "object"){
        for (let child of Object.keys(obj)) {
            let f = recursiveFind(obj[child], pattern);
            if (f) {
                if (Array.isArray(f)) {
                    for (let i of f) {
                        findlist.push(i);
                    }
                } else {
                    findlist.push(f);
                }
            }
        }
    }
    return findlist;
}


/**
    Generate naive hash from string
    Bad, need to redo
*/
String.prototype.hashCode = function() {
    let hash = 0;
    if (this.length > 0) {
        for (let i = 0; i < this.length; i++) {
            const char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
    }
    return hash;
}
/*
s = "105209964" + "101" + "10";
console.log('hashing', s, s.hashCode());
s = "105209964" + "101" + "20";
console.log('hashing', s, s.hashCode());
s = "105209964" + "101" + "30";
console.log('hashing', s, s.hashCode());
*/


/**
    Returns true if x is between a and b (or equal to either)
    @param {num} x Test number
    @param {num} a First boundary
    @param {num} b Second boundary
    @return {boolean} True or false
*/
function isBetween(x, a, b) {
    return (a <= x && x <= b) || (a >= x && x >= b)
}

/**
    Returns x if between a and b, otherwise whichever boundary is closer
    @param {float} x Test number
    @param {float} a First boundary
    @param {float} b Second boundary
    @return {float} A number between a and b
*/
function constrain(x, a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return Math.max(Math.min(x, max), min);
}

/**
    Generates a object of variable values from a object of parameters. Example:<br>
    {"constants": {"x": 1, "y": 2},<br>
    "random": {"z": {"min": -3, "max": 3, "digits": 1}},<br>
    "calculated": {"sum": "@x@+@y@", "f": "myfunction(@z@)"}}<br>
    @param {object} variables
    @param {object} variables.constants Constant values
    @param {object} variables.random Linear random variables
    @param {num} variables.random.min Minimum value
    @param {num} variables.random.max Maximum value
    @param {num} variables.random.digits Digits of precision
    @param {object} variables.calculated Variables calculated from other variables, referenced by surrounding in @ symbols
    @return {object} Objectionary of variable names and values
*/
function generateVariables(variables) {
    let variablevalues = {};
    // Assign constants
    for (let name of Object.keys(variables.constants)) {
        variablevalues[name] = variables.constants[name];
    }
    // Generate and assign random variables
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
        while (exp.indexOf(`${VAR}`) != -1 && loops < maxloops) {
            for (let variable of Object.keys(variablevalues)) {
                exp = exp.replace(`${VAR}${variable}${VAR}`, variablevalues[variable]);
            }
            loops++;
        }
        if (loops >= maxloops) {
            console.log("Error, maximum loops exceeded, cannot resolve", name, "=", exp);
        }
        // Evaluate expression (trusted code provided by the question-creator)
        //console.log("Evaluating",exp);
        variablevalues[name] = eval(exp);
    }
    return variablevalues;
}

/**
    Creates a new cookie for this page
    @param {string} cname Name of the cookie
    @param {string} cvalue Value of the cookie
    @param {int} milliseconds Lifespan of cookie in ms
*/
function setCookie(cname, cvalue, milliseconds) {
    var d = new Date();
    d.setTime(d.getTime() + milliseconds);
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
    Retrieves a cookie for this page
    @param {string} cname Name of the cookie
*/
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

/**
    Example function for creating/checking a cookie
*/
function checkCookie() {
    var user=getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
       user = prompt("Please enter your name:","");
       if (user != "" && user != null) {
           setCookie("username", user, 5*1000);
       }
    }
}

// ##### Canvas objects #####

/**
    Objecting representing a point in 2D space
*/
class Point {
    /**
        @param {object} args Object of input arguments.
        @param {object} args.graphinfo
        @param {float} args.rawx
        @param {float} args.rawy
        @param {float} args.x
        @param {float} args.y
        @param {boolean} [args.movex=false]
        @param {boolean} [args.movey=false]
        @param {string} [args.color="black"]
        @param {float} [args.radius=5]
        @param {boolean} [args.answer=false]
        @param {boolean} [args.show=true]
    */
    constructor(args) {
        /**
            @name Point#graphinfo
            @type GraphInfo
            @desc Relevant information for the graph this point will live on.
        */
        /**
            @name Point#x
            @type float
            @desc Calibrated x value of point. Must provide either this or {@link Point#rawx}.
        */
        /**
            @name Point#y
            @type float
            @desc Calibrated y value of point. Must provide either this or {@link Point#rawy}.
        */
        /**
            @name Point#rawx
            @type float
            @desc Canvas-based x value of point. Must provide either this or {@link Point#x}.
        */
        /**
            @name Point#rawy
            @type float
            @desc Canvas-based y value of point. Must provide either this or {@link Point#y}.
        */
        /**
            @name Point#ID
            @type string
            @desc (Probably) unique identifier for point. Generated by {@link randomID}.
        */
        this.ID = randomID(IDLENGTH);
        /**
            @name Point#movex
            @type boolean
            @desc Is this point movable in the x dimension?
            @default false
        */
        this.movex = false;
        /**
            @name Point#movey
            @type boolean
            @desc Is this point movable in the y dimension?
            @default false
        */
        this.movey = false;
        /**
            @name Point#color
            @type string
            @default "black"
            @desc Color of the point
        */
        this.color = "black";
        /**
            @name Point#radius
            @type float
            @default 5
            @desc Radius of the point
        */
        this.radius = 5;
        /**
            @name Point#answer
            @type boolean
            @default false
            @desc Is this point submitted as an answer to the question?
        */
        this.answer = false;
        /**
            @name Point#show
            @type boolean
            @default true
            @desc Is this point drawn as part of a line?
        */
        this.show = true;
        // Fill values from provided arguments
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        // Fill missing values
        this.generateCal();
        this.generateRaw();
    }
    /**
        Sets calibrated values ({@link Point#x}, {@link Point#y}) from raw values ({@link Point#rawx}, {@link Point#rawy}) using {@link Point#graphinfo}.
    */
    generateCal() {
        if (this.rawx != undefined) {
            if (this.graphinfo.xRawToCal != undefined) {
                this.x = this.graphinfo.xRawToCal(this.rawx);
            }
            if (this.graphinfo.x2RawToCal != undefined) {
                this.x2 = this.graphinfo.x2RawToCal(this.rawx);
            }
        }
        if (this.rawy != undefined) {
            if (this.graphinfo.yRawToCal != undefined) {
                this.y = this.graphinfo.yRawToCal(this.rawy);
            }
            if (this.graphinfo.y2RawToCal != undefined) {
                this.y2 = this.graphinfo.y2RawToCal(this.rawy);
            }
        }
    }
    /**
        Sets raw values ({@link Point#rawx}, {@link Point#rawy}) from calibrated values ({@link Point#x}, {@link Point#y}) using {@link Point#graphinfo}.
    */
    generateRaw() {
        if (this.x != undefined) {
            this.rawx = this.graphinfo.xCalToRaw(this.x);
        }
        if (this.y != undefined) {
            this.rawy = this.graphinfo.yCalToRaw(this.y);
        }
        if (this.x2 != undefined) {
            this.rawx = this.graphinfo.x2CalToRaw(this.x2);
        }
        if (this.y2 != undefined) {
            this.rawy = this.graphinfo.y2CalToRaw(this.y2);
        }
    }
    /**
        @return {object} The internal data of the point
    */
    data() {
        let r = {};
        for (let k of Object.keys(this)) {
            r[k] = this[k];
        }
        return r;
    }
}

/**
    @param {object} args Object-like object of input arguments.
    @param {list} args.points List of {@link Point} constructor argument objects
    @param {string} [args.color="black"]
    @param {float} [args.width=1]
    @param {boolean} [args.answer=false]
    @param {boolean} [args.correctanswer=false]
*/
class Line {
    constructor(args) {
        /**
            @name Line#ID
            @type string
            @desc (Probably) unique identifier for line. Generated by {@link randomID}.
        */
        this.ID = randomID(IDLENGTH);
        /**
            @name Line#color
            @type string
            @default "black"
            @desc Line color.
        */
        this.color = "black";
        /**
            @name Line#width
            @type string
            @default 2
            @desc Line width.
        */
        this.width = 2;
        /**
            @name Line#answer
            @type boolean
            @default false
            @desc Is this line submitted as an answer to the question?
        */
        this.answer = false;
        /**
            @name Point#answer
            @type boolean
            @default false
            @desc Is this line shown as an answer to the question?
        */
        this.correctanswer = false;
        // Fill values from provided arguments
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
    }
    /**
        @return {int} The number of line segments
    */
    segments() {
        return this.points.length-1;
    }
    /**
        @return {float} The total distance covered by the line from point to point
    */
    distance() {
        sum = 0;
        for (let i = 1; i < this.points.length; i++) {
            sum += getDist(this.points[i-1], this.points[i]);
        }
        return sum;
    }
    /**
        @return {object} The internal data of the line
    */
    data() {
        let r = {};
        for (let k of Object.keys(this)) {
            r[k] = this[k];
        }
        return r;
    }
}

/**
    Container class for graph/calibration data
    @param {object} args Object of input arguments.
    @param {int} args.graphheight Height (in px) of the vertical (y) axes
    @param {int} args.graphwidth Width (in px) of the horizontal (x) axes
    @param {string} args.graphbackground Color of the area within the axes
    @param {string} args.axesbackground Color of the area around the graph
    @param {object} args.padding Container for padding size around the plot
        @param {int} args.padding.top Height (in px) of the region above the plot
        @param {int} args.padding.left Width (in px) of the region to the left of the plot
        @param {int} args.padding.bottom Height (in px) of the region below the plot
        @param {int} args.padding.right Width (in px) of the region to the right of the plot
    @param {object} args.x Container for information about the primary x axis
        @param {string} args.x.label Text to label the axis
        @param {float} args.x.min Left/bottom value on the axis
        @param {float} args.x.max Right/top value on the axis
        @param {float} args.x.majortick Increment to draw major tick marks on the axis
        @param {float} args.x.minortick Increment to draw minor tick marks on the axis
        @param {float} args.x.gridline Increent to draw gridlines across the plot
    @param {object} args.y Container for information about the primary y axis (same arguments as {@link x})
    @param {object} args.x2 Container for information about the secondary x axis (same arguments as {@link x})
    @param {object} args.y2 Container for information about the secondary y axis (same arguments as {@link x})
*/
class GraphInfo {
    constructor(args) {
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        this.height = this.graphheight + this.padding.bottom + this.padding.top;
        this.width = this.graphwidth + this.padding.left + this.padding.right;
        this.graphleft = this.padding.left;
        this.graphright = this.padding.left + this.graphwidth;
        this.graphtop = this.padding.top;
        this.graphbottom = this.padding.top + this.graphheight;
        
        // Generate calibration values/functions
        if (this.x != undefined) {
            this.scaleX = (this.graphwidth) / (this.x.max - this.x.min);
            this.xCalToRaw = function(xcal) {
                return (xcal - this.x.min) * this.scaleX + this.padding.left;
            }
            this.xRawToCal = function(xraw) {
                return (xraw - this.padding.left) / this.scaleX + this.x.min;
            }
        }
        if (this.y != undefined) {
            this.scaleY = -(this.graphheight) / (this.y.max - this.y.min);
            this.yCalToRaw = function(ycal) {
                return (ycal - this.y.max) * this.scaleY + this.padding.top;
            }
            this.yRawToCal = function(yraw) {
                return (yraw - this.padding.top) / this.scaleY + this.y.max;
            }
        }
        if (this.x2 != undefined) {
            this.scaleX2 = (this.graphwidth) / (this.x2.max - this.x2.min);
            this.x2CalToRaw = function(xcal) {
                return (xcal - this.x2.min) * this.scaleX2 + this.padding.left;
            }
            this.x2RawToCal = function(xraw) {
                return (xraw - this.padding.left) / this.scaleX2 + this.x2.min;
            }
        }
        if (this.y2 != undefined) {
            this.scaleY2 = -(this.graphheight) / (this.y2.max - this.y2.min);
            this.y2CalToRaw = function(ycal) {
                return (ycal - this.y2.max) * this.scaleY2 + this.padding.top;
            }
            this.y2RawToCal = function(yraw) {
                return (yraw - this.padding.top) / this.scaleY2 + this.y2.max;
            }
        }
    }
    /**
        Converts {@link GraphInfo} into a {@link Calibration} object.
    */
    calibration() {
        calinfo = {};
        for (let key of ["scaleX", "xCalToRaw", "xRawToCal",
                         "scaleY", "yCalToRaw", "yRawToCal",
                         "scaleX2", "x2CalToRaw", "x2RawToCal",
                         "scaleY2", "y2CalToRaw", "y2RawToCal"]) {
            if (this[key] != undefined) {
                calinfo[key] = this[key];
            }
        }
        return calinfo;
    }
}

/**
    Text element for display through CanvasController
    @param {string} text Text to display
    @param {string} [font="20px sans-serif"] ex. "italic 20px sans-serif"
    @param {string} align "left", "right", or "center"
    @param {string} color Color of text
    @param {Point} position Location of text on canvas
*/
class Text {
    constructor(args) {
        // Default values
        this.ID = randomID(IDLENGTH);
        this.text = "";
        this.font = "20px sans-serif";
        this.align = "left";
        this.color = "black";
        // Argument values
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        // Convert data to point if not
        if (!(this.position instanceof Point)) {
            this.position = new Point(this.position);
        }
        
    }
    /**
        @return {object} The internal data of the text
    */
    data() {
        let r = {};
        for (let k of Object.keys(this)) {
            r[k] = this[k];
        }
        return r;
    }
}

// ##### Other classes #####

/**
    Stacked canvases for drawing on different layers
    @param {int} width Width of canvases
    @param {int} height Height of canvases
    @param {int} layers Number of layers
    @param {string} container ID of container element
    @param {string} id Style of canvas, postpended with index
    @param {string} class Classes added to each canvas
*/
class ZCanvas {
    constructor(args) {
        this.id = "zcanvas-";
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        this.canvas = [];
        for (let i=0; i<this.layers; i++) {
            let container = document.getElementById(this.container);
            let html = `<canvas `;
            if (this.id) {
                html += `id="${this.id}${i}" `;
            }
            if (this.class) {
                html += `class="${this.class}" `;
            }
            html += `style="z-index:${i}"></canvas>`;
            container.insertAdjacentHTML("beforeend", html);
            this.canvas[i] = document.getElementById(`${this.id}${i}`)
            this.canvas[i].width = this.width;
            this.canvas[i].height = this.height;
        }
    }
    getContext(index) {
        return this.canvas[index].getContext("2d");
    }
}

// ##### Controllers #####

/**
    Controller class for HTML canvas objects<br>
    Uses two overlaid canvases for background and foreground drawing.
*/
class CanvasController {
    /**
        @param {object} DOM DOM name associations
        @param {int} index Index to identify canvas
        @param {object} args Object of input arguments
        @param {object} args.cursor Cursor display information
        @param {object} args.mode Interaction mode
        @param {object} args.answercount Maximum number of elements to allow on graph
        @param {int} args.answercount.point 
        @param {int} args.answercount.line 
        @param {object} args.default Default elements that exist on graph
        @param {list} args.default.point 
        @param {list} args.default.line 
    */
    constructor(DOM, index, args) {
        // Load arguments
        this.graphinfo = new GraphInfo(args.graphinfo)
        //this.img = new Image();
        //this.img.src = args.imgsrc;
        //this.imgcalibration = args.imgcal;
        /* Valid modes are "move", "point", "line", "calibrate" */
        this.mode = args.mode;
        if (args.cursor != undefined) {
            this.cursor = args.cursor;
        }
        
        // Unique number for this canvas
        this.index = index;
        const re = new RegExp(`${VAR}id${VAR}`, "g");
        // Retrieve DOM elements
        this.div = document.getElementById(DOM.canvasdivid.replace(re, index));
        this.staticcanvas = document.getElementById(DOM.staticcanvasid.replace(re, index));
        this.dynamiccanvas = document.getElementById(DOM.dynamiccanvasid.replace(re, index));
        
        // Set up canvas size
        this.height = this.graphinfo.height;
        this.width = this.graphinfo.width;
        this.staticcanvas.width = this.width;
        this.staticcanvas.height = this.height;
        this.dynamiccanvas.width = this.width;
        this.dynamiccanvas.height = this.height;
        // Set div to correct height
        this.div.style.height = this.height + "px";
        // Context objects for drawing
        this.staticctx = this.staticcanvas.getContext('2d');
        this.dynamicctx = this.dynamiccanvas.getContext('2d');
        
        this.drawGraph();
        
        // State variables
        this.interactable = true;
        this.drawing = false; /* True when not finished drawing */
        
        // Constants
        this.grabradius = GRABRADIUS;
        
        this.max = [];
        this.finished = [];
        // Set max elements of each type, if specified
        if (args.answercount != undefined) {
            this.max = args.answercount;
        }
        // Set default elements of each type, if specified
        if (args.default != undefined) {
            this.default = [];
            for (let type of Object.keys(args.default)) {
                for (let d of args.default[type]) {
                    this.finished.push(this.dataToElement(type, d));
                }
            }
        }
        
        // Set up mouse events
        this.dynamiccanvas.addEventListener("mousemove", e => this.mouseMove(e));
        this.dynamiccanvas.addEventListener("mousedown", e => this.mouseDown(e));
        this.dynamiccanvas.addEventListener("mouseup", e => this.mouseUp(e));
        
        // Calibration setup
        if (this.mode === "calibrate") {
            this.x1 = DOM.textboxid.replace(re, 2);
            this.y1 = DOM.textboxid.replace(re, 3);
            this.x2 = DOM.textboxid.replace(re, 4);
            this.y2 = DOM.textboxid.replace(re, 5);
        }
  
        // Initialize
        this.update();
    }
    /**
        Clears the foreground canvas
    */
    clear() {
        //this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.dynamiccanvas.width = this.dynamiccanvas.width; // Hacky workaround
    }
    /**
        Updates the canvas to its current state
    */
    update() {
        this.clear();
        // Remove objects if over limits
        this.trimLists();
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
    /**
        Creates geometric class object from input data
        @param {string} type "point", "line", or "text"
        @param {object} data Object of input arguments for object
        @return {Point|Line|Text} An instance of the chosen class
    */
    dataToElement(type, data) {
        // Append calibration data
        data.graphinfo = this.graphinfo;
        // Create appropriate object
        if (type === "point") {
            return new Point(data);
        } else if (type === "line") {
            let ptlist = [];
            if (data.points) {
                // line constructed from list of points
                for (let ptdata of data.points) {
                    ptdata.graphinfo = this.graphinfo;
                    let pt = new Point(ptdata);
                    ptlist.push(pt);
                    if (pt.show) {
                        this.finished.push(pt);
                    }
                }
                data.points = ptlist;
            } else if (data.equation) {
                // line constructed from equation
                const dx = (data.max - data.min) / data.steps;
                //for (let i=1; i<= data.steps; i++) {
                for (let i=data.min; i<= data.max; i+=dx) {
                    const ind = data.independent;
                    const dep = data.dependent;
                    const re = new RegExp(`${SPVAR}${data.independent}${SPVAR}`, "g");
                    let ptdata = {};
                    ptdata[ind] = i;
                    // Evaluate expression (trusted code provided by the question-creator)
                    ptdata[dep] = eval(data.equation.replace(re, i))
                    ptdata["graphinfo"] = this.graphinfo
                    if (data.showpoints) {
                        ptdata.show = true;
                    } else {
                        ptdata.show = false;
                    }
                    let pt = new Point(ptdata);
                    ptlist.push(pt);
                    if (pt.show) {
                        this.finished.push(pt);
                    }
                }
                data.points = ptlist;
            }
            return new Line(data);
        } else if (type === "text") {
            data.position.graphinfo = this.graphinfo;
            return new Text(data);
        }
    }
    /**
        @param {event} e Mouse event
        @return {Point} Point object at the current location of the mouse cursor
    */
    getMousePoint(e) {
        return new Point({"rawx":e.pageX - this.dynamiccanvas.offsetParent.offsetLeft,
                          "rawy":e.pageY - this.dynamiccanvas.offsetParent.offsetTop,
                          "graphinfo":this.graphinfo});
    }
    /**
        Draws the background of the graph (background colors, axes, labels)<br>
        Needs serious revision
    */
    drawGraph() {
        // Constants
        const MajorAxisTickLength = 10;
        const MinorAxisTickLength = 5;
        const LabelDigits = 3;
        const LabelxDigits = LabelDigits;
        const LabelyDigits = LabelDigits;
        const Labelx2Digits = LabelDigits;
        const Labely2Digits = LabelDigits;
        const GridColor = "lightgray";
        const GridThickness = 1;
        const TickColor = "gray";
        const TickThickness = 1;
        const TextColor = "black";
        const TextFont = "20px sans-serif";
        // Border region
        this.staticctx.beginPath();
        this.staticctx.fillStyle = this.graphinfo.axesbackground;
        this.staticctx.fillRect(0, 0, this.graphinfo.width, this.graphinfo.height);
        // Graph region
        this.staticctx.fillStyle = this.graphinfo.graphbackground;
        this.staticctx.fillRect(this.graphinfo.padding.left, this.graphinfo.padding.top, this.graphinfo.graphwidth, this.graphinfo.graphheight);
        this.staticctx.beginPath();
        // TODO abstract these four blocks into one method with arguments
        // X axis
        if (this.graphinfo.x != undefined) {
            // Draw gridlines
            this.staticctx.strokeStyle = GridColor;
            this.staticctx.lineWidth = GridThickness;
            for (let x = this.graphinfo.padding.left; x <= this.graphinfo.width - this.graphinfo.padding.right; x += Math.abs(this.graphinfo.x.gridline * this.graphinfo.scaleX)) {
                this.staticctx.beginPath();
                this.staticctx.moveTo(x, this.graphinfo.height - this.graphinfo.padding.bottom);
                this.staticctx.lineTo(x, this.graphinfo.padding.top);
                this.staticctx.stroke();
            }
            // Draw minor ticks
            this.staticctx.strokeStyle = TickColor;
            this.staticctx.lineWidth = TickThickness;
            for (let x = this.graphinfo.padding.left; x <= this.graphinfo.width - this.graphinfo.padding.right; x += Math.abs(this.graphinfo.x.minortick * this.graphinfo.scaleX)) {
                this.staticctx.beginPath();
                this.staticctx.moveTo(x, this.graphinfo.height - this.graphinfo.padding.bottom);
                this.staticctx.lineTo(x, this.graphinfo.height - this.graphinfo.padding.bottom - MinorAxisTickLength);
                this.staticctx.stroke();
            }
            // Draw major ticks and numbers
            for (let x = this.graphinfo.padding.left; x < this.graphinfo.width - this.graphinfo.padding.right; x += Math.abs(this.graphinfo.x.majortick * this.graphinfo.scaleX)) {
                this.staticctx.beginPath();
                this.staticctx.strokeStyle = TickColor;
                this.staticctx.moveTo(x, this.graphinfo.height - this.graphinfo.padding.bottom);
                this.staticctx.lineTo(x, this.graphinfo.height - this.graphinfo.padding.bottom - MajorAxisTickLength);
                this.staticctx.stroke();
                this.staticctx.fillStyle = TextColor;
                this.staticctx.font = TextFont;
                this.staticctx.textAlign = "center";
                this.staticctx.fillText(roundTo(this.graphinfo.xRawToCal(x), LabelxDigits), x, this.graphinfo.height - this.graphinfo.padding.bottom + 20);
            }
            // Draw last number
            this.staticctx.fillText(roundTo(this.graphinfo.xRawToCal(this.graphinfo.width - this.graphinfo.padding.right), LabelxDigits), this.graphinfo.width - this.graphinfo.padding.right, this.graphinfo.height - this.graphinfo.padding.bottom + 20);
            // Draw label
            this.staticctx.fillText(this.graphinfo.x.label, this.graphinfo.graphwidth / 2 + this.graphinfo.padding.left, this.graphinfo.height - this.graphinfo.padding.bottom + 40);
        }
        // Y axis
        if (this.graphinfo.y != undefined) {
            // Draw gridlines
            this.staticctx.strokeStyle = GridColor;
            this.staticctx.lineWidth = GridThickness;
            for (let y = this.graphinfo.padding.top; y < this.height - this.graphinfo.padding.bottom; y += Math.abs(this.graphinfo.y.gridline * this.graphinfo.scaleY)) {
                this.staticctx.beginPath();
                this.staticctx.moveTo(this.graphinfo.padding.left, y);
                this.staticctx.lineTo(this.graphinfo.padding.left + this.graphinfo.graphwidth, y);
                this.staticctx.stroke();
            }
            // Draw minor ticks
            this.staticctx.strokeStyle = TickColor;
            this.staticctx.lineWidth = TickThickness;
            for (let y = this.graphinfo.padding.top; y < this.height - this.graphinfo.padding.bottom; y += Math.abs(this.graphinfo.y.minortick * this.graphinfo.scaleY)) {
                this.staticctx.beginPath();
                this.staticctx.moveTo(this.graphinfo.padding.left, y);
                this.staticctx.lineTo(this.graphinfo.padding.left + MinorAxisTickLength, y);
                this.staticctx.stroke();
            }
            // Draw major ticks and numbers
            for (let y = this.graphinfo.padding.top; y < this.height - this.graphinfo.padding.bottom; y += Math.abs(this.graphinfo.y.majortick * this.graphinfo.scaleY)) {
                this.staticctx.beginPath();
                this.staticctx.strokeStyle = TickColor;
                this.staticctx.moveTo(this.graphinfo.padding.left, y);
                this.staticctx.lineTo(this.graphinfo.padding.left + MajorAxisTickLength, y);
                this.staticctx.stroke();
                this.staticctx.fillStyle = TextColor;
                this.staticctx.font = TextFont;
                this.staticctx.textAlign = "right";
                this.staticctx.fillText(roundTo(this.graphinfo.yRawToCal(y), LabelyDigits), this.graphinfo.padding.left - 5, y + 7); // vertical align not working, 7 works for 20 pt font
            }
            // Draw last number
            this.staticctx.fillText(roundTo(this.graphinfo.yRawToCal(this.height - this.graphinfo.padding.bottom), LabelyDigits), this.graphinfo.padding.left - 5, this.height - this.graphinfo.padding.bottom + 7); // vertical align not working, 7 works for 20 pt font
            // Draw label
            this.staticctx.save();
            this.staticctx.rotate(-Math.PI/2);
            this.staticctx.textAlign = "center";
            // rotate is strange, temporary fix
            this.staticctx.fillText(this.graphinfo.y.label, -this.graphinfo.graphheight / 2 - this.graphinfo.padding.top, 35);
            this.staticctx.restore();
        }
        // X2 axis
        if (this.graphinfo.x2 != undefined) {
            // Draw gridlines
            this.staticctx.strokeStyle = GridColor;
            this.staticctx.lineWidth = GridThickness;
            for (let x = this.graphinfo.padding.left; x <= this.graphinfo.width - this.graphinfo.padding.right; x += Math.abs(this.graphinfo.x2.gridline * this.graphinfo.scaleX2)) {
                this.staticctx.beginPath();
                this.staticctx.moveTo(x, this.graphinfo.height - this.graphinfo.padding.bottom);
                this.staticctx.lineTo(x, this.graphinfo.padding.top);
                this.staticctx.stroke();
            }
            // Draw minor ticks
            this.staticctx.strokeStyle = TickColor;
            this.staticctx.lineWidth = TickThickness;
            for (let x = this.graphinfo.padding.left; x <= this.graphinfo.width - this.graphinfo.padding.right; x += Math.abs(this.graphinfo.x2.minortick * this.graphinfo.scaleX2)) {
                this.staticctx.beginPath();
                this.staticctx.moveTo(x, this.graphinfo.padding.top);
                this.staticctx.lineTo(x, this.graphinfo.padding.top + MinorAxisTickLength);
                this.staticctx.stroke();
            }
            // Draw major ticks and numbers
            for (let x = this.graphinfo.padding.left; x < this.graphinfo.width - this.graphinfo.padding.right; x += Math.abs(this.graphinfo.x2.majortick * this.graphinfo.scaleX2)) {
                // working
                this.staticctx.beginPath();
                this.staticctx.strokeStyle = TickColor;
                this.staticctx.moveTo(x, this.graphinfo.padding.top);
                this.staticctx.lineTo(x, this.graphinfo.padding.top + MajorAxisTickLength);
                this.staticctx.stroke();
                this.staticctx.fillStyle = TextColor;
                this.staticctx.font = TextFont;
                this.staticctx.textAlign = "center";
                this.staticctx.fillText(roundTo(this.graphinfo.x2RawToCal(x), Labelx2Digits), x, this.graphinfo.padding.top - 15);
            }
            // Draw last number
            this.staticctx.fillText(roundTo(this.graphinfo.x2RawToCal(this.graphinfo.width - this.graphinfo.padding.right), Labelx2Digits), this.graphinfo.width - this.graphinfo.padding.right, this.graphinfo.padding.top - 15);
            // Draw label
            this.staticctx.fillText(this.graphinfo.x2.label, this.graphinfo.graphwidth / 2 + this.graphinfo.padding.left, this.graphinfo.padding.top - 37);
        }
        // Y2 axis
        if (this.graphinfo.y2 != undefined) {
            // Draw gridlines
            this.staticctx.strokeStyle = GridColor;
            this.staticctx.lineWidth = GridThickness;
            for (let y = this.graphinfo.padding.top; y < this.height - this.graphinfo.padding.bottom; y += Math.abs(this.graphinfo.y2.gridline * this.graphinfo.scaleY2)) {
                this.staticctx.beginPath();
                this.staticctx.moveTo(this.graphinfo.padding.left, y);
                this.staticctx.lineTo(this.graphinfo.padding.left + this.graphinfo.graphwidth, y);
                this.staticctx.stroke();
            }
            // Draw minor ticks
            this.staticctx.strokeStyle = TickColor;
            this.staticctx.lineWidth = TickThickness;
            for (let y = this.graphinfo.padding.top; y < this.height - this.graphinfo.padding.bottom; y += Math.abs(this.graphinfo.y2.minortick * this.graphinfo.scaleY2)) {
                this.staticctx.beginPath();
                this.staticctx.moveTo(this.width - this.graphinfo.padding.right, y);
                this.staticctx.lineTo(this.width - this.graphinfo.padding.right - MinorAxisTickLength, y);
                this.staticctx.stroke();
            }
            // Draw major ticks and numbers
            for (let y = this.graphinfo.padding.top; y < this.height - this.graphinfo.padding.bottom; y += Math.abs(this.graphinfo.y2.majortick * this.graphinfo.scaleY2)) {
                this.staticctx.beginPath();
                this.staticctx.strokeStyle = TickColor;
                this.staticctx.moveTo(this.width - this.graphinfo.padding.right, y);
                this.staticctx.lineTo(this.width - this.graphinfo.padding.right - MajorAxisTickLength, y);
                this.staticctx.stroke();
                this.staticctx.fillStyle = TextColor;
                this.staticctx.font = TextFont;
                this.staticctx.textAlign = "left";
                this.staticctx.fillText(roundTo(this.graphinfo.y2RawToCal(y), Labely2Digits), this.width - this.graphinfo.padding.right + 5, y + 7); // vertical align not working, 7 works for 20 pt font
            }
            // Draw last number
            this.staticctx.fillText(roundTo(this.graphinfo.y2RawToCal(this.height - this.graphinfo.padding.bottom), Labely2Digits), this.width - this.graphinfo.padding.right + 5, this.height - this.graphinfo.padding.bottom + 7); // vertical align not working, 7 works for 20 pt font
            // Draw label
            this.staticctx.save();
            this.staticctx.rotate(Math.PI/2);
            this.staticctx.textAlign = "center";
            // rotate is strange, temporary fix
            this.staticctx.fillText(this.graphinfo.y2.label, this.graphinfo.graphheight/2+this.graphinfo.padding.top, -this.graphinfo.width + this.graphinfo.padding.right - 37);
            this.staticctx.restore();
        }
        // Bounding box
        this.staticctx.rect(this.graphinfo.padding.left, this.graphinfo.padding.top, this.graphinfo.graphwidth, this.graphinfo.graphheight);
        this.staticctx.strokeStyle = "black";
        this.staticctx.lineWidth = 1;
        this.staticctx.stroke();
    }
    /**
        Abstract method to replace drawGraph<br>
        Not implemented yet
    */
    drawAxis(axis) {
        // TODO abstract above method
    }
    /**
        Draws an image to the background canvas.<br>
        Deprecated, but may reuse in future problems
    */
    drawImage() {
        /*this.img.onload = function(a) {
            console.log('whats this');
            console.log(a);
            this.ctx.drawImage(this.img, 0, 0);
        }*/
        this.staticctx.drawImage(this.img, 0, 0);
    }
    /**
        Draws an element to the foreground canvas<br>
        To be replaced with Object.draw() calls
        @param {Point|Line|Text} element Element to be drawn
    */
    draw(element) {
        // TODO give elements a draw method and call from here, passing context
        // Save whatever state the context object is in
        this.dynamicctx.save();
        if (element instanceof Point) {
            if (isBetween(element.rawx, this.graphinfo.graphleft, this.graphinfo.graphright) &&
                isBetween(element.rawy, this.graphinfo.graphtop, this.graphinfo.graphbottom)) {
                // Black border
                this.dynamicctx.beginPath();
                this.dynamicctx.fillStyle = "black";
                this.dynamicctx.globalAlpha = 1;
                this.dynamicctx.arc(element.rawx, element.rawy, element.radius, 2*Math.PI, false);
                this.dynamicctx.fill();
                // Colored interior
                this.dynamicctx.beginPath();
                this.dynamicctx.fillStyle = element.color;
                this.dynamicctx.arc(element.rawx, element.rawy, element.radius-1, 2*Math.PI, false);
                this.dynamicctx.fill();
                if (element.correctanswer) {
                    this.dynamicctx.beginPath();
                    this.dynamicctx.strokeStyle = "green";
                    this.dynamicctx.ellipse(element.rawx, element.rawy, element.tolerance.x*this.graphinfo.scaleX, element.tolerance.y*-this.graphinfo.scaleY, 0, 0, 2*Math.PI, false);
                    this.dynamicctx.stroke();
                }
            }
        } else if (element instanceof Line) {
            // Connect points
            this.dynamicctx.beginPath();
            this.dynamicctx.globalAlpha = 1;
            this.dynamicctx.strokeStyle = element.color;
            this.dynamicctx.lineWidth = element.width;
            let first = true;
            //console.log(element);
            for (let pt of element.points) {
                if (isBetween(pt.rawx, this.graphinfo.graphleft, this.graphinfo.graphright) &&
                    isBetween(pt.rawy, this.graphinfo.graphtop, this.graphinfo.graphbottom)) {
                    if (first) {
                        // Move to start of line
                        this.dynamicctx.moveTo(pt.rawx, pt.rawy);
                    } else {
                        // Draw segment
                        this.dynamicctx.lineTo(pt.rawx, pt.rawy);
                        this.dynamicctx.stroke();
                    }
                    first = false;
                }
            }
            //this.dynamicctx.fillStyle = "black";
            //this.dynamicctx.globalAlpha = 0.1;
            //this.dynamicctx.fill();
        } else if (element instanceof Text) {
            if (this.graphinfo.graphleft <= element.position.rawx && element.position.rawx <= this.graphinfo.graphright && this.graphinfo.graphtop <= element.position.rawy && element.position.rawy <= this.graphinfo.graphbottom) {
                this.dynamicctx.fillStyle = element.color;
                this.dynamicctx.globalAlpha = 1;
                this.dynamicctx.font = element.font;
                this.dynamicctx.textAlign = element.align;
                this.dynamicctx.fillText(element.text, element.position.rawx, element.position.rawy);
            }
        }
        // Restore the context object to its previous state
        this.dynamicctx.restore();
    }
    /**
        Checks each type of element (point, line, etc) and removes the oldest member(s) if more than the maximum exist
    */
    trimLists() {
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
    /**
        Finds a point in the list of drawn objects by its {@link Point#ID}
        @return {Point}
    */
    getPointByID(ID) {
        for (let pt of this.finished) {
            if (pt instanceof Point) {
                if (pt.ID === ID) {
                    return pt;
    }}}}
    /**
        Deletes a point in the list of drawn objects by its {@link Point#ID}
    */
    deletePointByID(ID) {
        for (let pt of this.finished) {
            if (pt instanceof Point) {
                if (pt.ID === ID) {
                    this.finished.splice(this.finished.indexOf(pt),1);
    }}}}
    /**
        Returns all finished elements on the graph marked as answers ({@link Element#answer})
        @return {list} A list of {@link Element}s
    */
    getanswers() {
        this.interactable = false;
        let answers = [];
        for (let element of this.finished) {
            if (element.answer) {
                answers.push(element);
            }
        }
        return answers;
    }
    /**
        Displays a set of elements as correct answers
        @param {list} answers List of {@link Element}s
    */
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
            this.draw(answer);
        }
    }
    /**
        Displays cursor data next to the mouse cursor
        @param {Point} cursorpt Location of the cursor
        @param {object} cursordata How the cursor data should look
        @param {string} [cursordata.color="black"] What color the text is written in
        @param {string} [cursordata.style="bold 16px sans-serif"] What style the text is written in
        @param {string} cursordata.format Format of the string to display (use ~x~, ~x2~, ~y~, or ~y2~ for relevant coordinate)
        @param {object} cursordata.digits How many digits to round to for each axis. If using an axis in cursordata.format, it must have a number of digits set.
        @param {int} cursordata.digits.x
        @param {int} cursordata.digits.x2
        @param {int} cursordata.digits.y
        @param {int} cursordata.digits.y2
    */
    drawCursor(cursorpt, cursordata) {
        if (isBetween(cursorpt.x, this.graphinfo.x.min, this.graphinfo.x.max) &&
            isBetween(cursorpt.y, this.graphinfo.y.min, this.graphinfo.y.max)) {
            let cursoralign = "";
            let cursorcolor = "black";
            let cursorstyle = "bold 16px sans-serif"
            // Constants align box position around crosshair cursor nicely
            if (cursorpt.rawx < this.dynamiccanvas.width/2) {
                // Left
                cursoralign = "left";
                cursorpt.rawx += 4;
            } else {
                // Right
                cursoralign = "right";
                cursorpt.rawx -= 5;
            }
            if (cursorpt.rawy < this.dynamiccanvas.height/2) {
                // Top
                cursorpt.rawy += 15;
            } else {
                // Bottom
                cursorpt.rawy -= 5;
            }
            if (cursordata.color != undefined) {
                cursorcolor = cursordata.color;
            }
            if (cursordata.style != undefined) {
                cursorcolor = cursordata.style;
            }
            // Generate text based on cursordata format
            let content = cursordata.format;
            if (this.graphinfo.x != undefined) {
                content = content.replace(`${SPVAR}x${SPVAR}`, cursorpt.x.toFixed(this.cursor.digits.x));
            }
            if (this.graphinfo.y != undefined) {
                content = content.replace(`${SPVAR}y${SPVAR}`, cursorpt.y.toFixed(this.cursor.digits.y));
            }
            if (this.graphinfo.x2 != undefined) {
                content = content.replace(`${SPVAR}x2${SPVAR}`, cursorpt.x2.toFixed(this.cursor.digits.x2));
            }
            if (this.graphinfo.y2 != undefined) {
                content = content.replace(`${SPVAR}y2${SPVAR}`, cursorpt.y2.toFixed(this.cursor.digits.y2));
            }
            // Draw text
            this.draw(new Text({"text": content,
                                "color": cursorcolor,
                                "font": cursorstyle,
                                "align": cursoralign,
                                "position": cursorpt}));
        }
    }
    /**
        Whenever the mouse is moved over the canvas, update the dynamic layer.
    */
    mouseMove(e) {
        if (this.interactable) {
            this.update();
            let pt = this.getMousePoint(e);
            // Draw cursor
            if (this.cursor != undefined) {
                let cursorpt = new Point(pt.data());
                if (this.held) {
                    if (this.held.altcursor) {
                        this.drawCursor(cursorpt, this.held.altcursor);
                    } else {
                        this.drawCursor(cursorpt, this.cursor);
                    }
                } else {
                    this.drawCursor(cursorpt, this.cursor);
                }
            }
            // If moving objects
            if (this.mode === "move") {
                // Drag held object
                if (this.held) {
                    if (this.held instanceof Point) {
                        // Copy current location data to point
                        if (this.held.movex) {
                            this.held.rawx = constrain(pt.rawx, this.graphinfo.padding.left, this.graphinfo.padding.left + this.graphinfo.graphwidth);
                        }
                        if (this.held.movey) {
                            this.held.rawy = constrain(pt.rawy, this.graphinfo.padding.top, this.graphinfo.padding.top + this.graphinfo.graphheight);
                        }
                        // Calculated calibrated positions from new raw position
                        this.held.generateCal();
                        // Show held point
                        this.draw(this.held);
                    } else if (this.held instanceof Line) {
                        // Update location data
                        let rawdx = pt.rawx - this.grabpoint.rawx;
                        let caldx = pt.x - this.grabpoint.x;
                        let rawdy = pt.rawy - this.grabpoint.rawy;
                        let caldy = pt.y - this.grabpoint.y;
                        for (let p of this.held.points) {
                            if (p.movex) {
                                p.rawx = constrain(this.origins[p.ID].rawx + rawdx, this.graphinfo.padding.left, this.graphinfo.padding.left + this.graphinfo.graphwidth);
                            }
                            if (p.movey) {
                                p.rawy = constrain(this.origins[p.ID].rawy + rawdy, this.graphinfo.padding.top, this.graphinfo.padding.top + this.graphinfo.graphheight);
                            }
                            p.generateCal();
                            // Show points
                            if (p.show) {
                                this.draw(p);
                            }
                        }
                        // Show held line
                        this.draw(this.held);
                    }
                }
            // If drawing
            } else if (this.drawing) {
                if (this.mode === "point") {
                    this.draw(pt);
                } else if (this.mode === "line") {
                    this.draw(new Line({"points":[this.pt, pt]}));
                } else if (this.mode === "calibrate") {
                    this.draw(new Line({"points":[this.pt, pt]}));
                }
            }
        }
    }
    /**
        Whenever the mouse is released over the canvas
    */
    mouseUp(e) {
        if (this.interactable) {
            let pt = this.getMousePoint(e);
            if (this.mode === "move") {
                // Drop held object
                if (this.held) {
                    if (this.held instanceof Point) {
                        // Copy current location data to point
                        if (this.held.movex) {
                            this.held.rawx = constrain(pt.rawx, this.graphinfo.padding.left, this.graphinfo.padding.left + this.graphinfo.graphwidth);
                        }
                        if (this.held.movey) {
                            this.held.rawy = constrain(pt.rawy, this.graphinfo.padding.top, this.graphinfo.padding.top + this.graphinfo.graphheight);
                        }
                        // Calculated calibrated positions from new raw position
                        this.held.generateCal();
                        // Add point to finished list
                        this.finished.push(this.held);
                    } else if (this.held instanceof Line) {
                        let rawdx = pt.rawx - this.grabpoint.rawx;
                        let caldx = pt.x - this.grabpoint.x;
                        let rawdy = pt.rawy - this.grabpoint.rawy;
                        let caldy = pt.y - this.grabpoint.y;
                        for (let p of this.held.points) {
                            if (p.movex) {
                                p.rawx = constrain(this.origins[p.ID].rawx + rawdx, this.graphinfo.padding.left, this.graphinfo.padding.left + this.graphinfo.graphwidth);
                            }
                            if (p.movey) {
                                p.rawy = constrain(this.origins[p.ID].rawy + rawdy, this.graphinfo.padding.top, this.graphinfo.padding.top + this.graphinfo.graphheight);
                            }
                            p.generateCal();
                            // Show points
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
                    this.finished.push(new Line({"points":[this.pt, pt]}));
                } else if (this.mode === "calibrate") {
                    // calibration routine
                    this.finished.push(new Line({"points":[this.pt, pt]}));
                    let x1 = document.getElementById(this.x1).value;
                    let y1 = document.getElementById(this.y1).value;
                    let x2 = document.getElementById(this.x2).value;
                    let y2 = document.getElementById(this.y2).value;
                    let str = `let calibration = new Line({"points":[new Point({"rawx":${this.pt.rawx}, "rawy":${this.pt.rawy}, "x":${x1}, "y":${y1}})`
                    str += `, new Point({"rawx":${pt.rawx}, "rawy":${pt.rawy}, "x":${x2}, "y":${y2}})]});`;
                    console.log("Copy and paste the line between the bars to use this calibration:");
                    console.log("-----");
                    console.log(str);
                    console.log("-----");
                }
            }
        }
    }
    /**
        Whenever the mouse is clicked on the canvas object
    */
    mouseDown(e) {
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
                            // If either point is immovable, line isn't movable
                            if ((!pt1.movex && !pt1.movey) || (!pt2.movex && !pt2.movey)) {
                                // If any point is immobile, the line cannot be moved
                                break;
                            }
                            // Shrink grabbing range for line (otherwise assume grabbing a point on either end)
                            let minx = Math.min(pt1.rawx, pt2.rawx) + this.grabradius;
                            let maxx = Math.max(pt1.rawx, pt2.rawx) - this.grabradius;
                            // Check if clicked x is between bounds
                            if (pt.rawx > minx && pt.rawx < maxx) {
                                let ytarget = (pt.rawx - pt1.rawx) * (pt2.rawy - pt1.rawy) / (pt2.rawx - pt1.rawx) + pt1.rawy;
                                let d = Math.abs(pt.rawy - ytarget);
                                // Check if in grabbing range of the line
                                if (d <= this.grabradius) {
                                    // Check if this is the closest object
                                    if (d < grabdist) {
                                        grabindex = i;
                                        grabdist = d;
                }}}}}}
                if (grabindex > -1) {
                    this.grabpoint = pt;
                    this.held = this.finished[grabindex];
                    this.finished.splice(grabindex, 1);
                    if (this.held instanceof Line) {
                        this.origins = {};
                        for (let p of this.held.points) {
                            this.origins[p.ID] = new Point(p.data());
                            this.deletePointByID(p.ID);
                        }
                    }
                }
            } else {
                this.pt1 = this.getMousePoint(e);
                this.drawing = true;
            }
            this.update();
            this.draw(this.held);
        }
    }
    /**
        Handle key-press events<br>
        Must be forwarded from {@link ProblemController}
    */
    keyPress(key) {
        this.drawing = false;
        this.calibrating = false;
        if (key === "p") {
            this.mode = "point";
        } else if (key === "l") {
            this.mode = "line";
        }
        this.update();
    }
}

// ##### Problem/question classes #####

/**
    Container class for graph-entry questions
*/
class GraphElement {
    /**
        @param {string} mode ("move, "point", "line")
        mode: mode for the canvascontroller to be in
        answercount: {"point": 1, "line": 0}, named list of expected
        answer: correct answers
        default: default graph objects
        tolerance: range near answer to count as correct
        points: number of points question is worth
        @param {string} imgsrc (deprecated) Location of image source file
        @param {Calibration} imgcal (deprecated) Calibration data for image
    */
    constructor(inputarguments) {
        for (let key of Object.keys(inputarguments)) {
            this[key] = inputarguments[key];
        }
    }
    /**
        Check submitted answers against correct answers
    */
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
            // Each answer being looked for
            for (let i in this.answer.line) {
                score.max += 1;
                let matchscore = 0;
                let matchindex = 0;
                // Each answer provided
                for (let j in answer) {
                    let mymatchscore = 0;
                    let mymaxscore = 0;
                    if (answer[j] instanceof Line) {
                        // If unused
                        if (used.indexOf(j) === -1) {
                            // If same line size
                            if (this.answer.line[i].points.length === answer[j].points.length) {
                                // Assume line matches
                                let fullmatch = true;
                                // Each point in the line
                                for (let k in answer[j].points) {
                                    if (answer[j].points[k].movex || answer[j].points[k].movey) {
                                        mymaxscore++;
                                        // If point is not close enough
                                        const ansx = this.answer.line[i].points[k].x;
                                        const inpx = answer[j].points[k].x;
                                        const tolx = this.answer.line[i].tolerance.x;
                                        const ansy = this.answer.line[i].points[k].y;
                                        const inpy = answer[j].points[k].y;
                                        const toly = this.answer.line[i].tolerance.y;
                                        if (Math.abs(ansx - inpx) <= tolx && Math.abs(ansy - inpy) <= toly) {
                                            mymatchscore++;
                                        }
                                    }
                                }
                                if (mymatchscore > matchscore) {
                                    mymatchscore = mymatchscore / mymaxscore;
                                    matchscore = mymatchscore;
                                    matchindex = j;
                                }
                            }
                        }
                    }
                }
                if (matchscore > 0) {
                    score.got += matchscore;
                    used.push(matchindex);
                }
            }
        }
        score.pct = score.got / score.max;
        return score.pct;
    }
    
    insertHTML(DOM, id) {
        let container = document.getElementById(DOM.questiondivid);
        
        let html = `<div class="${DOM.canvasdivclass}" id="${DOM.canvasdivid}">`;
        html += `<canvas class="${DOM.canvasclass}" id="${DOM.staticcanvasid}" style="z-index:1"></canvas>`;
        html += `<canvas class="${DOM.canvasclass}" id="${DOM.dynamiccanvasid}" style="z-index:2"></canvas>`;
        html += `<br>`;
        html += `<div class="${DOM.canvasinfodivclass}">`;
        //html += `<span class="${DOM.canvaspointclass}" id="${DOM.canvaspointid}">(x, y)</span>`;
        //html += `<span class="${DOM.canvasmodeclass}" id="${DOM.canvasmodeid}">mode</span>`;
        html += `</div></div>`;
        
        const re = new RegExp(`${VAR}id${VAR}`, "g");
        html = html.replace(re, id);
        
        container.insertAdjacentHTML("beforeend", html);
        
        this.canvascontroller = new CanvasController(DOM, id, this);
    }
}

/**
    Container class for text display
    label: Text to display before textbox
    style: CSS style to apply
*/
class TextElement {
    
    constructor(inputarguments) {
        this.label = inputarguments.label;
        this.style = inputarguments.style;
    }
    
    insertHTML(DOM, id) {
        let container = document.getElementById(DOM.questiondivid);
        
        let html = `<span class="${DOM.textspanclass}`;
        if (this.style != undefined) {
            html += ` ${this.style}`;
        }
        html += `">${this.label}</span>`;
        
        container.insertAdjacentHTML("beforeend", html);
    }
}

/**
    Container class for textbox-entry questions
    label: Text to display before textbox
    placeholder: Placeholder text in textbox
    answertype: "number" or "text"
    answer: correct answer
    tolerance: range above or below answer to count as correct
    points: number of points question is worth
*/
class TextboxElement {
    
    constructor(inputarguments) {
        
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
    
    insertHTML(DOM, id) {
        let container = document.getElementById(DOM.questiondivid);
        let html = `<div class="${DOM.textboxdivclass}">`;
        html += `<span class="${DOM.textboxspanclass}">${this.label}</span>`;
        html += `<br>`;
        html += `<input class="${DOM.textboxclass}" placeholder="${this.placeholder}" id="${DOM.textboxid}">`;
        html += `<span class="${DOM.textboxanswerclass}" id="${DOM.textboxanswerid}"></span>`;
        html+= `</input></div>`;
        
        const re = new RegExp(`${VAR}id${VAR}`, "g");
        html = html.replace(re, id);
        
        container.insertAdjacentHTML("beforeend", html);
    }
}

/**
    Container class for each question
    Consists of elements displayed sequentially on the page
    variables: list of variables in problem
    elements: array of question elements
    requiredscore: required % score to move on
*/
class Question {
    constructor(inputarguments) {
        this.elements = [];
        for (let e of inputarguments.questionelements) {
            this.elements.push(this.createElement(e));
        }
        this.variablevalues = {};
        this.inputvariables = inputarguments.variables;
        this.requiredscore = inputarguments.requiredscore;
    }
    
    createElement(elementdata) {
        let element;
        if (elementdata.type === "textbox") {
            element = new TextboxElement(elementdata);
        } else if (elementdata.type === "graph") {
            element = new GraphElement(elementdata);
        } else if (elementdata.type === "text") {
            element = new TextElement(elementdata);
        }
        return element;
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
            const maxloops = 100;
            let loops = 0;
            while (recursiveExists(element, `${VAR}`)) {
                for (let variable of Object.keys(this.variablevalues)) {
                    // Replace variable strings with values
                    element = recursiveReplace(element, `${VAR}${variable}${VAR}`, this.variablevalues[variable]);
                }
                loops++;
                if (loops >= maxloops) {
                    console.log('assignVariables failed:', recursiveFind(element, `${VAR}`));
                    break;
                }
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
    
    display(DOM, parentvariables) {
        // Input variables from parent as constants
        for (let name of Object.keys(parentvariables)) {
            this.inputvariables.constants[name] = parentvariables[name];
        }
        // Generate variable values
        this.variablevalues = generateVariables(this.inputvariables);
        // Replace variables in elements with values
        this.assignVariables();
        // Create display elements
        //this.insertContainers(DOM, this.instruction);
        for (let i in this.elements) {
            this.elements[i].insertHTML(DOM, i);
        }
    }
    
    submit(DOM) {
        // Add up score and reveal answers
        let score = {"max": 0,
                     "got": 0,
                     "pct": 0};
        for (let i in this.elements) {
            let element = this.elements[i];
            if (element instanceof TextboxElement) {
                const re = new RegExp(`${VAR}id${VAR}`, "g");
                // Disable textbox
                document.getElementById(DOM.textboxid.replace(re, i)).disabled = true;
                // Get answer from textbox
                let ans = document.getElementById(DOM.textboxid.replace(re, i)).value;
                // Check answer
                score.max += element.points;
                score.got += (element.points * element.checkanswer(ans));
                document.getElementById(DOM.textboxanswerid.replace(re, i)).textContent = element.answer;
            } else if (element instanceof GraphElement) {
                // Get answers from canvas
                let ans = element.canvascontroller.getanswers();
                // Check answers
                score.max += element.points;
                score.got += (element.points * element.checkanswer(ans));
                element.canvascontroller.showanswers(element.answer);
            }
            score.pct = score.got / score.max;
        }
        return score;
    }
}

/**
    Master class for controlling page
    Consists of a series of questions
*/
class ProblemController {
    constructor(problemdata) {
        // Load problem data
        this.title = problemdata.pagetitle;
        this.inputvariables = problemdata.variables;
        this.questions = [];
        for (let q of problemdata.questions) {
            this.questions.push(this.createQuestion(q));
        }
        this.finishquestion = this.createQuestion(problemdata.finish);
        // Initialize local data
        this.DOM = this.getDOM;
        this.score = {};
        this.currentquestion = -1;
        // Set/insert heading title
        document.title = this.title;
        document.getElementById(this.DOM.titledivid).insertAdjacentHTML("beforeend", this.title);
        // Score box will hide if window is resized too narrowly
        this.pagesetup(this.DOM);
        // Catch keyboard events
        document.addEventListener("keydown", e => this.keyEvent(e));
    }
    /*
    constructor(title, variables) {
        this.title = title;
        this.DOM = this.getDOM;
        
        //let testargs = JSON.parse("immiciblePtest.js");
        console.log(testargs);
        
        this.questions = [];
        this.score = {};
        this.currentquestion = -1;
        this.inputvariables = variables;
        
        // Set/insert heading title
        document.title = title;
        document.getElementById(this.DOM.titledivid).insertAdjacentHTML("beforeend", title);
        // Score box will hide if window is resized too narrowly
        this.pagesetup(this.DOM);
        // Catch keyboard events
        document.addEventListener("keydown", e => this.keyEvent(e));
    }
    //*/
    
    get getDOM() {
        return {
        "headerdivid": "header",
        "bodydivid": "body",
            "titledivid": "title",
            "questiondivid": "question",
                "canvasdivclass": "canvasarea",
                "canvasdivid": "canvasarea--" + VAR + "id" + VAR,
                    "canvasclass": "canvas",
                    "canvasid": "canvas--" + VAR + "id" + VAR,
                    "staticcanvasid": "canvas--static--" + VAR + "id" + VAR,
                    "dynamiccanvasid": "canvas--dynamic--" + VAR + "id" + VAR,
                    "canvasinfodivclass": "canvasinfo",
                        "canvaspointclass": "canvaspoint",
                        "canvaspointid": "canvaspoint--" + VAR + "id" + VAR,
                        "canvasmodeclass": "canvasmode",
                        "canvasmodeid": "canvasmode--" + VAR + "id" + VAR,
                "textboxdivclass": "textentry",
                    "textboxspanclass": "textboxlabel",
                    "textboxclass": "textbox",
                    "textboxid": "textbox--" + VAR + "id" + VAR,
                    "textboxanswerclass": "textboxanswer",
                    "textboxanswerid": "textboxanswer--" + VAR + "id" + VAR,
                "textspanclass": "textspan",
            "buttonsdivid": "buttons",
                "restartbuttonid": "restartbutton",
                "hintbuttonid": "hintbutton",
                "submitbuttonid": "submitbutton",
                "nextbuttonid": "nextbutton",
            "scoredivid": "score",
                "scoretitleid": "scoretitle",
            "gradedivid": "submitgrade",
                "nametextid": "nametext",
                "cuidtextid": "cuidtext",
                "gradebuttonid": "gradebutton",
        "footerdivid": "footer",
        "hiddentextclass": "hiddentext",
        "hiddenbuttonclass": "hiddenbutton",
        "hidescoreclass": "hidescore",
        
        "tipboxdivclass" : "tipbox",
        "tipboxdivid" : "tipbox--" + VAR + "id" + VAR,
        "tipboxtextclass" : "tiptext",
        "tipboxcheckid" : "tipcheck--" + VAR + "id" + VAR,
        "tipboxdontshowclass" : "tipdontshow",
        "tipboxbuttonclass" : "tipbutton",
        "tipboxbuttonid" : "tipbutton--" + VAR + "id" + VAR,
        };
    }
    
    pagesetup(DOM) {
        if (document.documentElement.clientWidth < HIDESCOREWINDOWWIDTH) {
            document.getElementById(DOM.scoredivid).classList.add(DOM.hidescoreclass)
        } else {
            document.getElementById(DOM.scoredivid).classList.remove(DOM.hidescoreclass)
        }
        document.getElementsByTagName("BODY")[0].onresize = function() {
            if (document.documentElement.clientWidth < HIDESCOREWINDOWWIDTH) {
                document.getElementById(DOM.scoredivid).classList.add(DOM.hidescoreclass)
            } else {
                document.getElementById(DOM.scoredivid).classList.remove(DOM.hidescoreclass)
            }
        };
    }
    
    begin() {
        // Initialize scores
        for (let i in this.questions) {
            this.score[i] = {"max": this.questions[i].totalPoints,
                             "got": 0,
                             "pct": 0};
        }
        
        // Create buttons
        this.insertRestartButton(this.DOM);
        this.insertHintButton(this.DOM);
        this.insertSubmitButton(this.DOM);
        this.insertNextButton(this.DOM);
        this.toggleNextButton(this.DOM);
        
        // Create variables
        //this.variablevalues = this.generateVariables(this.inputvariables);
        this.variablevalues = generateVariables(this.inputvariables);
        
        // Start question sequence
        this.currentquestion = -1;
        this.nextQuestion();
    }
    
    createQuestion(questiondata) {
        let q = new Question(questiondata);
        return q;
    }
    
    refresh() {
        if (confirm("Really start a new problem?")) {
            // Refresh the page
            location = location;
        }
    }
    
    nextQuestion() {
        // Proceed to next question in sequence
        this.currentquestion++;
        this.display();
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
    
    clearPage() {
        // Clear question objects from html
        let container = document.getElementById(this.DOM.questiondivid);
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }
    }
    
    insertScoreInput() {
        let container = document.getElementById(this.DOM.gradedivid);
        let html = `<div class="${this.DOM.textboxdivclass}">`;
        html += `<span class="${this.DOM.textboxspanclass}">Name:</span>`;
        html += `<br>`;
        html += `<input class="${this.DOM.textboxclass}" id="${this.DOM.nametextid}">`;
        html += `</input></div>`;
        html += `<div class="${this.DOM.textboxdivclass}">`;
        html += `<span class="${this.DOM.textboxspanclass}">Student ID:</span>`;
        html += `<br>`;
        html += `<input class="${this.DOM.textboxclass}" id="${this.DOM.cuidtextid}">`;
        html += `</input></div>`;
        html += `<button id="${this.DOM.gradebuttonid}">Submit for Grade (optional)</button>`;
        html += "<br><br><br><br>"
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.gradebuttonid).addEventListener("click", e => this.submitforgrade(e));
    }
    
    submitforgrade() {
        const name = document.getElementById(this.DOM.nametextid).value;
        const cuid = document.getElementById(this.DOM.cuidtextid).value;
        const score = roundTo(this.sumScore(this.score).pct*100, 0);
        const hash = this.generateHash(name, cuid, score);
        console.log(name, cuid, score, hash);
        alert(`Submission information:\n|${name}|\n|${cuid}|\n|${score}|\n|${hash}|`);
    }
    
    generateHash() {
        let str = "";
        for (let i = 0; i < arguments.length; i++) {
            str += arguments[i];
        }
        return str.hashCode();
    }
    
    insertHintButton() {
        let container = document.getElementById(this.DOM.buttonsdivid);
        let html = `<button id="${this.DOM.hintbuttonid}">Hint</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.hintbuttonid).addEventListener("click", e => this.showhint(e));
    }
    
    insertSubmitButton() {
        let container = document.getElementById(this.DOM.buttonsdivid);
        let html = `<button id="${this.DOM.submitbuttonid}">Submit Answers</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.submitbuttonid).addEventListener("click", e => this.submit(e));
    }
    
    insertNextButton() {
        let container = document.getElementById(this.DOM.buttonsdivid);
        let html = `<button id="${this.DOM.nextbuttonid}">Next Part</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.nextbuttonid).addEventListener("click", e => this.next(e));
    }
    
    insertRestartButton() {
        // Add button
        let container = document.getElementById(this.DOM.buttonsdivid);
        let html = `<button id="${this.DOM.restartbuttonid}">Restart Problem</button>`;
        container.insertAdjacentHTML("beforeend", html);
        // Add event listener to button
        document.getElementById(this.DOM.restartbuttonid).addEventListener("click", e => this.refresh(e));
    }
    
    enableHintButton() {
        document.getElementById(this.DOM.hintbuttonid).disabled = false;
    }
    
    disableHintButton() {
        document.getElementById(this.DOM.hintbuttonid).disabled = true;
    }
    
    toggleSubmitButton() {
        document.getElementById(this.DOM.submitbuttonid).classList.toggle(this.DOM.hiddenbuttonclass);
    }
    
    toggleNextButton() {
        document.getElementById(this.DOM.nextbuttonid).classList.toggle(this.DOM.hiddenbuttonclass);
    }
    
    toggleHintButton() {
        document.getElementById(this.DOM.hintbuttonid).classList.toggle(this.DOM.hiddenbuttonclass);
    }
    
    sumScore(score) {
        let sumscore = 0;
        let sumpoints = 0;
        for (let i in score) {
            sumscore += score[i].got;
            sumpoints += score[i].max;
        }
        return {
            "got": sumscore,
            "max": sumpoints,
            "pct": sumscore / sumpoints,
        };
    }
    
    updateScores(score) {
        let container = document.getElementById(this.DOM.scoredivid);
        
        // Clear score objects from html
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }
        
        // Create new score object
        let html = `<span id=${this.DOM.scoretitleid}>SCORE</span>`;
        html += "<table>";
        html += "<tr><th>Part</th><th>Points</th><th>Total</th><th>Pct</th></tr>";
        for (let i in score) {
            html += `<tr><td>${parseFloat(i)+1}</td><td>${roundTo(score[i].got, 2)}</td><td>${roundTo(score[i].max, 2)}</td><td>${roundTo(score[i].pct*100, 0)}%</td></tr>`;
        }
        const sumscore = this.sumScore(score);
        html += `<tr><td>Total</td><td>${roundTo(sumscore.got, 2)}</td><td>${roundTo(sumscore.max, 2)}</td><td>${roundTo(sumscore.pct * 100,0)}%</td></tr>`;
        html += "</table>";
        
        container.insertAdjacentHTML("beforeend", html);
    }
    
    insertTipBox(tip, left, top, uuid) {
        const COOKIEEXPIRATION = 30*1000; // In milliseconds
        let container = document.getElementById(this.DOM.bodydivid);
        // Generate uuid from tip string
        uuid = tip.hashCode();
        // If haven't been told to not show
        if (!getCookie(uuid) === true) {
            // Create id strings
            const re = new RegExp(`${VAR}id${VAR}`, "g");
            const divid = this.DOM.tipboxdivid.replace(re, uuid);
            const checkid = this.DOM.tipboxcheckid.replace(re, uuid);
            const buttonid = this.DOM.tipboxbuttonid.replace(re, uuid);
            // Create html payload for tip
            let html = `<div class="${this.DOM.tipboxdivclass}" id="${divid}" style="left: ${left}px; top:${top}px;">
                        <span class="${this.DOM.tipboxtextclass}">${tip}</span>
                        <br>
                        <input type="checkbox" id="${checkid}">
                        <span class="${this.DOM.tipboxdontshowclass}">don't show this again</span>
                        <button class="${this.DOM.tipboxbuttonclass}" id="${buttonid}">OK</button>
                        </div>`;
            // Function for closing tip and creating cookie
            let f = function() {
                //console.log("I am tip #", uuid);
                // Set cookie if told to not show again
                if (document.getElementById(checkid).checked) {
                    setCookie(uuid, true, COOKIEEXPIRATION);
                }
                document.getElementById(divid).remove();
            }
            // Add box to html
            container.insertAdjacentHTML("beforeend", html);
            // Create event listener on button
            document.getElementById(buttonid).addEventListener("click", e => f(e));
        }
    }
    
    display() {
        // Display current question
        // Clear current page elements
        this.clearPage();
        if (this.currentquestion > -1) {
            // Add current question objects to html
            if (this.currentquestion < this.questions.length) {
                // TODO remove this if wrapper, instead remove event from Next button
                this.questions[this.currentquestion].display(this.DOM, this.variablevalues);
            }
        }
        this.updateScores(this.score);
        // Slide scores off screen
        document.getElementById(this.DOM.scoredivid).classList.remove("showscore");
        
        /*      TEST COOKIE TIPS
        this.insertTipBox("Interact with the graph by clicking and dragging elements", 270, 300);
        this.insertTipBox("Type answers into text fields (case insensitive)", 530, 720); 
        this.insertTipBox("Click here to start over with new values", 2, 890);
        this.insertTipBox("Click here to get a hint on the current step", 206, 890);
        this.insertTipBox("Click here to check your answers and move on to the next step", 410, 890);
        //*/
    }
    
    showhint() {
        // Prevent multiple clicks
        this.disableHintButton();
        // Loop through all hints, remove hidden text class
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
            // If on last question, adjust button label and click event
            if (this.currentquestion == this.questions.length - 1) {
                document.getElementById(this.DOM.nextbuttonid).textContent = "Finish";
                document.getElementById(this.DOM.nextbuttonid).addEventListener("click", e => this.finish(e));
            }
        } else {
            document.getElementById(this.DOM.nextbuttonid).textContent = "Retry";
        }
        this.toggleSubmitButton();
        this.toggleNextButton();
        this.showhint();
        this.updateScores(this.score);
        document.getElementById(this.DOM.scoredivid).classList.add("showscore");
    }
    
    repeat() {
        // Repeat current question
        this.currentquestion--;
        this.nextQuestion();
    }
    
    next() {
        // End question, go to next
        this.toggleSubmitButton();
        this.toggleNextButton();
        this.enableHintButton();
        this.nextQuestion();
    }
    
    finish() {
        // End problem
        this.clearPage();
        document.getElementById(this.DOM.hintbuttonid).remove();
        document.getElementById(this.DOM.submitbuttonid).remove();
        document.getElementById(this.DOM.nextbuttonid).remove();
        this.insertScoreInput();
        this.updateScores(this.score);
        this.finishquestion.display(this.DOM, this.variablevalues);
        document.getElementById(this.DOM.scoredivid).classList.add("showscore");
    }
}