export default class mainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu'});
        //Array con los aliados obtenidos. Empieza vacío porque no tiene ninguno
        this.ownedAllies = [];
        //Dinero del jugador. Empieza con 10
        this.money = 10;
    }

    preload(){
        this.load.image('startButton','assets/start_button.png')
        //this.load.image('marketButton','assets/button.png')
        this.load.image('background','assets/background.png')
        this.load.image('cat','assets/cat_maintitle.png')
    }

    create(){
        //fondo con título
        this.add.image(450,340,'background');
        this.add.image(450,340,'cat');
   
        //botón de juego
        const playButton = this.add.image(300, 100, 'startButton').setInteractive();
        //const marketButton = this.add.image(600,100,'marketButton').setInteractive();

        playButton.setPosition(450, 600);
        //marketButton.setPosition(450, 450);
        
        playButton.on('pointerdown',()=>{
            this.scene.start('debugMarket', {
                ownedAllies: this.ownedAllies,
                money: this.money
            });
        });

        /*
        //Botones debug
        marketButton.on('pointerdown',()=>{
            this.scene.start('debugMarket');
        });
        
        playButton.on('pointerdown',()=>{
            this.scene.start('combatSetup');
        });
        */
    }
}

