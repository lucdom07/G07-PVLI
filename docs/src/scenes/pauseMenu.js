

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
        this.load.image('resetButton','assets/buttons/reset.png');
        this.load.image('resumeButton','assets/buttons/continue.png');
    }

    create(){

        let gameWidth = this.sys.game.config.width;
        let gameHeight = this.sys.game.config.height;


        let rt = this.add.renderTexture(gameWidth*0.5, gameHeight*0.5, gameWidth, gameHeight);
        rt.fill(0x000000, 0.5);

        //botón de juego
        const resetButton = this.add.image(300, 100, 'resetButton').setInteractive().setDisplaySize(400,130);
        const resumeButton = this.add.image(300,100,'resumeButton').setInteractive().setDisplaySize(400,130);

        resumeButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.7);
        resetButton.setPosition(this.sys.game.canvas.width*0.5,this.sys.game.canvas.height*0.3);
        
        //función de resetear la partida
        resetButton.on('pointerdown',()=>{
                   
            this.scene.stop('debugMap');
            this.scene.stop(this.pausedSceneKey);
            this.scene.stop();
            this.scene.start('mainMenu');
            
        });

        //función de continuar con el juego
        resumeButton.on('pointerdown',()=>{
          
            if (this.pausedSceneKey) {
                this.scene.resume(this.pausedSceneKey);  

                this.scene.stop();
            }
                 
        });

        //aquí añado unos bordes desde phaser para mayor claridad del botón seleccionado
        
        const resetBorder = this.add.graphics();
        resetBorder.lineStyle(4, 0x0000000); 
        resetBorder.strokeRect(
            resetButton.x - resetButton.displayWidth/2, 
            resetButton.y - resetButton.displayHeight/2, 
            resetButton.displayWidth, 
            resetButton.displayHeight
        );

        resetButton.on('pointerover', () => {
            resetBorder.clear(); 
            resetBorder.lineStyle(4, 0xfffffff, 1); 
            resetBorder.strokeRect(
                resetButton.x - resetButton.displayWidth/2, 
                resetButton.y - resetButton.displayHeight/2, 
                resetButton.displayWidth, 
                resetButton.displayHeight
            );
        });

        resetButton.on('pointerout', () => {
            resetBorder.clear();
            resetBorder.lineStyle(4, 0x000000, 1); 
            resetBorder.strokeRect(
                resetButton.x - resetButton.displayWidth/2, 
                resetButton.y - resetButton.displayHeight/2, 
                resetButton.displayWidth, 
                resetButton.displayHeight
            );
        });

        
        const resumeBorder = this.add.graphics();
        resumeBorder.lineStyle(4, 0x0000000); 
        resumeBorder.strokeRect(
            resumeButton.x - resumeButton.displayWidth/2, 
            resumeButton.y - resumeButton.displayHeight/2, 
            resumeButton.displayWidth, 
            resumeButton.displayHeight
        );

        resumeButton.on('pointerover', () => {
            resumeBorder.clear(); 
            resumeBorder.lineStyle(4, 0xfffffff, 1); 
            resumeBorder.strokeRect(
                resumeButton.x - resumeButton.displayWidth/2,
                resumeButton.y - resumeButton.displayHeight/2,
                resumeButton.displayWidth,
                resumeButton.displayHeight
            );
        });

        resumeButton.on('pointerout', () => {
            resumeBorder.clear();
            resumeBorder.lineStyle(4, 0x000000, 1); 
            resumeBorder.strokeRect(
                resumeButton.x - resumeButton.displayWidth/2,
                resumeButton.y - resumeButton.displayHeight/2,
                resumeButton.displayWidth,
                resumeButton.displayHeight
            );
        });
    }
}