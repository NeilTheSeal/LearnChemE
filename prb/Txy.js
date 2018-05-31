import {ProblemController} from "../src/ProblemController.js";
import {Antoine, InvAntoine, BubblePoint, DewPoint} from "../src/ChemFunctions.js";

const datalabel = "pressure = @P@ bar";

const watercolor = "blue";
const organiccolor = "orange";
const triplecolor = "green";
const textcolor = "black";
const graycolor = "#999999";
const answercolor = "green";
const Tmin = 40;
const Tmax = 160;
const Pmin = 0.5;
const Pmax = 2;

const graphinfo = {
    "graphheight": 400,
    "graphwidth": 600,
    "padding": {"left":80, "bottom":60, "top":60, "right":30},
    "graphbackground": "white",
    "axesbackground": "lightgray",
    "x": {
        "label": "n-hexane mole fraction (z<sub>H</sub>)",
        "min": 0,
        "max": 1,
        "majortick": 0.1,
        "minortick": 0.05,
        "gridline": 0.05,
    },
    "y": {
        "label": "temperature [ºC]",
        "min": Tmin,
        "max": Tmax,
        "majortick": 10,
        "minortick": 5,
        "gridline": 10,
    },
    "x2": {
        "label": "n-octane mole fraction (z<sub>O</sub>)",
        "min": 1,
        "max": 0,
        "majortick": 0.1,
        "minortick": 0.05,
        "gridline": 0.05,
    },
};

const pointtolerance = {"x":0.025, "y":4};

const normalcursor = {
    "format": "z<sub>H</sub> = ~x~, T = ~y~",
    "digits": {
        "x": 2,
        "y": 0,
    }
};

const secondarycursor = {
    "format": "T = ~x~, P = ~y~",
    "digits": {
        "x": 0,
        "y": 1,
    }
};

const sidegraphtext = {
    "type": "text",
    "label": "the saturation pressures for each component are plotted versus temperature",
    "style": "data"
};

const sidegraph = {
    "type": "graph",
    "graphinfo": {
        "graphheight": 350,
        "graphwidth": 350,
        "padding": {"left":80, "bottom":60, "top":30, "right":30},
        "graphbackground": "white",
        "axesbackground": "lightgray",
        "x": {
            "label": "temperature [ºC]",
            "min": Tmin,
            "max": Tmax,
            "majortick": 30,
            "minortick": 10,
            "gridline": 10,
        },
        "y": {
            "label": "pressure [bar]",
            "min": Pmin,
            "max": Pmax,
            "majortick": 0.25,
            "minortick": 0.05,
            "gridline": 0.05,
        },
    },
    "mode": "move",
    "answercount": {
        "point": 0,
        "line": 0
    },
    "answer": {

    },
    "default": {
        "line": [
            {"equation": "Antoine(~x~, @AO@, @BO@, @CO@)",
             "label": {
                 "text": "n-octane",
                 "independent": 130,
                 "indoffset": 3,
                 "depoffset": 0,
             },
             "independent": "x",
             "dependent": "y",
             "min": Tmin,
             "max": Tmax,
             "steps": 300,
             "color": watercolor,
             "showpoints": false},
            {"equation": "Antoine(~x~, @AH@, @BH@, @CH@)",
             "label": {
                 "text": "n-hexane",
                 "independent": 70,
                "indoffset": 3,
                "depoffset": 0,
             },
             "independent": "x",
             "dependent": "y",
             "min": Tmin,
             "max": Tmax,
             "steps": 300,
             "color": organiccolor,
             "showpoints": false},
        ],
    },
    "cursor": secondarycursor,
    "points": 0
}

const problem = {
    "pagetitle": "Construct a Temperature-Composition Diagram for VLE",
    "variables": {
        "constants": {
            "AO": 4.04847,
            "BO": 1355.126,
            "CO": 209.517,
            "AH": 4.00266,
            "BH": 1171.53,
            "CH": 224.366,
            "Tmin": Tmin,
            "Tmax": Tmax,

            "P": 1.6,
        },
        "random": {
            /*
            "P": {"min": Pmin,
                  "max": Pmax,
                  "digits": 1},
            */
        },
        "calculated": {
            "TsatO": "InvAntoine(@P@, @AO@, @BO@, @CO@).toFixed(0)",
            "TsatH": "InvAntoine(@P@, @AH@, @BH@, @CH@).toFixed(0)",
            "Tsum": "FindRoot('Antoine(T, @AO@, @BO@, @CO@) + Antoine(T, @AH@, @BH@, @CH@) - @P@', 'T', @Tmin@, @Tmax@, 0.001)",
            "PsatO": "Antoine(@Tsum@, @AO@, @BO@, @CO@)",
            "PsatH": "Antoine(@Tsum@, @AH@, @BH@, @CH@)",
            "Psum": "@PsatH@ + @PsatH@",

            "Tinit": "55",
            "x1": "0",
            "x2": "0.25",
            "x3": "0.5",
            "x4": "0.75",
            "x5": "1",

            // calculate real bubble and dew points
            "by2": "FindRoot('@x2@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x2@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', 'T', @Tmin@, @Tmax@, 0.001)",
            "by3": "FindRoot('@x3@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x3@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', 'T', @Tmin@, @Tmax@, 0.001)",
            "by4": "FindRoot('@x4@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x4@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', 'T', @Tmin@, @Tmax@, 0.001)",

            "dy2": "FindRoot('@x2@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @x2@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', 'T', @Tmin@, @Tmax@, 0.001)",
            "dy3": "FindRoot('@x3@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @x3@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', 'T', @Tmin@, @Tmax@, 0.001)",
            "dy4": "FindRoot('@x4@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @x4@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', 'T', @Tmin@, @Tmax@, 0.001)",

            /*
            "xc": "@PsatH@ / @Psum@",
            "x1": "@xc@ * 3/6",
            "x2": "@xc@ * 4/6",
            "x3": "@xc@ * 5/6",
            "x4": "@xc@ + (1-@xc@) * 1/6",
            "x5": "@xc@ + (1-@xc@) * 2/6",
            "x6": "@xc@ + (1-@xc@) * 3/6",

            "y1": "InvAntoine(@P@ * (1 - @x1@), @AO@, @BO@, @CO@)",
            "y2": "InvAntoine(@P@ * (1 - @x2@), @AO@, @BO@, @CO@)",
            "y3": "InvAntoine(@P@ * (1 - @x3@), @AO@, @BO@, @CO@)",
            "y4": "InvAntoine(@P@ * @x4@, @AH@, @BH@, @CH@)",
            "y5": "InvAntoine(@P@ * @x5@, @AH@, @BH@, @CH@)",
            "y6": "InvAntoine(@P@ * @x6@, @AH@, @BH@, @CH@)",
            "yvlabel": "@Tmax@ * .75 + .25 * @Tsum@",
            "yllabel": "@Tmin@ * .5 + .5 * @Tsum@",
            "ywlabel": "(@TsatO@ + @Tsum@)/2",
            "yolabel": "(@TsatH@ + @Tsum@)/2",
            */
        }
    }, // variables
    "questions": [
        {
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
                            {"x":1, "y":"@TsatH@", "tolerance":pointtolerance, "color":"orange"}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":0.5, "y":Tmax / 2, "movex":true, "movey":true, "color":"orange"}
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: determine saturation temperature using the P-T graph",
                    "style": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "1) Click and drag the orange point to the location where pure n-hexane is in vapor-liquid equilibrium.",
                    "style": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                },
                sidegraphtext,
                sidegraph]],
            ],
            "requiredscore": 0.00
        }, // question

        {
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
                            {"x":0, "y":"@TsatO@", "tolerance":pointtolerance, "color":"blue"}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":1, "y":"@TsatH@", "movex":true, "movey":true, "color":"orange"},
                            {"x":0.5, "y":Tmax / 2, "color":"blue"},
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: determine saturation temperature using the P-T graph",
                    "style": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "2) Click and drag the blue point to the location where pure n-octane is in vapor-liquid equilibrium.",
                    "style": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                },
                sidegraphtext,
                sidegraph]],
            ],
            "requiredscore": 0.00
        }, // question

        { // question
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
                            {"points":[{"x":"@x1@", "y":"@TsatO@", "show":false},
                                       {"x":"@x2@", "y":"@by2@", "show":false, "answer":true},
                                       {"x":"@x3@", "y":"@by3@", "show":false, "answer":true},
                                       {"x":"@x4@", "y":"@by4@", "show":false, "answer":true},
                                       {"x":"@x5@", "y":"@TsatH@", "show":false},],
                             "tolerance":pointtolerance,
                             "color":answercolor},
                        ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":"@x1@", "y":"@TsatO@", "color":watercolor},
                                       {"x":"@x2@", "y":"@Tinit@", "movey":true},
                                       {"x":"@x3@", "y":"@Tinit@", "movey":true},
                                       {"x":"@x4@", "y":"@Tinit@", "movey":true},
                                       {"x":"@x5@", "y":"@TsatH@", "color":organiccolor},],
                             "color":graycolor,
                             "answer":true,},
                        ],

                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint:<br>K<sub>i</sub> = P<sup>sat</sup><sub>i</sub> / P<br>Σ (K<sub>i</sub> · x<sub>i</sub>) = 1",
                    "style": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "3) Click and drag the black points to draw the bubble-point curve.",
                    "style": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                },
                sidegraphtext,
                sidegraph]]
            ],
            "requiredscore": 0.00
        }, // question

        { // question
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
                            {"points":[{"x":"@x1@", "y":"@TsatO@", "show":false},
                                       {"x":"@x2@", "y":"@dy2@", "show":false, "answer":true},
                                       {"x":"@x3@", "y":"@dy3@", "show":false, "answer":true},
                                       {"x":"@x4@", "y":"@dy4@", "show":false, "answer":true},
                                       {"x":"@x5@", "y":"@TsatH@", "show":false},],
                             "tolerance":pointtolerance,
                             "color":answercolor},
                        ]
                    },
                    "default": {
                        "line": [
                            {"equation": "FindRoot('~x~ * Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) * Antoine(T, @AO@, @BO@, @CO@) - @P@', 'T', @Tmin@, @Tmax@, 0.001)",
                             "independent": "x",
                             "dependent": "y",
                             "min": 0,
                             "max": 1,
                             "steps": 100,
                             "color": graycolor,
                             "showpoints": false},

                            {"points":[{"x":"@x1@", "y":"@TsatO@", "color":watercolor},
                                       {"x":"@x2@", "y":"@Tinit@"},
                                       {"x":"@x3@", "y":"@Tinit@"},
                                       {"x":"@x4@", "y":"@Tinit@"},
                                       {"x":"@x5@", "y":"@TsatH@", "color":organiccolor},],
                             "color":graycolor,
                             "answer":true,},
                        ],

                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint:<br>K<sub>i</sub> = P<sup>sat</sup><sub>i</sub> / P<br>Σ (y<sub>i</sub> / K<sub>i</sub>) = 1",
                    "style": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "4) Click and drag the black points to draw the dew-point curve.",
                    "style": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                },
                sidegraphtext,
                sidegraph]]
            ],
            "requiredscore": 0.00
        }, // question

        { // question
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
                            {"points":[{"x":"@x1@", "y":"@TsatO@", "show":false},
                                       {"x":"@x2@", "y":"@dy2@", "show":false, "answer":true},
                                       {"x":"@x3@", "y":"@dy3@", "show":false, "answer":true},
                                       {"x":"@x4@", "y":"@dy4@", "show":false, "answer":true},
                                       {"x":"@x5@", "y":"@TsatH@", "show":false},],
                             "tolerance":pointtolerance,
                             "color":answercolor},
                        ]
                    },
                    "default": {
                        "line": [
                            {"equation": "FindRoot('~x~ * Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) * Antoine(T, @AO@, @BO@, @CO@) - @P@', 'T', @Tmin@, @Tmax@, 0.001)",
                             "independent": "x",
                             "dependent": "y",
                             "min": 0,
                             "max": 1,
                             "steps": 100,
                             "color": graycolor,
                             "showpoints": false},

                            {"equation": "FindRoot('~x~ / Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', 'T', @Tmin@, @Tmax@, 0.001)",
                             "independent": "x",
                             "dependent": "y",
                             "min": 0,
                             "max": 1,
                             "steps": 100,
                             "color": graycolor,
                             "showpoints": false},

                        ],

                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint:<br>K<sub>i</sub> = P<sup>sat</sup><sub>i</sub> / P<br>Σ (y<sub>i</sub> / K<sub>i</sub>) = 1",
                    "style": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "5) ???",
                    "style": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "style": "data"
                },
                sidegraphtext,
                sidegraph]]
            ],
            "requiredscore": 0.00
        }, // question

    ], // questions

    "finish": {
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
                        {"points":[{"x":0, "y":"@Tsum@", "radius":1, "show":false},
                                   {"x":1, "y":"@Tsum@", "radius":1, "show":false}], "color":graycolor},
                        {"points":[{"x":"0", "y":"@Tsum@", "show":false},
                                   {"x":"0", "y":"@TsatO@", "color":watercolor},
                                   {"x":"@x1@", "y":"@y1@", "show": false},
                                   {"x":"@x2@", "y":"@y2@", "show": false},
                                   {"x":"@x3@", "y":"@y3@", "show": false},
                                   {"x":"@xc@", "y":"@Tsum@", "color":"green"}], "color":graycolor,
                                   "fill":{"color":watercolor, "opacity":0.2}},
                        {"points":[{"x":"@xc@", "y":"@Tsum@", "color":"green"},
                                   {"x":"@x4@", "y":"@y4@", "show": false},
                                   {"x":"@x5@", "y":"@y5@", "show": false},
                                   {"x":"@x6@", "y":"@y6@", "show": false},
                                   {"x":"1", "y":"@TsatH@", "color":organiccolor},
                                   {"x":"1", "y":"@Tsum@", "show":false}],
                                   "color":graycolor,
                                   "fill":{"color":organiccolor, "opacity":0.2}}
                    ],
                    "text": [
                        {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor},
                        {"text":"vapor + liquid water", "position": {"x": 0.01, "y": "@ywlabel@"}, "align":"left", "color":textcolor},
                        {"text":"vapor + liquid @compound@", "position": {"x": 0.99, "y": "@yolabel@"}, "align":"right", "color":textcolor},
                        {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": normalcursor,
            },
        ] // questionelements
    }, // finish

    "begin": {
        "variables": {
            "constants": {
                "P": "25",
                "org": "B",
            },
            "random": {},
            "calculated": {

            }
        },
        "questionelements": [
            [{
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

                    ],
                },
                "cursor": normalcursor,
            }, // element
            [{
                "type": "text",
                "label": `Placeholder`,
                "style": "prompt"
            },
            {
                "type": "text",
                "label": "Hint: click 'Begin' to start the problem",
                "style": "hiddentext hint"
            }]], // element
        ] // questionelements
    } // begin
};

let problemController = new ProblemController(problem, "body");
problemController.load();
