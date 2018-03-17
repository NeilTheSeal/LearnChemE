// Create new problem
let problemController = new ProblemController(
    "Immicible liquids",
    {
        "constants": {
            "Aw": 5.0768,
            "Bw": 1659.793,
            "Cw": 227.1,
            "Ab": 4.72583,
            "Bb": 1660.652,
            "Cb": 271.5,
            "At": 0,
            "Bt": 0,
            "Ct": 0,
            "Ah": 0,
            "Bh": 0,
            "Ch": 0,
        },
        "random": {
            "T": {"min": 105,
                  "max": 125,
                  "digits": 0},
            "compound": {"min": 0,
                         "max": 2,
                         "digits": 0}
        },
        "calculated": {
            "x": "['B', 'B', 'B'][%compound%]",
            "PsatW": "roundTo(Math.pow(10,%Aw% - %Bw% / (%T% + %Cw%)),1)",
            "PsatB": "roundTo(Math.pow(10,%Ab% - %Bb% / (%T% + %Cb%)),1)",
            "PsatT": "roundTo(Math.pow(10,%At% - %Bt% / (%T% + %Ct%)),1)",
            "PsatH": "roundTo(Math.pow(10,%Ah% - %Bh% / (%T% + %Ch%)),1)",
            "Psum": "%PsatW% + %Psat%x%%",
            "xc": "%Psat%x%% / %Psum%",
            "x1": "%xc%/2",
            "x2": "%xc%*4/6",
            "x3": "%xc%*5/6",
            "x4": "%xc%+(1-%xc%)*1/6",
            "x5": "%xc%+(1-%xc%)*2/6",
            "x6": "%xc%+(1-%xc%)/2",
            "y1": "%PsatW% / (1 - %x1%)",
            "y2": "%PsatW% / (1 - %x2%)",
            "y3": "%PsatW% / (1 - %x3%)",
            "y4": "%Psat%x%% / %x4%",
            "y5": "%Psat%x%% / %x5%",
            "y6": "%Psat%x%% / %x6%",
        }
    }
);

const datalabel = "temperature = %T% C <br> saturation pressures: P<sub>satW</sub> = %PsatW% bar,  P<sub>sat%x%</sub> = %Psat%x%% bar";

let calibration = new Line({"points":[new Point({"rawx":38, "rawy":312, "calx":0, "caly":0}), new Point({"rawx":574, "rawy":34, "calx":1, "caly":6})]});

problemController.addQuestion(
    new Question({
        "variables": {
            "constants": {},
            "random": {},
            "calculated": {}
        },
        "questionelements": [
            new TextElement({
                "label": "Drag the line to the pressure where three phases coexist <br>",
                "size": "24px"
            }),
            new TextElement({
                "label": datalabel,
                "size": "16px"
            }),
            new GraphElement({
                "imgsrc": "pressure_immicible.png",
                "imgcal": calibration,
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 1
                },
                "answer": {
                    "line": [
                        {"points":[{"calx":"0", "caly":"%Psum%"},
                                   {"calx":"1", "caly":"%Psum%"}], "tolerance":{"calx":0.025, "caly":0.1}, "color":"red"}
                    ]
                },
                "default": {
                    "line": [
                        {"points":[{"calx":0, "caly":4, "movey":true, "show":false},
                                   {"calx":1, "caly":4, "movey":true, "show":false}], "color":"black", "answer":true}
                    ],
                    "text": [
                        {"text":"A", "position": {"calx": 0.49, "caly": 6}, "font":"bold 20px Arial", "color":"black"},
                        {"text":"B", "position": {"calx": 0.49, "caly": 0.25}, "font":"bold 20px Arial", "color":"black"}
                    ]
                },
                "points": 10
            }),
            new TextboxElement({
                "label": "Which region has two liquids in equilibrium and no vapor? ",
                "placeholder": "A or B",
                "answertype": "text",
                "answer": "A",
                "tolerance": 0,
                "points": 10
            }),
        ],
        "requiredscore": 0.00
    })
);

problemController.addQuestion(
    new Question({
        "variables": {
            "constants": {},
            "random": { },
            "calculated": { }
        },
        "questionelements": [
            new TextElement({
                "label": "Drag the blue point to where pure water is in VLE, and drag the orange point to where pure benzene is in VLE. <br>",
                "size": "30px"
            }),
            new TextElement({
                "label": datalabel,
                "size": "20px"
            }),
            new GraphElement({
                "imgsrc": "pressure_immicible.png",
                "imgcal": calibration,
                "mode": "move",
                "answercount": {
                    "point": 2,
                    "line": 0
                },
                "answer": {
                    "point": [
                        {"calx":"0", "caly":"%PsatW%", "tolerance":{"calx":0.025, "caly":0.1}, "color":"blue"},
                        {"calx":"1", "caly":"%Psat%x%%", "tolerance":{"calx":0.025, "caly":0.1}, "color":"orange"}
                    ]
                },
                "default": {
                    "point": [
                        {"calx":0.3, "caly":4, "movex":true, "movey":true, "color":"blue", "answer":true},
                        {"calx":0.7, "caly":4, "movex":true, "movey":true, "color":"orange", "answer":true}
                    ],
                    "line": [
                        {"points":[{"calx":0, "caly":"%Psum%", "show":false},
                                   {"calx":1, "caly":"%Psum%", "show":false}], "color":"black"},
                    ],
                    "text": [
                        {"text":"Liquid+Liquid", "position": {"calx": 0.39, "caly": 6}, "color":"black"},
                        {"text":"Vapor", "position": {"calx": 0.45, "caly": 0.25}, "color":"black"}
                    ]
                },
                "points": 20
            }),
        ],
        "requiredscore": 0.00
    })
);

problemController.addQuestion(
    new Question({
        "variables": {
            "constants": {},
            "random": { },
            "calculated": { }
        },
        "questionelements": [
            new TextElement({
                "label": "Drag the point to where vapor is in equilibrium with two liquid phases. <br>",
                "size": "30px"
            }),
            new TextElement({
                "label": datalabel,
                "size": "20px"
            }),
            new GraphElement({
                "imgsrc": "pressure_immicible.png",
                "imgcal": calibration,
                "mode": "move",
                "answercount": {
                    "point": 1,
                    "line": 0
                },
                "answer": {
                    "point": [
                        {"calx":"%xc%", "caly":"%Psum%", "tolerance":{"calx":0.025, "caly":0.1}, "color":"green"}
                    ]
                },
                "default": {
                    "point": [
                        {"calx":"0", "caly":"%PsatW%", "color":"blue"},
                        {"calx":"1", "caly":"%Psat%x%%", "color":"orange"},
                        {"calx":0.5, "caly":4, "color":"green", "movex":true, "movey":true, "answer":true}
                    ],
                    "line": [
                        {"points":[{"calx":0, "caly":"%Psum%", "show":false},
                                   {"calx":1, "caly":"%Psum%", "show":false}], "color":"black"},
                    ],
                    "text": [
                        {"text":"Liquid+Liquid", "position": {"calx": 0.39, "caly": 6}, "color":"black"},
                        {"text":"Vapor", "position": {"calx": 0.45, "caly": 0.25}, "color":"black"}
                    ]
                },
                "points": 10
            }),
        ],
        "requiredscore": 0.00
    })
);

problemController.addQuestion(
    new Question({
        "variables": {
            "constants": {},
            "random": { },
            "calculated": { }
        },
        "questionelements": [
            new TextElement({
                "label": "Drag each point to the pressure where vapor with that mole fraction is in equilbrium with liquid. <br>",
                "size": "30px"
            }),
            new TextElement({
                "label": datalabel,
                "size": "20px"
            }),
            new GraphElement({
                "imgsrc": "pressure_immicible.png",
                "imgcal": calibration,
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 1
                },
                "answer": {
                    "line":[{"points":[{"calx":"0", "caly":"%PsatW%", "color":"blue"},
                                       {"calx":"%x1%", "caly":"%y1%", "color":"red"},
                                       {"calx":"%x2%", "caly":"%y2%", "color":"red"},
                                       {"calx":"%x3%", "caly":"%y3%", "color":"red"},
                                       {"calx":"%xc%", "caly":"%Psum%", "color":"green"},
                                       {"calx":"%x4%", "caly":"%y4%", "color":"red"},
                                       {"calx":"%x5%", "caly":"%y5%", "color":"red"},
                                       {"calx":"%x6%", "caly":"%y6%", "color":"red"},
                                       {"calx":"1", "caly":"%Psat%x%%", "color":"orange"}], "tolerance":{"calx":0.025, "caly":0.1}, "color":"red"}
                            ]
                },
                "default": {
                    "point": [],
                    "line": [
                        {"points":[{"calx":0, "caly":"%Psum%", "radius":1, "show":false},
                                   {"calx":1, "caly":"%Psum%", "radius":1, "show":false}], "color":"black"},
                        {"points":[{"calx":"0", "caly":"%PsatW%", "color":"blue"},
                                   {"calx":"%x1%", "caly":"%y1%", "movey":true},
                                   {"calx":"%x2%", "caly":"%y2%", "movey":true},
                                   {"calx":"%x3%", "caly":"%y3%", "movey":true},
                                   {"calx":"%xc%", "caly":"%Psum%", "color":"green"},
                                   {"calx":"%x4%", "caly":"%y4%", "movey":true},
                                   {"calx":"%x5%", "caly":"%y5%", "movey":true},
                                   {"calx":"%x6%", "caly":"%y6%", "movey":true},
                                   {"calx":"1", "caly":"%Psat%x%%", "color":"orange"}], "color":"black", "answer":true}
                    ],
                    "text": [
                        {"text":"Liquid+Liquid", "position": {"calx": 0.39, "caly": 6}, "color":"black"},
                        {"text":"Vapor", "position": {"calx": 0.45, "caly": 0.25}, "color":"black"}
                    ]
                },
                "points": 60
            }),
        ],
        "requiredscore": 0.00
    })
);


// Start
problemController.begin();