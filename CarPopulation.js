class CarPopulation {
    constructor(popSize, mutationProb, parkingPlace, simTime) {
        this.currPopulation = []
        this.countGenerations = 0
        this.mutationProb = mutationProb
        this.target = parkingPlace
        this.populationSize = popSize
        this.simTime = simTime
        this.initFirstPopulation()
    }

    initFirstPopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            this.currPopulation.push(new Car(400, 400, simTime))
        }

        this.initPopParams()
    }

    initPopParams() {
        this.countGenerations++
        this.currTimeIdx = 0
    }


    simulate(dt) {
        if (this.currTimeIdx >= this.simTime) {
            this.generateNextPopulation()
            return false
        }

        for (let car of this.currPopulation) {
            car.update(this.currTimeIdx, dt)
            car.fitness = this.calcFitness(car)
            car.distInertialError += p5.Vector.dist(car.pos, this.target.pos)*this.currTimeIdx*dt
            car.angVelInertialError += abs(car.angVel)*this.currTimeIdx*dt
        }
        
        this.currTimeIdx++
        return true
    }

    render(showOnlyBest) {
        this.target.render()

        if (showOnlyBest) {
            this.currPopulation[0].render()
            return
        }

        let bestFitness = -Infinity
        let bestCar = null
        for (let car of this.currPopulation) {
            car.render()
            if (car.fitness >= bestFitness) {
                bestFitness = car.fitness
                bestCar = car
            }
        }
        bestCar.highlight()
    }

    generateNextPopulation() {
        let newPopulation = []

        const totalVal =
            this.currPopulation.reduce((sum, car) => sum + max(car.fitness, 0), 0)
        const fitnesses = this.currPopulation.map(car => {
            return {val: car.fitness/totalVal, car}
        }).sort((a, b) => b.val - a.val)
        console.log("Generation " + this.countGenerations + "; Best fitness: " + fitnesses[0].car.fitness)

        fitnesses[0].car.reset(400, 400)
        newPopulation.push(fitnesses[0].car)

        while (newPopulation.length < this.populationSize) {
            let newCar = this.selectFromPool(fitnesses).copy(400, 400)
            newCar.mutate(this.mutationProb)
            newPopulation.push(newCar)
        }

        this.currPopulation = newPopulation
        this.initPopParams()
    }

    selectFromPool(fitnesses) {
        let num = random(1)
        let currCar = null
        for (let fitness of fitnesses) {
            num -= fitness.val
            currCar = fitness.car
            if (num < 0) break
        }
        
        return currCar
    }


    calcFitness(car) {
        return 100000
            - p5.Vector.dist(car.pos, this.target.pos)
            - 100*abs(car.angVel)
            - 50*abs(car.dir.angleBetween(p5.Vector.fromAngle(radians(this.target.heading) + PI/2)))
            - 10*abs(car.speed)
            - 0.03*car.distInertialError
            - 0.1*car.angVelInertialError
    }
}