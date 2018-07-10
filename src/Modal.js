/**
*
*/
export class Modal {
    /**
    *
    */
    constructor(args) {
        // Pull in arguments
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        if (!document.getElementById(this.modalid)) {
            // Insert modal onto page
            document.body.insertAdjacentHTML("beforeend", this.getHTML());
        }
        // Retrieve html element
        this.modal = document.getElementById(this.modalid);
        // Set up listener for 'x' box
        this.modal.getElementsByClassName("close")[0].onclick = e => this.hide();
        // Close if clicking outside the box
        document.addEventListener("click", e => this.checkhide(e));
    }

    /**
    *
    */
    getHTML() {
        let html = `<div id="${this.modalid}" class="${this.modalclass}">`;
            html += `<div class="modal-content">`;
                html += `<div class="modal-header" style="color: ${this.color}; background-color:${this.backgroundcolor};">`;
                    html += `<span class="close"> &times; </span>`;
                    html += `<p>${this.header}</p>`;
                html += `</div>`;
                html += `<div class="modal-body">`;
                    html += `<p>${this.content}</p>`;
                html += `</div>`;
            html += `</div>`;
        html += `</div>`;
        return html;
    }

    /**
    * If clicking outside the modal box, hide it
    */
    checkhide(e) {
        if (e.target == this.modal) {
            this.hide();
        }
    }

    /**
    *
    */
    show() {
        this.modal.style.display = "block";
        this.showing = true;
    }

    /**
    *
    */
    hide() {
        this.modal.style.display = "none";
        this.showing = false;
    }

    /**
    *
    */
    remove() {
        this.modal.remove();
        delete this;
    }
}
