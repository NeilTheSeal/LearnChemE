// Create new problem
let problemController = new ProblemController(
    "Test problem",
    {
        "constants": {
            "test": 42
        },
        "random": {
            "rtest": {
                "min": 10,
                "max": 20,
                "digits": 0
            }
        },
        "calculated": {
            
        }
    }
);

let testGraphCal = new Line([
    new Point({"rawx": 17, "rawy": 356,
     "calx": 0, "caly": 0}),
    new Point({"rawx": 572, "rawy": 13,
     "calx": 10, "caly": 10})
]);

problemController.addQuestion(
    new Question({
        "variables": {
            "constants": {
                "k": 3
            },
            "random": {
                "x": {"min": 0,
                      "max": 10,
                      "digits": 0},
                "y": {"min": 0,
                      "max": 10,
                      "digits": 0}
            },
            "calculated": {
                "s": "%x%+%y%",
                "d": "Math.abs(%x%-%y%)"
            }
        },
        "questionelements": [
            new TextElement({
                "label": "Click the requested points, and compute the sum and absolute difference of the x and y values.<br><br>Where is (%x%, %y%)?",
                "size": "24px"
            }),
            new GraphElement({
                "imgsrc": "testGraph.png",
                "imgcal": testGraphCal,
                "mode": "point",
                "answercount": {
                    "point": 1
                },
                "answer": {
                    "point": [{"calx":"%x%", "caly":"%y%"}]
                },
                "default": {
                    "point": [{"calx":2, "caly":2, "movex":false, "movey":true},
                              {"calx":6, "caly":9, "movex":true, "movey":false},
                              {"calx":6, "caly":6, "movex":true, "movey":true}],
                    "line": [[{"calx":4, "caly":2, "movex":true, "movey":true}, 
                              {"calx":8, "caly":5, "movex":true, "movey":true}],
                            [{"calx":1, "caly":6}, 
                              {"calx":2, "caly":7, "movex":false, "movey":true},
                              {"calx":3, "caly":8}]],
                },
                "tolerance": 1,
                "points": 10
            }),
            new TextboxElement({
                "label": "Sum = ",
                "placeholder": "<number>",
                "answertype": "number",
                "answer": "%s%",
                "tolerance": 0,
                "points": 10
            }),
            new TextboxElement({
                "label": "|Difference| = ",
                "placeholder": "<number>",
                "answertype": "number",
                "answer": "%d%",
                "tolerance": 0,
                "points": 10
            })
        ],
        "requiredscore": 0.00
    })
);

problemController.addQuestion(
    new Question({
        "instruction": "Construct a square from the numbers given",
        "variables": {
            "constants": {
                "k": 3},
            "random": {
                "x": {"min": 0,
                      "max": 10,
                      "digits": 0},
                "y": {"min": 0,
                      "max": 10,
                      "digits": 0}},
            "calculated": {
                "s": "%x%+%y%",
                "d": "Math.abs(%x%-%y%)"}
        },
        "questionelements": [
            new TextElement({
                "label": "Make a square from the numbers %x% and %y%",
                "size": "24px"
            }),
            new GraphElement({
                "imgsrc": "testGraph.png",
                "imgcal": testGraphCal,
                "mode": "point",
                "answercount": {
                    "point": 4,
                    "line": 0,
                    "circle": 0
                },
                "answer": {
                    "point": [["%x%", "%x%"],
                              ["%x%", "%y%"],
                              ["%y%", "%x%"],
                              ["%y%", "%y%"]],
                    "line": [],
                    "circle": []
                },
                "tolerance": 1,
                "points": 10
            })
        ],
        "requiredscore": 0.00
    })
);

/* // PROBLEM TEMPLATE
problemController.addQuestion(
    new Question({
        "instruction": "",
        "questionelements": [
            new GraphElement({
                "label": "",
                "imgsrc": "",
                "imgcal": "",
                "answertype": {"point": 0,
                               "line": 0,
                               "circle": 0},
                "answer": {"point": [],
                           "line": [],
                           "circle": []},
                "tolerance": 0,
                "points": 10
            }),
            new TextboxElement({
                "label": "",
                "placeholder": "",
                "answertype": "",
                "answer": 0,
                "tolerance": 0,
                "points": 10
            }),
        ],
        "requiredscore": 1.00
    })
);
*/

// Start
problemController.begin();