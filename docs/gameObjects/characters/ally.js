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

    takeHit(damage, callback){
        super.takeHit(damage, callback);
    }

    isAvailable() {
        return this.available;
    }

    calculateAttackPos(targetX){
        return targetX * 0.9;
    }

    calculateNewXInCombat(previousUnitX, index, WARRIORS_SEPARATION){
        return previousUnitX - index * WARRIORS_SEPARATION;
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