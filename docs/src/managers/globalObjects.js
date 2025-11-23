export default class GlobalObject {
    constructor(name, textureURL, life, attack, cost, level, available) {
        this.name = name;
        this.textureURL = textureURL;
        this.life = life;
        this.attack = attack;
        this.cost = cost;
        this.level = level;
        this.available = available;

        this.DISPLAY_SIZE = 80;
        this.setDisplaySize(this.DISPLAY_SIZE, this. DISPLAY_SIZE);
    }

    getName() {
        return this.name;
    }

    getTextureURL() {
        return this.textureURL;
    }

    getLife() {
        return this.life;
    }

    getAttack() {
        return this.attack;
    }

    getCost() {
        return this.cost;
    }

    isAvailable() {
        return this.available;
    }

    setAvailable(available) {
        this.available = available;
    }

    clone() {
        return new GlobalObject(
            this.name,
            this.textureURL,
            this.life,
            this.attack,
            this.cost,
            this.level,
            this.available
        );
    }
}