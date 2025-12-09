
import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";
import { DialogueKeys } from "../managers/dialogueConfig.js";
import DOMmanager from "../managers/DOMManager.js";

export default class mainMenu extends Phaser.Scene{
    constructor(DOManager){
        super({key: 'mainMenu'});
        this.DOMmanager = DOManager;
        this.playerData = { 
            ownedAllies: [],
            money: 10,
            level: 0,
            ownedObjects: []
        }
        this.audioManager = null;
        this.fromReset = data?.reset === true;
    }

    preload(){
        this.load.image('startButton','assets/buttons/start.png')
        //this.load.image('marketButton','assets/button.png')
        this.load.image('bg','assets/backgrounds/mainMenu.png')
        this.load.image('mainMenuCat','assets/main_menu/mainmenu_cat.png')
        this.load.image('furry','assets/main_menu/furryLogo.png')
    }

    create(){

        if (this.fromReset) {
            this.cameras.main.fadeIn(800, 0, 0, 0);
        }

        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.MENU);

        //fondo con título
        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,'bg').setDisplaySize(this.sys.game.canvas.width,this.sys.game.canvas.height);
        const cat = this.add.image(this.sys.game.canvas.width*0.25,this.sys.game.canvas.height*0.6,'mainMenuCat').setDisplaySize(550,710);
        const meow = this.add.image(this.sys.game.canvas.width*0.7,this.sys.game.canvas.height*0.4,'furry').setDisplaySize(600,320);

        this.tweens.add({
        targets: cat,           
        y: cat.y - 30,    
        x: cat.x - 10 ,    
        duration: 1800,         
        ease: 'Sine.easeInOut', 
        yoyo: true,             
        loop: -1                
        });


        this.tweens.add({
        targets: meow,           
        y: meow.y - 50,          
        duration: 1500,         
        ease: 'Sine.easeInOut', 
        yoyo: true,             
        loop: -1                
        });

        //botón de juego
        const playButton = this.add.image(300, 100, 'startButton').setInteractive().setDisplaySize(400,130);
        //const marketButton = this.add.image(600,100,'marketButton').setInteractive();

        playButton.setPosition(this.sys.game.canvas.width*0.7, this.sys.game.canvas.height*0.8);
        //marketButton.setPosition(450, 450);
        
       
        playButton.on('pointerdown',()=>{
            
            this.cameras.main.fadeOut(800, 0, 0, 0); 
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start("DialogueScene", 
                    { dialogueKey: DialogueKeys.INTRO,
                        nextScene: 'debugMap',
                        playerData: this.playerData
                    }, 
                );

            });
        });

        //borde del botón de jugar
        const border = this.add.graphics();
        border.lineStyle(4, 0x000000); 
        border.strokeRect(
            playButton.x - playButton.displayWidth/2, 
            playButton.y - playButton.displayHeight/2, 
            playButton.displayWidth, 
            playButton.displayHeight
        );

        playButton.on('pointerover', () => {
            border.clear(); 
            border.lineStyle(4, 0xffffff, 0.7); 
            border.strokeRect(
                playButton.x - playButton.displayWidth/2,
                playButton.y - playButton.displayHeight/2,
                playButton.displayWidth,
                playButton.displayHeight
            );
        });

        playButton.on('pointerout', () => {
            border.clear();
            border.lineStyle(4, 0x000000, 1); 
            border.strokeRect(
                playButton.x - playButton.displayWidth/2,
                playButton.y - playButton.displayHeight/2,
                playButton.displayWidth,
                playButton.displayHeight
            );
        });
        
        this.DOMmanager.inicializa(this.playerData.ownedAllies);
    }
}

