function Barbarian() {
	Hero.apply(this, arguments);

	this.health = 150;
	this.energy = 50;
	this.stamina = 200;
	this.attack_damage = 50;
	this.attack_stamina_cost = 50;
	this.attack_enabled = 1;
	this.attack_cooldown = 3000;
	this.berserk_cooldown = 30000;
	this.maxhealth = 150;
	this.maxenergy = 50;
	this.maxstamina = 200;
	this.berserk_enabled = 1;
	this.berserk_energy_cost = 50;
	this.berserk_damage = 25;
}
Barbarian.prototype = Object.create(Hero.prototype);
Barbarian.prototype.constructor = Barbarian;

Barbarian.prototype.attack = function() {
	if(!gameStatus) return;
	if(this.stamina >= this.attack_stamina_cost) {
		if(this.attack_enabled) {
			this.attackRender();
			if(this == me) {
				this.animate(function(timePassed) {
					return me.reload_changer(timePassed, 0, me.attack_cooldown);
				}, this.attack_cooldown)
			}

			this.animate(function(timePassed) {
				document.querySelector('.attack_animation_block:last-child').style.height = timePassed/4 + 'px';
				document.querySelector('.attack_animation_block:last-child').style.opacity = (1000 - timePassed)/1000 + '';
			}, 1000)
			this.stamina -= this.attack_stamina_cost;
			var table_row;
			(this == me)?table_row = document.querySelectorAll('.HUD')[0].rows[2]:
			table_row = document.querySelectorAll('.HUD')[1].rows[2];				
			this.hud_changer(table_row, this.attack_stamina_cost, this.maxstamina, this.stamina);
			
			if(distance == 1) {
				if(this == enemy) {
					me.health -= me.attack_damage;
					if(me.health < 0) {
						this.eventObj.attack = 'Enemy hit you with his sword, you got worse by: '+
					'<span style="color:#f00;font-family:Verdana;font-size:20px">'+
					(this.attack_damage+ me.health)+'</span> points';
					} else {
						this.eventObj.attack = 'Enemy hit you with his sword, you got worse by: '+
					'<span style="color:#f00;font-family:Verdana;font-size:20px">'+
					this.attack_damage+'</span> points';
					}
					
					var table_row = document.querySelectorAll('.HUD')[0].rows[0];	
					this.showEvent(this.eventObj.attack);					
					this.hud_changer(table_row, this.attack_damage, me.maxhealth, me.health);						
					this.end();
				
				} else {
					enemy.health -= enemy.attack_damage;
					if(enemy.health < 0) {
						this.eventObj.attack = 'You hit enemy with your sword, he got worse by: '+
					'<span style="color:#f00;font-family:Verdana;font-size:20px">'+
					(this.attack_damage+ enemy.health)+'</span> points';
				} else {
						this.eventObj.attack = 'You hit enemy with your sword, he got worse by: '+ 
					'<span style="color:#AA0cff;font-family:Verdana;font-size:20px">'+
					this.attack_damage+'</span> points';
				}
					var table_row = document.querySelectorAll('.HUD')[1].rows[0];
					this.hud_changer(table_row, this.attack_damage, enemy.maxhealth, enemy.health);
				
					this.showEvent(this.eventObj.attack);
					this.end();
				
				}
			
				
			} else if(this==me){
				this.eventObj.attack = 'In the rage, you dissected emptiness';
				this.showEvent(this.eventObj.attack);
			}

			
			var self = this;
			setTimeout(function () {self.attack_enabled = 1}, self.attack_cooldown);
			self.attack_enabled = 0;
		} else if(this==me) {
			this.eventObj.attack = 'You can\'t attack faster';
			this.showEvent(this.eventObj.attack);
		}
	} else if(this==me){
		this.eventObj.attack = 'Your stamina is low';
		this.showEvent(this.eventObj.attack);
	}
}

Barbarian.prototype.berserk = function() {
	var player2 = document.getElementById('player2');
	var player1 = document.getElementById('player1');
	if(this.berserk_enabled) {
		if(this == me) {
			if(this.energy == this.berserk_energy_cost) {
				distance = 1;
				
				this.showDistance();
				enemy.health -= this.berserk_damage;
				this.energy -= this.berserk_energy_cost;
				var table = document.querySelectorAll('.HUD')[0].rows[1];
				this.hud_changer(table, this.berserk_energy_cost, this.maxenergy, this.energy);
				table = document.querySelectorAll('.HUD')[1].rows[0];
				this.hud_changer(table, this.berserk_damage, enemy.maxhealth, enemy.health);
				this.eventObj.berserk = 'You rushing forward and attack enemy by:' + 
				'<span style="color:#AA0cff;font-family:Verdana;font-size:20px">'+
					this.berserk_damage+' </span> points';

				player1.style.left = (this.getCoords(player2).left- this.attackWidth()) + 'px';
				if(enemy.health <= 0) {
					this.end();
					this.eventObj.end = 'You\'re so hard, you rammed your opponent';
					this.showEvent(this.eventObj.end);				
				} else this.showEvent(this.eventObj.berserk);

				this.animate(function(timePassed) {
						return me.reload_changer(timePassed, 2, me.berserk_cooldown);
				}, me.berserk_cooldown)

				var self = this;
				setTimeout(function () {self.berserk_enabled = 1}, self.berserk_cooldown);
				self.berserk_enabled = 0;
			} else {
				this.eventObj.berserk = 'To activate ability you need: ' +
				'<span style="color:#00F;font-family:Verdana;font-size:20px">'+ 
				(this.berserk_energy_cost - this.energy) +'</span> energy points';
				this.showEvent(this.eventObj.berserk);
			}

		} else {
			if(this.energy == this.berserk_energy_cost) {
				distance = 1;
				
				this.showDistance();
				me.health -= this.berserk_damage;
				this.energy -= this.berserk_energy_cost;
				var table = document.querySelectorAll('.HUD')[1].rows[1];
				this.hud_changer(table, this.berserk_energy_cost, this.maxenergy, this.energy);
				table = document.querySelectorAll('.HUD')[0].rows[0];
				this.hud_changer(table, this.berserk_damage, me.maxhealth, me.health);
				this.eventObj.berserk = 'Enemy rushing forward and attack you by:' +
				'<span style="color:#F00;font-family:Verdana;font-size:20px">'+this.berserk_damage+ 
				'</span> points';
				player2.style.left = this.getCoords(player1).left + this.attackWidth() + 'px';
				if(me.health <=0) {
					this.end();
					this.eventObj.end = 'Your enemy rammed you';
					this.showEvent(this.eventObj.end);
				} else this.showEvent(this.eventObj.berserk);

				var self = this;
				setTimeout(function () {self.berserk_enabled = 1}, self.berserk_cooldown);
				self.berserk_enabled = 0;

			}
		}
	} else {
		this.eventObj.berserk ='You can\'t use it so often';
		this.showEvent(this.eventObj.berserk);
	}
	
}