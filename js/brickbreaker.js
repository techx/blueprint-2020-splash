/** VARIABLES **/

// CONSTANTS
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

const vertBlocks = 5
const horizBlocks = 21
boxSize = () => { return logoRect.height / vertBlocks } // the dimension of the boxes the logo is cut into

// SVG ASSETS
let ballSvg = new Image()
ballSvg.src = ('../assets/svg/ball.svg')

let paddleSvg = new Image()
paddleSvg.src = ('../assets/svg/bar.svg')

let logoSvg = new Image()
logoSvg.src = ('../assets/svg/blueprintlogo.svg')

// GAME VARIABLES
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


let logoRect //dom rect object giving bounds of logo
logoTopX = () => {
	return logoRect.x - ((boxSize() * horizBlocks) - (logoRect.width)) / 2 
}

let brokenBlocks = []
let begAnimationTick = 0
let tickSpeed = 2

/** WINDOW FUNCTIONS **/
function startBrickGame() {
	for (var i = 0; i < vertBlocks; i++) {
		let row = []
		for (var j = 0; j < horizBlocks; j++) {  row.push(false) }
		brokenBlocks.push(row)
	}

		Array(5).fill(Array(21).fill(false))
	canvas = document.getElementById('brickerbreaker-canvas')
	context = canvas.getContext('2d')

	fixCanvasDim()
	resetGame()

  	setInterval(gameTick, 1000/framesPerSecond)
  	canvas.addEventListener('mousemove', updateMousePos)
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
	if (begAnimationTick <= (vertBlocks * horizBlocks) * tickSpeed) {
		begAnimationTick++
	}

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
	checkLogoCollision()
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

function checkLogoCollision() {
	// check whether we are inside the logo box
	if (checkInLogoBox()) {
		ballVy = -ballVy
	}
}

function checkLogoCollision() {
	const boxHeight = boxSize() * vertBlocks
	const boxWidth = boxSize() * horizBlocks
	console.log(ballY, logoRect.y)
	const yInBox = ballY + ballR > logoRect.y && ballY - ballR < logoRect.y + boxHeight
	const xInBox = ballX + ballR > logoTopX() && ballY - ballR < logoTopX() + boxWidth

	if (yInBox && xInBox) {
		ballVy = -ballVy
	}

	return yInBox && xInBox
}

function resetGame() {
	ballX = gameWidth/2
	ballY = ballCollisionH() - ballStartDeltaH

	paddleX = gameWidth/2

	ballVx = 0
	ballVy = 10
}

/** DRAWING **/
function drawScene() {
	context.clearRect(0, 0, canvas.width, canvas.height)
	drawLogo()

	//drawHighlightSquare()
	if (begAnimationTick < (vertBlocks * horizBlocks) * tickSpeed) {
		const thisRow = Math.floor(Math.floor(begAnimationTick / tickSpeed) / horizBlocks)
		const thisCol = Math.floor(begAnimationTick / tickSpeed) % horizBlocks
		//drawHighlightSquare(thisRow, thisCol)
	}

	drawPaddle()
	drawBall()
}

function drawHighlightSquare(row, col) {
	topX = logoTopX() + boxSize() * col
	topY = logoRect.y + boxSize() * row
	context.fillStyle = "#ffffff50"
	context.fillRect(topX, topY, boxSize(), boxSize())
}

function drawPaddle() {
	context.drawImage(ballSvg, ballDrawX(), ballDrawY(), ballR * 2, ballR * 2)
}

function drawBall() {
	context.drawImage(paddleSvg, paddleDrawX(), paddleDrawY(), paddleXR() * 2, paddleYR * 2)
}

function drawLogo() {
	// context.fillStyle = "black"
	// context.fillRect(logoTopX(), logoRect.y, boxSize() * horizBlocks, logoRect.height)
	context.drawImage(logoSvg, logoRect.x, logoRect.y, logoRect.width, logoRect.height)
}

