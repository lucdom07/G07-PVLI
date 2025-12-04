import Character from "./character.js";

export default class Dialogue{
    constructor(chara, text, isAnimated, sprite = null) {
        this.chara = chara;
        this.text = text;
        this.animated = isAnimated || false; 

        this.sprite = sprite;
    }
}
