export default class mainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu'});
    }

    preload(){
        this.load.image('button1','assets/button.jpg')
        this.load.image('button2','assets/button_2.png')
        this.load.image('background','assets/background.jpg')
    }

    create(){

        //fondo con título
        this.add.image(450,340,'background');
   
        //botón de juego

        const playButton = this.add.image(400,100,'button1').setInteractive();
        const debugPreparationButton = this.add.image(400,100,'button2').setInteractive();


        playButton.setPosition(200, 500);
        debugPreparationButton.setPosition(700,500);
  

        playButton.on('pointerdown',()=>{
            this.scene.start('debugCombat');
        });

        debugPreparationButton.on('pointerdwown',()=>{
            this.scene.start('combatSetup')
        })
    }

    
}

