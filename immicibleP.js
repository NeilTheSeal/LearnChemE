const datalabel = "temperature = @T@ C <br> saturation pressures: P<sub>W</sub><sup>sat</sup> = @PsatW@ bar, P<sub>@org@</sub><sup>sat</sup> = @PsatO@ bar";

const watercolor = "blue";
const organiccolor = "orange";
const triplecolor = "green";
const textcolor = "black";
const graycolor = "#999999";
const answercolor = "green";
const Pmin = 0;
const Pmax = 7;

const graphinfo = {
    "graphheight": 400,
    "graphwidth": 600,
    "padding": {
        "left":60,
        "bottom":60,
        "top":60,
        "right":30
    },
    "graphbackground": "white",
    "axesbackground": "lightgray",
    "x": {
        "label": "@compound@ mole fraction (x@org@)",
        "min": 0,
        "max": 1,
        "majortick": 0.1,
        "minortick": 0.05,
        "gridline": 0.05,
    },
    "y": {
        "label": "pressure [bar]",
        "min": Pmin,
        "max": Pmax,
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
};

const pointtolerance = {
    "x":0.025,
    "y":0.2
};

const normalcursor = {
    "format": "x@org@ = ~x~, P = ~y~",
    "digits": {
        "x": 2,
        "y": 1,
    }
};

const detailedcursor = {
    "format": "x@org@ = ~x~, P = ~y~",
    "digits": {
        "x": 2,
        "y": 2,
    }
};

function Antoine(T, A, B, C) {
    return Math.pow(10, A - B / (T + C))
}

const problem = {
    "pagetitle": "Construct a Pressure-Composition Diagram for Immiscible Liquids",
    "variables": {
        "constants": {
            "AW": 5.0768,
            "BW": 1659.793,
            "CW": 227.1,
            "AB": 4.72583,
            "BB": 1660.652,
            "CB": 271.5,
            "AT": 4.07827,
            "BT": 1343.943,
            "CT": 219.227,
            "AH": 4.00266,
            "BH": 1171.53,
            "CH": 224.216,
            "Pmin": Pmin,
            "Pmax": Pmax,
        },
        "random": {
            "T": {
                "min": 105,
                "max": 125,
                "digits": 0
            },
            "orgnum": {
                "min": 0,
                "max": 2,
                "digits": 0
            },
        },
        "calculated": {
            "org": "['B', 'T', 'H'][@orgnum@]",
            "compound": "['benzene', 'toluene', 'hexane'][@orgnum@]",
            "PsatW": "Antoine(@T@, @AW@, @BW@, @CW@).toFixed(1)",
            "PsatO": "Antoine(@T@, @A@org@@, @B@org@@, @C@org@@).toFixed(1)",
            "Psum": "@PsatW@ + @PsatO@",
            "xc": "@PsatO@ / @Psum@",
            "x1": "@xc@ * 3/6",
            "x2": "@xc@ * 4/6",
            "x3": "@xc@ * 5/6",
            "x4": "@xc@ + (1-@xc@) * 1/6",
            "x5": "@xc@ + (1-@xc@) * 2/6",
            "x6": "@xc@ + (1-@xc@) * 3/6",
            "y1": "@PsatW@ / (1 - @x1@)",
            "y2": "@PsatW@ / (1 - @x2@)",
            "y3": "@PsatW@ / (1 - @x3@)",
            "y4": "@PsatO@ / @x4@",
            "y5": "@PsatO@ / @x5@",
            "y6": "@PsatO@ / @x6@",
            "yllabel": "@Pmax@ * .5 + .5 * @Psum@",
            "yvlabel": "@Pmin@ * .75 + .25 * @Psum@",
            "ywlabel": "(@PsatW@+@Psum@)/2",
            "yolabel": "(@PsatO@+@Psum@)/2",
        }
    },
    "questions": [
        {
            "type": "question",
            "variables": {
                "constants": {},
                "random": {},
                "calculated": {}
            },
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 1
                    },
                    "answer": {
                        "line": [
                            {"points":[{"x":"0", "y":"@Psum@", "answer":true},
                                       {"x":"1", "y":"@Psum@"}], "tolerance":pointtolerance, "color":answercolor}
                        ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":0, "y":4, "movey":true, "show":false},
                                       {"x":1, "y":4, "movey":true, "show":false}],
                             "color":"blue",
                             "answer":true,
                             "altcursor": {
                                 "format": "P = ~y~",
                                 "digits": {"y": 1,
                                           }
                             }
                            },
                        ],

                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: sum the saturation pressures",
                    "style": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "1) Drag the blue line to the pressure where three phases coexist.",
                    "style": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                }]]
            ],
            "requiredscore": 0.00
        }, // question
        {
            "type": "question",
            "variables": {
                "constants": {},
                "random": {},
                "calculated": {}
            },
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 0
                    },
                    "answer": {

                    },
                    "default": {
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "show":false},
                                       {"x":1, "y":"@Psum@", "show":false}],
                             "color":graycolor
                            },
                        ],
                        "text": [
                            {"text":"region A", "position": {"x": 0.5, "y": "@yllabel@"}, "font":"bold 20px sans-serif", "align":"center", "color":"blue"},
                            {"text":"region B", "position": {"x": 0.5, "y": "@yvlabel@"}, "font":"bold 20px sans-serif", "align":"center", "color":"blue"}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 0
                },
                {
                    "type": "text",
                    "label": "Hint: sum the saturation pressures",
                    "style": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "2) Which region has two liquids in equilibrium and no vapor?",
                    "style": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                },
                 {
                    "type": "textbox",
                    "placeholder": "type A or B",
                    "answertype": "text",
                    "answer": "A",
                    "tolerance": 0,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: liquids are more stable at higher pressures",
                    "style": "hiddentext hint"
                }]],
            ],
            "requiredscore": 0.00
        }, // question
        {
            "type": "question",
            "variables": {
                "constants": {},
                "random": { },
                "calculated": { }
            },
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 2,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"0", "y":"@PsatW@", "tolerance":pointtolerance, "color":watercolor},
                            {"x":"1", "y":"@PsatO@", "tolerance":pointtolerance, "color":organiccolor}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":0.3, "y":4, "movex":true, "movey":true, "color":watercolor, "answer":true},
                            {"x":0.7, "y":4, "movex":true, "movey":true, "color":organiccolor, "answer":true}
                        ],
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "show":false},
                                       {"x":1, "y":"@Psum@", "show":false}], "color":graycolor},
                        ],
                        "text": [
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 20
                }, // element
                {
                    "type": "text",
                    "label": "Hint: pure component saturation pressures",
                    "style": "hiddentext hint"
                }], // element
                [{
                    "type": "text",
                    "label": "3) Drag the blue point to where pure water is in VLE (vapor-liquid equilibrium), and drag the orange point to where pure benzene is in VLE. <br>",
                    "style": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                }]], // element
            ], // questionelements
            "requiredscore": 0.00
        }, // question
        {
            "type": "question",
            "variables": {
                "constants": {},
                "random": { },
                "calculated": { }
            },
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"@xc@", "y":"@Psum@", "tolerance":pointtolerance, "color":triplecolor}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":"0", "y":"@PsatW@", "color":watercolor},
                            {"x":"1", "y":"@PsatO@", "color":organiccolor},
                            {"x":0.5, "y":4, "color":triplecolor, "movex":true, "movey":true, "answer":true}
                        ],
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "show":false},
                                       {"x":1, "y":"@Psum@", "show":false}], "color":graycolor},
                        ],
                        "text": [
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                }, // element
                {
                    "type": "text",
                    "label": "Hint: each liquid exerts its saturation pressure",
                    "style": "hiddentext hint"
                }], // element
                [{
                    "type": "text",
                    "label": "4) Drag the green point to where vapor is in equilibrium with two liquid phases. <br>",
                    "style": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                }]], // element
            ], // questionelements
            "requiredscore": 0.00
        }, // question
        {
            "type": "question",
            "variables": {
                "constants": {},
                "random": { },
                "calculated": { }
            },
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 2
                    },
                    "answer": {
                        "line":[{"points":[{"x":"0", "y":"@Psum@"},
                                           {"x":"0", "y":"@PsatW@", "color":watercolor},
                                           {"x":"@x1@", "y":"@y1@", "answer":true},
                                           {"x":"@x2@", "y":"@y2@", "answer":true},
                                           {"x":"@x3@", "y":"@y3@", "answer":true},
                                           {"x":"@xc@", "y":"@Psum@"}], "tolerance":pointtolerance, "color":answercolor},
                                {"points":[{"x":"@xc@", "y":"@Psum@", "color":"green"},
                                           {"x":"@x4@", "y":"@y4@", "answer":true},
                                           {"x":"@x5@", "y":"@y5@", "answer":true},
                                           {"x":"@x6@", "y":"@y6@", "answer":true},
                                           {"x":"1", "y":"@PsatO@", "color":organiccolor},
                                           {"x":"1", "y":"@Psum@"}], "tolerance":pointtolerance, "color":answercolor}
                                ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "radius":1, "show":false},
                                       {"x":1, "y":"@Psum@", "radius":1, "show":false}],
                             "color":graycolor},
                            {"points":[{"x":"0", "y":"@Psum@", "show":false},
                                       {"x":"0", "y":"@PsatW@", "color":watercolor},
                                       {"x":"@x1@", "y":"@PsatW@", "movey":true},
                                       {"x":"@x2@", "y":"@PsatW@", "movey":true},
                                       {"x":"@x3@", "y":"@PsatW@", "movey":true},
                                       {"x":"@xc@", "y":"@Psum@", "color":"green"}],
                             "color":graycolor,
                             "answer":true,
                             "fill":{"color":watercolor, "opacity":0.2}},
                            {"points":[{"x":"@xc@", "y":"@Psum@", "color":"green"},
                                       {"x":"@x4@", "y":"@PsatO@", "movey":true},
                                       {"x":"@x5@", "y":"@PsatO@", "movey":true},
                                       {"x":"@x6@", "y":"@PsatO@", "movey":true},
                                       {"x":"1", "y":"@PsatO@", "color":organiccolor},
                                       {"x":"1", "y":"@Psum@", "show":false}],
                             "color":graycolor,
                             "answer":true,
                             "fill":{"color":organiccolor, "opacity":0.2}}
                        ],
                        "text": [
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": detailedcursor,
                    "points": 20
                }, // element
                {
                    "type": "text",
                    "label": "Hint: the vapor mole fraction for component i is P<sub>i</sub><sup>sat</sup> / P",
                    "style": "hiddentext hint"
                }], // element
                [{
                    "type": "text",
                    "label": "5) Drag each black point to the pressure where vapor with that mole fraction is in equilbrium with liquid. <br>",
                    "style": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                }]], // element
            ], // questionelements
            "requiredscore": 0.00
        }, // question
    ], // questions
    "finish": {
        "variables": {
            "constants": {},
            "random": { },
            "calculated": { }
        },
        "questionelements": [
            {
                "type": "graph",
                "graphinfo": graphinfo,
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 0
                },
                "answer": {},
                "default": {
                    "point": [],
                    "line": [
                        {"points":[{"x":0, "y":"@Psum@", "radius":1, "show":false},
                                   {"x":1, "y":"@Psum@", "radius":1, "show":false}], "color":graycolor},
                        {"points":[{"x":"0", "y":"@Psum@", "show":false},
                                   {"x":"0", "y":"@PsatW@", "color":watercolor},
                                   {"x":"@x1@", "y":"@y1@", "show": false},
                                   {"x":"@x2@", "y":"@y2@", "show": false},
                                   {"x":"@x3@", "y":"@y3@", "show": false},
                                   {"x":"@xc@", "y":"@Psum@", "color":"green"}], "color":graycolor,
                                   "fill":{"color":watercolor, "opacity":0.2}},
                        {"points":[{"x":"@xc@", "y":"@Psum@", "color":"green"},
                                   {"x":"@x4@", "y":"@y4@", "show": false},
                                   {"x":"@x5@", "y":"@y5@", "show": false},
                                   {"x":"@x6@", "y":"@y6@", "show": false},
                                   {"x":"1", "y":"@PsatO@", "color":organiccolor},
                                   {"x":"1", "y":"@Psum@", "show":false}],
                                   "color":graycolor,
                                   "fill":{"color":organiccolor, "opacity":0.2}}
                    ],
                    "text": [
                        {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                        {"text":"vapor + liquid water", "position": {"x": 0.01, "y": "@ywlabel@"}, "align":"left", "color":textcolor},
                        {"text":"vapor + liquid @compound@", "position": {"x": 0.99, "y": "@yolabel@"}, "align":"right", "color":textcolor},
                        {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": detailedcursor,
            },
        ] // questionelements
    } // finish
};
