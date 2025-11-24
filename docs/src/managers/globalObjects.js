export default class GlobalObject extends Phaser.GameObjects.Image {
    constructor(scene, x, y, name, textureURL, life, attack, cost, level) {
        super(scene, x, y, textureURL);

        this.name = name;
        this.textureURL = textureURL;
        this.life = life;
        this.attack = attack;
        this.cost = cost;
        this.level = level;

        this.DISPLAY_SIZE = 80;
    
        if (scene) {
            this.setDisplaySize(this.DISPLAY_SIZE, this. DISPLAY_SIZE);
            this.setInteractive();
            scene.add.existing(this);
        }
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

    clone() {
        return new GlobalObject(
            this.scene,
            this.x,
            this.y,
            this.name,
            this.textureURL,
            this.life,
            this.attack,
            this.cost,
            this.level,
        );
    }
}