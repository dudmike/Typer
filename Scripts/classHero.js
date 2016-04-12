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
		//Variable to select HUD table and it's row 
		var table_row;
		(this == me) ? table_row = document.querySelectorAll('.HUD')[0].rows[1]:
		table_row = document.querySelectorAll('.HUD')[1].rows[1];				
		this.hud_changer(table_row, this.heal_energy_cost, this.maxenergy, this.energy);
		var healAmount = this.maxhealth - this.health;
		this.eventObj.heal = 
		'You laid hands and got better by: '+
		'<span style="color:green;font-family:Verdana;font-size:20px">' + healAmount + '</span> points.';

		//Restore full hp for different classes
		this.health = (this.classDefiner ==1)? 150: 
		(this.classDefiner ==2)? 80: 50;
		var self = this;
		var table;
		self == me? table = document.querySelectorAll('.HUD')[0]:
		table = document.querySelectorAll('.HUD')[1];
		//Fulfill health bar and show numeric amount of health
		table.rows[0].querySelector('div[class $="bar"]').style.width ='100%';
		table.querySelectorAll('div[class="num"]')[0].innerHTML = self.maxhealth;
		//Show cooldown
		this.animate(function(timePassed) {
			return me.reload_changer(timePassed, 1, 10000);
		}, 10000)

		
		//Cooldown is set to 10 seconds
		setTimeout(function() {
			self.heal_enabled = 1;
		}, 10000)
		self.heal_enabled = 0;
	} else this.eventObj.heal = 'It\'s reloading...';
			 	
}

/*It changes percentage of hud's width, refreshes numeric amount of health and
animates damage amount.
It takes arguments:
tbl_row - to get hud table and it's row
dmg - amount of damage to animate
max_val - maxhealth, maxenergy, maxstamina
property - health, energy, stamina*/
Hero.prototype.hud_changer = function(tbl_row, dmg, max_val, property) {
	if(!gameStatus) return;
	//Selecting bar
	var bar = tbl_row.querySelector('div[class $="bar"]');
	if(me.health <=0 || enemy.health <=0) {
		bar.style.width = '0%';
		tbl_row.querySelector('div[class="num"]').innerHTML = 0;			
	} else {
		//Calculate current property percentage of max value
		var percentage =   property*100/ max_val;
		//Change bar's width
		bar.style.width = percentage + '%';
		//Show numeric amount of property
		tbl_row.querySelector('div[class="num"]').innerHTML = Math.round(property);
	}

	if(this ==  me) {
		if(property < 0) {
			tbl_row.querySelector('div[class="animated"]').innerHTML = '-' + (dmg + property);
		} else {
			tbl_row.querySelector('div[class="animated"]').innerHTML = '-' + dmg;
		}
	}
	
	//Animate damage amount
	this.animate(function(timePassed) {
		tbl_row.querySelector('div[class="animated"]').style.opacity = (2000  -  timePassed)/1000 + '';
	}, 2000)
}

/*It takes arguments:
draw - function that will change values to animate
duration - duration of animation*/
Hero.prototype.animate = function(draw, duration) {
	//Time when animation starts
	var start = performance.now();

	requestAnimationFrame(function animate(time) {
		//How much time passed since start
		var timePassed = time - start;

		if(timePassed > duration) timePassed = duration;
		//Draw animation in timePassed time
		draw(timePassed);

		//Plan another frame if it's not end
		if(timePassed < duration) {
			requestAnimationFrame(animate);
		}	
	});
}

Hero.prototype.getCoords = function(elem) {
	return elem.getBoundingClientRect();
}

/*It moves players, take arguments:
changeVal - amount of pixels to move.
It can positive(move player forward) and negative(move backward)*/
Hero.prototype.positionChange = function(changeVal) {
	if(distance >= 4 && changeVal > 0) return;

	var player2 = document.getElementById('player2'),
	    player1 = document.getElementById('player1'),
		player1_start_position = this.player1_start_position,
		player2_start_position = this.player2_start_position;

	//For the first launch	
	if(player1.style.left== '' && player2.style.left == '' || distance ==4)	{
		player1.style.left = player1_start_position;
		player2.style.left = player2_start_position;
	}

	var attackWidth = this.attackWidth(),
		player1_left = parseInt(player1.style.left),
		player2_left = parseInt(player2.style.left),
		difference = player2_left - player1_left,
		//Calculation min step, depending of animation_container's clientWidth
		step = (animation_container.clientWidth - attackWidth - player1.offsetWidth)/ 3;

	if(this == me) {
		//End target of player1's movement		
		var position = player1_left + attackWidth  + changeVal;
		//If player1 is going over player2
		if(position >= player2_left ) {
			player1.style.left = (player2_left- attackWidth) + 'px';
		//If player1 is going over his start position
		} else if(player1_left + changeVal < parseInt(player1_start_position)) {			
			if(difference >= 2 * step) {
				player1.style.left = player1_start_position;
			} else { //If player 2 is too close
				player1.style.left = (parseInt(player2_start_position)  - difference + changeVal) + 'px';
				player2.style.left = player2_start_position;	
			}
		//When player1 moves from distance=5 to ditance=3	
		} else if(distance == 3 && changeVal > 0) {
			player1.style.left = step + 10 + 'px';//10 is default body margin
		} else {
			if(distance == 4) {
				player1.style.left = player1_start_position;
			} else {
				player1.style.left = player1_left  + changeVal + 'px';
			}
			
		}

	} else {
		//End target of player2's movement
		var position = player2_left - changeVal;
		//If player2 is going over player1
		if(position <= player1_left + attackWidth) {
			player2.style.left = (player1_left + attackWidth) + 'px';
		//If player1 is going over his start position
		} else if(player2_left - changeVal > parseInt(player2_start_position)) {
			
			if(difference > 2 * step) {
				
				player2.style.left = player2_start_position;
			} else {//If player 1 is too close			
				player2.style.left = (parseInt(player1_start_position) + difference - changeVal) + 'px';
				player1.style.left = player1_start_position;
			}
		//When player1 moves from distance=5 to ditance=3
		} else if(distance == 3 && changeVal > 0) {
			player2.style.left =  parseInt(player2_start_position)-step + 'px';
		}

		else {
			if(distance == 4 ) {
				player2.style.left = player2_start_position;
			} else {
				player2.style.left = player2_left - changeVal + 'px';
			}		
		}
	}	
}
//Move forward
Hero.prototype.walk = function() {	
	distance--;
	this.showDistance();//Display distance
	if(distance < 1) {
		distance = 1;
		this.showDistance();
	}
	this.positionChange(257);//Move player
}
//Double walk
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
//Double step backward
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
//Step backward
Hero.prototype.back = function() {
	distance++;
	this.showDistance();
	this.positionChange(-257);
}
//Update all bar's width
Hero.prototype.regeneration = function() {
	if(gameStatus != 1) return;

	var self = this;
	var current_val_array = [self.health, self.energy, self.stamina];
	var max_val_array = [self.maxhealth, self.maxenergy, self.maxstamina];

	for(var i=0; i<current_val_array.length; i++) {
		if(current_val_array[i] >= max_val_array[i]) continue;
		//Select HUD
		var table;
		self == me? table = document.querySelectorAll('.HUD')[0]:
		table = document.querySelectorAll('.HUD')[1];
		//Calculate 5%of max value + property value 
		current_val_array[i] += max_val_array[i]*5/100;
		i==0? self.health = current_val_array[i]: i==1? self.energy = current_val_array[i]:
		self.stamina = current_val_array[i];
		//Calculate current value percentage of max value
		var percentage = current_val_array[i]*100/max_val_array[i];
		//Set up bar's width
		table.rows[i].querySelector('div[class $="bar"]').style.width = percentage + '%';
		//Display changes
		table.querySelectorAll('div[class="num"]')[i].innerHTML = Math.round(current_val_array[i]);
		//If it's going over the limit
		if(current_val_array[i] > max_val_array[i]) {
			table.querySelectorAll('div[class="num"]')[i].innerHTML = max_val_array[i];
			i==0? self.health = max_val_array[i]: i==1? self.energy = max_val_array[i]:
			self.stamina = max_val_array[i];
		}
	}
	
}
//Ends the game
Hero.prototype.end = function() {
	//Button to start new game
	var button = document.createElement('button');
	
	button.innerHTML = 'Start new';
	
	button.addEventListener('click', function() {
		//Cancel regeneration
		clearInterval(regMe);
		clearInterval(regEnemy);
		gameStatus = 1;
		distance = 4;
 		me = new Barbarian();
		enemy = new Barbarian();
		log_container.innerHTML = '';
		var bars = document.querySelectorAll('div[class $="bar"]');
		//Refresh bars
		for(var i=0; i<bars.length; i++) {
			bars[i].style.width= '100%';
		}
		//Refresh distance
		var dist = document.getElementById('dist');
		dist.innerHTML ='<b style="font-size:25px">' + distance + '</b>';
		var divs = document.querySelectorAll('.num');
		//Refresh values of basic parameters
		var arr = [me.maxhealth, me.maxenergy, me.maxstamina, enemy.maxhealth, enemy.maxenergy, enemy.maxstamina];
		for(var i=0; i<arr.length/2; i++) {
			divs[i].innerHTML = arr[i];
		}

		for(var i=3; i<arr.length; i++) {
			divs[i].innerHTML = arr[i];
		}
		//Start new regeneration
		regMe = setInterval(me.regeneration.bind(me), 5000);
		regEnemy = setInterval(enemy.regeneration.bind(enemy), 5000);
		//Start positions
		player1.style.left = me.player1_start_position;
		player2.style.left = enemy.player2_start_position;
		//Set up animation blocks
		me.reloadPlacer();
		//Bot mode on
		enemy.react_on_danger();
		enemy.bot();
		//Remove end block
		document.body.removeChild(document.querySelector('.endBlock'));
		
	});
	
	var abilities = document.querySelectorAll('.ability');
	if(enemy.health <= 0) {
		//End block
		var div = document.createElement('div');
		div.style.bottom = '200px';
		div.style.right =window.innerWidth/2 + 'px';
		div.innerHTML = 'Victory<br>';
		div.setAttribute('class', 'endBlock');
		div.appendChild(button);
		document.body.insertBefore(div, animation_container);
		this.eventObj.end = 'Passionately swinging with your sword,  you win this battle';
		this.showEvent(this.eventObj.end);
		//Stop abilities animation 
		for(var i=0; i<abilities.length; i++) {
			document.body.removeChild(abilities[i]);
		}
		gameStatus = 0;
		 
	} else if(me.health <=0) {
		//End block
		var div = document.createElement('div');
		div.style.bottom = '200px';
		div.style.right =window.innerWidth/2 + 'px';
		div.innerHTML = 'Defeat<br>';
		div.setAttribute('class', 'endBlock');
		div.appendChild(button);
		document.body.insertBefore(div, animation_container);
		this.eventObj.end = 'You were good, but destiny is cruel...';
		this.showEvent(this.eventObj.end);
		//Stop abilities animation
		for(var i=0; i<abilities.length; i++) {
			document.body.removeChild(abilities[i]);
		}
		gameStatus = 0;	
	}
}
//Places animation blocks for abilities
Hero.prototype.reloadPlacer = function() {
	var abilityImages = document.body.querySelectorAll('div[id="status_container"] img');

	for(var i=0; i< abilityImages.length; i++) {
		var div = document.createElement('div');
		div.setAttribute('class', 'ability');
		div.style.left = this.getCoords(abilityImages[i]).left + 'px';
		div.style.top = this.getCoords(abilityImages[i]).top + 'px';
		document.body.appendChild(div);
	}
}
//Places attack block and deletes first
Hero.prototype.setAttackBlock = function() {
	//Create block for attack animation
	var parentDiv = document.createElement('div');
	var whiteDiv = document.createElement('div');
	whiteDiv.setAttribute('class', 'attack_animation_render');
	parentDiv.appendChild(whiteDiv);
	//Set up attack block position for players
	if(this == me) {
		var player1 = this.getCoords(document.getElementById('player1'));
		parentDiv.style.left = player1.left + 'px';

	} else {
		var player2= this.getCoords(document.getElementById('player2'));
		parentDiv.style.left = (player2.left - (this.attackWidth() - document.getElementById('player1').offsetWidth) )  + 'px';
	}		
	
	parentDiv.setAttribute('class', 'attack_animation_block');
	//Add into document
	document.body.appendChild(parentDiv);
	//Delete if there are more than 1 blocks
	if(document.querySelectorAll('.attack_animation_block').length == 2) {
		document.body.removeChild(document.querySelectorAll('.attack_animation_block')[0]);
	}
}
/*This is draw function for animation method. It takes arguments:
time - timePassed, take it from the animate method
index - number of image
duration - duration of animation*/
Hero.prototype.reload_changer = function(time, index, duration) {
	var Img = document.body.querySelectorAll('div[id="status_container"] img')[index];
	//Select reload block, that is inserted by reloadPlacer method
	var reloader = document.querySelectorAll('.ability')[index];
	//Get difference, to view height decrease from top to bottom
	var difference = Img.offsetHeight - reloader.offsetHeight;
	reloader.style.top = this.getCoords(Img).top+ difference + window.pageYOffset + 'px';
	var dividend = duration/Img.offsetHeight;
	reloader.style.height =  (duration - time)/dividend + 'px';
}
//Show ditance in the id="dist" block
Hero.prototype.showDistance = function() {
	var dist = document.getElementById('dist');
	dist.innerHTML ='<b style="font-size:25px">'+ distance +'</b>' ;
}
/*Show event in the id="log_container" block
It takes prop argument, which is property of this.eventObj*/
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
/*Loads commands from the input string(str)*/
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
/*Creates and inserts into document block to read Width*/
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
//Random value for array index
Hero.prototype.getIntegerRandom = function(max) {
	return Math.floor(Math.random() * (max+1) );
}
//Random value for time interval
Hero.prototype.getTimeRandom = function(min, max) {
	return min + Math.random() *(max-min);
}



