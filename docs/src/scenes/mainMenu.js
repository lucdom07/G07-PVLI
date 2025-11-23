export default class mainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu'});
        this.playerData = { 
            ownedAllies: [],
            money: 10
        };
    }

    preload(){
        this.load.image('startButton','assets/placeholders/buttons/start_button.png')
        //this.load.image('marketButton','assets/button.png')
        this.load.image('background','assets/placeholders/background.png')
        this.load.image('cat','assets/placeholders/cat_maintitle.png')
    }

    create(){
        //fondo con título
        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,'background');
        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,'cat');
   
        //botón de juego
        const playButton = this.add.image(300, 100, 'startButton').setInteractive();
        //const marketButton = this.add.image(600,100,'marketButton').setInteractive();

        playButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
        //marketButton.setPosition(450, 450);
        
        playButton.on('pointerdown',()=>{
            this.scene.start('debugMarket', this.playerData);
        });
    }
}

