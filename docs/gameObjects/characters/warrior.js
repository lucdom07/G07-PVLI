import WarriorUI from "../ui/warriorUi.js"

export default class Warrior extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, name, life, attack, range, texture, frame, level){
        super(scene, x, y, texture, frame);
        this.name = name;
        this.life = life;
        this.attack = attack;
        this.range = range;
        this.level = level;
        this.DISPLAY_SIZE = 190;
        this.setDisplaySize(this.DISPLAY_SIZE, this.DISPLAY_SIZE); 
        this.scene.add.existing(this);
        this.warriorUI = new WarriorUI(scene, x, y, life, attack, range, this.DISPLAY_SIZE);
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
        console.log("position:" + this.x + " "+ this.y);
        this.warriorUI.setStatsPosition(newX, newY);
    }

    //Ejecuta animación de ataque y le hace daño al objetivo
    attackWarrior(target, callback){
        this.attackAnimation(target, callback);
    }

    takeHit(damage, callback){
        this.life -= (damage);
        this.warriorUI.updateLivesNumber(this.life);
        console.log(this.life);
        //poner tinte rojo al personaje cuando recibe daño
        this.setTint(0xffff0000);
        this.scene.time.addEvent({
            delay: 500,
            callback: ()=>{this.setTint(0xffffffff)}
        });
        this.scene.time.addEvent({
            delay: 500,
            callback: ()=>{ callback() }
        });
    }

    // Animación de ataque
    attackAnimation(target, callback) {
        const originalX = this.x;
        const originalY = this.y;
        
        // Mover hacia el objetivo
        this.scene.tweens.add({
            targets: this,
            x: this.x + (target.x - this.x) * 0.3,
            y: this.y + (target.y - this.y) * 0.3,
            duration: 300,
            ease: 'Power2',
        });
        
        // Efecto visual en el objetivo
        this.scene.tweens.add({
            targets: target,
            scaleX: 0.6,
            scaleY: 0.6,
            duration: 100,
            yoyo: true
        });
        
        // Volver a la posición original
        this.scene.tweens.add({
            targets: this,
            x: originalX,
            y: originalY,
            duration: 300,
            ease: 'Power2',
            callback: ()=>{     
                target.takeHit(this.attack, callback);
            }
        });
    }

    dieAnimation(){
        this.setAlpha(0.3);
        this.setTint(0xff0000);
    }

    destroy(fromScene) {
        if (this.warriorUI) {
            this.warriorUI.destroy();
        }
        super.destroy(fromScene);
    }
}