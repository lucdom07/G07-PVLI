export default class GlobalObject extends Phaser.GameObjects.Image {
    constructor(scene, x, y, name, textureURL, life, attack, cost, texture) {
        super(scene, x, y, texture);

        this.name = name;
        this.textureURL = textureURL;
        this.life = life;
        this.attack = attack;
        this.cost = cost;

        this.DISPLAY_SIZE = 20;
    
        if (scene) {
            this.setDisplaySize(this.DISPLAY_SIZE, this.DISPLAY_SIZE);
            this.setInteractive();
            scene.add.existing(this);
        }
    }

    //Retorna el nombre del objeto
    getName() {
        return this.name;
    }
    //Retorna la dirección del al textura del objeto
    getTextureURL() {
        return this.textureURL;
    }
    //Retorna el número de vida del objeto
    getLife() {
        return this.life;
    }
    //Retorna el número de ataque del objeto
    getAttack() {
        return this.attack;
    }
    //Retorna el coste del objeto
    getCost() {
        return this.cost;
    }
    //Retorna una duplica del objeto
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
            this.texture,
            this.frame
        );
    }
}