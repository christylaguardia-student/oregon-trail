var Oregon = Oregon || {};

Oregon.UI = {};

// show a notification in the message area
Oregon.UI.notify = function(message, type) {
  console.log(message, type);
  // $('#updates-area').prepend('<p class="update-' + type + '">Day '+ Math.ceil(this.caravan.day) + ': ' + message + '</p>');
  $('#updates-area').append('<p class="update-' + type + '">Day '+ Math.ceil(this.caravan.day) + ': ' + message + '</p>');
};

// refresh the visual caravan stats
Oregon.UI.refreshStats = function() {
  // console.log('caravan', this.caravan);
  // modify the document
  $('#stat-day').text(Math.ceil(this.caravan.day));
  $('#stat-distance').text(Math.floor(this.caravan.distance) + ' miles');
  $('#stat-crew').text(this.caravan.crew);
  $('#stat-oxen').text(this.caravan.oxen);
  $('#stat-food').text(Math.ceil(this.caravan.food) + ' lbs.');
  $('#stat-money').text('$' + this.caravan.money);
  $('#stat-firepower').text(this.caravan.firepower);
  $('#stat-weight').text(Math.ceil(this.caravan.weight) + '/' + this.caravan.capacity);

  // TODO: change from pixles
  $('#caravan').css({ left: (638 * this.caravan.distance/Oregon.finalDistance) + 'px'})
};

Oregon.UI.showShop = function(products) {
  // $('#shop').removeClass('hidden');
  var shopDiv = document.getElementById('shop');
  shopDiv.classList.remove('hidden');

  if (!this.shopInitiated) {
    // $('#shop').on('click', function(e) {
    // TODO: does not work with jquery
    shopDiv.addEventListener('click', function(e){
      var target = e.target || e.src;
      if (target.tagName == 'BUTTON') {
        // $ ('#shop').addClass('hidden');
        shopDiv.classList.add('hidden');
        Oregon.UI.game.resumeJourney();
      } else if (target.tagName == 'DIV' && target.className.match(/product/)) {
        console.log('buying');
        var bought = Oregon.UI.buyProduct({
          item: target.getAttribute('data-item'),
          qty: target.getAttribute('data-qty'),
          price: target.getAttribute('data-price')
        });
        if (bought) target.html = '';
      }
    });
    this.shopInitiated = true;
  }

  // $('#prods').val('');
  //clear existing content
  var prodsDiv = document.getElementById('prods');
  prodsDiv.innerHTML = '';

  // show shop products
  var product;
  for (var i=0; i<products.length; i++) {
    product = products[i];
    // $('#prods').html('<div class="product" data-qty="' + product.qty + '" data=price"' + product.price + '">' + product.item + ' - $' + product.price + '</div>');
    prodsDiv.innerHTML += '<p class="product" data-qty="' + product.qty + '" data-item="' + product.item + '" data-price="' + product.price + '">' + product.qty + ' ' + product.item + ' - $' + product.price + '</p>';
  }
};

Oregon.UI.buyProduct = function(product) {
  // check if have enough money
  if (product.price > Oregon.UI.caravan.money) {
    Oregon.UI.notify('Not enough money', 'negative');
    return false;
  }
  Oregon.UI.caravan.money -= product.price;
  Oregon.UI.caravan[product.item] += +product.qty;
  Oregon.UI.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');
  Oregon.UI.caravan.updateWeight();
  Oregon.UI.refreshStats();
  return true;
};

Oregon.UI.showAttack = function(firepower, gold) {
  // show the div
  $('#attack').removeClass('hidden');

  this.firepower = firepower;
  this.gold = gold;

  // show firepower
  $('#attack-description').html('Firepower: ' + firepower);

  // handle user's input
  if(!this.attackInitiated) {
    $('#fight').click(this.fight.bind(this));
    $('#runaway').click(this.runaway.bind(this));
    this.attackInitiated = true;
  }
};

Oregon.UI.fight = function() {
  var firepower = this.firepower;
  var gold = this.gold;

  var damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.caravan.firepower));

  // check for suvivors
  if (damage < this.caravan.crew) {
    this.caravan.crew -= damage;
    this.caravan.money += gold;
    this.notify(damage + ' people were killed fighting.', 'negative');
    this.notify('Found $' + gold, 'gold');
  } else {
    this.caravan.crew = 0;
    this.notify('Everybody died in the fight', 'negative');
  }

  $('#attack').addClass('hidden');
  this.game.resumeJourney();
};

Oregon.UI.runaway = function() {
  var firepower = this.firepower;
  var damage = Math.ceil(Math.max(0, firepower * 2 * Math.random()/2));

  // check for suvivors
  if (damage < this.caravan.crew) {
    this.caravan.crew -= damage;
    this.notify(damage + ' people were killed running.', 'negative');
  } else {
    this.caravan.crew = 0;
    this.notify('Everybody died running away', 'negative');
  }

  // resume
  $('#attack').addClass('hidden');
  this.game.resumeJourney();
};
