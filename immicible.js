// Create new problem
let problemController = new ProblemController(
    "Construct a Pressure-Composition Diagram for Immiscible Liquids",
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
            "org": "['B', 'B', 'B'][%compound%]",
            "PsatW": "roundTo(Math.pow(10,%Aw% - %Bw% / (%T% + %Cw%)),1)",
            "PsatB": "roundTo(Math.pow(10,%Ab% - %Bb% / (%T% + %Cb%)),1)",
            "PsatT": "roundTo(Math.pow(10,%At% - %Bt% / (%T% + %Ct%)),1)",
            "PsatH": "roundTo(Math.pow(10,%Ah% - %Bh% / (%T% + %Ch%)),1)",
            "Psum": "%PsatW% + %Psat%org%%",
            "xc": "%Psat%org%% / %Psum%",
            "x1": "%xc% / 2",
            "x2": "%xc% * 4/6",
            "x3": "%xc% * 5/6",
            "x4": "%xc% + (1-%xc%) * 1/6",
            "x5": "%xc% + (1-%xc%) * 2/6",
            "x6": "%xc% + (1-%xc%) / 2",
            "y1": "%PsatW% / (1 - %x1%)",
            "y2": "%PsatW% / (1 - %x2%)",
            "y3": "%PsatW% / (1 - %x3%)",
            "y4": "%Psat%org%% / %x4%",
            "y5": "%Psat%org%% / %x5%",
            "y6": "%Psat%org%% / %x6%",
        }
    }
);

const datalabel = "temperature = %T% C <br> saturation pressures: P<sub>sat,W</sub> = %PsatW% bar, P<sub>sat,%org%</sub> = %Psat%org%% bar";

const watercolor = "blue";
const organiccolor = "orange";
const triplecolor = "green";
const textcolor = "black";
const graycolor = "#999999";
const answercolor = "green";

let graphinfo = new GraphInfo({
    "graphheight": 400,
    "graphwidth": 600,
    "padding": {"left":60, "bottom":60, "top":60, "right":30},
    "graphbackground": "white",
    "axesbackground": "lightgray",
    "x": {
        "label": "organic mole fraction (xB)",
        "min": 0,
        "max": 1,
        "majortick": 0.1,
        "minortick": 0.05,
        "gridline": 0.05,
    },
    "y": {
        "label": "pressure [bar]",
        "min": 0,
        "max": 6,
        "majortick": 1,
        "minortick": 0.2,
        "gridline": 0.5,
    },
    "x2": {
        "label": "water mole fraction (xW)",
        "min": 1,
        "max": 0,
        "majortick": 0.1,
        "minortick": 0.05,
        "gridline": 0.05,
    },
});

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
                "graphinfo": graphinfo,
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 1
                },
                "answer": {
                    "line": [
                        {"points":[{"x":"0", "y":"%Psum%"},
                                   {"x":"1", "y":"%Psum%"}], "tolerance":pointtolerance, "color":answercolor}
                    ]
                },
                "default": {
                    "line": [
                        {"points":[{"x":0, "y":4, "movey":true, "show":false},
                                   {"x":1, "y":4, "movey":true, "show":false}], "color":graycolor, "answer":true}
                    ],
                    "text": [
                        {"text":"region A", "position": {"x": 0.5, "y": 5.6}, "align":"center", "color":textcolor},
                        {"text":"region B", "position": {"x": 0.5, "y": 0.2}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": {
                    "format": "%!x%, %!y%",
                    "digits": {"x": 1,
                               "y": 1,
                              }
                },
                "points": 10
            }),
            new TextElement({
                "label": "Hint: sum the saturation pressures",
                "style": "hiddentext hint"
            }),
            new TextboxElement({
                "label": "Which region has two liquids in equilibrium and no vapor? ",
                "placeholder": "type A or B",
                "answertype": "text",
                "answer": "A",
                "tolerance": 0,
                "points": 10
            }),
            new TextElement({
                "label": "Hint: liquids are more stable at higher pressures",
                "style": "hiddentext hint"
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
                "graphinfo": graphinfo,
                "mode": "move",
                "answercount": {
                    "point": 2,
                    "line": 0
                },
                "answer": {
                    "point": [
                        {"x":"0", "y":"%PsatW%", "tolerance":pointtolerance, "color":watercolor},
                        {"x":"1", "y":"%Psat%org%%", "tolerance":pointtolerance, "color":organiccolor}
                    ]
                },
                "default": {
                    "point": [
                        {"x":0.3, "y":4, "movex":true, "movey":true, "color":watercolor, "answer":true},
                        {"x":0.7, "y":4, "movex":true, "movey":true, "color":organiccolor, "answer":true}
                    ],
                    "line": [
                        {"points":[{"x":0, "y":"%Psum%", "show":false},
                                   {"x":1, "y":"%Psum%", "show":false}], "color":graycolor},
                    ],
                    "text": [
                        {"text":"liquid + liquid", "position": {"x": 0.5, "y": 5.6}, "align":"center", "color":textcolor},
                        {"text":"vapor", "position": {"x": 0.5, "y": 0.2}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": {
                    "format": "%!x%, %!y%",
                    "digits": {"x": 1,
                               "y": 1}
                },
                "points": 20
            }),
            new TextElement({
                "label": "Hint: pure component saturation pressures",
                "style": "hiddentext hint"
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
                "graphinfo": graphinfo,
                "mode": "move",
                "answercount": {
                    "point": 1,
                    "line": 0
                },
                "answer": {
                    "point": [
                        {"x":"%xc%", "y":"%Psum%", "tolerance":pointtolerance, "color":triplecolor}
                    ]
                },
                "default": {
                    "point": [
                        {"x":"0", "y":"%PsatW%", "color":watercolor},
                        {"x":"1", "y":"%Psat%org%%", "color":organiccolor},
                        {"x":0.5, "y":4, "color":triplecolor, "movex":true, "movey":true, "answer":true}
                    ],
                    "line": [
                        {"points":[{"x":0, "y":"%Psum%", "show":false},
                                   {"x":1, "y":"%Psum%", "show":false}], "color":graycolor},
                    ],
                    "text": [
                        {"text":"liquid + liquid", "position": {"x": 0.5, "y": 5.6}, "align":"center", "color":textcolor},
                        {"text":"vapor", "position": {"x": 0.5, "y": 0.2}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": {
                    "format": "%!x%, %!y%",
                    "digits": {"x": 1,
                               "y": 1}
                },
                "points": 10
            }),
            new TextElement({
                "label": "Hint: each liquid exerts its saturation pressure",
                "style": "hiddentext hint"
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
                "graphinfo": graphinfo,
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 2
                },
                "answer": {
                    "line":[{"points":[{"x":"0", "y":"%Psum%", "show":false},
                                       {"x":"0", "y":"%PsatW%", "color":watercolor},
                                       {"x":"%x1%", "y":"%y1%"},
                                       {"x":"%x2%", "y":"%y2%"},
                                       {"x":"%x3%", "y":"%y3%"},
                                       {"x":"%xc%", "y":"%Psum%"}], "tolerance":pointtolerance, "color":answercolor},
                            {"points":[{"x":"%xc%", "y":"%Psum%", "color":"green"},
                                       {"x":"%x4%", "y":"%y4%"},
                                       {"x":"%x5%", "y":"%y5%"},
                                       {"x":"%x6%", "y":"%y6%"},
                                       {"x":"1", "y":"%Psat%org%%", "color":organiccolor},
                                       {"x":"1", "y":"%Psum%", "show":false}], "tolerance":pointtolerance, "color":answercolor}
                            ]
                },
                "default": {
                    "point": [],
                    "line": [
                        {"points":[{"x":0, "y":"%Psum%", "radius":1, "show":false},
                                   {"x":1, "y":"%Psum%", "radius":1, "show":false}], "color":graycolor},
                        {"points":[{"x":"0", "y":"%Psum%", "show":false},
                                   {"x":"0", "y":"%PsatW%", "color":watercolor},
                                   {"x":"%x1%", "y":"%PsatW%", "movey":true},
                                   {"x":"%x2%", "y":"%PsatW%", "movey":true},
                                   {"x":"%x3%", "y":"%PsatW%", "movey":true},
                                   {"x":"%xc%", "y":"%Psum%", "color":"green"}], "color":graycolor, "answer":true},
                        {"points":[{"x":"%xc%", "y":"%Psum%", "color":"green"},
                                   {"x":"%x4%", "y":"%Psat%org%%", "movey":true},
                                   {"x":"%x5%", "y":"%Psat%org%%", "movey":true},
                                   {"x":"%x6%", "y":"%Psat%org%%", "movey":true},
                                   {"x":"1", "y":"%Psat%org%%", "color":organiccolor},
                                   {"x":"1", "y":"%Psum%", "show":false}], "color":graycolor, "answer":true}
                    ],
                    "text": [
                        {"text":"liquid + liquid", "position": {"x": 0.5, "y": 5.6}, "align":"center", "color":textcolor},
                        {"text":"vapor", "position": {"x": 0.5, "y": 0.2}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": {
                    "format": "%!x%, %!y%",
                    "digits": {"x": 2,
                               "y": 2}
                },
                "points": 20
            }),
            new TextElement({
                "label": "Hint: the vapor mole fraction for component X is P<sub>sat,X</sub> / P",
                "style": "hiddentext hint"
            }),
        ],
        "requiredscore": 0.00
    })
);

problemController.setFinish(
    new Question({
        "variables": {
            "constants": {},
            "random": { },
            "calculated": { }
        },
        "questionelements": [
            new GraphElement({
                "graphinfo": graphinfo,
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 2
                },
                "answer": {
                    "line":[{"points":[{"x":"0", "y":"%Psum%", "show":false},
                                       {"x":"0", "y":"%PsatW%", "color":watercolor},
                                       {"x":"%x1%", "y":"%y1%", "color":"green"},
                                       {"x":"%x2%", "y":"%y2%", "color":"green"},
                                       {"x":"%x3%", "y":"%y3%", "color":"green"},
                                       {"x":"%xc%", "y":"%Psum%", "color":"green"}], "tolerance":pointtolerance, "color":"green"},
                            {"points":[{"x":"%xc%", "y":"%Psum%", "color":"green"},
                                       {"x":"%x4%", "y":"%y4%", "color":"green"},
                                       {"x":"%x5%", "y":"%y5%", "color":"green"},
                                       {"x":"%x6%", "y":"%y6%", "color":"green"},
                                       {"x":"1", "y":"%Psat%org%%", "color":organiccolor},
                                       {"x":"1", "y":"%Psum%", "show":false}], "tolerance":pointtolerance, "color":"green"}
                            ]
                },
                "default": {
                    "point": [],
                    "line": [
                        {"points":[{"x":0, "y":"%Psum%", "radius":1, "show":false},
                                   {"x":1, "y":"%Psum%", "radius":1, "show":false}], "color":graycolor},
                        {"points":[{"x":"0", "y":"%Psum%", "show":false},
                                   {"x":"0", "y":"%PsatW%", "color":watercolor},
                                   {"x":"%x1%", "y":"%y1%"},
                                   {"x":"%x2%", "y":"%y2%"},
                                   {"x":"%x3%", "y":"%y3%"},
                                   {"x":"%xc%", "y":"%Psum%", "color":"green"}], "color":graycolor, "answer":true},
                        {"points":[{"x":"%xc%", "y":"%Psum%", "color":"green"},
                                   {"x":"%x4%", "y":"%y4%"},
                                   {"x":"%x5%", "y":"%y5%"},
                                   {"x":"%x6%", "y":"%y6%"},
                                   {"x":"1", "y":"%Psat%org%%", "color":organiccolor},
                                   {"x":"1", "y":"%Psum%", "show":false}], "color":graycolor, "answer":true}
                    ],
                    "text": [
                        {"text":"liquid + liquid", "position": {"x": 0.5, "y": 5.6}, "align":"center", "color":textcolor},
                        {"text":"vapor", "position": {"x": 0.5, "y": 0.2}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": {
                    "format": "%!x%, %!y%",
                    "digits": {"x": 2,
                               "y": 2}
                },
                "points": 60
            }),
        ],
        "requiredscore": 0.00
    })
);


// Start
problemController.begin();
