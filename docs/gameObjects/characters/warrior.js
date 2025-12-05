import WarriorUI from "../ui/warriorUi.js"

export default class Warrior extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, name, life, attack, range, texture, frame, textureURL){
        super(scene, x, y, texture, frame);
        this.name = name;
        this.life = life;
        this.attack = attack;
        this.range = range;
        this.DISPLAY_SIZE = 190;
        //tiempo de delay entre llamadas de las funciones de ataque
        this.ATTACK_DELAY_TIME = 380;
        this.setDisplaySize(this.DISPLAY_SIZE, this.DISPLAY_SIZE); 
        this.scene.add.existing(this);
        this.warriorUI = new WarriorUI(scene, x, y, life, attack, range, this.DISPLAY_SIZE);

        this.textureURL = textureURL;
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
    
    getWarriorUI(){
        return this.warriorUI;
    }

    //mueve a los guerreros y sus UI a una nueva posición
    setWarriorPosition(newX, newY){
        this.x = newX;
        this.y = newY;
        this.warriorUI.setStatsPosition(newX, newY);
    }

    //Ejecuta animación de ataque, que luego llamará a la función de recibir daño del target
    attackWarrior(target){
        const originalX = this.x;
        const originalY = this.y;
        
        // Mover hacia el objetivo
        this.scene.tweens.add({
            targets: this,
            x: this.calculateAttackPos(target.x),
            y: target.y,
            duration: 600,
            ease: 'Power2',
            callback: () =>{
                this.scene.time.delayedCall(this.ATTACK_DELAY_TIME, () => {
                    target.takeHit(this.attack);
                    // Volver a la posición original
                    this.scene.tweens.add({
                        targets: this,
                        x: originalX,
                        y: originalY,
                        duration: 600,
                        ease: 'Power2',
                    });
                });
            }
        });
    }

    //funcion de recibir daño: quita vidas según el daño, lo actualiza en la UI y después de mostrar las animaciones
    //emite canCallNext para avisar de que se puede ejecutar el siguiente evento
    takeHit(damage){
        this.life -= (damage);
        this.warriorUI.showDamageFeedback(this.x, this.y, damage, this.life);
        // Efecto visual en el objetivo
        this.scene.tweens.add({
            targets: this,
            scaleX: 0.6,
            scaleY: 0.6,
            duration: 300,
            yoyo: true,
        });
        //poner tinte rojo al personaje cuando recibe daño
        this.setTint(0xffff0000);
        this.scene.time.addEvent({
            delay: this.ATTACK_DELAY_TIME,
            callback: ()=>{
                this.setTint(0xffffffff);
                this.scene.time.delayedCall(this.ATTACK_DELAY_TIME, () => {
                    this.scene.events.emit('canCallNext');
                });
            }
        });
    }

    //NO BORRAR. Los aliados y enemigos heredan de esta función para que cada uno se calcule la posición a la que debe avanzar en la animación de ataque
    calculateAttackPos(targetX){
        
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