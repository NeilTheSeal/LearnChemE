import {ProblemController} from "./ProblemController.js";
import {Question} from "./Question.js";
import {TextElement} from "./TextElement.js";
import {GraphElement} from "./GraphElement.js";
import {TextboxElement} from "./TextboxElement.js";

// Place image here
let ImageToCalibrate = "pressure_immicible.png";

// ---
let problemController = new ProblemController(
    "Image Calibration",
    {"constants": {}, "random": {}, "calculated": {}}
);
problemController.addQuestion(
    new Question({
        "variables": {"constants": {}, "random": {}, "calculated": {}},
        "questionelements": [
            new TextElement({
                "label": "Draw a line and report where the endpoints are.",
                "size": "24px"
            }),
            new GraphElement({
                "imgsrc": ImageToCalibrate,
                "answercount": {"point":2, "line": 1},
                "mode": "calibrate",
            }),
            new TextboxElement({
                "label": "X1 = ",
                "placeholder": "<number>",
                "answertype": "number",
                "answer": "0",
                "tolerance": 0,
                "points": 10
            }),
            new TextboxElement({
                "label": "Y1 = ",
                "placeholder": "<number>",
                "answertype": "number",
                "answer": "0",
                "tolerance": 0,
                "points": 10
            }),
            new TextboxElement({
                "label": "X2 = ",
                "placeholder": "<number>",
                "answertype": "number",
                "answer": "0",
                "tolerance": 0,
                "points": 10
            }),
            new TextboxElement({
                "label": "Y2 = ",
                "placeholder": "<number>",
                "answertype": "number",
                "answer": "0",
                "tolerance": 0,
                "points": 10
            })
        ],
    })
);
problemController.begin();
