import {ProblemController} from "../src/ProblemController.js";

const graphinfo = {
    "type": "xy",
    "graphheight": 500,
    "graphwidth": 500,
    "padding": {
        "left":60,
        "bottom":60,
        "top":30,
        "right":30
    },
    "graphbackground": "white",
    "axesbackground": "lightgray",
    "x": {
        "label": "x",
        "min": 0,
        "max": 10,
        "majortick": 1,
        "minortick": 0.2,
        "gridline": 0.2,
    },
    "y": {
        "label": "y",
        "min": 0,
        "max": 10,
        "majortick": 1,
        "minortick": 0.2,
        "gridline": 0.2,
    },
};

const pointtolerance = {
    "x":0.025,
    "y":0.2
};

const normalcursor = {
    "format": "z = ~x~, y = ~y~",
    "digits": {
        "x": 1,
        "y": 1,
    }
};

const problem = {
    "pagetitle": "SimpleProblem",
    "variables": {
        "constants": {
            "one": 1,
            "two": 2,
            "three": 3,
        },
        "random": {
            "digit": {
                "min": 0,
                "max": 9,
                "digits": 0
            },
            "percent": {
                "min": 0,
                "max": 1,
                "digits": 2
            }
        },
        "calculated": {
            "oneplusdigit": "@one@ + @digit@",
            "twodigit": "@two@ * @digit@",
            "tenpercent": "10 * @percent@",
        }
    },
    "questions": [
        {
            "questionelements": [
                {
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 1
                    },
                    "answer": {
                        "point": [
                            {"x":"@tenpercent@", "y":"@tenpercent@", "tolerance":pointtolerance}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":"5", "y":"5", "answer":true}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                }
            ],
            "requiredscore": 0.00
        }, // question
    ], // questions

    "finish": {
        "questionelements": [

        ] // questionelements
    }, // finish

    "begin": {
        "variables": {
        },
        "questionelements": [
            {
                "type": "text",
                "label": `This is simple.`,
                "class": "prompt"
            } // element
        ] // questionelements
    } // begin
};

let problemController = new ProblemController(problem, document.getElementById("myscript").getAttribute("parentid"));