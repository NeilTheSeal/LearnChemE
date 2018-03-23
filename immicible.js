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
            "x1": "%xc% / 2",
            "x2": "%xc% * 4/6",
            "x3": "%xc% * 5/6",
            "x4": "%xc% + (1-%xc%) * 1/6",
            "x5": "%xc% + (1-%xc%) * 2/6",
            "x6": "%xc% + (1-%xc%) / 2",
            "y1": "%PsatW% / (1 - %x1%)",
            "y2": "%PsatW% / (1 - %x2%)",
            "y3": "%PsatW% / (1 - %x3%)",
            "y4": "%Psat%x%% / %x4%",
            "y5": "%Psat%x%% / %x5%",
            "y6": "%Psat%x%% / %x6%",
        }
    }
);

const datalabel = "temperature = %T% C <br> saturation pressures: P<sub>sat,W</sub> = %PsatW% bar, P<sub>sat,%x%</sub> = %Psat%x%% bar";

let calibration = new Calibration({"pt1":new Point({"rawx":38, "rawy":312, "x":0, "y":0}), "pt2":new Point({"rawx":574, "rawy":34, "x":1, "y":6})});

let pointtolerance = {"x":0.025, "y":0.2};

problemController.addQuestion(
    new Question({
        "variables": {
            "constants": {},
            "random": {},
            "calculated": {}
        },
        "questionelements": [
            new TextElement({
                "label": "1) Drag the line to the pressure where three phases coexist. <br>",
                "style": "prompt"
            }),
            new TextElement({
                "label": datalabel,
                "style": "data"
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
                        {"points":[{"x":"0", "y":"%Psum%"},
                                   {"x":"1", "y":"%Psum%"}], "tolerance":pointtolerance, "color":"green"}
                    ]
                },
                "default": {
                    "line": [
                        {"points":[{"x":0, "y":4, "movey":true, "show":false},
                                   {"x":1, "y":4, "movey":true, "show":false}], "color":"black", "answer":true}
                    ],
                    "text": [
                        {"text":"region A", "position": {"x": 0.5, "y": 6}, "align":"center", "color":"black"},
                        {"text":"region B", "position": {"x": 0.5, "y": 0.25}, "align":"center", "color":"black"}
                    ]
                },
                "cursor": {
                    "digits": 1,
                    "bounds": calibration,
                },
                "points": 10
            }),
            new TextboxElement({
                "label": "Which region has two liquids in equilibrium and no vapor? ",
                "placeholder": "type A or B",
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
                "label": "2) Drag the blue point to where pure water is in VLE, and drag the orange point to where pure benzene is in VLE. <br>",
                "style": "prompt"
            }),
            new TextElement({
                "label": datalabel,
                "style": "data"
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
                        {"x":"0", "y":"%PsatW%", "tolerance":pointtolerance, "color":"blue"},
                        {"x":"1", "y":"%Psat%x%%", "tolerance":pointtolerance, "color":"orange"}
                    ]
                },
                "default": {
                    "point": [
                        {"x":0.3, "y":4, "movex":true, "movey":true, "color":"blue", "answer":true},
                        {"x":0.7, "y":4, "movex":true, "movey":true, "color":"orange", "answer":true}
                    ],
                    "line": [
                        {"points":[{"x":0, "y":"%Psum%", "show":false},
                                   {"x":1, "y":"%Psum%", "show":false}], "color":"black"},
                    ],
                    "text": [
                        {"text":"liquid + liquid", "position": {"x": 0.5, "y": 6}, "align":"center", "color":"black"},
                        {"text":"vapor", "position": {"x": 0.5, "y": 0.25}, "align":"center", "color":"black"}
                    ]
                },
                "cursor": {
                    "digits": 1,
                    "bounds": calibration,
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
                "label": "3) Drag the point to where vapor is in equilibrium with two liquid phases. <br>",
                "style": "prompt"
            }),
            new TextElement({
                "label": datalabel,
                "style": "data"
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
                        {"x":"%xc%", "y":"%Psum%", "tolerance":pointtolerance, "color":"green"}
                    ]
                },
                "default": {
                    "point": [
                        {"x":"0", "y":"%PsatW%", "color":"blue"},
                        {"x":"1", "y":"%Psat%x%%", "color":"orange"},
                        {"x":0.5, "y":4, "color":"green", "movex":true, "movey":true, "answer":true}
                    ],
                    "line": [
                        {"points":[{"x":0, "y":"%Psum%", "show":false},
                                   {"x":1, "y":"%Psum%", "show":false}], "color":"black"},
                    ],
                    "text": [
                        {"text":"liquid + liquid", "position": {"x": 0.5, "y": 6}, "align":"center", "color":"black"},
                        {"text":"vapor", "position": {"x": 0.5, "y": 0.25}, "align":"center", "color":"black"}
                    ]
                },
                "cursor": {
                    "digits": 1,
                    "bounds": calibration,
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
                "label": "4) Drag each point to the pressure where vapor with that mole fraction is in equilbrium with liquid. <br>",
                "style": "prompt"
            }),
            new TextElement({
                "label": datalabel,
                "style": "data"
            }),
            new GraphElement({
                "imgsrc": "pressure_immicible.png",
                "imgcal": calibration,
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 2
                },
                "answer": {
                    "line":[{"points":[{"x":"0", "y":"%Psum%", "show":false},
                                       {"x":"0", "y":"%PsatW%", "color":"blue"},
                                       {"x":"%x1%", "y":"%y1%", "color":"green"},
                                       {"x":"%x2%", "y":"%y2%", "color":"green"},
                                       {"x":"%x3%", "y":"%y3%", "color":"green"},
                                       {"x":"%xc%", "y":"%Psum%", "color":"green"}], "tolerance":pointtolerance, "color":"green"},
                            {"points":[{"x":"%xc%", "y":"%Psum%", "color":"green"},
                                       {"x":"%x4%", "y":"%y4%", "color":"green"},
                                       {"x":"%x5%", "y":"%y5%", "color":"green"},
                                       {"x":"%x6%", "y":"%y6%", "color":"green"},
                                       {"x":"1", "y":"%Psat%x%%", "color":"orange"},
                                       {"x":"1", "y":"%Psum%", "show":false}], "tolerance":pointtolerance, "color":"green"}
                            ]
                },
                "default": {
                    "point": [],
                    "line": [
                        {"points":[{"x":0, "y":"%Psum%", "radius":1, "show":false},
                                   {"x":1, "y":"%Psum%", "radius":1, "show":false}], "color":"black"},
                        {"points":[{"x":"0", "y":"%Psum%", "show":false},
                                   {"x":"0", "y":"%PsatW%", "color":"blue"},
                                   {"x":"%x1%", "y":"%y1%", "movey":true},
                                   {"x":"%x2%", "y":"%y2%", "movey":true},
                                   {"x":"%x3%", "y":"%y3%", "movey":true},
                                   {"x":"%xc%", "y":"%Psum%", "color":"green"}], "color":"black", "answer":true},
                        {"points":[{"x":"%xc%", "y":"%Psum%", "color":"green"},
                                   {"x":"%x4%", "y":"%y4%", "movey":true},
                                   {"x":"%x5%", "y":"%y5%", "movey":true},
                                   {"x":"%x6%", "y":"%y6%", "movey":true},
                                   {"x":"1", "y":"%Psat%x%%", "color":"orange"},
                                   {"x":"1", "y":"%Psum%", "show":false}], "color":"black", "answer":true}
                    ],
                    "text": [
                        {"text":"liquid + liquid", "position": {"x": 0.5, "y": 6}, "align":"center", "color":"black"},
                        {"text":"vapor", "position": {"x": 0.5, "y": 0.25}, "align":"center", "color":"black"}
                    ]
                },
                "cursor": {
                    "digits": 1,
                    "bounds": calibration,
                },
                "points": 60
            }),
        ],
        "requiredscore": 0.00
    })
);


// Start
problemController.begin();
