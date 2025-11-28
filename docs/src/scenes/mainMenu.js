export default class mainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu'});
        //Array con los aliados obtenidos. Empieza vacío porque no tiene ninguno
        this.ownedAllies = [];
        //Dinero del jugador. Empieza con 10
        this.money = 10;

        this.level =0;
         this.ownedObjects = [];
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
            this.scene.start('debugMarket', {
                ownedAllies: this.ownedAllies,
                money: this.money,
                ownedObjects: this.ownedObjects || [],
                level: this.level

            });
        });
    }
}

