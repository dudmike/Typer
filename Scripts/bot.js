var commands = [];
enemy.bot = function() {
	var time = enemy.getTimeRandom(1000, 3000);
	setTimeout(function () {
		commands = [enemy.walk.bind(enemy), enemy.back.bind(enemy)];
		commands[enemy.getIntegerRandom(commands.length- 1)]();
	}, time)

	if(gameStatus == 1) {
		setTimeout(enemy.bot, time);
	}
}

enemy.react_on_danger = function() {
	setInterval(function() {
		if(enemy.health <= enemy.maxhealth * 30/100 ) {
			if(enemy.heal_enabled && enemy.stamina >= run_stamina_cost) {
				commands=[enemy.heal.bind(enemy),enemy.heal.bind(enemy),enemy.run.bind(enemy),
				enemy.run.bind(enemy),enemy.heal.bind(enemy)];
				commands[enemy.getIntegerRandom(commands.length-1)]();
			} else if(!enemy.heal_enabled && enemy.stamina >= run_stamina_cost){
				commands=[enemy.run.bind(enemy), enemy.run.bind(enemy),enemy.back.bind(enemy)];
				commands[enemy.getIntegerRandom(commands.length-1)]();
			} else {
				enemy.heal.bind(enemy);
			}
			
		} else {
			if(distance ==1) {
				if(enemy.attack_enabled ) {
					commands = [enemy.attack.bind(enemy),enemy.back.bind(enemy), enemy.attack.bind(enemy)];
					commands[enemy.getIntegerRandom(commands.length-1)]();	
				} else {
					enemy.back.bind(enemy);
				}
				
			}
		}
		
	}, 2000)
}

//enemy.react_on_danger();
enemy.bot();
