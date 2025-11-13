import MarketManager from "../managers/marketManager.js";
import Ally from "../../gameObjects/characters/ally.js";

export default class debugMarket extends Phaser.Scene{
    constructor(){
        super({key: 'debugMarket'});
    }

    init(){
         
        this.marketSystem = new MarketManager(this, this.load.image('button','assets/button.jpg'));

        this.allyList = [
            new Ally(this, -150, -150,'Michi-Michi', 36, 20, 0, 'perro', 0, 1, false, 0),
            new Ally(this, -150, -150,'Foca', 36, 20, 0, 'foca', 0, 1, false, 0),
            new Ally(this, -150, -150,'Pimiento', 36, 20, 0, 'pimiento', 0, 1, false, 0),
            new Ally(this, -150, -150,'Tortuga', 20, 5, 0, 'tortuga', 0, 1, false, 0),
            new Ally(this, -150, -150,'Chupacabra', 21, 10, 0, 'chupacabra', 0, 1, false, 0),
            new Ally(this, -150, -150,'Warf', 35, 7, 0, 'warf', 0, 1, false, 0)
        ];

        this.bag = [
            new Ally(this, -150, -150,'Chupacabra', 21, 10, 0, 'chupacabra', 0, 1, true, 0),
            new Ally(this, -150, -150,'Warf', 35, 7, 0, 'warf', 0, 1, true, 0)
        ];

        this.objList =[];

        this.money = 50;
    }
    

    preload(){
        //se cargan el fondo, las imagenes y la ui
        this.load.image('button','assets/button.jpg');
        this.load.image('background','assets/background.jpg');

        //strites de los personajes
        this.load.image('pimiento', 'assets/pimiento.png');
        this.load.image('tortuga','assets/tortuga.png');
        this.load.image('chupacabra','assets/Chupacabra.png');
        this.load.image('perro','assets/Dog.png');
        this.load.image('foca','assets/Seal.png');
        this.load.image('warf','assets/Warf.png');
    }

    create(){
        //añadir el fondo del mercado
        //crear una generacion aleatoria de los personajes a comprar
        //añadir la venta de los personajes que tengas y eliminarlas del inventario
        //mostrar el precio de las cosas
        //al comprar el personaje se añade al inventario
        //cunado no tengas suficiente dinero no te deja

        this.add.image(450,340,'background');
        const exitButton = this.add.image(300,100,'button').setInteractive();

        exitButton.setPosition(600,500);

        exitButton.on('pointerdown', () =>{
            this.scene.start('mainMenu');
        });

        this.marketSystem.textureButton = 'button'; 
        this.marketSystem.market(this.bag, this.allyList, this.objList, this.money);


    }
}