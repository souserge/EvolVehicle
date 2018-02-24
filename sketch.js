// Parameters
let population = 200
let mutationProb = 0.001
let oneMeter = 40 //pixels
let dt = 0.04
let simTime = 400

let speed = 1
let showOnlyBest = false
let doRender = true

function setup() {
	  createCanvas(20*oneMeter, 20*oneMeter)
	  let parkingPlace = new ParkingPlace(7*oneMeter, 4*oneMeter, 0, oneMeter, 2*oneMeter)
	  carPop = new CarPopulation(population, mutationProb, parkingPlace, simTime)
}

function draw() {
	background(0)

	for (let i = 0; i < speed; i++) {
		carPop.simulate(dt)
	}

	if (doRender) carPop.render(showOnlyBest)
}

function mousePressed() {
	noLoop()
}
  
function mouseReleased() {
	loop()
}

function keyPressed() {
	switch(keyCode) {
		case 189:
			speed--
			break
		case 187:
			speed++
			break
		case 66:
			showOnlyBest = !showOnlyBest
			break
		case 49:
			speed = 1
			doRender = true
			break
		case 50:
			speed = simTime
			break
		case 51:
			speed = 1000
			doRender = false
			break
		case 82:
			doRender = !doRender
			break
	}

	console.log("Speed: " + speed)
} 