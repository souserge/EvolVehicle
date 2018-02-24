class Car {
	constructor(x, y, simTime, DNA) {
		this.reset(x, y)
        this.color = color(random(256), random(256), random(256))

		if (DNA) {
			this.DNA = DNA
		} else {
			this.DNA = []
			for (let i = 0; i < simTime; i++) {
				this.DNA.push(new Genome())
			}
		}
    }
    
    reset(x, y) {
        this.pos  = createVector(x, y)		
        this.dir  = createVector(0, 1)
        
		this.angVel = 0
        this.speed  = 0

		this.fitness = -Infinity
		this.distInertialError = 0
		this.angVelInertialError = 0
    }
	
	update(timeIdx, dt) {
		let currGenome = this.DNA[timeIdx]
	
		this.speed += currGenome.thrust*dt
		this.angVel += currGenome.offset*dt

		this.speed = constrain(this.speed, -100, 100)
		this.angVel = constrain(this.angVel, -270, 270)
		
		let posChange = p5.Vector.mult(this.dir.normalize(), this.speed)
		let dirChange = radians(this.angVel)

		this.pos.add(posChange)
		this.dir.rotate(dirChange)
	}
	
	render() {	
		push()
		translate(this.pos.x, this.pos.y)
		rotate(this.dir.heading())
		rectMode(CENTER)

        strokeWeight(1)
        stroke(255)
		fill(this.color)
		rect(0, 0, 60, 30)
		pop()
    }
    
    highlight() {
		push()
		translate(this.pos.x, this.pos.y)
		fill('rgba(255,0,0, 0.5)');
        ellipse(0, 0, 70);
		pop()
    }

    copy(x, y) {
        let newCar = new Car(x,y, this.DNA.length, this.DNA.map(i => i))
        newCar.color = this.color
        return newCar
    }

    mutate(mutationProb) {
		this.DNA = this.DNA.map(gen => {
			let g = new Genome(gen.thrust, gen.offset)
            if (random(1) < mutationProb) {
                g.thrust += random(-4, 4)
            }

            if (random(1) < mutationProb) {
                g.offset += random(-15, 15)
			}
			return g
		})
    }
}

class Genome {
	constructor(thrust, offset) {
		this.thrust = thrust || random(-10, 10)
		this.offset = offset || random(-15, 15)
	}
}

class ParkingPlace {
	constructor(x, y, angle, wid, hei) {
		this.pos = createVector(x, y)
		this.heading = angle
		this.size = createVector(wid, hei)
	}

	render() {
		push()
		translate(this.pos.x, this.pos.y)
		rotate(radians(this.heading))
		rectMode(CENTER)
		stroke(255)
		fill(100,100,100)
		rect(0, 0, this.size.x, this.size.y)
		pop()
	}
}