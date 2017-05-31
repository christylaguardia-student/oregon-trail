// namespace
var Oregon = Oregon || {};

Oregon.Caravan = {};

Oregon.Caravan.init = function(stats) {
  this.day = stats.day;
  this.distance = stats.distance;
  this.crew = stats.crew;
  this.food = stats.food;
  this.oxen = stats.oxen;
  this.money = stats.money;
  this.firepower = stats.firepower;
};

// update weight and capacity
Oregon.Caravan.updateWeight = function() {
  var droppedFood = 0;
  var droppedGuns = 0;

  // how much can the caravan carry
  this.capacity = this.oxen * Oregon.weightPerOx + this.crew * Oregon.weightPerPerson;

  // how much weight do we currently have
  this.weight = this.food * Oregon.weightFood + this.firepower * Oregon.weightFirePower;

  // drop things behind if it's too much weight
  while (this.firepower && this.capacity <= this.weight) {
    this.firepower--;
    this.weight -= Oregon.weightFirePower;
    droppedGuns++;
  }

  if (droppedGuns) {
    this.ui.notify('Left ' + droppedGuns + ' guns behind', 'negative');
    console.log('Left ' + droppedGuns + ' guns behind', 'negative');
  }

  while (this.food && this.capacity <= this.weight) {
    this.food--;
    this.weight -= Oregon.weightFood;
    droppedFood++;
  }

  if (droppedFood) {
    this.ui.notify('Left ' + droppedFood + ' food provisions behind', 'negative');
    console.log('Left ' + droppedFood + ' food provisions behind', 'negative');
  }
};

// update covered distance
Oregon.Caravan.updateDistance = function() {
  // the closer to capacity, the slower
  var diff = this.capacity - this.weight;
  var speed = Oregon.slowSpeed + diff/this.capacity * Oregon.fullSpeed;
  this.distance += speed;
};

// food consumption
Oregon.Caravan.consumeFood = function() {
  this.food -= this.crew * Oregon.foodPerPerson;

  if (this.food < 0) {
    this.food = 0;
  }
};
