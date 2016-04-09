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