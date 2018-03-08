// Create new problem
let problemController = new ProblemController(
    "Immicible liquids",
    {
        "constants": {
            "Ab": 4.72583,
            "Bb": 1660.652,
            "Cb": 271.5,
            "Aw": 5.0768,
            "Bw": 1659.793,
            "Cw": 227.1
        },
        "random": {
            "T": {"min": 105,
                  "max": 125,
                  "digits": 0},
        },
        "calculated": {
            "Psatw": "Math.pow(10,%Aw%-%Bw%/(%T%+%Cw%))",
            "Psatb": "Math.pow(10,%Ab%-%Bb%/(%T%+%Cb%))",
            "P": "%Psatw%+%Psatb%"
        }
    }
);

problemController.addQuestion(
    new Question({
        "variables": {
            "constants": {
                
            },
            "random": {
                
            },
            "calculated": {
                
            }
        },
        "questionelements": [
            new TextElement({
                "label": "Draw a line at the pressure where three phases coexist",
                "size": "30px"
            }),
            new GraphElement({
                "imgsrc": "testGraph.png",
                "imgcal": {
                    "pt1raw": new Point(17,356),
                    "pt2raw": new Point(572,13),
                    "pt1cal": new Point(0,0),
                    "pt2cal": new Point(10,10)
                },
                "answertype": {
                    "point": 1,
                    "line": 0,
                    "circle": 0
                },
                "answer": {
                    "point": [["%x%", "%x%"],
                              ["%x%", "%y%"],
                              ["%y%", "%x%"],
                              ["%y%", "%y%"]],
                },
                "tolerance": 1,
                "points": 10
            }),
        ],
        "requiredscore": 0.00
    })
);

// Start
problemController.begin();