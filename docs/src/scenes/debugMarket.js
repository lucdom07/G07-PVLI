import MarketManager from "../managers/marketManager.js";
import Ally from "../../gameObjects/characters/ally.js";
import GlobalObject from "../managers/globalObjects.js";
import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";
import { DialogueKeys } from "../managers/dialogueConfig.js";
import DOMmanager from "../managers/DOMManager.js";

import cargaGameObject from "../managers/cargaGameObjects.js";

export default class debugMarket extends Phaser.Scene{
    constructor(DOMmanager){
        super({key: 'debugMarket'});
        this.DOManager = DOMmanager;
        this.playerData = {};
        this.audioManager = null;

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

        //sprites de los personajes
        // this.load.image('pimiento', 'assets/placeholders/warriors/pepper_miku_placeholder.png');
        // this.load.image('tortuga','assets/placeholders/warriors/green_miku_placeholder.png');
        // this.load.image('chupacabra','assets/placeholders/warriors/dark_blue_miku_placeholder.png');
        // this.load.image('perro','assets/placeholders/warriors/orange_miku_placeholder.png');
        // this.load.image('foca','assets/placeholders/warriors/light_blue_miku_placeholder.png');
        // this.load.image('warf','assets/placeholders/warriors/garnet_miku_placeholder.png');

        // this.load.image('comida1','assets/placeholders/objets/comida1.png');
        // this.load.image('comida2','assets/placeholders/objets/comida2.png');
        // this.load.image('comida3','assets/placeholders/objets/comida3.png');
        // this.load.image('comida4','assets/placeholders/objets/comida4.png');


    }

    create(){
        this.cargaGameObject = new cargaGameObject(this, this.playerData.level);
        this.GameObjectOfLevel.allies = this.cargaGameObject.loadAllyGroups();
        this.GameObjectOfLevel.objects = this.cargaGameObject.loadObjectGroups();

        console.log(this.GameObjectOfLevel);


        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.cameras.main.once('camerafadeincomplete', () => {
            //diálogo de la tienda
            this.scene.pause();
            this.scene.launch("DialogueScene", {
                dialogueKey: DialogueKeys.TIENDA,
                returnScene: this.scene.key,
                nextScene: null,
                playerData: this.playerData
            });
        });
        
        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.TIENDA);
        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'shopBackground');
        
        //Eventos personalizados
        //En ambos eventos se actualizan los aliados disponibles y el dinero
        //Creo que no hace falta pasar ally porque en marketManager se ha copiado el array por referencia, pero tengo que verlo
        this.events.on('buyingAlly', (price)=>{
            this.DOManager.updateAllies();

            console.log(this.playerData.ownedAllies.length);
            this.playerData.ownedAllies.forEach(element => { console.log(element.name);});
            
            this.playerData.money -= price;
        });
        this.events.on('buyingObject', (price)=>{
            this.playerData.money -= price;
            console.log("new money:" + this.playerData.money);
        });
        this.events.on('sellingAlly', (index, price)=>{
            this.playerData.ownedAllies.splice(index, 1);
            this.playerData.money += price;
        });
        
        //añadir el fondo del mercado
        //crear una generacion aleatoria de los personajes a comprar
        //añadir la venta de los personajes que tengas y eliminarlas del inventario
        //mostrar el precio de las cosas
        //al comprar el personaje se añade al inventario
        //cuando no tengas suficiente dinero no te deja
        // this.allyList = [
        //     new Ally(this, -150, -150,'Michi-Michi', 36, 20, 0, 'perro', 0, 1, false, 0),
        //     new Ally(this, -150, -150,'foca', 36, 20, 0, 'foca', 0, 1, false, 0),
        //     new Ally(this, -150, -150,'pimiento', 36, 20, 0, 'pimiento', 0, 1, false, 0),
        //     new Ally(this, -150, -150,'tortuga', 20, 5, 0, 'tortuga', 0, 1, false, 0),
        //     new Ally(this, -150, -150,'chupacabra', 21, 10, 0, 'chupacabra', 0, 1, false, 0),
        //     new Ally(this, -150, -150,'warf', 35, 7, 0, 'warf', 0, 1, false, 0)
        // ];

        // this.objList =[
        //     new GlobalObject(this, -150, -150,"comida1","assets/placeholders/objets/comida1.png", 5 ,2 ,2,"comida1"),
        //     new GlobalObject(this, -150, -150,"comida2","assets/placeholders/objets/comida2.png", 2 ,-3 ,1,"comida2"),
        //     new GlobalObject(this, -150, -150,"comida3","assets/placeholders/objets/comida3.png", 0 ,2 ,19,"comida3"),
        //     new GlobalObject(this, -150, -150,"comida4","assets/placeholders/objets/comida4.png", 2 ,0 ,3,"comida4")
        // ];

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
                console.log("Saliendo del mercado");
                console.log("ownedAllies: " + this.playerData.ownedAllies);
                this.audioManager.playMusic(MusicKeys.MAPA);
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

        /*
        BOTÓN DE EXIT
        */
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


        this.marketSystem.textureButton = 'buyButton'; 
        this.marketSystem.market(this.playerData.ownedAllies, this.GameObjectOfLevel.allies, this.GameObjectOfLevel.objects, this.playerData.money, this.playerData.ownedObjects);
        //this.marketSystem.market(this.ownedAllies, this.allyList, this.objList, this.money, this.ownedObjects);

    }
}
