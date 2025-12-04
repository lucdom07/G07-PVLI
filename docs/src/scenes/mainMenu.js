import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";

export default class mainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu'});
        this.playerData = {
            
        }
    }

    init(){
        this.playerData = {
            ownedAllies: [],
            money: 10,
            level: 0,
            ownedObjects: []
        }
        this.audioManager = null;
    }

    preload(){
        this.load.image('startButton','assets/placeholders/buttons/start_button.png')
        //this.load.image('marketButton','assets/button.png')
        this.load.image('mainMenuBackground','assets/main_menu/background.png')
        this.load.image('cat','assets/main_menu/cat.png')
    }

    create(){
        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.MENU);

        //fondo con título
        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,'mainMenuBackground').setDisplaySize(this.sys.game.canvas.width,this.sys.game.canvas.height);
        this.add.image(this.sys.game.canvas.width*0.17,this.sys.game.canvas.height*0.57,'cat').setDisplaySize(400,550);
   
        //botón de juego
        const playButton = this.add.image(300, 100, 'startButton').setInteractive();
        //const marketButton = this.add.image(600,100,'marketButton').setInteractive();

        playButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
        //marketButton.setPosition(450, 450);
        
        playButton.on('pointerdown',()=>{
            this.scene.start('introduction', this.playerData);
        });
    }
}

