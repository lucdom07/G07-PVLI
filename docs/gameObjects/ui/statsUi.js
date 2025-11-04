export default class StatsUI extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, life, attack, range, warriorSize){
        super(scene, x, y);
        this.DISTANCE_BELOW_WARRIOR = warriorSize/2;
        this.STATS_DISTANCE = 50;
        let livesText = this.scene.add.text(x, y, `Vida: ${life}`, {
            fontSize: '20px',
            fill: '#baffa3ff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        let attackText = this.scene.add.text(x, y, `Ataque: ${attack}`, {
            fontSize: '20px',
            fill: '#f99d9dff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        let rangeText = this.scene.add.text(x, y, `Rango: ${range + 1}`, {
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
}