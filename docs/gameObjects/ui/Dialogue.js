import Character from "./character.js";

export default class Dialogue{
    constructor(chara, text, isAnimated) {
        this.chara = chara;
        this.text = text;
        this.animated = isAnimated || false; 
    }
}
