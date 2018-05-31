import {randomID, isBetween} from "./sky-helpers.js";
import {Text} from "./Text.js";

const IDLENGTH = 16;

// ##### Canvas objects #####

/**
    Objecting representing a point in 2D space
*/
export class Point {
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
        @param {Point} [args.label]
        @param {Point} args.label.text
        @param {Point} [args.label.offset]
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
        this.generateMissing();
        if (this.label) {
            // Create default offset
            this.label.offset = this.label.offset ? this.label.offset : {"rawx":0, "rawy":0};
            // Add offset to point position
            this.label.position = {"rawx":this.rawx + this.label.offset.rawx, "rawy":this.rawy + this.label.offset.rawy};
            // If still raw data, create text element
            if (!(this.label instanceof Text)) {
                this.label.graphinfo = this.graphinfo;
                this.label = new Text(this.label);
            }
        }
    }

    draw(context) {
        if (isBetween(this.rawx, this.graphinfo.graphleft, this.graphinfo.graphright) &&
            isBetween(this.rawy, this.graphinfo.graphtop, this.graphinfo.graphbottom)) {
            if (this.show) {
                context.save();
                if (this.correctanswer) {
                    // Draw ellipse
                    context.beginPath();
                    context.strokeStyle = "green";
                    context.ellipse(this.rawx, this.rawy, this.tolerance.x*this.graphinfo.x.scale, this.tolerance.y*-this.graphinfo.y.scale, 0, 0, 2*Math.PI, false);
                    context.stroke();
                    // Fill circle
                    context.fillStyle = "green";
                    context.globalAlpha = 0.3;
                    context.fill();
                }
                // Black border
                context.beginPath();
                context.fillStyle = "black";
                context.globalAlpha = 1;
                context.arc(this.rawx, this.rawy, this.radius, 2*Math.PI, false);
                context.fill();
                // Colored interior
                context.beginPath();
                context.fillStyle = this.color;
                context.arc(this.rawx, this.rawy, this.radius-1, 2*Math.PI, false);
                context.fill();
                context.restore();
            }
            if (this.label != undefined) {
                this.label.draw(context);
            }
        }
    }
    /**
        Sets raw values ({@link Point#rawx}, {@link Point#rawy}) from calibrated values ({@link Point#x}, {@link Point#y}) using {@link Point#graphinfo}.
    */
    generateMissing() {
        if (this.graphinfo === undefined) {
            console.log("Error in Point.generateMissing(), graphinfo not supplied.", this);
            return 0;
        }
        if (this.graphinfo.x != undefined) {
            if (this.x === undefined) {
                this.x = this.graphinfo.x.RawToCal(this.rawx);
            } else if (this.rawx === undefined) {
                this.rawx = this.graphinfo.x.CalToRaw(this.x);
            }
        }
        if (this.graphinfo.x2 != undefined) {
            if (this.x2 === undefined) {
                this.x2 = this.graphinfo.x2.RawToCal(this.rawx);
            } else if (this.rawx === undefined) {
                this.rawx = this.graphinfo.x2.CalToRaw(this.x2);
            }
        }
        if (this.graphinfo.y != undefined) {
            if (this.y === undefined) {
                this.y = this.graphinfo.y.RawToCal(this.rawy);
            } else if (this.rawy === undefined) {
                this.rawy = this.graphinfo.y.CalToRaw(this.y);
            }
        }
        if (this.graphinfo.y2 != undefined) {
            if (this.y2 === undefined) {
                this.y2 = this.graphinfo.y2.RawToCal(this.rawy);
            } else if (this.rawy === undefined) {
                this.rawy = this.graphinfo.y2.CalToRaw(this.y2);
            }
        }
    }
    generateRawFromCal() {
        if (this.graphinfo === undefined) {
            console.log("Error in Point.generateMissing(), graphinfo not supplied.", this);
            return 0;
        }
        if (this.graphinfo.x != undefined) {
            this.rawx = this.graphinfo.x.CalToRaw(this.x);
        }
        if (this.graphinfo.x2 != undefined) {
            this.rawx = this.graphinfo.x2.CalToRaw(this.x2);
        }
        if (this.graphinfo.y != undefined) {
            this.rawy = this.graphinfo.y.CalToRaw(this.y);
        }
        if (this.graphinfo.y2 != undefined) {
            this.rawy = this.graphinfo.y2.CalToRaw(this.y2);
        }
    }
    generateCalFromRaw() {
        if (this.graphinfo === undefined) {
            console.log("Error in Point.generateMissing(), graphinfo not supplied.", this);
            return 0;
        }
        if (this.graphinfo.x != undefined) {
            this.x = this.graphinfo.x.RawToCal(this.rawx);
        }
        if (this.graphinfo.x2 != undefined) {
            this.x2 = this.graphinfo.x2.RawToCal(this.rawx);
        }
        if (this.graphinfo.y != undefined) {
            this.y = this.graphinfo.y.RawToCal(this.rawy);
        }
        if (this.graphinfo.y2 != undefined) {
            this.y2 = this.graphinfo.y2.RawToCal(this.rawy);
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