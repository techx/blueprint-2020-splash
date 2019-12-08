/** VARIABLES **/
console.log("hi")
// CONSTANTS
let gameWidth = 0
let gameHeight = 0
const framesPerSecond = 50

const paddleDeltaH = 70 // distance paddle is above bottom of screen
const paddleAspect = 7.334 // aspect radtio of paddle asset
const paddleYR = 10 
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
let score = 0

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

let animationTick = 0
let animationRepeat = 3
let animationInterval = 17
let animationOn = 6

/** WINDOW FUNCTIONS **/
function startBrickGame() {
	for (var i = 0; i < vertBlocks; i++) {
		let row = []
		for (var j = 0; j < horizBlocks; j++) {  row.push(false) }
		brokenBlocks.push(row)
	}

	canvas = document.getElementById('brickerbreaker-canvas')
	context = canvas.getContext('2d')

	fixCanvasDim()
	resetGame()

	animationTick = 0

  	setInterval(gameTick, 1000/framesPerSecond)
  	canvas.addEventListener('mousemove', updateMousePos)
}

function resetBricks() {
	brokenBlocks = []
	const topIncluded = [0,1,3,14,15,19]
	const bottomIncluded = [10]
	for (let i = 0; i < vertBlocks; i++) {
		let row = []
		for (let j = 0; j < horizBlocks; j++) {  
			console.log(i, j, (i == 0 && !topIncluded.includes(j)))
			if ((i == 0 && !topIncluded.includes(j)) || (i == vertBlocks-1 && !bottomIncluded.includes(j))) {
				console.log("hiiiii")
				row.push(true) 
			} else {
				row.push(false)
			}
		}
		brokenBlocks.push(row)
	}
}

function resetGame() {
	resetBricks()

	ballX = gameWidth/2
	ballY = ballCollisionH() - ballStartDeltaH

	paddleX = gameWidth/2

	ballVx = 0
	ballVy = 10
	console.log(brokenBlocks)
}

window.onresize = function(event) {
	fixCanvasDim()
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
	animationTick++

	positionUpdate()
	drawScene()
}

function updateMousePos(event){
	var rect = canvas.getBoundingClientRect();
  	var root = document.documentElement;

 	mouseX = event.clientX - rect.left - root.scrollLeft;
  	mouseY = event.clientY - rect.top - root.scrollTop;

  	//check that in bounds
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
	updateBoxes() //checkLogoCollision()
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

function updateBoxes() {
	const boxHeight = boxSize() * vertBlocks
	const boxWidth = boxSize() * horizBlocks
	const yInBox = ballY + ballR > logoRect.y && ballY - ballR < logoRect.y + boxHeight
	const xInBox = ballX + ballR > logoTopX() && ballY - ballR < logoTopX() + boxWidth

	if (yInBox && xInBox) {
		let flips = [0, 0]
		brokenBlocks.forEach((row, r_index) => {
			row.forEach((broken, c_index) => {
				//check whether block is there
				if (!broken) {
					let blockTopX = logoTopX() + boxSize() * c_index
					let blockTopY = logoRect.y + boxSize() * r_index
					let rect = rectInCircle(ballX, ballY, ballR, blockTopX, blockTopY, boxSize())
					if (rect !== null) {
						brokenBlocks[r_index][c_index] = true
						score += 1
						//update which ones to flip
						if (flips[0] == flips[1]) {
							flips = rect
						}

					}
				}
			})
		})

		//console.log(flips)

		if (flips[0] == 1) {
			ballVx = - ballVx
		}
		if (flips[1] == 1) {
			ballVy = - ballVy
		}
	}
}

/** GEOMETRY **/
function rectInCircle(cx, cy, rad, x, y, width) {
	let res = [vertLineIntCircle(cx, cy, width, x, y, rad), vertLineIntCircle(cx, cy, width, x + width, y, rad), horizLineIntCircle(cx, cy, width, x, y, rad), horizLineIntCircle(cx, cy, width, x, y + width, rad)]
	for (let i = 0; i < res.length; i++) {
		if (res[i] !== null) {
			return res[i]
		}
	}

	const corners = [[0, 0], [0, 1], [1, 0], [1, 1]]
	for (let i = 0; i < corners.length; i++) {
		corner = corners[i]

		const xCoord = x + corner[0] * width
		const yCoord = y + corner[1] * width

		let inCircle = pointInCircle(xCoord, yCoord, cx, cy, rad)
		if (inCircle !== null) {
			return inCircle
		}
	}

	return pointInGridCell(cx, cy, x, y, width)
}

function vertLineIntCircle(cx, cy, width, x, y, rad) {
	if (Math.abs(cx - x) <= rad && (y < cy && y + width >= cy)) {
		// flip just x
		return [1, 0]
	}
	return null
}

function horizLineIntCircle(cx, cy, width, x, y, rad) {
	if (Math.abs(cy - y) <= rad && (x < cx && x + width >= cx)) {
		// flip just y
		return [0, 1]
	}
	return null
}

function pointInGridCell(xCoord, yCoord, x, y, width) {
	let xInside = xCoord >= x && xCoord <= x + width
	let yInside = yCoord >= y && yCoord <= y + width
	if (xInside && yInside) {
		// flip both x and y
		return [1, 1]
	}
	return null
}

function pointInCircle(x, y, cx, cy, radius) {
	let dist = Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2))
	if (dist <= radius) {
		// flip both x and y
		return [1, 1]
	}
	return null
}

/** DRAWING **/
function drawScene() {
	context.clearRect(0, 0, canvas.width, canvas.height)
	drawLogo()
	clearSquares()

	context.clearRect(logoTopX(), logoRect.y + boxSize() * (vertBlocks), boxSize() * horizBlocks, 10)

	if (animationTick % animationInterval <= animationOn) {
		drawGrid()
	}

	drawPaddle()
	drawBall()
}

function clearSquares() {
	brokenBlocks.forEach((row, r_index) => {
		row.forEach((broken, c_index) => {
			if (broken) {
				clearSquare(r_index, c_index)
			}
		})
	})
}

function drawGrid() {
	brokenBlocks.forEach((row, r_index) => {
		row.forEach((broken, c_index) => {
			if (!broken) {
				context.lineWidth = 1
				context.strokeStyle = '#ffffff'
				strokeSquare(r_index, c_index)
			}
		})
	})
}

function drawSquare(row, col) {
	topX = logoTopX() + boxSize() * col
	topY = logoRect.y + boxSize() * row
	context.fillRect(topX, topY, boxSize(), boxSize())
}

function strokeSquare(row, col) {
	topX = logoTopX() + boxSize() * col
	topY = logoRect.y + boxSize() * row
	context.strokeRect(topX, topY, boxSize(), boxSize())
}

function clearSquare(row, col) {
	topX = logoTopX() + boxSize() * col
	topY = logoRect.y + boxSize() * row
	context.clearRect(topX, topY, boxSize(), boxSize())
}


function drawPaddle() {
	context.drawImage(ballSvg, ballDrawX(), ballDrawY(), ballR * 2, ballR * 2)
}

function drawBall() {
	context.drawImage(paddleSvg, paddleDrawX(), paddleDrawY(), paddleXR() * 2, paddleYR * 2)
}

function drawLogo() {
	context.drawImage(logoSvg, logoRect.x, logoRect.y, logoRect.width, logoRect.height)
}

