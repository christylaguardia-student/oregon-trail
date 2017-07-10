// namespace
var Oregon = Oregon || {};

// constants
Oregon.weightPerOx = 20;
Oregon.weightPerPerson = 2;
Oregon.weightFood = 0.6;
Oregon.weightFirePower = 5;
Oregon.gameSpeed = 800;
Oregon.dayPerStep = 0.2;
Oregon.foodPerPerson = 0.02;
Oregon.fullSpeed = 5;
Oregon.slowSpeed = 3;
Oregon.finalDistance = 1000;
Oregon.eventProbability = 0.15; //0.15; //15% chance that there will be a random event
Oregon.enemyFirePowerAvg = 5;
Oregon.enemyGoldAvg = 50;

Oregon.Game = {};

// initiate the game
Oregon.Game.init = function() {
  // references
  this.ui = Oregon.UI;
  this.eventManager = Oregon.Event;

  // setup the caravan
  this.caravan = Oregon.Caravan;
  this.caravan.init({
    day: 0,
    distance: 0,
    crew: 30,
    food: 80,
    oxen: 2,
    money: 300,
    firepower: 2
  });

  // pass references
  this.caravan.ui = this.ui;
  this.caravan.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.caravan = this.caravan;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.caravan = this.caravan;
  this.eventManager.ui = this.ui;

  // begin game
  this.startJourney();
};

// start the journey and time starts running
Oregon.Game.startJourney = function() {
  this.gameActive = true;
  this.previousGame = null;
  this.ui.notify('A great adventure begins!', 'positive');

  this.step();
};

$(document).keypress(function(event) {
  if (event.keyCode == 32) { // space bar
    alert('the user pressed the space bar');
  }
});

// game loop
Oregon.Game.step = function(timestamp) {
  
  // set the previousTime for the first time
  if(!this.previousTime) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  // time diff
  var progress = timestamp - this.previousTime;

  // update the game
  if (progress >= Oregon.gameSpeed) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  // QUESTION:
  if (this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

Oregon.Game.updateGame = function() {
  // day update
  this.caravan.day += Oregon.dayPerStep;

  // eat food
  this.caravan.consumeFood();

  // check if no more food
  if (this.caravan.food === 0) {
    this.ui.notify('Your caravan starved to death', 'negative');
    this.gameActive = false;
    return;
  }

  // update stats
  this.caravan.updateWeight();
  this.caravan.updateDistance();
  this.ui.refreshStats();

  // check if everyone dead
  if (this.caravan.crew <= 0) {
    this.caravan.crew = 0;
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  // check if game won
  if (this.caravan.distance >= Oregon.finalDistance) {
    this.ui.notify('You have returned home!', 'positive');
    alert('You won!');
    this.gameActive = false;
    return;
  }

  // randomly do random events
  if (Math.random() <= Oregon.eventProbability) {
    this.eventManager.generateEvent();
  }
};

Oregon.Game.pauseJourney = function() {
  this.gameActive = false;
};

Oregon.Game.resumeJourney = function() {
  this.gameActive = true;
  this.step();
}

// TODO:
window.onload = function() {
  Oregon.Game.init();
};
