import StatsUI from "../ui/statsUi.js"

export default class Warrior extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, name, life, attack, range, texture, frame, level){
        super(scene, x, y, texture, frame);
        this.name = name;
        this.life = life;
        this.attack = attack;
        this.range = range;
        this.level = level;
        this.DISPLAY_SIZE = 100;
        this.setDisplaySize(this.DISPLAY_SIZE, this.DISPLAY_SIZE); 
        this.scene.add.existing(this);
        this.statsUI = new StatsUI(scene, x, y, life, attack, range, this.DISPLAY_SIZE);
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    getName() {
        return this.name;
    }

    getImageURL() {
        return this.texture;
    }
    
    setWarriorPosition(newX, newY){
        this.x = newX;
        this.y = newY;
        this.statsUI.setStatsPosition(newX, newY);
    }

    hit(damage){
        this.life -= (damage);
        this.statsUI.updateLivesNumber(this.life);
        console.log(this.life);
        //poner tinte rojo al personaje cuando recibe daño
        this.setTint(0xffff0000);
        this.scene.time.addEvent({
            delay: 500,
            callback: ()=>{this.setTint(0xffffffff)}
        });
    }

    destroy(fromScene) {
    if (this.statsUI) {
        this.statsUI.destroy();
    }
    super.destroy(fromScene);
}
}