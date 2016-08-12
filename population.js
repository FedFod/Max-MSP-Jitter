include("dna");

function Population(p, m, num) {
  this.mutationRate = m;
  this.totalPopulation = 150;

  this.population = [];
  this.matingPool = [];
  this.target = p;
  this.generations = 0;
  this.finishedVal = false;
  this.perfectScore = 1;

  for(var i = 0; i < num; i++) {
    this.population.push(new DNA(this.target.length));
  }

  this.calcFitness = function() {
    for(var i = 0; i < this.population.length; i++) {
        this.population[i].fitness(this.target);
    }
  }

  this.calcFitness();

  this.naturalSelection = function() {
    this.matingPool = [];

    var maxFitness = 0.0;
    for(var i = 0; i < this.population.length; i++) {
      if(this.population[i].fitnessVal > maxFitness) {
        maxFitness = this.population[i].fitnessVal;
      }
    }

    for(var i = 0; i < this.population.length; i++) {
      // Normalizzazione
      var fitness = map(this.population[i].fitnessVal, 0, maxFitness, 0, 1);
      // Fill the mating pool
      var n = Math.round(fitness*100);
      for(var j = 0; j < n; j++) {
        this.matingPool.push(this.population[i]);
      }
    }
  }

  this.generate = function() {
    for(var i = 0; i < this.population.length; i++) {
      var a = Math.round(Math.random() * this.matingPool.length);
      var b = Math.round(Math.random() * this.matingPool.length);
      while(a == b)
        b = Math.round(Math.random() * this.matingPool.length);
      var parentA = this.matingPool[a];
      var parentB = this.matingPool[b];
      var child = parentA.crossover(parentB);
      child.mutate(mutationRate);
      this.population[i] = child;
    }
    this.generations++;
  }

  this.getBest = function() {
    var worldRecord = 0.0;
    var index = 0;
    for(var i = 0; i < this.population.length; i++) {
      if(this.population[i].fitnessVal > worldRecord) {
        index = i;
        worldRecord = this.population[i].fitnessVal;
      }
    }
    if(worldRecord == this.perfectScore) this.finishedVal = true;
    return this.population[index].getPhrase();
  }

  this.finished = function() {
    return this.finishedVal;
  }

  this.getGenerations = function() {
    return this.generations;
  }

  this.getAverageFitness = function() {
    var total = 0;
    for(var i = 0; i < this.population.length; i++) {
      total += this.population[i].fitnessVal;
    }
    return total / this.population.length;
  }

  this.allPhrases = function() {
    var everything = "";
    var displayLimit = Math.min(this.population.length, 50);
    for(var i = 0; i < this.population.length; i++) {
      everything += this.population[i].getPhrase() + "\n";
    }
    return everything;
  }
}
