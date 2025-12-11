import MarketManager from "../managers/marketManager.js";
import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";
import { DialogueKeys } from "../managers/dialogueConfig.js";


import cargaGameObject from "../managers/cargaGameObjects.js";

export default class debugMarket extends Phaser.Scene{
    constructor(DOMmanager){
        super({key: 'debugMarket'});
        this.DOManager = DOMmanager;
        this.playerData = {};
        this.audioManager = null;
        this.mapMusic = [MusicKeys.AU, MusicKeys.ES, MusicKeys.CH, MusicKeys.USA];
        this.cargaGameObject = null;
        this.GameObjectOfLevel ={
            allies :[],
            objects:[]
        }
    }

    //en init le paso los aliados que tiene el jugador
    init(data){
        this.playerData = data.playerData;
        this.marketSystem = new MarketManager(this, this.load.image('buyButton','assets/placeholders/buttons/market_button.png'), this.DOManager);
    }
    
    preload(){
        this.load.image('buyButton','assets/buttons/buy.png');
        this.load.image('exitButton','assets/buttons/quit.png');
        this.load.image('shopBackground','assets/backgrounds/shopBackground.png');
    }

    create(){
        this.openShopDialogue();
        this.cameras.main.fadeIn(800, 0, 0, 0);
       
        this.cargaGameObject = new cargaGameObject(this, this.playerData.level);
        this.GameObjectOfLevel.allies = this.cargaGameObject.loadAllyGroups();
        this.GameObjectOfLevel.objects = this.cargaGameObject.loadObjectGroups();

        this.quitOwnedAlliesFromArray();
   
        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.TIENDA);
        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'shopBackground');
        
        //Eventos personalizados
        //En ambos eventos se actualizan los aliados disponibles y el dinero
        this.events.on('buyingAlly', (price)=>{
            this.DOManager.updateAllies();
            this.playerData.money -= price;
        });
        this.events.on('buyingObject', (price)=>{
            this.playerData.money -= price;
        });
        this.events.on('sellingAlly', (index, price)=>{
            this.playerData.ownedAllies.splice(index, 1);
            this.playerData.money += price;
        });

        
        this.createExitButton();
        this.marketSystem.textureButton = 'buyButton'; 
        this.marketSystem.market(this.playerData.ownedAllies, this.GameObjectOfLevel.allies, this.GameObjectOfLevel.objects, this.playerData.money, this.playerData.ownedObjects);
      
    }

    /**
     * quita a los aliados que ya tiene el jugador del array de disponibles
     * para evitar que salgan los que ya tienes
     */
    quitOwnedAlliesFromArray(){
        const ownedAllyNames = this.playerData.ownedAllies.map(ally => ally.name);
    
        // Filtrar los aliados disponibles, excluyendo aquellos cuyo nombre esté en ownedAllyNames
        this.GameObjectOfLevel.allies = this.GameObjectOfLevel.allies.filter(ally => {
            return !ownedAllyNames.includes(ally.name);
        });
        

    }

    /**
     * crea la escena de diálogo de la tienda
     */
    openShopDialogue(){
           this.cameras.main.once('camerafadeincomplete', () => {
            //diálogo de la tienda
            this.scene.pause();
            this.scene.launch("DialogueScene", {
                dialogueKey: DialogueKeys.TIENDA,
                returnScene: this.scene.key,
                nextScene: null,
                playerData: this.playerData,
                backgroundKey: "shop"
            });
        });
    }

    /**
     * crea el botón de vuelta al mapa
     */
    createExitButton(){
    const exitButton = this.add.image(300,100,'exitButton').setInteractive().setDisplaySize(400,130);

        exitButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);

        exitButton.on('pointerdown', () =>{       
            this.events.off('buyingAlly');
            this.events.off('buyingObject');
            this.events.off('sellingAlly');
            this.cameras.main.fadeOut(800, 0, 0, 0); 
                this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop();
                this.scene.resume('debugMap'); 
                this.audioManager.playMusic(this.mapMusic[this.playerData.level]);
            });
        });

        const border = this.add.graphics();
        border.lineStyle(4, 0x000000); 
        border.strokeRect(
            exitButton.x - exitButton.displayWidth/2, 
            exitButton.y - exitButton.displayHeight/2, 
            exitButton.displayWidth, 
            exitButton.displayHeight
        );

        exitButton.on('pointerover', () => {
            border.clear(); 
            border.lineStyle(4, 0xffffff, 0.7); 
            border.strokeRect(
                 exitButton.x - exitButton.displayWidth/2, 
                exitButton.y - exitButton.displayHeight/2, 
                exitButton.displayWidth, 
                exitButton.displayHeight
            );
        });

        exitButton.on('pointerout', () => {
            border.clear();
            border.lineStyle(4, 0x000000, 1); 
            border.strokeRect(
                 exitButton.x - exitButton.displayWidth/2, 
                exitButton.y - exitButton.displayHeight/2, 
                exitButton.displayWidth, 
                exitButton.displayHeight
            );
        });

    }
}
