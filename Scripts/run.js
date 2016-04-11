var distance = 4;
var gameStatus = 1;
var me = new Barbarian();
var enemy = new Barbarian();
var regMe = setInterval(me.regeneration.bind(me), 5000);
var regEnemy = setInterval(enemy.regeneration.bind(enemy), 5000);
var elem = document.getElementById('input');

elem.onkeydown = function(event) {
	if(event.keyCode == 13) {
		target = input.value;
		input.value = '';
		if(gameStatus) {
			return me.strLoader(target);
		}
		
	}
}

var dist = document.getElementById('dist');
dist.innerHTML = '<b style="font-size:25px">' + distance + '</b>';
var divs = document.querySelectorAll('.num');
var arr = [me.maxhealth, me.maxenergy, me.maxstamina, enemy.maxhealth, enemy.maxenergy, enemy.maxstamina];
for(var i=0; i<arr.length/2; i++) {
	divs[i].innerHTML = arr[i];
}

for(var i=3; i<arr.length; i++) {
	divs[i].innerHTML = arr[i];
}

me.reloadPlacer();
