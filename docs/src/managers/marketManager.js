import Ally from "../../gameObjects/characters/ally.js";

export default class MarketManager {
    constructor(scene, buttonTexture, DomManager){
        //escena actual
        this.scene = scene;
        //textura del botón de compra
        this.textureButton = buttonTexture;
        //gestor del DOM
        this.DomManager = DomManager;
        
        //aliados ya obtenidos
        this.bag = [];
        //capacidad máxima del inventario
        this.maxCapacity = 6;
        //aliados y objetos en venta
        this.marketAllies = [];
        this.marketObjects = [];
        //dinero del jugador
        this.money = 0;
        
        //elementos UI
        this.moneyText = null;
        this.messageText = null;
        this.selectedForSale = null;
        this.sellPanel = null;
        this.sellButtons = [];

        //objetos ya obtenidos
        this.objectBag =[];

        //tamaño de los objetos en venta
        this.ObjectSize = 100;
        this.FIRST_ALLY_X = 150;
        this.ALLIES_Y = 200;
        this.FIRST_OBJECT_X = 850;
        this.OBJECTS_Y = 250;
        this.ITEM_DISTANCE = 150;
    }
    
    /**
     * inicialización del mercado
     * @param {array} bag - aliados que poseemos actualmente
     * @param {array} allyList - lista total de aliados
     * @param {array} objList - lista total de objetos
     * @param {int} money - dinero actual
     * @param {array} ownedObjectsBag - objetos qe poseemos actualmente
     */
    market(bag, allyList, objList, money, ownedObjectsBag){
        //aliados ya obtenidos
        this.bag = bag;
        //genero aliados y objetos en venta
        console.log("aaaaaaa");
        this.marketAllies = this.generateAlly(allyList, 3);
        this.marketObjects = this.generateObject(objList, 2); // objetos no implementados aún
        //muestro el mercado
        this.showMarket(money);
        //objetos ya obtenidos
        this.objectBag = ownedObjectsBag || [];    
    }

    /**
     * crea un elemento en el mercado
     * @param {item} item - aliado u objeto del cual se va a crear un nuevo objeto específico para el mercado
     * @returns - todos los atributos desglosados de dicho elemento
     */
    makeStruct(item) {
        return {
            item: item, 
            texture: null,
            button: null,
            buttonText: null,
            priceText: null,
            infoText: null
        };
    }

    /**
     * generación aleatoria de aliados en el mercado a partir de una
     * sub-lista (para dividir los aliados disponibles por país)
     * @param {array} allyList - lista de aliados disponibles
     * @param {int} slots - número de huecos de la tienda
     * @returns 
     */
    generateAlly(allyList, slots){
        //array donde se guardan los aliados generados
        const marketAllies = [];
        //filtra los aliados disponibles (no comprados)
        const available = allyList.filter(a => !a.available);

        if (available.length === 0) {
        return marketAllies;
        }

        //copia de los que son validos
        const shuffled = [...available];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const count = Math.min(slots,shuffled.length);

        //toma el numero de count de los primeros slots mezclados de shuffled
        for (let i = 0; i < count; i++) {

            const clone = shuffled[i].clone();
            clone.scene = this.scene;
            //elimina el aliado elegido del array de disponibles
            if (!clone.scene) {
            this.scene.add.existing(clone);
        }
        //lo añade al array de aliados del mercado
        marketAllies.push(this.makeStruct(clone));
        }
        
        //devuelvo el array de aliados generados
        return marketAllies;
    }


    /**
     * muestra los elementos escogidos en el mercado
     * @param {int} money - dinero del jugador
     */
    showMarket(money) {
        //limpio el mercado anterior
        this.clearMarket();
        //actualizo el dinero
        this.money = money;
        //muestro el dinero
        this.showMoney();

        //muestro los aliados en venta
        this.marketAllies.forEach((marketItem, index) => {
            this.displayMarketItem(marketItem, index);
        });

        //muestro los objetos en venta
        this.marketObjects.forEach((marketItem, index) => {
            this.displayMarketItem(marketItem, index);
        });
    }

    /**
     * muestra un elemento en el mercado
     * @param {item} marketItem - elemento en cuestión
     * @param {int} index - índice de posición
     */
    displayMarketItem(marketItem, index){
        //posición del aliado u objeto
        let x = 0;        
        let y = 0;
        //calculo la posición en función de si es aliado u objeto
        if(marketItem.item instanceof Ally){
            x = this.FIRST_ALLY_X + index * this.ITEM_DISTANCE;
            y = this.ALLIES_Y
        }
        else {
            x = this.FIRST_OBJECT_X + index * this.ITEM_DISTANCE; //en caso de que fuera un objeto
            y = this.OBJECTS_Y
        }
        const item = marketItem.item;
        
        //añado el sprite del aliado u objeto
        if (!item.scene) {
            this.scene.add.existing(item);
        }
        //configuro el sprite dependiendo de si es aliado u objeto
        if(marketItem.item instanceof Ally){
            item.setPosition(x, y)
            .setScale(0.5)
            .setInteractive()
            .setVisible(true);
        }
        else {
           item.setPosition(x, y)
            .setDisplaySize(this.ObjectSize, this.ObjectSize)
            .setInteractive()
            .setVisible(true); 
        }

        // botón de compra
        marketItem.button = this.scene.add.image(x, y + 60, this.textureButton)
            .setInteractive()
            .setScale(0.1);
      
        // Texto del precio
        marketItem.priceText = this.scene.add.text(x, y + 120, `${item.cost}$`, {
            fontSize: '35px', fill: '#000', backgroundColor: '#D4D4D4', fontFamily: "Caveat Brush"
        }).setOrigin(0.5);

        // muestro stats al pasar el ratón
        if(marketItem instanceof Ally){
            item.on('pointerover', () => {
            marketItem.infoText = this.scene.add.text(x, y - 60,
                `${item.name}\nHP:${item.life}\nATK:${item.attack},\nLVL:${item.level}`, {
                    fontSize: '25px',
                    fill: '#000',
                    backgroundColor: '#D4D4D4',
                    fontFamily: "Caveat Brush",
                    padding: { x: 5, y: 5 },
                    align: 'center'
                }).setOrigin(0.5);
            });
        }
        else { //en caso de que fuera un objeto
            item.on('pointerover', () => {
            marketItem.infoText = this.scene.add.text(x, y - 80,
                `${item.name}\nHP:${item.life}\nATK:${item.attack}`, {
                    fontSize: '25px',
                    fill: '#000',
                    backgroundColor: '#D4D4D4',
                    fontFamily: "Caveat Brush",
                    padding: { x: 5, y: 5 },
                    align: 'center'
                }).setOrigin(0.5);
        });
        }

        //destruyo el texto al quitar el ratón
        item.on('pointerout', () => {
            if (marketItem.infoText) {
                marketItem.infoText.destroy();
                marketItem.infoText = null;
            }
        });

        //evento de compra
        marketItem.button.on('pointerdown', () => this.buyMarketItem(marketItem));
    }

    /**
     * muestra el dinero del jugador
     */
    showMoney(){
        if(this.moneyText) this.moneyText.destroy();
        this.moneyText = this.scene.add.text(
            this.scene.cameras.main.centerX, 50, `Dinero: ${this.money}$`, {
            fontSize: '40px', fontFamily: "Caveat Brush", fill: '#fff', backgroundColor: '#000'
        }).setOrigin(0.5);
    }

    /**
     * compra un aliado u objeto
     * @param {item} marketItem 
     * @returns 
     */
    buyMarketItem(marketItem) {
        const item = marketItem.item;

        //comprobaciones previas
        if (this.money < item.cost) { this.showMessage("No tienes dinero"); return; }
        //if (item instanceof Ally && this.bag.length >= this.maxCapacity) { this.showMessage("Inventario lleno"); return; }
        if (!(item instanceof Ally) && this.objectBag.length >= 4) { this.showMessage("Inventario de objetos lleno"); return; }

        //resto el dinero
        this.money -= item.cost;

        //añado el aliado u objeto al inventario
        if (item instanceof Ally) {
            
            const newAlly = item;
            //marco el aliado como disponible
            newAlly.available = true;
            //destruyo la UI del guerrero si la tuviera
            if (newAlly.warriorUI) {
                newAlly.warriorUI.destroy();
                newAlly.warriorUI = null;
            }
            //oculto el sprite en la escena
            newAlly.setVisible(false).disableInteractive();
            //lo añado al inventario
            this.bag.push(newAlly);
            //lanzo el evento de compra
            this.scene.events.emit('buyingAlly', newAlly.cost);

            this.showMessage(`¡Has comprado a ${newAlly.name}!`);
        } 
        else {
            // Para objetos
            const newObj = item;
            
            newObj.setVisible(false).disableInteractive();
            this.objectBag.push(newObj);
            //lanzo el evento de compra
            this.scene.events.emit('buyingObject', newObj.cost);

            this.showMessage(`¡Has comprado ${newObj.name}!`);
        }

        //destruyo los elementos del mercado
        if (marketItem.button) { 
            marketItem.button.destroy(); 
            marketItem.button = null; 
            console.log("boton compra destruido");
        }
        if (marketItem.priceText) { 
            marketItem.priceText.destroy(); 
            marketItem.priceText = null; 
            console.log("texto precio destruido");
        }
        if (marketItem.infoText) { 
            marketItem.infoText.destroy(); 
            marketItem.infoText = null; 
            console.log("texo info destruido");
        }

        //actualizo el dinero mostrado
        this.showMoney();
    }

    /**
     * muestra un mensaje en pantalla
     * @param {string} msg - mensaje a mostrar
     */
    showMessage(msg){
        if(this.messageText) this.messageText.destroy();
        this.messageText = this.scene.add.text(this.scene.cameras.main.centerX, 100, msg, {
            fontSize: '25px', fill: '#fff', backgroundColor: '#495169', fontFamily: "Caveat Brush"
        }).setOrigin(0.5);
        this.scene.time.delayedCall(2000, () => { 
            if(this.messageText) this.messageText.destroy(); 
            this.messageText=null; 
        });
    }

    /**
     * limpia el mercado
     */
    clearMarket(){
        //destruyo los elementos de los aliados y objetos en venta
        [...this.marketAllies, ...this.marketObjects].forEach(m=>{
            if(m.item){ m.item.setVisible(false).disableInteractive(); }
            if(m.button) m.button.destroy();
            if(m.buttonText) m.buttonText.destroy();
            if(m.priceText) m.priceText.destroy();
            if(m.levelText) m.levelText.destroy();
            if(m.infoText) m.infoText.destroy();
        });
        this.sellButtons.forEach(b=>b.destroy());
        this.sellButtons=[];
        if(this.moneyText) this.moneyText.destroy();
        if(this.messageText) this.messageText.destroy();
    }

    /**
     * genera un nuevo objeto
     * @param {array} objectList - lista total de objetos
     * @param {int} slots - número máximo de objetos que puede haber en una misma escena de mercado
     * @returns 
     */
    generateObject(objectList, slots){
        const marketObject = [];
 
        for (let i = 0; i < slots; i++) {
            const index = Phaser.Math.Between(0, objectList.length - 1);
            const clone = objectList[index].clone();
     
            if (clone.scene !== this.scene) {
                clone.scene = this.scene;
                this.scene.add.existing(clone);
            }

            marketObject.push(this.makeStruct(clone));
        }
        
        return marketObject;
    }
}
