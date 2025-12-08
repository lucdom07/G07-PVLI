

export default class PauseMenu extends Phaser.Scene{

        constructor(){
        super({key: 'pauseMenu'});
        this.playerData = {}
        this.pausedSceneKey = null;
    }

   

    init(data){

         console.log(
        "%c[PAUSE MENU INIT]",
        "color: cyan; font-weight: bold",
        "Received pausedSceneKey:", data.pausedSceneKey
        );
        this.pausedSceneKey = data.pausedSceneKey || null;
    }

    preload(){
        this.load.image('startButton','assets/placeholders/buttons/start_button.png');
        this.load.image('exitButton','assets/placeholders/buttons/exit_button.png');
    }

    create(){

        let gameWidth = this.sys.game.config.width;
        let gameHeight = this.sys.game.config.height;


        let rt = this.add.renderTexture(gameWidth*0.5, gameHeight*0.5, gameWidth, gameHeight);
        rt.fill(0x000000, 0.5);

        //botón de juego
        const exitButton = this.add.image(300, 100, 'exitButton').setInteractive();
        const resumeButton = this.add.image(300,100,'startButton').setInteractive()

        exitButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
        resumeButton.setPosition(this.sys.game.canvas.width*0.5,this.sys.game.canvas.height*0.4);
        
        exitButton.on('pointerdown',()=>{
                   
            this.scene.stop('debugMap');
            this.scene.stop(this.pausedSceneKey);
            this.scene.stop();
            this.scene.start('mainMenu');
            
        });

        resumeButton.on('pointerdown',()=>{
          
            if (this.pausedSceneKey) {
                this.scene.resume(this.pausedSceneKey);  

                this.scene.stop();
            }
                 
        });
    }
}