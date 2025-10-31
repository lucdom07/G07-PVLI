import Warrior from "./warrior.js";

export default class Ally extends Warrior{
    constructor(scene, x, y,name,life, attack, range, texture, frame, cost, available, level){
            super(scene, x, y, name, life, attack, range, texture, frame);
            this.cost = cost;
            this.available = available;
            this.level = level;
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    isAvailable() {
        return this.available;
    }

}