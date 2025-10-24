import Warrior from "./warrior.js";

export default class Enemy extends Warrior{
        constructor(scene, x, y,life, attack, range, texture, frame){
        super(scene, x, y,life, attack, range, texture, frame);
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }
}