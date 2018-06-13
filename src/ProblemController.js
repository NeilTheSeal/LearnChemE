import {DOM} from "./DOM.js";
import {Question} from "./Question.js";
import {Modal} from "./Modal.js"
import {roundTo, getCookie, setCookie, generateVariables} from "./sky-helpers.js";

const VAR = "@";
const HIDESCOREWINDOWWIDTH = 875;
const spreadsheetURL = "https://script.google.com/macros/s/AKfycbzNPmE7Qx1mLXdwIvP8FyWVyDdR8FQ-ymkAFyiNcF4QC4zvVwM/exec";

/**
    Master class for controlling page <br>
    Each problem consists of a series of {@link Question}s
*/
export class ProblemController {
    /**
        @param {object} inputarguments
        @param {string} inputarguments.title Title to be displayed at the top of the page and as the html page title
        @param {object} inputarguments.inputvariables Data for variables used in problem
        @param {list} inputarguments.questions List of objects containing data for each {@link Question}
        @param {object} inputarguments.finish Object containing data for display of finishing page
    */
    constructor(inputarguments, containerid) {
        this.inputarguments = inputarguments;
        this.containerid = containerid;
        this.init(this.inputarguments, this.containerid);
    }

    init(inputarguments, containerid) {
        // Insert main page containers
        let html = `<div id=${DOM.problemdivid}>`;
            html += `<div id="${DOM.titledivid}"></div>`;
            html += `<hr>`;
            html += `<div id="${DOM.questiondivid}"></div>`;
            html += `<hr>`;
            html += `<div id="${DOM.buttonsdivid}"></div>`;
            html += `<div id="${DOM.scoredivid}"></div>`;
            html += `<div id="${DOM.gradedivid}"></div>`;
            html += `<div id=${DOM.modaldivid}></div>`;
        html += `</div>`;
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

        // Create buttons
        this.insertButton(DOM.buttonsdivid, DOM.beginbuttonid, "Begin", this.begin.bind(this));
        this.insertButton(DOM.buttonsdivid, DOM.hintbuttonid, "Hint", this.showhint.bind(this));

        // Set problem title
        this.title = inputarguments.pagetitle;
        document.title = this.title;
        document.getElementById(DOM.titledivid).insertAdjacentHTML("beforeend", this.title);

        // Create questions
        this.questions = [];
        for (let q of inputarguments.questions) {
            this.questions.push(new Question(q));
        }
        this.finishquestion = new Question(inputarguments.finish);
        this.beginquestion = new Question(inputarguments.begin);

        // Create variables
        this.variablevalues = generateVariables(inputarguments.variables);

        // Catch keyboard events
        document.addEventListener("keydown", e => this.keyEvent(e));

        // Initialize variables
        this.reviewing = false;
        this.hasbegun = false;
        this.finished = false;
        this.currentquestion = undefined;
        this.score = {};
        for (let i in this.questions) {
            this.score[i] = {"max": this.questions[i].totalPoints,
                             "got": 0,
                             "pct": 0};
        }

        // Show pre-question page
        this.beginquestion.display(this.variablevalues);
    }

    /**
    *   Restart the problem
    */
    promptrestart() {
        let m = new Modal({
            parentid:DOM.modaldivid,
            modalid:DOM.restartmodal,
            modalclass:DOM.modalclass,
            header:"Restart Problem",
            backgroundcolor:"#BC5F50",
            content:`You will lose all progress on the current problem. <br><br>Really start a new problem?<br><br><button id="restartone">Restart from step one</button><button id="restartzero">Restart from introduction</button><button id="restartabort">No</button>`,
        });

        m.show();

        document.getElementById("restartzero").addEventListener("click", this.restart.bind(this));
        document.getElementById("restartone").addEventListener("click", this.restartstepone.bind(this));
        document.getElementById("restartabort").addEventListener("click", m.remove.bind(m));
    }

    /**
    *
    */
    restartstepone() {
        this.restart();
        this.begin();
    }

    /**
    *
    */
    restart() {
        // Hide modal
        document.getElementById("restartmodal").remove();
        // Clear container
        document.getElementById(DOM.problemdivid).remove();
        // Start new problem
        this.init(this.inputarguments, this.containerid);
    }

    /**
        Handler for keypress events
    */
    keyEvent(e) {
        //console.log(`ProblemController: pressed ${e.key}`);
        if (e.key === "Enter") {
            if (!this.hasbegun) {
                this.begin();
            } else if (!this.finished && !this.reviewing) {
                this.submit();
            } else if (!this.finished && this.reviewing) {
                this.next();
            }
        }
    }

    /**
        Removes all html elements from the question div, clearing the page for the next question
    */
    clearPage() {
        // Clear question objects from html
        let container = document.getElementById(DOM.questiondivid);
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }
    }
    /**
        Inserts the HTML for grading submission input
    */
    insertScoreInput() {
        // Create html for modal
        let html = `<form id="${DOM.gradeform}" method="POST" class="pure-form pure-form-stacked" data-email="SOMEEMAIL@email.net"
  action="${spreadsheetURL}">`;

        html += `<div class="${DOM.textboxdivclass}"><span class="${DOM.textboxspanclass}">Name:</span><br><input class="${DOM.textboxclass}" id="${DOM.nametextid}"></input></div>`;
        html += `<div class="${DOM.textboxdivclass}"><span class="${DOM.textboxspanclass}">Student ID:</span><br><input class="${DOM.textboxclass}" id="${DOM.cuidtextid}"></input></div>`;
        html += `<div class="${DOM.textboxdivclass}"><span class="${DOM.textboxspanclass}">Course code:</span><br><input class="${DOM.textboxclass}" id="${DOM.coursetextid}"></input></div>`;
        html += `<button id="${DOM.gradebuttonid}">Submit</button>`;
        html += `<p id="gradeservererror" class="hidden">Error while submitting grade to server. Check console for detailed http report.</p>`
        html += `</form>`;
        // Create modal
        let m = new Modal({
            parentid:DOM.modaldivid,
            modalid:DOM.gradesubmitmodal,
            modalclass:DOM.modalclass,
            header:"Submit Grade",
            backgroundcolor:"#123456",
            content:html,
        });
        // Create submission button
        this.insertButton(DOM.buttonsdivid, DOM.gradebuttonid, "Submit for Grade (optional)", m.show.bind(m));
        // Bind modal button to grade submission function
        document.getElementById(DOM.gradeform).addEventListener("submit", e => this.submitForGrade(e));
    }

    /**
        Submits grade to spreadsheet <br>
        Followed example at: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server
    */
    submitForGrade(e) {
        this.disableElement(DOM.gradebuttonid);
        document.getElementById("gradeservererror").classList.add("hidden");
        e.preventDefault();     // Prevent default form submission, use xhr
        let data = this.getSubmissionData();

//        if (data.cuid.length != 9) {
//            console.log('BAD ID LENGTH');
//            return false;
//        } else if (data.name.length === 0) {
//            console.log('BAD NAME LENGTH');
//            return false;
//        } else if (parseFloat(data.course.length) <= 0) {
//            console.log('BAD COURSE ID');
//            return false;
//        } else {
            const url = e.target.action;
            const method = 'POST';
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (xhr.status == 200) {
                    //document.getElementById("gradeform").style.display = "none";
                    document.getElementById("gradeform").innerHTML = "Your grade has been submitted."
                } else {
                    this.enableElement(DOM.gradebuttonid);
                    document.getElementById("gradeservererror").classList.remove("hidden");
                    console.log(xhr.status, xhr.statusText, xhr.responseText);
                }
                return;
            };
            var encoded = Object.keys(data).map(function(k) {
                return encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
            }).join('&');
            xhr.send(encoded);
//        }
    }

    /**
     * Gathers data from the page to submit to the spreadsheet
     * @return {object} Data that will be passed to the web server
     */
    getSubmissionData() {
        let data = {};
        data.course = document.getElementById(DOM.coursetextid).value;
        data.title = this.title;
        data.name = document.getElementById(DOM.nametextid).value;
        data.cuid = document.getElementById(DOM.cuidtextid).value;
        data.score = this.sumScore().pct.toFixed(2);

        data.formDataNameOrder = JSON.stringify(["course", "title", "name", "cuid", "score"]); // The data, in order, that is inserted into the sheet
        data.formGoogleSheetName = data.course; // The subsheet to insert data onto

        return data;
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
        let container = document.getElementById(DOM.scoredivid);

        // Clear score objects from html
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }

        // Create new score object
        let html = `<div id=${DOM.scoretitleid}>SCORE</div>`;
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
        let container = document.getElementById(DOM.bodydivid);
        // Generate uuid from tip string
        uuid = tip.hashCode();
        // If haven't been told to not show
        if (!getCookie(uuid) === true) {
            // Create id strings
            const re = new RegExp(`${VAR}id${VAR}`, "g");
            const divid = DOM.tipboxdivid.replace(re, uuid);
            const checkid = DOM.tipboxcheckid.replace(re, uuid);
            const buttonid = DOM.tipboxbuttonid.replace(re, uuid);
            // Create html payload for tip
            let html = `<div class="${DOM.tipboxdivclass}" id="${divid}" style="left: ${left}px; top:${top}px;">
                        <span class="${DOM.tipboxtextclass}">${tip}</span>
                        <br>
                        <input type="checkbox" id="${checkid}">
                        <span class="${DOM.tipboxdontshowclass}">don't show this again</span>
                        <button class="${DOM.tipboxbuttonclass}" id="${buttonid}">OK</button>
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
                this.questions[this.currentquestion].display(this.variablevalues);
            }
        }
        this.updateScores();
        // Slide scores off screen
        document.getElementById(DOM.scoredivid).classList.remove("showscore");

        /*      TEST COOKIE TIPS
        this.insertTipBox("Interact with the graph by clicking and dragging elements", 270, 300);
        this.insertTipBox("Type answers into text fields (case insensitive)", 530, 720);
        this.insertTipBox("Click here to start over with new values", 2, 890);
        this.insertTipBox("Click here to get a hint on the current step", 206, 890);
        this.insertTipBox("Click here to check your answers and move on to the next step", 410, 890);
        //*/
    }

    /**
        Repeat the current question
    */
    repeat() {
        this.currentquestion--;
        this.next();
    }

    /**
    *   Inserts HTML for a button with specified properties <br>
    *   Uses weird string calling because arrow functions are odd
    *   @param {string} containerid ID of container element for button
    *   @param {string} buttonid ID of button
    *   @param {string} buttontext Text to display in button
    *   @param {string} callback Name of function in {@link ProblemController}
    */
    insertButton(containerid, buttonid, buttontext, callback) {
        let container = document.getElementById(containerid);
        let html = `<button id="${buttonid}">${buttontext}</button>`;
        container.insertAdjacentHTML("beforeend", html);
        document.getElementById(buttonid).addEventListener("click", callback);
    }

    /**
    *
    */
    removeElement(elementid) {
        if (document.getElementById(elementid)) {
            document.getElementById(elementid).remove();
        } else {
            console.log(`element ${elementid} does not exist`);
            console.trace();
        }
    }

    /**
    *
    */
    enableElement(elementid) {

        document.getElementById(elementid).classList.remove(DOM.disabledclass);
    }

    /**
    *
    */
    disableElement(elementid) {
        document.getElementById(elementid).classList.add(DOM.disabledclass);
    }

    /**
    *
    */
    hideElement(elementid) {
        document.getElementById(elementid).classList.add(DOM.hiddenclass);
    }

    /**
    *
    */
    showElement(elementid) {
        document.getElementById(elementid).classList.remove(DOM.hiddenclass);
    }

    /**
     *  Begin the question
     */
    begin() {
        this.hasbegun = true;
        this.removeElement(DOM.beginbuttonid);
        this.removeElement(DOM.hintbuttonid);
        this.insertButton(DOM.buttonsdivid, DOM.restartbuttonid, "Restart Problem", this.promptrestart.bind(this));
        this.insertButton(DOM.buttonsdivid, DOM.hintbuttonid, "Hint", this.showhint.bind(this));
        this.insertButton(DOM.buttonsdivid, DOM.submitbuttonid, "Submit Answers", this.submit.bind(this));
        // Insert next button so it can be removed
        this.insertButton(DOM.buttonsdivid, DOM.nextbuttonid, "Next Part", this.next.bind(this));

        // Start question sequence
        this.currentquestion = -1;
        this.next();
    }

    /**
        Show the hints for the current {@link Question}
    */
    showhint(e) {
        this.disableElement(DOM.hintbuttonid);
        // Loop through all hints, remove hidden text class
        let elements = document.getElementsByClassName(DOM.hiddentextclass);
        while (elements[0]) {
            elements[0].classList.remove(DOM.hiddentextclass);
        }
    }

    /**
        Check user-submitted answers, show correct answers, update score
    */
    submit() {
        this.reviewing = true;
        this.insertButton(DOM.buttonsdivid, DOM.nextbuttonid, "Next Part", this.next.bind(this));
        // Update score for this question, call Question.submit
        this.score[this.currentquestion] = this.questions[this.currentquestion].submit();
        if (this.score[this.currentquestion].pct >= this.questions[this.currentquestion].requiredscore) {
            // If on last question, adjust button label and click event
            if (this.currentquestion == this.questions.length - 1) {
                document.getElementById(DOM.nextbuttonid).textContent = "Finish";
                document.getElementById(DOM.nextbuttonid).addEventListener("click", e => this.finish(e));
            }
        } else {
            document.getElementById(DOM.nextbuttonid).textContent = "Retry";
        }
        this.disableElement(DOM.submitbuttonid);
        this.showElement(DOM.nextbuttonid);
        if (this.score[this.currentquestion].pct < 1) {
            this.showhint();
        }
        this.updateScores();
        document.getElementById(DOM.scoredivid).classList.add("showscore");
    }

    /**
        Finish reviewing correct answers, move on to the next question
    */
    next() {
        if (this.currentquestion < this.questions.length - 1) {
            this.reviewing = false;
            //this.insertButton(DOM.buttonsdivid, DOM.submitbuttonid, "Submit Answers", this.submit.bind(this));
            //this.insertButton(DOM.buttonsdivid, DOM.nextbuttonid, "Next Part", this.next.bind(this));
            //this.enableElement(DOM.submitbuttonid);
            this.removeElement(DOM.nextbuttonid);//this.hideElement(DOM.nextbuttonid);
            this.enableElement(DOM.submitbuttonid);
            this.enableElement(DOM.hintbuttonid);

            this.currentquestion++;
            this.display();

            window.scrollTo(0,0); // Move to top of page
        } else {
            this.finished = true;
            this.finish();
        }
    }

    /**
        Finish the problem, display the finishing page
    */
    finish() {
        this.clearPage();
        document.getElementById(DOM.hintbuttonid).remove();
        document.getElementById(DOM.submitbuttonid).remove();
        document.getElementById(DOM.nextbuttonid).remove();
        this.insertScoreInput();
        this.updateScores();
        this.finishquestion.display(this.variablevalues);
        document.getElementById(DOM.scoredivid).classList.add("showscore");
    }
}

