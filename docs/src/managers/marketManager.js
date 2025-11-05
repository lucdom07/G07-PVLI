import Ally from "../../gameObjects/characters/ally.js";

export default class marketManager{
    constructor(scene, button){
        this.scene= scene;
        this.textureButtom = button;
        this.marketAlly = [];
        this.marketObj = [];
        this.money = 0;
        this.selectForSale= null;
        this.sellButtons = [];
        this.moneyText = null;
        this.messageText = null;
        this.sellPanel = null;
    }

    makeStruct(type) { //crea un struct entre el objeto y el boton
        return{
            type: type,
            button: null,
            priceText:null,
            levelText: null,
            costTest: null
        };
        
    }

    generateAlly(allyList, slots){
        const marketAlly = [];

        for (let i =0; i < slots; i++){
            const availableAllies = allyList.filter(ally => !ally.available)

            const index = Phaser.Math.Between(0, availableAllies.length-1); 
            const allyTemplate = availableAllies[index]; 

            const ally = allyTemplate.clone();

            marketAlly.push(this.makeStruct(ally));
        }
        return marketAlly;
    }

    generateObjects(objList, slots){
         const marketObj = [];

        for (let i =0; i < slots; i++){
            const index = Phaser.Math.Between(0, objList.length-1);
            const objTemplate = objList[index];

            const obj = objTemplate.clone();

            marketObj.push(this.makeStruct(obj));
        }
        return marketObj;
    }

    showMarket(marketAlly,marketObj, money){
        this.clearMarket();
        this.money = money;

        this.showMoney(money);

        marketAlly.forEach((marketItem,index) => {
            this.displayMarketItem(marketItem,index);
        });

        marketObj.forEach((marketItem,index) => {
            this.displayMarketItem(marketItem,index);
        });

        this.displayPlayerAllies();
    }

    displayMarketItem(marketItem,index){
        const x = 150 + (index * 150);
        const y = 200;

        marketItem.type.setPosition(x, y);
        marketItem.type.setScale(0.5);
        marketItem.type.setInteractive();
        marketItem.type.setVisible(true);

        //añade el elemento a la escea si no esta
        if (!marketItem.type.scene) {
        this.scene.add.existing(marketItem.type);
        }

        //implementacion de sus botones
        this.marketItem.button = this.scene.add.image(x,y+60, this.textureButtom)
            .setInteractive()
            .setScale(0.5);
        
        //texto del precio
        marketItem.priceText = this.scene.add.text(x,y+60, `${marketItem.type.cost}$`, {
            fontSize: '14px',
            fill: '#000000',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        //texto del nivel
        marketItem.levelText = this.scene.add.text(x, y - 30, `Nvl ${marketItem.type.level}`, {
            fontSize: '12px',
            fill: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);

         // Mostrar estadísticas al pasar el ratón
        marketItem.ally.on('pointerover', () => {
            this.showItemStats(marketItem, x, y);
        });
        
        marketItem.ally.on('pointerout', () => {
            if (marketItem.costText) {
                marketItem.costText.destroy();
                marketItem.costText = null;
            }
        });
        
        // Evento de compra
        marketItem.button.on('pointerdown', () => {
            this.buyItem(marketItem);
        });
    }

    showItemStats(marketItem,x,y){
        const stats = `${marketItem.ally.name}\nNvl: ${marketItem.ally.level}\nHP: ${marketItem.ally.life}\nATK: ${marketItem.ally.attack}\nPrecio: ${marketItem.ally.cost}$`;
        marketItem.costText = this.scene.add.text(x, y - 80, stats, {
            fontSize: '12px',
            fill: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        }).setOrigin(0.5);
    }

    displayPlayerAllies(){
         // Limpiar elementos anteriores
        this.sellButtons.forEach(btn => {
            if (btn && typeof btn.destroy === 'function') {
                btn.destroy();
            }
        });
        this.sellButtons = [];
        
        // Filtrar solo aliados disponibles
        const availableAllies = this.bag.filter(ally => ally.available);
        
        availableAllies.forEach((ally, index) => {
            const x = 150 + (index * 150);
            const y = 350;
            
            // Configurar posición del sprite del aliado
            ally.setPosition(x, y);
            ally.setScale(0.5);
            ally.setInteractive();
            ally.setVisible(true);
            
            // Añadir a la escena si no está añadido
            if (!ally.scene) {
                this.scene.add.existing(ally);
            }

            ally.on('pointerdown', () => {
                this.selectForSale(ally, index);
            });

            this.sellButtons.push(levelText);
        });
    }

    showMoney(money){
        if (this.moneyText) {
            this.moneyText.destroy();
        }
        
        this.moneyText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            50,
            `Dinero: ${money}$`, {
                fontSize: '24px',
                fill: '#FFFFFF',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5);
    }

    selectForSale(ally, index){
        if(this.selectedForSale) {
            this.cancelSale();
        }
        else if(bag.length <=1 ){
            this.showMessage("¡No puedes vender!");
            return;
        }

        this.selectedForSale = { ally: ally, index: index };
        const sellPrice = Math.floor(ally.cost / 2);

        const panelX = 600;
        const panelY = 350;

        //muestra el ally seleccionado
        const saleSprite = this.scene.add.sprite(panelX, panelY, ally.texture).setScale(0.5);

        // Texto del precio de venta
        const priceText = this.scene.add.text(panelX, panelY + 40, `Vender por: ${sellPrice}$`, {
            fontSize: '14px',
            fill: '#FFFFFF',
            backgroundColor: '#000000'
        }).setOrigin(0.5);

        // Texto de información
        const infoText = this.scene.add.text(panelX, panelY - 40, 
            `${ally.name}\nNvl: ${ally.level}\nHP: ${ally.life}\nATK: ${ally.attack}`, {
            fontSize: '12px',
            fill: '#FFFFFF',
            backgroundColor: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        
        // Botón vender
        const sellBtn = this.scene.add.image(panelX - 40, panelY + 80, this.textureButtom)
            .setInteractive()
            .setScale(0.4);
        const sellText = this.scene.add.text(panelX - 40, panelY + 80, 'Vender', {
            fontSize: '12px',
            fill: '#000000'
        }).setOrigin(0.5);
        
        // Botón cancelar
        const cancelBtn = this.scene.add.image(panelX + 40, panelY + 80, this.textureButtom)
            .setInteractive()
            .setScale(0.4);
        const cancelText = this.scene.add.text(panelX + 40, panelY + 80, 'Cancelar', {
            fontSize: '12px',
            fill: '#000000'
        }).setOrigin(0.5);
        
        // Guardar referencias
        this.sellPanel = { 
            sprite: saleSprite, 
            priceText: priceText,
            infoText: infoText,
            sellBtn: sellBtn, 
            sellText: sellText,
            cancelBtn: cancelBtn, 
            cancelText: cancelText,
            sellPrice: sellPrice
        };
        
        // Eventos
        sellBtn.on('pointerdown', () => {
            this.sellAlly(index, this.sellPanel.sellPrice);
        });
        
        cancelBtn.on('pointerdown', () => {
            this.cancelSale();
        });
    }

    cancelSale(){
        if (this.sellPanel) {
            this.sellPanel.sprite.destroy();
            this.sellPanel.priceText.destroy();
            this.sellPanel.infoText.destroy();
            this.sellPanel.sellBtn.destroy();
            this.sellPanel.sellText.destroy();
            this.sellPanel.cancelBtn.destroy();
            this.sellPanel.cancelText.destroy();
            this.sellPanel = null;
        }
        this.selectedForSale = null;
    }


    buyItem(marketItem){ //compra el alliado, quita dinero y añade al dom
        if(this.bag.length >= 6){
            this.showMessage("¡Tienes demasiados aliados!");
            return;
        }
        else if(this.money <marketItem.type.cost){
            this.showMessage("No tienes dinero suficiente!");
            return;
        }

        this.money -= marketItem.type.cost;
        const newAlly = marketItem.type.clone();
        newAlly.available = true;

        bag.push(newAlly);

        // Remover del mercado
        this.removeFromMarket(marketItem);
        
        // Actualizar display
        this.showMoney(this.currentMoney);
        this.displayPlayerAllies();
        
        this.showMessage(`¡Has comprado a ${newAlly.name}!`);

    }

    sellAlly(index, sellPrice){ //vende el aliaddo, se quita del inventario y se suma al dom
        // Encontrar el aliado disponible en la posición index
        const availableAllies = this.bag.filter(ally => ally.available);
        if (index < 0 || index >= availableAllies.length) return;
        
        const soldAlly = availableAllies[index];
        
        // Marcar como no disponible
        soldAlly.available = false;
        
        // Añadir dinero
        this.currentMoney += sellPrice;
        
        // Limpiar panel de venta
        this.cancelSale();
        
        // Actualizar display
        this.showMoney(this.currentMoney);
        this.displayPlayerAllies();
        
        this.showMessage(`¡Has vendido a ${soldAlly.name} por ${sellPrice}$!`);
    }

    removeFromMarket(marketItem){
       marketItem.ally.setVisible(false);
        marketItem.ally.disableInteractive();
        
        // Destruir elementos UI
        if (marketItem.button) marketItem.button.destroy();
        if (marketItem.priceText) marketItem.priceText.destroy();
        if (marketItem.levelText) marketItem.levelText.destroy();
        if (marketItem.costText) marketItem.costText.destroy();
        
        // Remover del array
        const marketIndex = this.marketAllies.indexOf(marketItem);
        if (marketIndex !== -1) {
            this.marketAllies.splice(marketIndex, 1);
        } 
    }

    showMessage(text){
         if (this.messageText) {
            this.messageText.destroy();
        }
        
        this.messageText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            100,
            text, {
                fontSize: '18px',
                fill: '#FF0000',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5);
        
        // Auto-eliminar mensaje después de 2 segundos
        this.scene.time.delayedCall(2000, () => {
            if (this.messageText) {
                this.messageText.destroy();
                this.messageText = null;
            }
        });
    }

    clearMarket(){
         this.marketAllies.forEach(item => {
            if (item.ally) {
                item.ally.setVisible(false);
                item.ally.disableInteractive();
            }
            if (item.button) item.button.destroy();
            if (item.priceText) item.priceText.destroy();
            if (item.levelText) item.levelText.destroy();
            if (item.costText) item.costText.destroy();
        });
        
        // Limpiar botones de venta
        this.sellButtons.forEach(btn => {
            if (btn && typeof btn.destroy === 'function') {
                btn.destroy();
            }
        });
        this.sellButtons = [];
        
        // Limpiar textos
        if (this.moneyText) this.moneyText.destroy();
        if (this.messageText) this.messageText.destroy();
        
        // Cancelar venta en curso
        this.cancelSale();
    }

    market(bag, allyList, objList, money){
        this.bag = bag;
        this.allyList = allyList;
        this.objList = objList;
        
        // Generar aliados para el mercado (3 slots) - solo los no disponibles
        const unavailableAllies = allyList.filter(ally => !ally.available);
        this.marketAllies = this.generateAlly(unavailableAllies, 3);
        
        // Mostrar el mercado
        this.showMarket(this.marketAllies, this.marketObjects, money);
    }
}