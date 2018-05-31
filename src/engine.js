"use strict";

/*
    Structure:
    
    ProblemController
        Question[]
            QuestionElement[]
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
const IDLENGTH = 16;
const GRABRADIUS = 10;

// ##### Misc functions #####



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


