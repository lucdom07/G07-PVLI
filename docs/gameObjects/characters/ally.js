import Warrior from "./warrior.js";
import WarriorUI from "../ui/warriorUi.js";

export default class Ally extends Warrior{
    constructor(scene, x, y, name, life, attack, range, texture, frame, cost, available, textureURL){
        super(scene, x, y, name, life, attack, range, texture, frame, textureURL);
        this.cost = cost;
        this.available = available;
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    takeHit(damage, callback){
        super.takeHit(damage, callback);
        this.scene.events.emit('allyDamageSound');
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

    getLife(){
        return this.life;
    }

    getAttack(){
        return this.attack;
    }

    setLife(apply){
        this.life = apply;
    }

    setAttack(apply){
        this.attack = apply;
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
            this.textureURL
        );
        return clone;
    }

    static clone(ally, scene){
        const clone = new Ally(
            this.scene = scene,
            -150,
            -150,
            ally.name,
            ally.life,
            ally.attack,
            ally.range,
            ally.texture,
            ally.frame,
            ally.cost,
            ally.available,
            ally.textureURL,
            this.warriorUI = new WarriorUI(scene, -150, -150, ally.life, ally.attack, ally.range, this.DISPLAY_SIZE)
        );
        scene.add.existing(clone);
        scene.add.existing(this.warriorUI);
        return clone;
    }

}