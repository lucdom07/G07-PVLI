import Warrior from "./warrior.js";

export default class Enemy extends Warrior{
        constructor(scene, x, y, name, life, attack, range, texture, frame, textureURL){
        super(scene, x, y, name, life, attack, range, texture, frame, textureURL);
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    takeHit(damage, callback){
        super.takeHit(damage, callback);
    }
    
    damageSound(){
        this.scene.events.emit('enemyDamageSound');
    }

    dyingSound(){
        this.scene.events.emit('enemyDyingSound');
    }

    calculateAttackPos(targetX){
        return targetX * 1.1;
    }

    calculateNewXInCombat(previousUnitX, index, WARRIORS_SEPARATION){
        return previousUnitX + index * WARRIORS_SEPARATION;
    }
}