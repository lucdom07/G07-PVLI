import Ally from "./ally.js";

export default class Market{
    constructor(scene){
        this.scene= scene;
        this.textureButtom = 'button';
        this.marketAlly = [];
        this.marketObj = [];
        this.money = 0;
        this.selectForSale= null;
        this.sellButtons = [];
    }

    makeStruct(type) { //crea un struct entre el objeto y el boton
        return{
            type: type,
            button: null,
            costText:null
        };
        
    }

    generateAlly(allyList, slots){
        const marketAlly = [];

        for (let i =0; i < slots; i++){
            const index = Phaser.Math.Between(0, allyList.length-1); 
            const allyTemplate = allyList[index]; 

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

    showMarket(marketAlly,marketObj){
        if(marketAlly.type.length!=0){
            for(let i =0; i<marketAlly.type.length;i++){
                marketAlly.type[i].x = 100 + (index * 150);
                marketAlly.type[i].y = 500;

                marketAlly.buttom[i].setPosition(100 + (index * 150), 550)

                if(!marketAlly.type[i].scene || !marketAlly.buttom[i].scene){
                    this.scene.add.existing(marketAlly.type[i]);
                    this.scene.add.existing(marketAlly.buttom[i])
                }
            }
        }

        if(marketObj.length!=0){
           for(let i =0; i<marketObj.type.length;i++){
                marketObj.type[i].x = 500 + (index * 150);
                marketObj.type[i].y = 500;

                marketObj.buttom[i].setPosition(500 + (index * 150), 550)

                if(!marketObj.type[i].scene || !marketObj.buttom[i].scene){
                    this.scene.add.existing(marketObj.type[i]);
                    this.scene.add.existing(marketObj.buttom[i])
                }
            }
        }
    }

    showMoney(money){
        this.scene.add.text(
            this.scene.cameras.main.centerX,
            150,
            money + '$',{
                fontSize: '20px',
                fill: '#000000',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);
    }

    buyAlly(bag, index, money){ //compra el alliado, quita dicero y añade al dom

    }

    sellAlly(bag, index, money){ //vende el aliaddo, se quita del inventario y se suma al dom

    }

    removeItem(index){

    }

    showCost(index){//muestra el valor de coste, vida, ataque y rango del aliado, lo mismo para el objeto

    }

    market(bag, allyList, objList, money){

    }
}