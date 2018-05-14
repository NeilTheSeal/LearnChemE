const datalabel = "temperature = @T@ C <br> saturation pressures: P<sub>W</sub><sup>sat</sup> = @PsatW@ bar, P<sub>@org@</sub><sup>sat</sup> = @Psat@org@@ bar";

const watercolor = "blue";
const organiccolor = "orange";
const triplecolor = "green";
const textcolor = "black";
const graycolor = "#999999";
const answercolor = "green";
const regionAy = 6.6;
const regionBy = 0.1;

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
        "min": 0,
        "max": 7,
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

const problem = {
    "pagetitle": "Construct a Pressure-Composition Diagram for Immiscible Liquids",
    "variables": {
        "constants": {
            "Aw": 5.0768,
            "Bw": 1659.793,
            "Cw": 227.1,
            "Ab": 4.72583,
            "Bb": 1660.652,
            "Cb": 271.5,
            "At": 4.07827,
            "Bt": 1343.943,
            "Ct": 219.227,
            "Ah": 4.00266,
            "Bh": 1171.53,
            "Ch": 224.216,
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
            "PsatW": "roundTo(Math.pow(10,@Aw@ - @Bw@ / (@T@ + @Cw@)),1).toFixed(1)",
            "PsatB": "roundTo(Math.pow(10,@Ab@ - @Bb@ / (@T@ + @Cb@)),1).toFixed(1)",
            "PsatT": "roundTo(Math.pow(10,@At@ - @Bt@ / (@T@ + @Ct@)),1).toFixed(1)",
            "PsatH": "roundTo(Math.pow(10,@Ah@ - @Bh@ / (@T@ + @Ch@)),1).toFixed(1)",
            "Psum": "@PsatW@ + @Psat@org@@",
            "xc": "@Psat@org@@ / @Psum@",
            "x1": "@xc@ / 2",
            "x2": "@xc@ * 4/6",
            "x3": "@xc@ * 5/6",
            "x4": "@xc@ + (1-@xc@) * 1/6",
            "x5": "@xc@ + (1-@xc@) * 2/6",
            "x6": "@xc@ + (1-@xc@) / 2",
            "y1": "@PsatW@ / (1 - @x1@)",
            "y2": "@PsatW@ / (1 - @x2@)",
            "y3": "@PsatW@ / (1 - @x3@)",
            "y4": "@Psat@org@@ / @x4@",
            "y5": "@Psat@org@@ / @x5@",
            "y6": "@Psat@org@@ / @x6@",
            "ywlabel": "(@PsatW@+@Psum@)/2",
            "yolabel": "(@Psat@org@@+@Psum@)/2",
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
                {
                    "type": "text",
                    "label": "1) Drag the blue line to the pressure where three phases coexist. <br>",
                    "style": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                },
                {
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 1
                    },
                    "answer": {
                        "line": [
                            {"points":[{"x":"0", "y":"@Psum@"},
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
                        "text": [
                            {"text":"region A", "position": {"x": 0.5, "y": regionAy}, "font":"bold 20px sans-serif", "align":"center", "color":"blue"},
                            {"text":"region B", "position": {"x": 0.5, "y": regionBy}, "font":"bold 20px sans-serif", "align":"center", "color":"blue"}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: sum the saturation pressures",
                    "style": "hiddentext hint"
                },
                {
                    "type": "textbox",
                    "label": "Which region has two liquids in equilibrium and no vapor? ",
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
                },
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
                {
                    "type": "text",
                    "label": "2) Drag the blue point to where pure water is in VLE, and drag the orange point to where pure benzene is in VLE. <br>",
                    "style": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                }, // element
                {
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
                            {"x":"1", "y":"@Psat@org@@", "tolerance":pointtolerance, "color":organiccolor}
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
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": regionAy}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": regionBy}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 20
                }, // element
                {
                    "type": "text",
                    "label": "Hint: pure component saturation pressures",
                    "style": "hiddentext hint"
                }, // element
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
                {
                    "type": "text",
                    "label": "3) Drag the green point to where vapor is in equilibrium with two liquid phases. <br>",
                    "style": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                }, // element
                {
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
                            {"x":"1", "y":"@Psat@org@@", "color":organiccolor},
                            {"x":0.5, "y":4, "color":triplecolor, "movex":true, "movey":true, "answer":true}
                        ],
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "show":false},
                                       {"x":1, "y":"@Psum@", "show":false}], "color":graycolor},
                        ],
                        "text": [
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": regionAy}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": regionBy}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                }, // element
                {
                    "type": "text",
                    "label": "Hint: each liquid exerts its saturation pressure",
                    "style": "hiddentext hint"
                }, // element
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
                {
                    "type": "text",
                    "label": "4) Drag each black point to the pressure where vapor with that mole fraction is in equilbrium with liquid. <br>",
                    "style": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                }, // element
                {
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 2
                    },
                    "answer": {
                        "line":[{"points":[{"x":"0", "y":"@Psum@", "show":false},
                                           {"x":"0", "y":"@PsatW@", "color":watercolor},
                                           {"x":"@x1@", "y":"@y1@"},
                                           {"x":"@x2@", "y":"@y2@"},
                                           {"x":"@x3@", "y":"@y3@"},
                                           {"x":"@xc@", "y":"@Psum@"}], "tolerance":pointtolerance, "color":answercolor},
                                {"points":[{"x":"@xc@", "y":"@Psum@", "color":"green"},
                                           {"x":"@x4@", "y":"@y4@"},
                                           {"x":"@x5@", "y":"@y5@"},
                                           {"x":"@x6@", "y":"@y6@"},
                                           {"x":"1", "y":"@Psat@org@@", "color":organiccolor},
                                           {"x":"1", "y":"@Psum@", "show":false}], "tolerance":pointtolerance, "color":answercolor}
                                ]
                    },
                    "default": {
                        "point": [],
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "radius":1, "show":false},
                                       {"x":1, "y":"@Psum@", "radius":1, "show":false}], "color":graycolor},
                            {"points":[{"x":"0", "y":"@Psum@", "show":false},
                                       {"x":"0", "y":"@PsatW@", "color":watercolor},
                                       {"x":"@x1@", "y":"@PsatW@", "movey":true},
                                       {"x":"@x2@", "y":"@PsatW@", "movey":true},
                                       {"x":"@x3@", "y":"@PsatW@", "movey":true},
                                       {"x":"@xc@", "y":"@Psum@", "color":"green"}], "color":graycolor, "answer":true},
                            {"points":[{"x":"@xc@", "y":"@Psum@", "color":"green"},
                                       {"x":"@x4@", "y":"@Psat@org@@", "movey":true},
                                       {"x":"@x5@", "y":"@Psat@org@@", "movey":true},
                                       {"x":"@x6@", "y":"@Psat@org@@", "movey":true},
                                       {"x":"1", "y":"@Psat@org@@", "color":organiccolor},
                                       {"x":"1", "y":"@Psum@", "show":false}], "color":graycolor, "answer":true}
                        ],
                        "text": [
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": regionAy}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": regionBy}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": detailedcursor,
                    "points": 20
                }, // element
                {
                    "type": "text",
                    "label": "Hint: the vapor mole fraction for component i is P<sub>i</sub><sup>sat</sup> / P",
                    "style": "hiddentext hint"
                }, // element
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
                    "line": 2
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
                                   {"x":"@xc@", "y":"@Psum@", "color":"green"}], "color":graycolor, "answer":true},
                        {"points":[{"x":"@xc@", "y":"@Psum@", "color":"green"},
                                   {"x":"@x4@", "y":"@y4@", "show": false},
                                   {"x":"@x5@", "y":"@y5@", "show": false},
                                   {"x":"@x6@", "y":"@y6@", "show": false},
                                   {"x":"1", "y":"@Psat@org@@", "color":organiccolor},
                                   {"x":"1", "y":"@Psum@", "show":false}], "color":graycolor, "answer":true}
                    ],
                    "text": [
                        {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": regionAy}, "align":"center", "color":textcolor},
                        {"text":"vapor + liquid @compound@", "position": {"x": 0, "y": "@ywlabel@"}, "align":"left", "color":textcolor},
                        {"text":"vapor + liquid water", "position": {"x": 1, "y": "@yolabel@"}, "align":"right", "color":textcolor},
                        {"text":"vapor", "position": {"x": 0.5, "y": regionBy}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": detailedcursor,
            },
        ] // questionelements
    } // finish
};