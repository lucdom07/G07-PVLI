import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";
import Ally from "../../gameObjects/characters/ally.js";

export default class mainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu'});
        this.playerData = {
            
        }
    }

    init(data){
        this.playerData = {
            ownedAllies: [],
            money: 10,
            level: 0,
            ownedObjects: []
        }
        this.audioManager = null;
        this.fromReset = data?.reset === true;

        this.loadMichi();
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
                this.scene.start('introduction', this.playerData);
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
        
    }


    loadMichi(){
        
        const groupToLoad = this.getAllyGroup(0);
        groupToLoad.forEach(ally => {
        this.load.image(ally.name + "Textura", ally.texture);})

        const group = this.getAllyGroup(0);

        const michi = group.map(allyData =>{
                    return new Ally(
                        this,
                        -150,
                        -150,
                        allyData.name,
                        allyData.life,
                        allyData.attack,
                        allyData.range,
                        allyData.name+"Textura",
                        0,
                        allyData.cost,
                        false,
                        allyData.texture
                    )
                })

        this.playerData.ownedAllies.push(michi);

        console.log(this.playerData.ownedAllies);
    }


    getAllyGroup(num){
        const allyKey = `ally${num}`;
        const rawData = this.cache.json.get("allyGroup");

        if(rawData && rawData[allyKey]){
            return rawData[allyKey];
        }
        else return null;
    }
    
}

