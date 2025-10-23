export default class Warrior extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y,life, attack, range, texture, frame){
        super(scene, x, y, texture, frame);
        this.life = life;
        this.attack = attack;
        this.range = range;
        this.scene.add.existing(this);
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }
    die(){
        
    }
    hit(damage){
        this.life -= (damage);
        console.log(this.life);
        //poner tinte rojo al personaje cuando recibe daño
        this.setTint(0xffff0000);
        this.scene.time.addEvent({
            delay: 500,
            callback: ()=>{this.setTint(0xffffffff)}
        });
    }
}