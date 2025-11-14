import Ally from "../../gameObjects/characters/ally.js";

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
    }
    
    market(bag, allyList, objList, money){
        this.bag = bag;
        this.marketAllies = this.generateAlly(allyList, 3);
        this.marketObjects = []; // objetos no implementados aún
        this.showMarket(money);
    }

    makeStruct(item) {
        return {
            item: item, 
            texture: null,
            button: null,
            buttonText: null,
            priceText: null,
            levelText: null,
            infoText: null
        };
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

        this.displayPlayerAllies();
    }

    displayMarketItem(marketItem, index){
        const x = 150 + index * 150;
        const y = 200;
        const item = marketItem.item;

        
        if (!item.scene) {
        this.scene.add.existing(item);
        }
        item.setPosition(x, y).setScale(0.5).setInteractive().setVisible(true);

        // Botón de compra
        marketItem.button = this.scene.add.image(x, y + 60, this.textureButton)
            .setInteractive()
            .setScale(0.3);
      
        // Texto del precio
        marketItem.priceText = this.scene.add.text(x, y - 30, `${item.cost}$`, {
            fontSize: '14px', fill: '#fff', backgroundColor: '#000'
        }).setOrigin(0.5);

        

        // Mostrar stats al pasar el ratón
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

        item.on('pointerout', () => {
            if (marketItem.infoText) {
                marketItem.infoText.destroy();
                marketItem.infoText = null;
            }
        });

        marketItem.button.on('pointerdown', () => this.buyItem(marketItem));
    }

    displayPlayerAllies(){
        this.sellButtons.forEach(b => b.destroy());
        this.sellButtons = [];

        this.bag.forEach((ally, index) => {
            if(!ally.available) return;

            const x = 150 + index * 150;
            const y = 350;
            ally.setPosition(x, y).setScale(0.5);
            if(!ally.scene) this.scene.add.existing(ally);

            ally.on('pointerdown', () => this.selectForSale(ally, index));
            this.sellButtons.push(ally);
        });
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
        if(this.bag.length >= 6){ this.showMessage("Inventario lleno"); return; }

        this.money -= item.cost;

        // Clonar y agregar a la escena
        const newAlly = item.clone();
        newAlly.available = true;

        if(!newAlly.scene) this.scene.add.existing(newAlly);

        // Ocultar temporalmente todo
        newAlly.setVisible(false);
        if(newAlly.warriorUI) 
        newAlly.warriorUI.destroy();
        
        
        //this.bag.push(newAlly);
        //Al comprar el aliado, se actualiza el array de aliados disponibles del jugador y el dinero en la escena de market
        this.scene.events.emit('buyingAlly', newAlly, item.cost);

        // Remover del mercado
        item.setVisible(false).disableInteractive();
        if(marketItem.button) marketItem.button.destroy();
        if(marketItem.priceText) marketItem.priceText.destroy();
        if(marketItem.levelText) marketItem.levelText.destroy();
        if(marketItem.infoText) marketItem.infoText.destroy();

        this.showMoney();
        this.displayPlayerAllies();
        this.showMessage(`¡Has comprado a ${newAlly.name}!`);
    }


    sellAlly(index, sellPrice){
        //const ally = this.bag[index];
        if(!ally) return;

        //ally.available = false;
        this.bag.splice(index, 1);
        this.money += sellPrice;

        this.scene.events.emit('sellingAlly', index, sellPrice);

        this.cancelSale();
        this.showMoney();
        this.displayPlayerAllies();
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

}
