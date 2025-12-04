

export default class PauseMenu extends Phaser.Scene{

        constructor(){
        super({key: 'pauseMenu'});
        this.playerData = {}
        this.pausedSceneKey = null;
    }

   

    init(data){
        this.pausedSceneKey = data.pausedSceneKey || null;
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
        const resumeButton = this.add.image(300,100,'startButton').setInteractive()

        playButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
        resumeButton.setPosition(this.sys.game.canvas.width*0.5,this.sys.game.canvas.height*0.4);
        
        playButton.on('pointerdown',()=>{
          
            this.scene.stop(this.pausedSceneKey);
            this.scene.start('mainMenu');
            this.scene.stop();
        });

        resumeButton.on('pointerdown',()=>{
          
            if (this.pausedSceneKey) {
                const pausedScene = this.scene.get(this.pausedSceneKey)

                this.scene.resume(pausedScene.scene.key);  

                this.scene.stop();
            }
                 
        });
    }
}