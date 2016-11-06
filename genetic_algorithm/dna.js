function DNA(num) {
  this.genes = [];
  this.fitnessVal = 0.0;

  for(var i = 0; i < num; i++) {
    this.genes[i] = String.fromCharCode(32+(Math.round(Math.random() * 96)));
  }

  this.fitness = function(target) {
    var score = 0;
    for(var i = 0; i < this.genes.length; i++) {
      if(this.genes[i] == target.charAt(i)) score++;
    }
    score *= score;
    this.fitnessVal = score / (target.length * target.length);
  }

  this.crossover = function(partner) {
    var child = new DNA(this.genes.length);
    var midpoint = Math.round(Math.random() * this.genes.length);
    for(var i = 0; i < this.genes.length; i++) {
      if(i > midpoint) child.genes[i] = this.genes[i];
      else child.genes[i] = partner.genes[i];
    }
    return child;
  }

  this.mutate = function(mutationRate) {
    for(var i = 0; i < this.genes.length; i++) {
      if(Math.random() < mutationRate) {
        this.genes[i] = String.fromCharCode(32+(Math.round(Math.random() * 96)));
      }
    }
  }

  this.getPhrase = function() {
    return this.genes.join('');
  }
}
