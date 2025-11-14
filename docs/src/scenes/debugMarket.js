import MarketManager from "../managers/marketManager.js";
import Ally from "../../gameObjects/characters/ally.js";

export default class debugMarket extends Phaser.Scene{
    constructor(){
        super({key: 'debugMarket'});
        //Array con los aliados obtenidos
        this.ownedAllies = [];
        //Dinero del jugador
        this.money = 0;
    }

    //En init le pasamos los aliados que tiene el jugador
    init(data){
        this.marketSystem = new MarketManager(this, this.load.image('buyButton','assets/market_button.png'));
        this.ownedAllies = data.ownedAllies;
        this.money = data.money;
    }
    
    preload(){
        //se cargan el fondo, las imagenes y la ui
        this.load.image('buyButton','assets/market_button.png');
        this.load.image('exitButton','assets/start_button.png');
        this.load.image('background','assets/background.jpg');

        //sprites de los personajes
        this.load.image('pimiento', 'assets/pepper_miku_placeholder.png');
        this.load.image('tortuga','assets/green_miku_placeholder.png');
        this.load.image('chupacabra','assets/dark_blue_miku_placeholder.png');
        this.load.image('perro','assets/orange_miku_placeholder.png');
        this.load.image('foca','assets/light_blue_miku_placeholder.png');
        this.load.image('warf','assets/garnet_miku_placeholder.png');
    }

    create(){
        //Eventos personalizados
        //En ambos eventos se actualizan los aliados disponibles y el dinero
        //Creo que no hace falta pasar ally porque en marketManager se ha copiado el array por referencia, pero tengo que verlo
        this.events.on('buyingAlly', (ally, price)=>{
            //this.ownedAllies.push(ally);
            this.money -= price;
        });
        this.events.on('sellingAlly', (index, price)=>{
            //this.ownedAllies.splice(index, 1);
            this.money += price;
        });
        
        //añadir el fondo del mercado
        //crear una generacion aleatoria de los personajes a comprar
        //añadir la venta de los personajes que tengas y eliminarlas del inventario
        //mostrar el precio de las cosas
        //al comprar el personaje se añade al inventario
        //cuando no tengas suficiente dinero no te deja
        this.allyList = [
            new Ally(this, -150, -150,'Michi-Michi', 36, 20, 0, 'perro', 0, 1, false, 0),
            new Ally(this, -150, -150,'foca', 36, 20, 0, 'foca', 0, 1, false, 0),
            new Ally(this, -150, -150,'pimiento', 36, 20, 0, 'pimiento', 0, 1, false, 0),
            new Ally(this, -150, -150,'tortuga', 20, 5, 0, 'tortuga', 0, 1, false, 0),
            new Ally(this, -150, -150,'chupacabra', 21, 10, 0, 'chupacabra', 0, 1, false, 0),
            new Ally(this, -150, -150,'warf', 35, 7, 0, 'warf', 0, 1, false, 0)
        ];

        /*
        this.bag = [
            new Ally(this, -150, -150,"chupacabra", 21, 10, 0, 'chupacabra', 0, 1, true, 0),
            new Ally(this, -150, -150,"warf", 35, 7, 0, 'warf', 0, 1, true, 0)
        ];
        */
        this.objList =[];
        this.add.image(450,340,'background');
        const exitButton = this.add.image(300,100,'exitButton').setInteractive();

        exitButton.setPosition(600,500);

        exitButton.on('pointerdown', () =>{        
            this.scene.start('debugMap', {
                ownedAllies: this.ownedAllies,
                money: this.money
            });
            console.log("Saliendo del mercado");
        });

        this.marketSystem.textureButton = 'buyButton'; 
        this.marketSystem.market(this.ownedAllies, this.allyList, this.objList, this.money);
    }
}