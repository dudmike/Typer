//----------Hero class start-----------
function Hero() {
	this.player1_start_position = '10px';
	this.player2_start_position = '910px';
	this.heal_energy_cost = 25;
	this.heal_cooldown = 10000;
	this.dash_stamina_cost = 50;
	this.run_stamina_cost = 50;
	this.classDefiner = 1;
	this.heal_enabled = 1;
	this.eventObj = {};
}

Hero.prototype.heal = function() {
	if(this.heal_enabled) {
		if(this.energy < this.heal_energy_cost) {
			return this.eventObj.heal = 'Not enough energy for playing doctors';
		}
		this.energy -= this.heal_energy_cost;

		var table_row;
		(this == me) ? table_row = document.querySelectorAll('.HUD')[0].rows[1]:
		table_row = document.querySelectorAll('.HUD')[1].rows[1];				
		this.hud_changer(table_row, this.heal_energy_cost, this.maxenergy, this.energy);
		
		var hp = this.maxhealth - this.health;
		this.eventObj.heal = 
		'You laid hands and got better by: '+
		'<span style="color:green;font-family:Verdana;font-size:20px">' + hp + '</span> points.';

		this.health = (this.classDefiner ==1)? 150: 
		(this.classDefiner ==2)? 80: 50;
		var self = this;
		var table;
		self == me? table = document.querySelectorAll('.HUD')[0]:
		table = document.querySelectorAll('.HUD')[1];

		table.rows[0].querySelector('div[class $="bar"]').style.width ='100%';
		table.querySelectorAll('div[class="num"]')[0].innerHTML = self.maxhealth;

		this.animate(function(timePassed) {
			return me.reload_changer(timePassed, 1, 10000);
		}, 10000)

		

		setTimeout(function() {
			self.heal_enabled = 1;
		}, 10000)
		self.heal_enabled = 0;
	} else this.eventObj.heal = 'It\'s reloading...';
			 	
}

Hero.prototype.hud_changer = function(tbl_row, dmg, max_val, property) {
	if(!gameStatus) return;
	var bar = tbl_row.querySelector('div[class $="bar"]');
	if(me.health <=0 || enemy.health <=0) {
		bar.style.width = '0%';
		tbl_row.querySelector('div[class="num"]').innerHTML = 0;			
	} else {
		var percentage =   property*100/ max_val;
		bar.style.width = percentage + '%';
		tbl_row.querySelector('div[class="num"]').innerHTML = Math.round(property);
	}

	if(this ==  me) {
		if(property < 0) {
			tbl_row.querySelector('div[class="animated"]').innerHTML = '-' + (dmg + property);
		} else {

			tbl_row.querySelector('div[class="animated"]').innerHTML = '-' + dmg;
		}
	}
	
	
	this.animate(function(timePassed) {
		tbl_row.querySelector('div[class="animated"]').style.opacity = (2000  -  timePassed)/1000 + '';
	}, 2000)
}

Hero.prototype.animate = function(draw, duration) {
	var start = performance.now();

	requestAnimationFrame(function animate(time) {
		var timePassed = time - start;

		if(timePassed > duration) timePassed = duration;
		draw(timePassed);

		if(timePassed < duration) {
			requestAnimationFrame(animate);
		}	
	});
}

Hero.prototype.getCoords = function(elem) {
	return elem.getBoundingClientRect();
}

Hero.prototype.positionChange = function(changeVal) {
	if(distance >= 4 && changeVal > 0) return;

	var player2 = document.getElementById('player2');
	var player1 = document.getElementById('player1');

	var attackWidth = this.attackWidth(),
		player1_left = this.getCoords(player1).left,
		player2_left = this.getCoords(player2).left,
		player1_start_position = this.player1_start_position,
		player2_start_position = this.player2_start_position,
		difference = player2_left - player1_left,
		step = (animation_container.clientWidth - attackWidth - player1.offsetWidth)/ 3;

	if(player1.style.left== '' && player2.style.left == '' || distance == 4)	{
		player1.style.left = player1_start_position;
		player2.style.left = player2_start_position;
	}
		
	if(this == me) {		
		var position = player1_left + attackWidth  + changeVal;
		if(position >= parseInt(player2.style.left) ) {
			player1.style.left = (parseInt(player2.style.left)- attackWidth) + 'px';
		} else if(player1_left + changeVal < parseInt(player1_start_position)) {
			
			if(difference >= 2 * step) {
				player1.style.left = player1_start_position;
			} else {
				player1.style.left = (parseInt(player2_start_position)  - difference + changeVal) + 'px';
				player2.style.left = player2_start_position;	
			}
			
		} else if(distance == 3 && changeVal > 0) {
			player1.style.left = step + 10 + 'px';
		} 

		else {
			player1.style.left = player1_left  + changeVal + 'px';
		}
		
	} else {
		var position = player2_left - changeVal;

		if(position <= parseInt(player1.style.left) + attackWidth) {
			player2.style.left = (parseInt(player1.style.left) + attackWidth) + 'px';
		} else if(player2_left - changeVal > parseInt(player2_start_position)) {
			
			if(difference > 2 * step) {
				
				player2.style.left = player2_start_position;
			} else {

				player2.style.left = (parseInt(player1_start_position) + difference - changeVal) + 'px';
				player1.style.left = player1_start_position;
			}
		} else if(distance == 3 && changeVal > 0) {
			
			player2.style.left =  parseInt(player2_start_position)-step + 'px';
		}

		else {
			
			player2.style.left = player2_left - changeVal + 'px';
		}
	}
	
	
}

Hero.prototype.walk = function() {	
	distance--;
	this.showDistance();
	if(distance < 1) {
		distance = 1;
		this.showDistance();
	}
	this.positionChange(257);
}

Hero.prototype.dash = function() {		
	distance--;
	distance--;
	this.showDistance();
	this.stamina -= this.dash_stamina_cost;
	var table_row;
	(this == me) ? table_row = document.querySelectorAll('.HUD')[0].rows[2]:
	table_row = document.querySelectorAll('.HUD')[1].rows[2];				
	this.hud_changer(table_row, this.dash_stamina_cost, this.maxstamina, this.stamina);

	if(distance < 1) {
		distance = 1;
		this.showDistance();
	}
	this.positionChange(514);
}

Hero.prototype.run = function() {
	distance++;
	distance++;
	this.showDistance();
	this.stamina -= this.run_stamina_cost;
	var table_row;
	(this == me) ? table_row = document.querySelectorAll('.HUD')[0].rows[2]:
	table_row = document.querySelectorAll('.HUD')[1].rows[2];				
	this.hud_changer(table_row, 25, this.maxstamina, this.stamina);
	this.positionChange(-514);
}

Hero.prototype.back = function() {
	distance++;
	this.showDistance();
	this.positionChange(-257);
}

Hero.prototype.regeneration = function() {
	if(gameStatus != 1) return;

	var self = this;
	var current_val_array = [self.health, self.energy, self.stamina];
	var max_val_array = [self.maxhealth, self.maxenergy, self.maxstamina];

	for(var i=0; i<current_val_array.length; i++) {
		if(current_val_array[i] >= max_val_array[i]) continue;

		var table;
		self == me? table = document.querySelectorAll('.HUD')[0]:
		table = document.querySelectorAll('.HUD')[1];

		current_val_array[i] += max_val_array[i]*5/100;
		i==0? self.health = current_val_array[i]: i==1? self.energy = current_val_array[i]:
		self.stamina = current_val_array[i];
		
		var percentage = current_val_array[i]*100/max_val_array[i];
		table.rows[i].querySelector('div[class $="bar"]').style.width = percentage + '%';
		table.querySelectorAll('div[class="num"]')[i].innerHTML = Math.round(current_val_array[i]);
		if(current_val_array[i] > max_val_array[i]) {
			table.querySelectorAll('div[class="num"]')[i].innerHTML = max_val_array[i];
			i==0? self.health = max_val_array[i]: i==1? self.energy = max_val_array[i]:
			self.stamina = max_val_array[i];
		}
	}
	
}

Hero.prototype.end = function() {
	var button = document.createElement('button');
	
	button.innerHTML = 'Start new';
	
	button.addEventListener('click', function() {
		clearInterval(regMe);
		clearInterval(regEnemy);
		gameStatus = 1;
		distance = 4;
 		me = new Barbarian();
		enemy = new Barbarian();
		log_container.innerHTML = '';
		var bars = document.querySelectorAll('div[class $="bar"]');
		for(var i=0; i<bars.length; i++) {
			bars[i].style.width= '100%';
		}

		var dist = document.getElementById('dist');
		dist.innerHTML = 'Distance: ' + '<b style="font-size:25px">' + distance + '</b>';
		var divs = document.querySelectorAll('.num');
		var arr = [me.maxhealth, me.maxenergy, me.maxstamina, enemy.maxhealth, enemy.maxenergy, enemy.maxstamina];
		for(var i=0; i<arr.length/2; i++) {
			divs[i].innerHTML = arr[i];
		}

		for(var i=3; i<arr.length; i++) {
			divs[i].innerHTML = arr[i];
		}
		 regMe = setInterval(me.regeneration.bind(me), 5000);
		 regEnemy = setInterval(enemy.regeneration.bind(enemy), 5000);

		 player1.style.left = me.player1_start_position;
		 player2.style.left = enemy.player2_start_position;

		 me.reloadPlacer();
		document.body.removeChild(document.querySelector('.endBlock'));
		
	});
	
	var abilities = document.querySelectorAll('.ability');
	if(enemy.health <= 0) {
		var div = document.createElement('div');
		div.style.bottom = '200px';
		div.style.right =window.innerWidth/2 + 'px';
		div.innerHTML = 'Victory<br>';
		div.setAttribute('class', 'endBlock');
		div.appendChild(button);
		document.body.insertBefore(div, animation_container);
		this.eventObj.end = 'Passionately swinging with your sword,  you win this battle';
		this.showEvent(this.eventObj.end);
		
		for(var i=0; i<abilities.length; i++) {
			document.body.removeChild(abilities[i]);
		}
		gameStatus = 0;
		 
	} else if(me.health <=0) {
		var div = endPlacer();
		div.innerHTML = 'Defeat<br>';
		div.setAttribute('class', 'endBlock');
		div.appendChild(button);
		document.body.insertBefore(div, animation_container);
		this.eventObj.end = 'You were good, but destiny is cruel...';
		this.showEvent(this.eventObj.end);
		for(var i=0; i<abilities.length; i++) {
			document.body.removeChild(abilities[i]);
		}
		gameStatus = 0;	
	}
}

Hero.prototype.reloadPlacer = function() {
	var currentImg = document.body.querySelectorAll('div[id="status_container"] img');

	for(var i=0; i< currentImg.length; i++) {
		var div = document.createElement('div');
		div.setAttribute('class', 'ability');
		div.style.left = this.getCoords(currentImg[i]).left + 'px';
		div.style.top = this.getCoords(currentImg[i]).top + 'px';
		document.body.appendChild(div);
	}
}

Hero.prototype.attackRender = function() {
	var parentDiv = document.createElement('div');
	var whiteDiv = document.createElement('div');
	whiteDiv.setAttribute('class', 'attack_animation_render');
	parentDiv.appendChild(whiteDiv);
	if(this == me) {
		var player1 = this.getCoords(document.getElementById('player1'));
		parentDiv.style.left = player1.left + 'px';

	} else {
		var player2= this.getCoords(document.getElementById('player2'));
		parentDiv.style.left = (player2.left - (this.attackWidth() - document.getElementById('player1').offsetWidth) )  + 'px';
	}		
	
	parentDiv.setAttribute('class', 'attack_animation_block');
	document.body.appendChild(parentDiv);
	if(document.querySelectorAll('.attack_animation_block').length == 2) {
		document.body.removeChild(document.querySelectorAll('.attack_animation_block')[0]);
	}
}

Hero.prototype.reload_changer = function(time, index, duration) {
	var Img = document.body.querySelectorAll('div[id="status_container"] img')[index];
	var reloader = document.querySelectorAll('.ability')[index];
	var difference = Img.offsetHeight - reloader.offsetHeight;
	reloader.style.top = this.getCoords(Img).top+ difference + window.pageYOffset + 'px';
	var delimiter = duration/Img.offsetHeight;
	reloader.style.height =  (duration - time)/delimiter + 'px';
}

Hero.prototype.showDistance = function() {
	var p = document.getElementById('dist');
	p.innerHTML = 'Distance: ' + '<b style="font-size:25px">'+ distance +'</b>' ;
}

Hero.prototype.showEvent = function(prop) {
	if(!gameStatus) return;
	var text = prop;
	var p = document.createElement('p');
	p.innerHTML = text;
	log_container.appendChild(p);
	log_container.scrollTop = log_container.scrollHeight;
}

Hero.prototype.inputClear = function() {
	input.value = '';
}

Hero.prototype.strLoader = function(str) {
	switch(str) {
	case 'berserk':
	me.berserk();
	break;

	case 'run':
	return me.run()

	case 'dash':
	return me.dash()

	case 'heal':
	me.heal();
	this.showEvent(this.eventObj.heal);
	break;

	case 'walk':
	return me.walk()

	case 'back':
	return me.back()

	case 'attack':
	 me.attack(); 
	 break;

	default: 
	 me.inputClear();
	}	
}

Hero.prototype.attackWidth = function() {
	var div = document.createElement('div');
	div.setAttribute('class', 'attack_animation_render');
	div.style.height = '0px';
	div.style.visibility = 'hidden';
	document.body.appendChild(div);
	var Width = document.querySelector('.attack_animation_render').offsetWidth;
	document.body.removeChild(document.body.lastChild);
	return Width;
}

Hero.prototype.getIntegerRandom = function(max) {
	return Math.floor(Math.random() * (max+1) );
}

Hero.prototype.getTimeRandom = function(min, max) {
	return min + Math.random() *(max-min);
}



