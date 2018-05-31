import {Question} from "./Question.js";
import {roundTo, getCookie, setCookie, generateVariables} from "./sky-helpers.js";

/**
    Master class for controlling page <br>
    Consists of a series of questions

*/
const VAR = "@";
const HIDESCOREWINDOWWIDTH = 875;

export class ProblemController {
    /**
        @param {object} inputarguments
        @param {string} inputarguments.title Title to be displayed at the top of the page and as the html page title
        @param {object} inputarguments.inputvariables Data for variables used in problem
        @param {list} inputarguments.questions List of objects containing data for each {@link Question}
        @param {object} inputarguments.finish Object containing data for display of finishing page
    */
    constructor(inputarguments, containerid) {
        /**
            @name ProblemController#currentquestion
            @type int
            @desc Index of the {@link Question} currently displayed to the user
        */
        this.DOM = this.getDOM;
        // Insert problem onto page here
        this.pagesetup(this.DOM, containerid);
        // Load problem data
        this.title = inputarguments.pagetitle;
        this.inputvariables = inputarguments.variables;
        this.questions = [];
        for (let q of inputarguments.questions) {
            q.DOM = this.DOM;
            this.questions.push(new Question(q));
        }
        inputarguments.finish.DOM = this.DOM;
        inputarguments.begin.DOM = this.DOM;
        this.finishquestion = new Question(inputarguments.finish);
        this.beginquestion = new Question(inputarguments.begin);
        // Initialize local data
        this.score = {};
        // Set/insert heading title
        document.title = this.title;
        document.getElementById(this.DOM.titledivid).insertAdjacentHTML("beforeend", this.title);
        // Catch keyboard events
        document.addEventListener("keydown", e => this.keyEvent(e));
    }
    /**
        Document object model for the page
    */
    get getDOM() {
        return {
        "headerdivid": "header",
        "bodydivid": "body",
            "titledivid": "title",
            "questiondivid": "question",
                "canvasdivclass": "canvasarea",
                "canvasdivid": "canvasarea--" + VAR + "id" + VAR,
                    "canvasclass": "canvas",
                    "canvasid": "canvas--" + VAR + "id" + VAR,
                    "staticcanvasid": "canvas--static--" + VAR + "id" + VAR,
                    "dynamiccanvasid": "canvas--dynamic--" + VAR + "id" + VAR,
                    "canvasinfodivclass": "canvasinfo",
                        "canvaspointclass": "canvaspoint",
                        "canvaspointid": "canvaspoint--" + VAR + "id" + VAR,
                        "canvasmodeclass": "canvasmode",
                        "canvasmodeid": "canvasmode--" + VAR + "id" + VAR,
                "textboxdivclass": "textentry",
                    "textboxspanclass": "textboxlabel",
                    "textboxclass": "textbox",
                    "textboxid": "textbox--" + VAR + "id" + VAR,
                    "textboxanswerclass": "textboxanswer",
                    "textboxanswerid": "textboxanswer--" + VAR + "id" + VAR,
                    "textboxanswershown": "textboxanswershown",
                "textspanclass": "textspan",
            "buttonsdivid": "buttons",
                "restartbuttonid": "restartbutton",
                "hintbuttonid": "hintbutton",
                "submitbuttonid": "submitbutton",
                "nextbuttonid": "nextbutton",
            "scoredivid": "scorediv",
                "scoretitleid": "scoretitle",
            "gradedivid": "submitgrade",
                "nametextid": "nametext",
                "cuidtextid": "cuidtext",
                "gradebuttonid": "gradebutton",
        "footerdivid": "footer",
        "hiddentextclass": "hiddentext",
        "hiddenclass": "hidden",
        "disabledclass": "disabled",
        "hidescoreclass": "hidescore",

        "tipboxdivclass" : "tipbox",
        "tipboxdivid" : "tipbox--" + VAR + "id" + VAR,
        "tipboxtextclass" : "tiptext",
        "tipboxcheckid" : "tipcheck--" + VAR + "id" + VAR,
        "tipboxdontshowclass" : "tipdontshow",
        "tipboxbuttonclass" : "tipbutton",
        "tipboxbuttonid" : "tipbutton--" + VAR + "id" + VAR,
        };
    }
    /**
        Show or hide scores box based on window width, and set up listening event to do so on page resizing
        @param {object} DOM Document object model name associations
    */
    pagesetup(DOM, containerid) {
        // Insert main page elements
        let html = ``;
        html += `<div id="${DOM.titledivid}"></div>`;
        html += `<div id="${DOM.questiondivid}"></div>`;
        html += `<hr>`;
        html += `<div id="${DOM.buttonsdivid}"></div>`;
        html += `<div id="${DOM.scoredivid}"></div>`;
        html += `<div id="${DOM.gradedivid}"></div>`;
        document.getElementById(containerid).insertAdjacentHTML("beforeend", html);

        // Set up score box
        if (document.documentElement.clientWidth < HIDESCOREWINDOWWIDTH) {
            document.getElementById(DOM.scoredivid).classList.add(DOM.hidescoreclass)
        } else {
            document.getElementById(DOM.scoredivid).classList.remove(DOM.hidescoreclass)
        }
        document.getElementsByTagName("BODY")[0].onresize = function() {
            if (document.documentElement.clientWidth < HIDESCOREWINDOWWIDTH) {
                document.getElementById(DOM.scoredivid).classList.add(DOM.hidescoreclass)
            } else {
                document.getElementById(DOM.scoredivid).classList.remove(DOM.hidescoreclass)
            }
        };
    }
    /**
        Refresh the page, starting a new problem
    */
    refresh() {
        if (this.currentquestion === undefined) {
            this.begin();
        } else {
            if (confirm("Really start a new problem?")) {
                // One of many ways to refresh the page
                location = location;
            }
        }
    }
    /**
        Proceed to the next question in the problem
    */
    nextQuestion() {
        this.currentquestion++;
        this.display();
        // Move to top of page
        window.scrollTo(0,0);
    }
    /**
        Handler for keypress events
    */
    keyEvent(e) {
        //console.log(`ProblemController: pressed ${e.key}`);
        if (e.key === "Enter") {
            if (this.currentquestion === undefined) {
                // Begin problem
                document.getElementById(this.DOM.restartbuttonid).click();
            } else if (this.currentquestion < this.questions.length) {
                if (!document.getElementById(this.DOM.submitbuttonid).classList.contains(this.DOM.hiddenclass)) {
                    document.getElementById(this.DOM.submitbuttonid).click();
                } else {
                    document.getElementById(this.DOM.nextbuttonid).click();
                }
            }
        }
    }
    /**
        Removes all html elements from the question div, clearing the page for the next question
    */
    clearPage() {
        // Clear question objects from html
        let container = document.getElementById(this.DOM.questiondivid);
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }
    }
    /**
        Inserts the HTML for grading submission input
    */
    insertScoreInput() {
        let container = document.getElementById(this.DOM.gradedivid);
        let html = `<div class="${this.DOM.textboxdivclass}">`;
        html += `<span class="${this.DOM.textboxspanclass}">Name:</span>`;
        html += `<br>`;
        html += `<input class="${this.DOM.textboxclass}" id="${this.DOM.nametextid}">`;
        html += `</input></div>`;
        html += `<div class="${this.DOM.textboxdivclass}">`;
        html += `<span class="${this.DOM.textboxspanclass}">Student ID:</span>`;
        html += `<br>`;
        html += `<input class="${this.DOM.textboxclass}" id="${this.DOM.cuidtextid}">`;
        html += `</input></div>`;
        html += `<button id="${this.DOM.gradebuttonid}">Submit for Grade (optional)</button>`;
        html += "<br><br><br><br>"
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.gradebuttonid).addEventListener("click", e => this.submitforgrade(e));
    }
    /**
        Placeholder grade submission function <br>
        Should be replaced with server communication
    */
    submitforgrade() {
        const name = document.getElementById(this.DOM.nametextid).value;
        const cuid = document.getElementById(this.DOM.cuidtextid).value;
        const score = roundTo(this.sumScore().pct*100, 0);
        const hash = this.generateHash(name, cuid, score);
        console.log(name, cuid, score, hash);
        alert(`Submission information:\n|${name}|\n|${cuid}|\n|${score}|\n|${hash}|`);
    }
    /**
        Concatenate a series of strings then run them through a simple hash function
    */
    generateHash() {
        let str = "";
        for (let i = 0; i < arguments.length; i++) {
            str += arguments[i];
        }
        return str.hashCode();
    }
    /**
        Insert HTML for the Hint button
    */
    insertHintButton() {
        let container = document.getElementById(this.DOM.buttonsdivid);
        let html = `<button id="${this.DOM.hintbuttonid}">Hint</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.hintbuttonid).addEventListener("click", e => this.showhint(e));
    }
    /**
        Insert HTML for the Submit button
    */
    insertSubmitButton() {
        let container = document.getElementById(this.DOM.buttonsdivid);
        let html = `<button id="${this.DOM.submitbuttonid}">Submit Answers</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.submitbuttonid).addEventListener("click", e => this.submit(e));
    }
    /**
        Insert HTML for the Next button
    */
    insertNextButton() {
        let container = document.getElementById(this.DOM.buttonsdivid);
        let html = `<button id="${this.DOM.nextbuttonid}">Next Part</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(this.DOM.nextbuttonid).addEventListener("click", e => this.next(e));
    }
    /**
        Insert HTML for the Restart button
    */
    insertRestartButton() {
        // Add button
        let container = document.getElementById(this.DOM.buttonsdivid);
        let html = `<button id="${this.DOM.restartbuttonid}">Restart Problem</button>`;
        container.insertAdjacentHTML("beforeend", html);
        // Add event listener to button
        document.getElementById(this.DOM.restartbuttonid).addEventListener("click", e => this.refresh(e));
    }
    /**
        Make Hint button clickable
    */
    enableHintButton() {
        document.getElementById(this.DOM.hintbuttonid).classList.remove(this.DOM.disabledclass);
    }
    /**
        Make Hint button un-clickable
    */
    disableHintButton() {
        document.getElementById(this.DOM.hintbuttonid).classList.add(this.DOM.disabledclass);
    }
    /**
        Hide/show Submit button
    */
    toggleSubmitButton() {
        document.getElementById(this.DOM.submitbuttonid).classList.toggle(this.DOM.hiddenclass);
    }
    /**
        Hide/show Next button
    */
    toggleNextButton() {
        document.getElementById(this.DOM.nextbuttonid).classList.toggle(this.DOM.hiddenclass);
    }
    /**
        Hide/show Hint button
    */
    toggleHintButton() {
        document.getElementById(this.DOM.hintbuttonid).classList.toggle(this.DOM.hiddenclass);
    }
    /**
        Gets the total score for the problem
        return {object} Score object containing "got", "max", and "pct" keys
    */
    sumScore() {
        let sumscore = 0;
        let sumpoints = 0;
        for (let i in this.score) {
            sumscore += this.score[i].got;
            sumpoints += this.score[i].max;
        }
        return {
            "got": sumscore,
            "max": sumpoints,
            "pct": sumscore / sumpoints,
        };
    }
    /**
        Update score summary table on page
    */
    updateScores() {
        let container = document.getElementById(this.DOM.scoredivid);

        // Clear score objects from html
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }

        // Create new score object
        let html = `<div id=${this.DOM.scoretitleid}>SCORE</div>`;
        html += "<table>";
        html += "<tr><th>Part</th><th>Points</th><th>Total</th><th>Pct</th></tr>";
        for (let i in this.score) {
            // TODO add highlight to current question
            html += `<tr><td>${parseFloat(i)+1}</td><td>${roundTo(this.score[i].got, 2)}</td><td>${roundTo(this.score[i].max, 2)}</td><td>${roundTo(this.score[i].pct*100, 0)}%</td></tr>`;
        }
        const sumscore = this.sumScore();
        html += `<tr><td>Total</td><td>${roundTo(sumscore.got, 2)}</td><td>${roundTo(sumscore.max, 2)}</td><td>${roundTo(sumscore.pct * 100,0)}%</td></tr>`;
        html += "</table>";

        container.insertAdjacentHTML("beforeend", html);
    }
    /**
        Insert a dismissable tip box on the page
        @param {string} tip Text content
        @param {int} left Left position of box (in px)
        @param {int} top Top position of box (in px)
        @param {string} uuid Unique id
    */
    insertTipBox(tip, left, top, uuid) {
        const COOKIEEXPIRATION = 30*1000; // In milliseconds
        let container = document.getElementById(this.DOM.bodydivid);
        // Generate uuid from tip string
        uuid = tip.hashCode();
        // If haven't been told to not show
        if (!getCookie(uuid) === true) {
            // Create id strings
            const re = new RegExp(`${VAR}id${VAR}`, "g");
            const divid = this.DOM.tipboxdivid.replace(re, uuid);
            const checkid = this.DOM.tipboxcheckid.replace(re, uuid);
            const buttonid = this.DOM.tipboxbuttonid.replace(re, uuid);
            // Create html payload for tip
            let html = `<div class="${this.DOM.tipboxdivclass}" id="${divid}" style="left: ${left}px; top:${top}px;">
                        <span class="${this.DOM.tipboxtextclass}">${tip}</span>
                        <br>
                        <input type="checkbox" id="${checkid}">
                        <span class="${this.DOM.tipboxdontshowclass}">don't show this again</span>
                        <button class="${this.DOM.tipboxbuttonclass}" id="${buttonid}">OK</button>
                        </div>`;
            // Function for closing tip and creating cookie
            let f = function() {
                //console.log("I am tip #", uuid);
                // Set cookie if told to not show again
                if (document.getElementById(checkid).checked) {
                    setCookie(uuid, true, COOKIEEXPIRATION);
                }
                document.getElementById(divid).remove();
            }
            // Add box to html
            container.insertAdjacentHTML("beforeend", html);
            // Create event listener on button
            document.getElementById(buttonid).addEventListener("click", e => f(e));
        }
    }
    /**
        Display current question to page
    */
    display() {
        // Clear current page elements
        this.clearPage();
        if (this.currentquestion > -1) {
            // Add current question objects to html
            if (this.currentquestion < this.questions.length) {
                // TODO remove this if wrapper, instead remove event from Next button
                this.questions[this.currentquestion].display(this.DOM, this.variablevalues);
            }
        }
        this.updateScores();
        // Slide scores off screen
        document.getElementById(this.DOM.scoredivid).classList.remove("showscore");

        /*      TEST COOKIE TIPS
        this.insertTipBox("Interact with the graph by clicking and dragging elements", 270, 300);
        this.insertTipBox("Type answers into text fields (case insensitive)", 530, 720);
        this.insertTipBox("Click here to start over with new values", 2, 890);
        this.insertTipBox("Click here to get a hint on the current step", 206, 890);
        this.insertTipBox("Click here to check your answers and move on to the next step", 410, 890);
        //*/
    }
    /**
        Show the hints for the current {@link Question}
    */
    showhint() {
        // Prevent multiple clicks
        this.disableHintButton();
        // Loop through all hints, remove hidden text class
        let elements = document.getElementsByClassName(this.DOM.hiddentextclass);
        while (elements[0]) {
            elements[0].classList.remove(this.DOM.hiddentextclass);
        }
    }
    /**
        Check user-submitted answers, show correct answers, update score
    */
    submit() {
        // Update score for this question, call Question.submit
        this.score[this.currentquestion] = this.questions[this.currentquestion].submit(this.DOM);
        if (this.score[this.currentquestion].pct >= this.questions[this.currentquestion].requiredscore) {
            // If on last question, adjust button label and click event
            if (this.currentquestion == this.questions.length - 1) {
                document.getElementById(this.DOM.nextbuttonid).textContent = "Finish";
                document.getElementById(this.DOM.nextbuttonid).addEventListener("click", e => this.finish(e));
            }
        } else {
            document.getElementById(this.DOM.nextbuttonid).textContent = "Retry";
        }
        this.toggleSubmitButton();
        this.toggleNextButton();
        this.showhint();
        this.updateScores();
        document.getElementById(this.DOM.scoredivid).classList.add("showscore");
    }
    /**
        Repeat the current question
    */
    repeat() {
        this.currentquestion--;
        this.nextQuestion();
    }
    /**
        Create HTML elements and set initial variable values
    */
    load() {
        // Initialize scores
        for (let i in this.questions) {
            this.score[i] = {"max": this.questions[i].totalPoints,
                             "got": 0,
                             "pct": 0};
        }

        // Create buttons
        this.insertRestartButton(this.DOM);
        this.insertHintButton(this.DOM);
        this.insertSubmitButton(this.DOM);
        this.insertNextButton(this.DOM);
        this.toggleNextButton(this.DOM);

        // Create variables
        this.variablevalues = generateVariables(this.inputvariables);

        this.beginquestion.display(this.DOM, this.variablevalues);

        // Hide buttons
        document.getElementById(this.DOM.submitbuttonid).classList.add(this.DOM.disabledclass);
        document.getElementById(this.DOM.restartbuttonid).textContent = "Begin";
        document.getElementById(this.DOM.restartbuttonid).focus();
    }
    /**
     *  Begin the question
     */
    begin() {
        // Show buttons
        document.getElementById(this.DOM.submitbuttonid).classList.remove(this.DOM.disabledclass);
        document.getElementById(this.DOM.restartbuttonid).textContent = "Restart Problem";
        this.enableHintButton()
        document.getElementById(this.DOM.restartbuttonid).blur();

        // Start question sequence
        this.currentquestion = -1;
        this.nextQuestion();
    }
    /**
        Finish reviewing correct answers, move on to the next question
    */
    next() {
        this.toggleSubmitButton();
        this.toggleNextButton();
        this.enableHintButton();
        this.nextQuestion();
    }
    /**
        Finish the problem, display the finishing page
    */
    finish() {
        this.clearPage();
        document.getElementById(this.DOM.hintbuttonid).remove();
        document.getElementById(this.DOM.submitbuttonid).remove();
        document.getElementById(this.DOM.nextbuttonid).remove();
        this.insertScoreInput();
        this.updateScores();
        this.finishquestion.display(this.DOM, this.variablevalues);
        document.getElementById(this.DOM.scoredivid).classList.add("showscore");
    }
}

