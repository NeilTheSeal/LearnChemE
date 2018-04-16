// Create new problem
let problemController = new ProblemController(
    "Construct a Temperature-Composition Diagram for Immiscible Liquids",
    {
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
        },
        "random": {
            "P": {"min": 5,
                  "max": 15,
                  "digits": 1},
            "orgnum": {"min": 0,
                       "max": 2,
                       "digits": 0}
        },
        "calculated": {
            "org": "['B', 'T', 'H'][@orgnum@]",
            "compound": "['benzene', 'toluene', 'hexane'][@orgnum@]",
            "TsatW": "roundTo(@BW@/(@AW@-Math.log10(@P@))-@CW@,1)",
            "TsatO": "roundTo(@B@org@@/(@A@org@@-Math.log10(@P@))-@C@org@@,1)",
            "Tsum": "@TsatW@ + @TsatO@",
            
            "xc": "@TsatO@ / @Tsum@",
            "x1": "@xc@ / 2",
            "x2": "@xc@ * 4/6",
            "x3": "@xc@ * 5/6",
            "x4": "@xc@ + (1-@xc@) * 1/6",
            "x5": "@xc@ + (1-@xc@) * 2/6",
            "x6": "@xc@ + (1-@xc@) / 2",
            "y1": "@TsatW@ / (1 - @x1@)",
            "y2": "@TsatW@ / (1 - @x2@)",
            "y3": "@TsatW@ / (1 - @x3@)",
            "y4": "@TsatO@ / @x4@",
            "y5": "@TsatO@ / @x5@",
            "y6": "@TsatO@ / @x6@",
        }
    }
);

const datalabel = "pressure = @P@ bar <br> tsats: T<sub>sat,W</sub> = @TsatW@ C, T<sub>sat,@org@</sub> = @TsatO@ C";

const watercolor = "blue";
const organiccolor = "orange";
const triplecolor = "green";
const textcolor = "black";
const graycolor = "#999999";
const answercolor = "green";
const regionAy = 240;
const regionBy = 105;

let graphinfo = new GraphInfo({
    "graphheight": 400,
    "graphwidth": 600,
    "padding": {"left":80, "bottom":60, "top":60, "right":30},
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
        "label": "temperature [C]",
        "min": 100,
        "max": 250,
        "majortick": 20,
        "minortick": 4,
        "gridline": 10,
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

let sidegraphinfo = new GraphInfo({
    "graphheight": 400,
    "graphwidth": 400,
    "padding": {"left":80, "bottom":60, "top":30, "right":30},
    "graphbackground": "white",
    "axesbackground": "lightgray",
    "x": {
        "label": "temperature [C]",
        "min": 130,
        "max": 250,
        "majortick": 20,
        "minortick": 5,
        "gridline": 12.5,
    },
    "y": {
        "label": "saturation pressure [bar]",
        "min": 1,
        "max": 15,
        "majortick": 1,
        "minortick": .25,
        "gridline": 1,
    },
});

let pointtolerance = {"x":0.025, "y":4};

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
                        {"points":[{"x":"0", "y":"@Tsum@"},
                                   {"x":"1", "y":"@Tsum@"}], "tolerance":pointtolerance, "color":answercolor}
                    ]
                },
                "default": {
                    "line": [
                        {"points":[{"x":0, "y":175, "movey":true, "show":false},
                                   {"x":1, "y":175, "movey":true, "show":false}], "color":graycolor, "answer":true}
                    ],
                    "text": [
                        {"text":"region A", "position": {"x": 0.5, "y": regionAy}, "align":"center", "color":textcolor},
                        {"text":"region B", "position": {"x": 0.5, "y": regionBy}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": {
                    "format": "~x~, ~y~",
                    "digits": {"x": 1,
                               "y": 0,
                              }
                },
                "points": 10
            }),
            new TextElement({
                "label": "<br> water and @compound@ equilibrium data:",
                "style": "prompt"
            }),
            new GraphElement({
                "graphinfo": sidegraphinfo,
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 0
                },
                "answer": {
                    
                },
                "default": {
                    "line": [
                        {"equation": "roundTo(Math.pow(10,@AW@ - @BW@ / (~x~ + @CW@)),1)",
                         "independent": "x",
                         "dependent": "y",
                         "min": 130,
                         "max": 250,
                         "steps": 100,
                         "color": watercolor,
                         "showpoints": false},
                        {"equation": "roundTo(Math.pow(10,@A@org@@ - @B@org@@ / (~x~ + @C@org@@)),1)",
                         "independent": "x",
                         "dependent": "y",
                         "min": 130,
                         "max": 250,
                         "steps": 100,
                         "color": organiccolor,
                         "showpoints": false},
                        {"equation": "roundTo(Math.pow(10,@AW@ - @BW@ / (~x~ + @CW@))+Math.pow(10,@A@org@@ - @B@org@@ / (~x~ + @C@org@@)),1)",
                         "independent": "x",
                         "dependent": "y",
                         "min": 130,
                         "max": 250,
                         "steps": 100,
                         "color": "purple",
                         "showpoints": false},
                    ],
                },
                "cursor": {
                    "format": "~x~, ~y~",
                    "digits": {"x": 0,
                               "y": 1,
                              }
                },
                "points": 0
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

// Start
problemController.begin();