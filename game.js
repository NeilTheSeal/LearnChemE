const FPS = 50;
const FIELD_WIDTH = 640;
const FIELD_HEIGHT = 640;
const NUM_LAYERS = 4;
const PI = 3.141592654;
const CONTROLLER_DEADZONE = 0.15;
const BARREL_SIZE = 15;
const FIRE_COOLDOWN = 30;
const BULLET_SPEED = 10;
const FIRE_BUTTON = 7;
const HP_BORDER = 1;
const PLAYER_HP = 100;
const COLLISION_DAMAGE = 10;
const ASTEROID_SCORE = 100;
const NUM_ASTEROIDS = 40;

/*
    Controls all aspects of the game
*/
class GameController {
    constructor(args) {
        // Default arguments
        this.fps = FPS;
        // Fill arguments
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        this.initialize();
    }
    
    /*
        Set up initial variables
    */
    initialize() {
        // Event listeners
        document.addEventListener("keydown", e => this.keyEvent(e));
        document.addEventListener("keyup", e => this.keyEvent(e));
        document.addEventListener("mousemove", e => this.mouseEvent(e));
        document.addEventListener("mousedown", e => this.mouseEvent(e));
        window.addEventListener("gamepadconnected", e => this.gamepadEvent(e));
        window.addEventListener("gamepaddisconnected", e => this.gamepadEvent(e));
        // Set up interface objects
        this.gamepad = [];
        this.canvas = new ZCanvas({"width": this.width,
                                   "height": this.height,
                                   "layers": this.layers,
                                   "container": "viewport",
                                   "id": "canvas-",
                                   "class": ""});
        this.context = [];
        for (let i=0; i<this.layers; i++) {
            this.context.push(this.canvas.getContext(i));
        }
        // Background
        this.context[0].fillStyle = "#DDDDDD";
        this.context[0].fillRect(0, 0, this.width, this.height);
        // HUD statics
        this.context[2].fillStyle = "black";
        this.context[2].fillRect(this.width * 1 / 10,
                                 this.height * 19 / 20,
                                 this.width * 4 / 5,
                                 this.height / 100);
        /*
        this.context[2].fillStyle = "black";
        this.context[2].globalAlpha = 1;
        this.context[2].font = "20px Arial";
        this.context[2].textAlign = "left";
        this.context[2].fillText("Health:", 10, this.height-10);
        */
        // Entities
        this.entities = [];
        this.createPlayer();
    }
    
    /*
        Create the player object
    */
    createPlayer() {
        this.player = new Player({"x": this.width/2,
                                  "y": this.height/2,
                                  "speed": 5,
                                  "sizer":7,
                                  "aim": PI/2,
                                  "color":"red",
                                  "bounds":{"right":this.width, "bottom":this.height}});
        this.entities.push(this.player);
    }
    
    /*
        Process a keyup or keydown
    */
    keyEvent(e) {
        const playerKeys = ["w", "a", "s", "d"];
        
        if (playerKeys.indexOf(e.key) != -1) {
            if (e.type === "keydown") {
                if (this.gamepad.length) {
                    console.log("Player keystrokes ignored while controller is connected");
                }
                if (e.key === "w") {
                    this.player.vy = -this.player.speed;
                }
                if (e.key === "a") {
                    this.player.vx = -this.player.speed;
                }
                if (e.key === "s") {
                    this.player.vy = this.player.speed;
                }
                if (e.key === "d") {
                    this.player.vx = this.player.speed;
                }
            } else if (e.type === "keyup") {
                if (e.key === "w") {
                    this.player.vy = 0;
                }
                if (e.key === "a") {
                    this.player.vx = 0;
                }
                if (e.key === "s") {
                    this.player.vy = 0;
                }
                if (e.key === "d") {
                    this.player.vx = 0;
                }
            }
        }
        
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            let pm = 0;
            if (e.key === "ArrowUp") {
                pm = 1;
            } else {
                pm = -1;
            }
            for (let entity of this.entities) {
                if (entity.velocity > 0) {
                    entity.velocity += 0.1 * pm;
                } else {
                    entity.velocity -= 0.1 * pm;
                }
            }
        }
    }
    
    /*
        Process a mouse event
    */
    mouseEvent(e) {
        if (e.type === "mousemove") {
            let dx = e.x - this.player.x;
            let dy = e.y - this.player.y;
            if (dx >= 0) {
                this.player.aim = Math.atan(dy / dx);
            } else if (dx < 0) {
                this.player.aim = Math.atan(dy / dx) + PI;
            }
        } else if (e.type === "mousedown") {
            let b = this.player.fire();
            if (b) { this.entities.push(b); }
        }
    }
    
    /*
        Handles gamepad connect/disconnect events
    */
    gamepadEvent(e) {
        if (e.type === "gamepadconnected") {
            this.addGamepad(e.gamepad);
            console.log(`Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}. ${e.gamepad.buttons.length} buttons, ${e.gamepad.axes.length} axes.`);
        } else if (e.type === "gamepaddisconected") {
            this.removeGamepad(e.gamepad);
            console.log(`Gamepad disconnected from index ${e.gamepad.index}: ${e.gamepad.id}`);
        }
    }
    
    /*
        Adds a gamepad to the GameController
    */
    addGamepad(gamepad) {
        this.gamepad[gamepad.index] = gamepad;
    }
    
    /*
        Removes a gamepad from the GameController
    */
    removeGamepad(gamepad) {
        delete gamepad[gamepad.index];
    }
    
    /*
        Looks for changes in gamepad connects/disconnects and input updates
    */
    scanGamepads() {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (gamepads[i].index in this.gamepad) {
                    this.gamepad[gamepads[i].index] = gamepads[i];
                } else {
                    addGamepad(gamepads[i]);
                }
            }
        }
    }

    /*
        Updates internal game state
    */
    update() {
        // Get controller state
        for (let i in this.gamepad) {
            // Get updates from gamepad
            this.scanGamepads();
            // Ignore jitter
            let x1axis = Math.abs(this.gamepad[i].axes[0]) > CONTROLLER_DEADZONE ? this.gamepad[i].axes[0] : 0;
            let y1axis = Math.abs(this.gamepad[i].axes[1]) > CONTROLLER_DEADZONE ? this.gamepad[i].axes[1] : 0;
            //let x2axis = Math.abs(this.gamepad[i].axes[2]) > CONTROLLER_DEADZONE ? this.gamepad[i].axes[2] : 0;
            //let y2axis = Math.abs(this.gamepad[i].axes[3]) > CONTROLLER_DEADZONE ? this.gamepad[i].axes[3] : 0;
            let x2axis = this.gamepad[i].axes[2];
            let y2axis = this.gamepad[i].axes[3];
            // Set player speed
            this.player.vx = this.player.speed * x1axis;
            this.player.vy = this.player.speed * y1axis;
            // Set player aim
            if (x2axis || y2axis) {
                if (x2axis >= 0) {
                    this.player.aim = Math.atan(y2axis / x2axis);
                } else if (x2axis < 0) {
                    this.player.aim = Math.atan(y2axis / x2axis) + PI;
                }
            }
            if (this.gamepad[i].buttons[FIRE_BUTTON].pressed) {
                let b = this.player.fire();
                if (b) { this.entities.push(b); }
            }
        }
        
        for (let i = 0; i < this.entities.length; i++) {
            // Update each entity
            if (this.entities[i].update()) {
                this.entities[i].colliding = false;
                if (this.entities[i] instanceof Asteroid) {
                    if (this.entities[i].overlaps(this.player)) {
                        // Asteroid hits player
                        this.player.hp -= COLLISION_DAMAGE;
                        this.entities[i].colliding = true;
                        this.player.colliding = true;
                        this.entities.splice(i, 1);
                    }
                    for (let j = 0; j < this.entities.length; j++) {
                        if (this.entities[j] instanceof Bullet) {
                            if (this.entities[i].overlaps(this.entities[j])) {
                                // Bullet hit Asteroid
                                if (i > j) {
                                    this.entities.splice(i, 1);
                                    this.entities.splice(j, 1);
                                } else {
                                    this.entities.splice(j, 1);
                                    this.entities.splice(i, 1);
                                }
                                this.player.score += ASTEROID_SCORE;
                            }
                        }
                    }
                }
            } else {
                this.entities.splice(i, 1);
            }
        }
    }
    
    /*
        Draws game state to screen
    */
    draw() {
        // Clear screen
        this.context[1].clearRect(0, 0, this.width, this.height);
        // Draw entities
        for (var i=0; i < this.entities.length; i++) {
            this.entities[i].draw(this.context[1]);
        }
        // Draw healthbar
        this.context[3].clearRect(0, 0, this.width, this.height);
        this.context[3].fillStyle = "red";
        this.context[3].fillRect(this.width * 1 / 10 + HP_BORDER,
                                 this.height * 19 / 20 + HP_BORDER,
                                 (this.width * 4 / 5 - HP_BORDER*2) * this.player.hp / this.player.hpmax,
                                 this.height / 100 - HP_BORDER*2);
        // Draw score
        this.context[3].fillStyle = "black";
        this.context[3].globalAlpha = 1;
        this.context[3].font = "20px Arial";
        this.context[3].textAlign = "left";
        this.context[3].fillText(this.player.score, 10, this.height-20);
    }
    
    /*
        Adds a rectangle to the game
    */
    addAsteroid() {
        Game.entities.push(new Asteroid({"sizer": 15, "speed": 1, "color": "#444444", "bounds":{"right":this.width, "bottom":this.height}}));
    }
}

class Entity {
    constructor(args) {
        // Default arguments
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.ax = 0;
        this.ay = 0;
        this.color = "gray";
        this.elasticity = 0;
        this.cooldowns = {};
        this.bounds = {};
        // Load arguments
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
    }
    
    update() {
        // cooldowns
        for (let key of Object.keys(this.cooldowns)) {
            if (this.cooldowns[key]-- <= 0) {
                delete this.cooldowns[key];
            }
        }
        // x acceleration
        if (this.ax) {
            this.vx = Math.min(Math.max(this.vx + this.ax, -this.maxv), this.maxv);
        }
        // y acceleration
        if (this.ay) {
            this.vy = Math.min(Math.max(this.vy + this.ay, -this.maxv), this.maxv);
        }
        // x movement
        if (this.vx) {
            if (this.x + this.vx < this.bounds.left || this.x + this.vx > this.bounds.right) {
                if (this.x + this.vx < this.bounds.left) {
                    this.x = this.bounds.left - (this.x + this.vx - this.bounds.left) * this.elasticity;
                    this.vx = Math.abs(this.vx) * this.elasticity;
                    this.hitwallx = true;
                } else if (this.x + this.vx > this.bounds.right) {
                    this.x = this.bounds.right - (this.x + this.vx - this.bounds.right) * this.elasticity;
                    this.vx = -Math.abs(this.vx) * this.elasticity;
                    this.hitwallx = true;
                }
            } else {
                this.x += this.vx;
                this.hitwallx = false;
            }
        }
        // y movement
        if (this.vy) {
            if (this.y + this.vy < this.bounds.top || this.y + this.vy > this.bounds.bottom) {
                if (this.y + this.vy < this.bounds.top) {
                    this.y = this.bounds.top - (this.y + this.vy - this.bounds.top);
                    this.vy = Math.abs(this.vy) * this.elasticity * this.elasticity;
                    this.hitwally = true;
                } else if (this.y + this.vy > this.bounds.bottom) {
                    this.y = this.bounds.bottom - (this.y + this.vy - this.bounds.bottom) * this.elasticity;
                    this.vy = -Math.abs(this.vy) * this.elasticity;
                    this.hitwally = true;
                }
            } else {
                this.y += this.vy;
                this.hitwally = false;
            }
        }
        return true;
    }
    
    overlaps(other) {
        if (this instanceof RectEntity && other instanceof RectEntity) {
            const l1x = this.x - this.sizex / 2;
            const l1y = this.y - this.sizey / 2;
            const r1x = this.x + this.sizex / 2;
            const r1y = this.y + this.sizey / 2;
            const l2x = other.x - other.sizex / 2;
            const l2y = other.y - other.sizey / 2;
            const r2x = other.x + other.sizex / 2;
            const r2y = other.y + other.sizey / 2;
            if (l1x > r2x || l2x > r1x) { return false; }
            if (l1y > r2y | l2y > r1y) { return false; }
            return true;
        } else if (this instanceof CircleEntity && other instanceof RectEntity) {
            const dx = Math.abs(this.x - other.x);
            const dy = Math.abs(this.y - other.y);
            if (dx > other.sizex / 2 + this.sizer) { return false; }
            if (dy > other.sizey / 2 + this.sizer) { return false; }
            if (dx <= other.sizex / 2) { return true; }
            if (dy <= other.sizey / 2) { return true; }
            return (Math.pow(dx - other.sizex / 2, 2) + Math.pow(dy - other.sizey / 2, 2)) <= Math.pow(this.sizer, 2);
        } else if (this instanceof RectEntity && other instanceof CircleEntity) {
            const dx = Math.abs(other.x - this.x);
            const dy = Math.abs(other.y - this.y);
            if (dx > this.sizex / 2 + other.sizer) { return false; }
            if (dy > this.sizey / 2 + other.sizer) { return false; }
            if (dx <= this.sizex / 2) { return true; }
            if (dy <= this.sizey / 2) { return true; }
            return (Math.pow(dx - this.sizex / 2, 2) + Math.pow(dy - this.sizey / 2, 2)) <= Math.pow(other.sizer, 2);
        } else if (this instanceof CircleEntity && other instanceof CircleEntity) {
            if (Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2) <= Math.pow(this.sizer + other.sizer, 2)) {
                return true;
            }
            return false;
        }
    }
    
}

class RectEntity extends Entity {
    constructor(args) {
        // Default arguments
        args.sizex = 10;
        args.sizey = 10;
        // Load arguments
        super(args);
        // Calculate arguments
        this.bounds.left = this.sizex / 2;
        this.bounds.top = this.sizey / 2;
        this.bounds.right -= this.sizex / 2;
        this.bounds.bottom -= this.sizey / 2;
    }
    
    draw(context) {
        context.save();
        if (this.colliding) {
            context.fillStyle = "green";
        } else {
            context.fillStyle = this.color;
        }
        context.fillRect(this.x-this.sizex/2, this.y-this.sizey/2, this.sizex, this.sizey);
        context.restore();
    }
}

class CircleEntity extends Entity {
    constructor(args) {
        // Load arguments
        super(args);
        // Calculate arguments
        this.bounds.left = this.sizer;
        this.bounds.top = this.sizer;
        this.bounds.right -= this.sizer;
        this.bounds.bottom -= this.sizer;
    }
    
    draw(context) {
        context.save();
        if (this.colliding) {
            context.fillStyle = "green";
        } else {
            context.fillStyle = this.color;
        }
        context.beginPath();
        context.arc(this.x, this.y, this.sizer, 2*Math.PI, false);
        context.fill();
        context.restore();
    }
}

class Player extends CircleEntity {
    constructor(args) {
        super(args);
        this.hpmax = PLAYER_HP;
        this.hp = this.hpmax;
        this.score = 0;
    }
    
    update() {
        super.update();
        if (this.hp <= 0) {
            this.x = -1000;
            this.y = -1000;
            return false;
        }
        return true;
    }
    
    draw(context) {
        // Draw player
        super.draw(context);
        // Draw aiming line
        context.save();
        context.beginPath();
        context.moveTo(this.x + this.sizer*Math.cos(this.aim), this.y + this.sizer*Math.sin(this.aim));
        context.lineTo(this.x + BARREL_SIZE*Math.cos(this.aim), this.y + BARREL_SIZE*Math.sin(this.aim));
        context.stroke();
        context.restore();
    }
    
    fire() {
        if (this.cooldowns["fire"] === undefined) {
            this.cooldowns["fire"] = FIRE_COOLDOWN;
            return new Bullet({"x": this.x + BARREL_SIZE * Math.cos(this.aim),
                               "y": this.y + BARREL_SIZE * Math.sin(this.aim),
                               "vx": BULLET_SPEED * Math.cos(this.aim),
                               "vy": BULLET_SPEED * Math.sin(this.aim),
                               "sizer": 2,
                               "bounds": this.bounds});
        } else {
            return false;
        }
    }
}

class Bullet extends CircleEntity {
    constructor(args) {
        super(args);
        this.elasticity = 0;
    }
    
    update() {
        super.update();
        if (this.hitwallx || this.hitwally) {
            return false;
        } else {
            return true;
        }
    }
}

class Asteroid extends CircleEntity {
    constructor(args) {
        args.sizer = (Math.random() - 0.5) * 10 + 20;
        super(args);
        this.x = Math.floor(Math.random() * (this.bounds.right - this.bounds.left) + this.bounds.left);
        this.y = Math.floor(Math.random() * (this.bounds.bottom - this.bounds.top) + this.bounds.top);
        this.vx = Math.random() > 0.5 ? -this.speed : this.speed;
        this.vy = Math.random() > 0.5 ? -this.speed : this.speed;
        this.elasticity = 1;
    }
}

/*
    Stacked canvases for drawing on different layers
    @param {int} width Width of canvases
    @param {int} height Height of canvases
    @param {int} layers Number of layers
    @param {string} container ID of container element
    @param {string} id Style of canvas, postpended with index
    @param {string} class Classes added to each canvas
*/
class ZCanvas {
    constructor(args) {
        this.id = "zcanvas-";
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        this.canvas = [];
        for (let i=0; i<this.layers; i++) {
            let container = document.getElementById(this.container);
            let html = `<canvas `;
            if (this.id) {
                html += `id="${this.id}${i}" `;
            }
            if (this.class) {
                html += `class="${this.class}" `;
            }
            html += `style="z-index:${i}"></canvas>`;
            container.insertAdjacentHTML("beforeend", html);
            this.canvas[i] = document.getElementById(`${this.id}${i}`)
            this.canvas[i].width = this.width;
            this.canvas[i].height = this.height;
        }
    }
    getContext(index) {
        return this.canvas[index].getContext("2d");
    }
}

/*
    Rounds a float to a given number of decimal places
    @param {float} num Number to round
    @param {int} digits Number of digits to round to
*/
function roundTo(num, digits) {
    let mul = Math.pow(10, digits);
    return Math.round(num * mul) / mul;
}

/*
###############################################################################
###############################################################################
###############################################################################
*/

let Game = new GameController({"width":FIELD_WIDTH, "height":FIELD_HEIGHT, "layers":NUM_LAYERS});

// Add some moving rectangles
var i = NUM_ASTEROIDS;
while (i--) Game.addAsteroid();


/*
###############################################################################
###############################################################################
###############################################################################
*/

// Game loop in GameController
Game.run = (function() {
    let loops = 0;
    let skipTicks = 1000 / Game.fps;
    const maxFrameSkip = 10;
    let nextGameTick = (new Date).getTime();

    return function() {
        loops = 0;
        while ((new Date).getTime() > nextGameTick) {
            Game.update();
            nextGameTick += skipTicks;
            loops++;
        }
        Game.draw();
    };
})();

// Create game loop in window
var onEachFrame;
if (window.webkitRequestAnimationFrame) {
    onEachFrame = function(cb) {
        var _cb = function() {
            cb();
            webkitRequestAnimationFrame(_cb); }
        _cb();
    };
} else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
        var _cb = function() {
            cb();
            mozRequestAnimationFrame(_cb); }
        _cb();
    };
} else {
    onEachFrame = function(cb) {
        setInterval(cb, 1000 / 60);
    }
}
window.onEachFrame = onEachFrame;

window.onEachFrame(Game.run);