

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

        let gameWidth = this.sys.game.config.width;
        let gameHeight = this.sys.game.config.height;


        let rt = this.add.renderTexture(gameWidth*0.5, gameHeight*0.5, gameWidth, gameHeight);
        rt.fill(0x000000, 0.5);

        //botón de juego
        const playButton = this.add.image(300, 100, 'startButton').setInteractive();

        playButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
        //marketButton.setPosition(450, 450);
        
        playButton.on('pointerdown',()=>{

            const pausedScene = this.scene.manager.scenes.find(s => s.scene.isPaused());
    
            if (pausedScene) {
                this.scene.stop(pausedScene.scene.key);
            }

            this.scene.start('mainMenu');
            this.scene.stop();
        });
    }


}