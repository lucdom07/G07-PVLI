import Ally from "../../gameObjects/characters/ally.js";
import globalObjects from "../managers/globalObjects.js";

export default class MarketManager {
    constructor(scene, buttonTexture){
        this.scene = scene;
        this.textureButton = buttonTexture;
        
        this.bag = [];
        this.marketAllies = [];
        this.marketObjects = [];
        this.money = 0;
        
        this.moneyText = null;
        this.messageText = null;
        this.selectedForSale = null;
        this.sellPanel = null;
        this.sellButtons = [];

        this.objectBag =[];

        this.ObjectSize = 100;
    }
    
    market(bag, allyList, objList, money, ownedObjectsBag){
        this.bag = bag;
        this.marketAllies = this.generateAlly(allyList, 3);
        this.marketObjects = this.generateObject(objList, 2); // objetos no implementados aún
        this.showMarket(money);

        this.objectBag = ownedObjectsBag || [];    
}

    makeStruct(item) {
        if(item===Ally){
            return {
            item: item, 
            texture: null,
            button: null,
            buttonText: null,
            priceText: null,
            levelText: null,
            infoText: null
            };
        }else{
            return {
            item: item, 
            texture: null,
            button: null,
            buttonText: null,
            priceText: null,
            infoText: null
            };
        }
       
    }

    generateAlly(allyList, slots){
        const marketAllies = [];
        const available = allyList.filter(a => !a.available);

        for (let i = 0; i < slots; i++) {
            if (available.length === 0) break;
            const index = Phaser.Math.Between(0, available.length - 1);
            const clone = available[index].clone();
     
            if (clone.scene !== this.scene) {
                clone.scene = this.scene;
                this.scene.add.existing(clone);
            }

            marketAllies.push(this.makeStruct(clone));
        }
        
        return marketAllies;
    }

    showMarket(money) {
        this.clearMarket();
        this.money = money;
        this.showMoney();

        this.marketAllies.forEach((marketItem, index) => {
            this.displayMarketItem(marketItem, index);
        });

        this.marketObjects.forEach((marketItem, index) => {
        this.displayMarketItem(marketItem, index);
        });
    }

    displayMarketItem(marketItem, index){
        let x = 0;
        if(marketItem.item instanceof Ally){
            x = 150 + index * 150;
        }
        else x = 750 + index * 150; //en caso de que fuera un objeto

        const y = 200;
        const item = marketItem.item;
        
        if (!item.scene) {
        this.scene.add.existing(item);
        }
        if(marketItem.item instanceof Ally){
            item.setPosition(x, y)
            .setScale(0.5)
            .setInteractive()
            .setVisible(true);
        }else{
           item.setPosition(x, y)
            .setDisplaySize(this.ObjectSize, this.ObjectSize)
            .setInteractive()
            .setVisible(true); 
        }

        console.log(item);

        // Botón de compra
        marketItem.button = this.scene.add.image(x, y + 60, this.textureButton)
            .setInteractive()
            .setScale(0.3);
      
        // Texto del precio
        marketItem.priceText = this.scene.add.text(x, y - 30, `${item.cost}$`, {
            fontSize: '14px', fill: '#fff', backgroundColor: '#000'
        }).setOrigin(0.5);

        // Mostrar stats al pasar el ratón
        if(marketItem instanceof Ally){
            item.on('pointerover', () => {
            marketItem.infoText = this.scene.add.text(x, y - 80,
                `${item.name}\nHP:${item.life}\nATK:${item.attack},\nLVL:${item.level}`, {
                    fontSize: '12px',
                    fill: '#FFFFFF',
                    backgroundColor: '#000000',
                    padding: { x: 5, y: 5 },
                    align: 'center'
                }).setOrigin(0.5);
            });
        }else{ //en caso de que fuera un objeto
            item.on('pointerover', () => {
            marketItem.infoText = this.scene.add.text(x, y - 80,
                `${item.name}\nHP:${item.life}\nATK:${item.attack}`, {
                    fontSize: '12px',
                    fill: '#FFFFFF',
                    backgroundColor: '#000000',
                    padding: { x: 5, y: 5 },
                    align: 'center'
                }).setOrigin(0.5);
        });
        }

        item.on('pointerout', () => {
            if (marketItem.infoText) {
                marketItem.infoText.destroy();
                marketItem.infoText = null;
            }
        });

        marketItem.button.on('pointerdown', () => this.buyItem(marketItem));
    }

    showMoney(){
        if(this.moneyText) this.moneyText.destroy();
        this.moneyText = this.scene.add.text(
            this.scene.cameras.main.centerX, 50, `Dinero: ${this.money}$`, {
            fontSize: '24px', fill: '#fff', backgroundColor: '#000'
        }).setOrigin(0.5);
    }

    selectForSale(ally, index){
        if(this.selectedForSale) this.cancelSale();

        this.selectedForSale = {ally, index};
        const sellPrice = Math.floor(ally.cost/2);

        const panelX = 600, panelY = 350;
        const saleSprite = this.scene.add.sprite(panelX, panelY, ally.texture).setScale(0.5);
        const priceText = this.scene.add.text(panelX, panelY+40, `Vender por: ${sellPrice}$`, {fontSize:'14px', fill:'#fff', backgroundColor:'#000'}).setOrigin(0.5);
        const infoText = this.scene.add.text(panelX, panelY-40, `${ally.name}\nNvl:${ally.level}\nHP:${ally.life}\nATK:${ally.attack}`, {fontSize:'12px', fill:'#fff', backgroundColor:'#000'}).setOrigin(0.5);

        const sellBtn = this.scene.add.image(panelX-40, panelY+80, this.textureButton).setInteractive().setScale(0.4);
        const cancelBtn = this.scene.add.image(panelX+40, panelY+80, this.textureButton).setInteractive().setScale(0.4);

        const sellText = this.scene.add.text(panelX-40, panelY+80, 'Vender', {
            fontSize:'12px', fill:'#000'
        }).setOrigin(0.5);
        const cancelText = this.scene.add.text(panelX+40, panelY+80, 'Cancelar', {
            fontSize:'12px', fill:'#000'
        }).setOrigin(0.5);

        sellBtn.on('pointerdown', () => this.sellAlly(index, sellPrice));
        cancelBtn.on('pointerdown', () => this.cancelSale());

        this.sellPanel = {saleSprite, priceText, infoText, sellBtn, cancelBtn, sellText, cancelText};
    }

    cancelSale(){
        if(!this.sellPanel) return;
        Object.values(this.sellPanel).forEach(obj => {
            if (obj && obj.destroy) obj.destroy();
        });
        this.sellPanel = null;
        this.selectedForSale = null;
    }

    buyItem(marketItem){
        const item = marketItem.item;

        if(this.money < item.cost){ this.showMessage("No tienes dinero"); return; }

        if(this.bag.length >= 6 && item instanceof Ally){ this.showMessage("Inventario lleno"); return; }
        else if(this.objectBag.length >= 4 && !(item instanceof Ally)){ this.showMessage("Inventario de objetos lleno"); return; }

        this.money -= item.cost;

        // Clonar y agregar a la escena
        if(item instanceof Ally){
        const newAlly = item.clone();
        newAlly.available = true;

        if(!newAlly.scene) this.scene.add.existing(newAlly);

        // Ocultar temporalmente todo
        newAlly.setVisible(false);
        if(newAlly.warriorUI) 
        newAlly.warriorUI.destroy();
        
        //Al comprar el aliado, se actualiza el array de aliados disponibles del jugador y el dinero en la escena de market
        this.scene.events.emit('buyingAlly', newAlly, item.cost);
        this.showMessage(`¡Has comprado a ${newAlly.name}!`);
        }
        else{
            const newObj = item.clone();
            if(!newObj.scene) this.scene.add.existing(newObj);
            newObj.setVisible(false);

            this.objectBag.push(newObj);
            this.showMessage(`¡Has comprado ${newObj.name}!`);
        }
        

        // Remover del mercado
        item.setVisible(false).disableInteractive();
        if(marketItem.button) marketItem.button.destroy();
        if(marketItem.priceText) marketItem.priceText.destroy();
        if(marketItem.levelText) marketItem.levelText.destroy();
        if(marketItem.infoText) marketItem.infoText.destroy();

        this.showMoney();
    }

    sellAlly(index, sellPrice){
        const ally = this.bag[index];
        if(!ally) return;

        //ally.available = false;
        this.money += sellPrice;

        this.scene.events.emit('sellingAlly', index, sellPrice);

        this.cancelSale();
        this.showMoney();
        this.showMessage(`¡Has vendido a ${ally.name} por ${sellPrice}$!`);
    }

    showMessage(msg){
        if(this.messageText) this.messageText.destroy();
        this.messageText = this.scene.add.text(this.scene.cameras.main.centerX, 100, msg, {
            fontSize: '18px', fill: '#f00', backgroundColor: '#000'
        }).setOrigin(0.5);
        this.scene.time.delayedCall(2000, () => { 
            if(this.messageText) this.messageText.destroy(); 
            this.messageText=null; 
        });
    }

    clearMarket(){
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
        this.cancelSale();
    }

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
