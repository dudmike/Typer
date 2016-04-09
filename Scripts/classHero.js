//----------Hero class start-----------
function Hero() {
	this.player1_start_position = '10px';
	this.player2_start_position = '810px';
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
			this.changeHUD(table_row, this.heal_energy_cost, this.maxenergy, this.energy);
			
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

	Hero.prototype.changeHUD = function(tbl_row, dmg, max_val, property) {
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

