import Ally from "../../gameObjects/characters/ally.js";
import DOMmanager from "../managers/DOMManager.js";
import WarriorUI from "../../gameObjects/ui/warriorUi.js";

import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";

export default class CombatSetup extends Phaser.Scene {

    constructor(DOMmanager) {
        super({key: 'combatSetup'});

        this.DOMmanager = DOMmanager;
        this.playerData = {};
        //Array con los aliados seleccionados
        this.selectedAllies = [];
        this.clickableAllies = new Set();
        //División del DOM que muestra los aliados desbloqueados (también de clase DomAlly)

        this.DOMallies = document.getElementById('alliesArray');

        this.selectedObject = null;

        this.ObjectSize =100;

        this.audioManager = null;
        this.backgrounds = ['austSetup', 'chinaSetup', 'spainSetup', 'usaSetup'];
    }

    init(data) {
        this.playerData = data.playerData,
        this.world = data.world,
        this.bossFlag = data.bossFlag
    }

    preload() {
        //Backgrounds
        this.load.image('austSetup','assets/backgrounds/australiaSetup.png');
        this.load.image('chinaSetup','assets/backgrounds/chinaSetup.png');
        this.load.image('spainSetup','assets/backgrounds/spainSetup.png');
        this.load.image('usaSetup','assets/backgrounds/usaSetup.png');

        this.load.image('pimiento', 'assets/placeholders/warriors/pepper_miku_placeholder.png');
        this.load.image('tortuga','assets/placeholders/warriors/green_miku_placeholder.png');
        this.load.image('chupacabra','assets/placeholders/warriors/dark_blue_miku_placeholder.png');
        this.load.image('perro','assets/placeholders/warriors/orange_miku_placeholder.png');
        this.load.image('foca','assets/placeholders/warriors/light_blue_miku_placeholder.png');
        this.load.image('warf','assets/placeholders/warriors/garnet_miku_placeholder.png');
        this.load.image('combatButton', 'assets/placeholders/buttons/combat_button.jpg')
    }

    create() {

        this.cameras.main.fadeIn(800, 0, 0, 0);
        
        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.PRE);

        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,this.backgrounds[this.world]);

        this.showObjects(this.playerData.ownedObjects);

        const playButton = this.add.image(200 ,50,'combatButton').setInteractive();
        playButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
  
        //pasa los aliados al debugCombat
        playButton.on('pointerdown',()=>{
            if(this.selectedAllies.length > 0) {
                this.scene.start('debugCombat',{
                    playerData: this.playerData,
                    selectedAllies: this.selectedAllies,
                    world: this.world,
                    bossFlag: this.bossFlag
                });
                this.selectedAllies = [];
            }
            console.log("yendo al combate");
        });

        //Crear aliados en la escena y hacer los del DOM clickables
        for(let i = 0; i < this.playerData.ownedAllies.length; i++) {
            const ally = this.playerData.ownedAllies[i];
            this.playerData.ownedAllies[i] = Ally.clone(ally, this);
        }
  
        [...this.DOMallies.children].forEach(ally => {
            this.makeClickable(ally);
        });
    }
    //Determina si la ally esta en la tropa para removerlo o añadirlo
    toggleAlly(ally) {
        if(this.selectedObject){
            this.applyObjectToAlly(ally);
        }
        else{
            if(ally.isOnTeam()) {
            this.removeAlly(ally);
            }
            else {
            this.addAlly(ally);
            }
        }
    }

    /*
    Añade un aliado a selectedAllies, siempre que no estuviera ya añadido.
    */
    addAlly(ally) {
        if (this.selectedAllies.length >= 3 || (this.selectedAllies.length > 0 && this.selectedAllies.some(x => x === ally))) {
            return;
        }
        this.selectedAllies.push(ally);
        this.repositionSelectedAllies();
    }

    //se enseñan los objetos en el lado derecho de la pantalla del juego
   showObjects(objectsList){
    console.log('Mostrando objetos:', objectsList);
    
    let x = 1000;
    let y = 100;
    const ySpacing = 80;
    
    for(let i = 0; i < objectsList.length; i++){
        let obj = objectsList[i];
        
        if (!obj || !obj.scene) {
            console.log('Creando GameObject para objeto:', obj);
            
            // Guarda los valores originales antes de modificar el objeto
            const originalObj = objectsList[i];
            const originalName = originalObj.getName();
            const originalLife = originalObj.getLife();
            const originalAttack = originalObj.getAttack();
            
            // Crea un sprite temporal para el objeto
            const texture = originalObj.texture || '';
            obj = this.add.image(x, y + (i * ySpacing), texture);
            
            obj.originalObject = originalObj;
             
            obj.getName = () => originalName;
            obj.getLife = () => originalLife;
            obj.getAttack = () => originalAttack;
            
            // Reemplaza en el array
            this.playerData.ownedObjects[i] = obj;
        }
        
        // Configura el objeto
        obj.setPosition(x, y + (i * ySpacing))
           .setDisplaySize(this.ObjectSize, this.ObjectSize)
           .setInteractive()
           .setVisible(true);

        obj.on('pointerdown', () => {
            this.selectObject(obj, i);
        });

        obj.on('pointerover', () => {
            this.showObjectTooltip(obj, x, y + (i * ySpacing));
        });

        obj.on('pointerout', () => {
            this.hideObjectTooltip();
        });
    }
}

    //para pasar el raton por encima y enseñar información
    showObjectTooltip(obj, x, y){
        // Destruir tooltip anterior si existe
        this.hideObjectTooltip();
        
        // Crear tooltip con información del objeto
         this.currentTooltip = this.add.text(x-26, y - 30, 
        `${obj.getName()}\nHP: ${obj.getLife() || 0}\nATK: ${obj.getAttack() || 0}`, {
            fontSize: '10px',
            fill: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 },
            align: 'center'
        }).setOrigin(0, 0.5);
    }

    //esconde la información
    hideObjectTooltip(){
        if(this.currentTooltip){
            this.currentTooltip.destroy();
            this.currentTooltip = null;
        }
    }

    /*
    Elimina un aliado de selectedAllies.
    */
    removeAlly(ally) {
        const index = this.selectedAllies.indexOf(ally);
        if(index != -1) {
            this.selectedAllies.splice(index, 1);
            ally.x = -150;
            ally.y = -150;
            ally.warriorUI.setStatsPosition(ally.x, ally.y);
            this.repositionSelectedAllies();   
        }
    }

    repositionSelectedAllies() {
        const startX = 350;
        const y = 300;
        const separation = 125;

        this.selectedAllies.forEach((ally, index) => {
            // usa setPosition si es un GameObject de Phaser
            if (typeof ally.setPosition === "function") {
                // animación opcional: tween en lugar de salto directo
                const newX = startX - index * separation;

            // mover el aliado
            ally.setWarriorPosition(newX, y);

            } else {
                // fallback si no tiene setPosition
                ally.x = startX - index * separation;
                ally.y = y;
            }
        });
    }

    toggleAlly(domAlly) {
        const ally = this.playerData.ownedAllies.find(x => x.name === domAlly.dataset.name);
        if(!ally) return;

        if(this.selectedAllies.includes(ally)) {
            this.removeAlly(ally);
        }
        else {
            this.addAlly(ally);
        }
    }

    // Hace un aliado del DOM clickeable
    makeClickable(domAlly) {
        if(!this.clickableAllies.has(domAlly)) {
            domAlly.addEventListener('click', () => {
            this.toggleAlly(domAlly);
            console.log(domAlly.dataset.name);
            });
            this.clickableAllies.add(domAlly);
        }
    }

    removeFromClickable(domAlly) {
        this.clickableAllies.delete(domAlly);
    }

    selectObject(object, index) {
        if (this.selectedObject === object) {
            // Deseleccionar si ya está seleccionado
            this.deselectObject();
        } else {
            // Deseleccionar objeto anterior
            this.deselectObject();
            
            // Seleccionar nuevo objeto
            this.selectedObject = object;
            object.setTint(0xffff00);
            
            // Cambiar cursor para indicar que se puede aplicar a un aliado
            this.game.canvas.style.cursor = "crosshair";
            
            console.log(`Objeto seleccionado: ${object.getName()}`);
        }
    }

    deselectObject() {
        if (this.selectedObject) {
            // Remover highlight de todos los objetos
            this.playerData.ownedObjects.forEach(obj => {
            obj.clearTint(); // Remover cualquier tint
            });
            
            this.selectedObject = null;
            this.game.canvas.style.cursor = "default";
        }
    }

    applyObjectToAlly(ally) {
        if (!this.selectedObject) return;

        console.log(`Aplicando ${this.selectedObject.getName()} a ${ally.getName()}`);
        
        const originalObject = this.selectedObject.originalObject || this.selectedObject;

        // Encontrar el aliado en selectedAllies
        const sceneAlly = this.selectedAllies.find(a => a.getName() === ally.getName());
        
        if (sceneAlly) {
            // Aplicar efectos del objeto
            this.applyObjectEffects(sceneAlly, originalObject);
            
            // Remover objeto del DOM y del inventario
            this.removeUsedObject(originalObject);
            
            // Deseleccionar objeto
            this.deselectObject();
        }
    }

    applyObjectEffects(ally, object) {
        const originalLife = ally.getLife();
        const originalAttack = ally.getAttack();
        
        // Aplicar modificaciones
        const newLife = originalLife + object.getLife();
        const newAttack = originalAttack + object.getAttack();
        
        // Actualizar stats del aliado (ALLY)
        ally.setLife(Math.max(0, newLife)); // Vida mínima 0
        ally.setAttack(Math.max(0, newAttack)); // Ataque mínimo 0
    
        // Actualizar stats del aliado (GLOBAL_ALLY)
        const globalAlly = this.ownedAllies.find(a => a.getName() === ally.getName());
        if (globalAlly) {
            globalAlly.setLife(newLife);
            globalAlly.setAttack(newAttack);
        }

        ally.warriorUI.setNewStats(ally.getLife(), ally.getAttack());

        if (ally.updateStatsUI) {
            ally.updateStatsUI();
        }
        
        // Mostrar feedback visual
        this.showObjectEffect(ally, object);
            
        console.log(`Aliado ${ally.getName()} actualizado - Vida: ${ally.getLife()}, Ataque: ${ally.getAttack()}`);
    }

    showObjectEffect(ally, object) {
        const effectText = this.add.text(ally.x, ally.y - 50, 
            `+${object.getLife()}❤ +${object.getAttack()}⚔`, 
            { fontSize: '16px', fill: '#00ff00', backgroundColor: '#000' }
        ).setOrigin(0.5);
        
        // Animación del texto
        this.tweens.add({
            targets: effectText,
            y: ally.y - 100,
            alpha: 0,
            duration: 1500,
            onComplete: () => {
                effectText.destroy();
            }
        });

        console.log(ally);
    }

    removeUsedObject(object) {
       // Remover del array local
        const objectIndex = this.playerData.ownedObjects.findIndex(obj => {
        const objToCompare = obj.originalObject || obj;
        return objToCompare.getName() === object.getName();
        });
    
        if (objectIndex !== -1) {
            const objToRemove = this.playerData.ownedObjects[objectIndex];
            if (objToRemove && objToRemove.destroy) {
                objToRemove.destroy();
            }
        this.playerData.ownedObjects.splice(objectIndex, 1);
        }
    
        console.log(`Objeto ${object.getName()} usado y eliminado`);
    }
}