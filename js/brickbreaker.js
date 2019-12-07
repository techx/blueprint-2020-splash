/** VARIABLES **/

// constants
let gameWidth = 0
let gameHeight = 0
const framesPerSecond = 50

const paddleDeltaH = 70 // distance paddle is above bottom of screen
const paddleAspect = 7.334 // aspect radtio of paddle asset
const paddleYR = 15 
paddleY = () => { return gameHeight - paddleDeltaH }
paddleXR = () => { // computed variable: "x radius" of the ball (i.e. width / 2)
	return paddleYR * paddleAspect
}

const ballR = 20
const ballStartDeltaH = 10 // start of ball in pixels above paddle

ballCollisionH = () => { // the y coordinate of the center of the ball that represents collision with the paddle
	return paddleY() - (paddleYR + ballR) 
}
paddleBottom = () => { return paddleY() + (paddleYR + ballR)}

let logoRect //dom rect object giving bounds of logo

// svg assets
let ballSvg = new Image()
ballSvg.src = ('../assets/svg/ball.svg')

let paddleSvg = new Image()
paddleSvg.src = ('../assets/svg/bar.svg')

// game variables
let canvas, context

let ballX, ballY

// get top corner of ball for drawing
ballDrawX = () => { return ballX - ballR }
ballDrawY = () => { return ballY - ballR }

let ballVx, ballVy

let paddleX

// get top corner of paddle for drawing
paddleDrawX = () => { return paddleX - paddleXR() }
paddleDrawY = () => { return paddleY() - paddleYR }

/** WINDOW FUNCTIONS **/
window.onload = function() {
	canvas = document.getElementById('brickerbreaker-canvas')
	context = canvas.getContext('2d')

	fixCanvasDim()
	resetGame()

  	setInterval(gameTick, 1000/framesPerSecond)
  	canvas.addEventListener('mousemove', updateMousePos);
}

window.onresize = function(event) {

	fixCanvasDim()
	//TODO: make sure nothing is out of bounds
}

function fixCanvasDim() {
	gameWidth =  window.innerWidth
	canvas.width = gameWidth
	gameHeight = window.innerHeight
	canvas.height = gameHeight

	const homeElem = document.getElementById('home')
	homeElem.style.display = 'block'
	logoRect = document.getElementById('main-logo').getBoundingClientRect()
	homeElem.style.display = 'none'
}

function gameTick() {
	positionUpdate()
	drawScene()
}

function updateMousePos(event){
	var rect = canvas.getBoundingClientRect();
  	var root = document.documentElement;

 	mouseX = event.clientX - rect.left - root.scrollLeft;
  	mouseY = event.clientY - rect.top - root.scrollTop;

  	//check that in bound
  	mouseX = Math.min(Math.max(paddleXR(), mouseX), gameWidth - paddleXR())
  	paddleX = mouseX
}

/** GAME UPDATES **/
function positionUpdate() {
	updateBall()
}

function updateBall() {
	// update position based on velocity
	ballX += ballVx
	ballY += ballVy

	// check for collision
	updateBounds()
	updatePaddleCollision()
}

function updateBounds() {
	if (ballY >= gameHeight) {
		//lost game
		resetGame()
	} else if (ballY <= 0) {
		ballVy = -ballVy
	} else if (ballX <= 0 || ballX >= gameWidth) {
		ballVx = -ballVx
	}
}

function updatePaddleCollision() {
	ballYCollides = ballY >= ballCollisionH() && ballY <= paddleBottom()

	ballXCollides = (ballX + ballR >= paddleX - paddleXR()) && (ballX - ballR <= paddleX + paddleXR())
	if (ballXCollides && ballYCollides) {
		// update y
		ballY = ballCollisionH()
		ballVy = -ballVy

		// update x
		distFromMiddle = ballX - paddleX
		ballVx = 0.1 * distFromMiddle
	}
}

function resetGame() {
	ballX = gameWidth/2
	ballY = 0 //ballCollisionH() - ballStartDeltaH

	paddleX = gameWidth/2

	ballVx = 0
	ballVy = 10
}

/** DRAWING **/
function drawScene() {
	context.clearRect(0, 0, canvas.width, canvas.height)

	drawPaddle()
	drawBall()
}

function drawPaddle() {
	context.drawImage(ballSvg, ballDrawX(), ballDrawY(), ballR * 2, ballR * 2)
}

function drawBall() {
	context.drawImage(paddleSvg, paddleDrawX(), paddleDrawY(), paddleXR() * 2, paddleYR * 2)
}


