import Warrior from "./warrior.js";

export default class Enemy extends Warrior{
        constructor(scene, x, y, name, life, attack, range, texture, frame, level){
        super(scene, x, y, name, life, attack, range, texture, frame, level);
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    calculateNewXInCombat(previousUnitX, index, WARRIORS_SEPARATION){
        return previousUnitX - index * WARRIORS_SEPARATION;
    }
    
    /*
    clone(){
        const clone = new Enemy(
            this.scene,
            this.x,
            this.y,
            this.name,
            this.life,
            this.attack,
            this.range,
            this.texture,
            this.frame,
            this.level
        );
        return clone;
    }
    */
}