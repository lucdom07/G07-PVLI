export default class WarriorUI extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, life, attack, range, warriorSize){
        super(scene, x, y);
        this.DISTANCE_BELOW_WARRIOR = warriorSize/2;
        const startingY = y + this.DISTANCE_BELOW_WARRIOR;
        this.STATS_DISTANCE = 50;
        let livesText = this.scene.add.text(x, startingY, `Vida: ${life}`, {
            fontSize: '20px',
            fill: '#baffa3ff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        let attackText = this.scene.add.text(x, startingY + this.STATS_DISTANCE, `Ataque: ${attack}`, {
            fontSize: '20px',
            fill: '#f99d9dff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        let rangeText = this.scene.add.text(x, startingY + this.STATS_DISTANCE * 2, `Rango: ${range + 1}`, {
            fontSize: '20px',
            fill: '#98f7f7ff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.stats = [livesText, attackText, rangeText];
        this.scene.add.existing(this);
    }

    setStatsPosition(newX, newY){
        for (let i = 0; i < this.stats.length; i++){
            const startingY = newY + this.DISTANCE_BELOW_WARRIOR;
            this.stats[i].setPosition(newX, startingY + this.STATS_DISTANCE * (i +1));
        }
    }

    //Muestra el feedback de daño de la UI del guerrero, tanto actualizar vidas como crear el texto de daño
    showDamageFeedback(x, y, damage, lives){
        this.updateLivesNumber(lives);
        this.createDamageText(x, y, damage);
    }

    updateLivesNumber(lives){
        this.stats[0].setText(`Vida: ${lives}`); //stats[0] -> texto de vidas
    }

    destroy(fromScene) {
        // Destruir los textos
        if (this.stats) {
            this.stats.forEach(s => {
                if (s && s.destroy) s.destroy();
            });
        }

        // Destruir el propio sprite StatsUI
        super.destroy(fromScene);
    }

    //Crea texto de daño
    createDamageText(x, y, damage, color = '#ff0000'){
            //console.log(`Creando texto de daño: -${damage} en (${x}, ${y})`); // Debug
            const text = this.scene.add.text(x, y - this.TEXT_FEEDBACK_DISTANCE, `-${damage}`, {
                fontSize: '24px',
                fill: color,
                stroke: '#000000',
                strokeThickness: 4,
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }).setOrigin(0.5);
            
            this.scene.tweens.add({
                targets: text,
                y: y - 100,
                alpha: 0,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => {
                    if (text && text.destroy) {
                        text.destroy();
                    }
                }
            });
    }
    
    /* Por ahora no lo estamos usando, pero lo dejamos aquí para cuando lo necesitemos
    createHealText(x, y, amount) {
        const text = this.scene.add.text(x, y - this.TEXT_FEEDBACK_DISTANCE, `+${amount}`, {
            fontSize: '20px',
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 80,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }
        */
}