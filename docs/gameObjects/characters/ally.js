import Warrior from "./warrior.js";

export default class Ally extends Warrior{
    constructor(scene, x, y, name, life, attack, range, texture, frame, cost, available, level){
        super(scene, x, y, name, life, attack, range, texture, frame, level);
        this.cost = cost;
        this.available = available;
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    hit(damage){
        super.hit(damage);
        if (this.life <= 0){
            this.scene.events.emit('addNewEvent', 'removeDeadAlly');
        }
        this.scene.events.emit('nextEvent');
    }

    isAvailable() {
        return this.available;
    }

    calculateNewXInCombat(previousUnitX, index, WARRIORS_SEPARATION){
        return previousUnitX + index * WARRIORS_SEPARATION;
    }

    clone(){
        const clone = new Ally(
            this.scene,
            this.x,
            this.y,
            this.name,
            this.life,
            this.attack,
            this.range,
            this.texture,
            this.frame,
            this.cost,
            this.available,
            this.level
        );
        return clone;
    }

}