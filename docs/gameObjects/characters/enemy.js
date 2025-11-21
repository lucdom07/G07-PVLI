import Warrior from "./warrior.js";

export default class Enemy extends Warrior{
        constructor(scene, x, y, name, life, attack, range, texture, frame, level){
        super(scene, x, y, name, life, attack, range, texture, frame, level);
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    takeHit(damage, callback){
        super.takeHit(damage, callback);
    }

    calculateNewXInCombat(previousUnitX, index, WARRIORS_SEPARATION){
        return previousUnitX - index * WARRIORS_SEPARATION;
    }
}