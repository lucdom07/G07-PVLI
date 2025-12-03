

export default class PauseMenu extends Phaser.Scene{

        constructor(){
        super({key: 'pauseMenu'});
        this.playerData = {}
    }

    Init(){
        
    }

    preload(){
        this.load.image('startButton','assets/placeholders/buttons/start_button.png')
    }

    create(){

   
        //botón de juego
        const playButton = this.add.image(100, 100, 'startButton').setInteractive();
        //const marketButton = this.add.image(600,100,'marketButton').setInteractive();

        playButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
        //marketButton.setPosition(450, 450);
        
        playButton.on('pointerdown',()=>{
            this.scene.resume();
            this.scene.stop();
        });
    }


}