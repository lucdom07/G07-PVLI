export default class mainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu'});
    }

    preload(){
        this.load.image('button','../../assets/button.jpg')
        this.load.image('background','../../assets/background.jpg')
    }

    create(){

        //fondo con título
        this.add.image(450,340,'background');
   
        //botón de juego

        const playButton = this.add.image(300,100,'button').setInteractive();


        playButton.setPosition(450, 500);
  

        playButton.on('pointerdown',()=>{
            this.scene.start('debugCombat');
        });
    }

    
}

