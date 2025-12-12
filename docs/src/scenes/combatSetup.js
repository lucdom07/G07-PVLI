import Ally from "../../gameObjects/characters/ally.js";
import DOMmanager from "../managers/DOMManager.js";
import WarriorUI from "../../gameObjects/ui/warriorUi.js";

import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";

/**
 * Escena de preparación de combate, donde se eligen a los aliados que lucharán, y se usan los objetos
 */
export default class CombatSetup extends Phaser.Scene {

    constructor(DOMmanager) {
        super({key: 'combatSetup'});

        this.DOMmanager = DOMmanager;
        this.playerData = {};
        this.clickableAllies = new Set();
        //División del DOM que muestra los aliados desbloqueados (también de clase DomAlly)

        this.DOMallies = document.getElementById('alliesArray');

        this.selectedObject = null;

        this.ObjectSize =100;

        this.audioManager = null;
        this.backgrounds = ['austSetup', 'spainSetup', 'chinaSetup', 'usaSetup'];
    }

    init(data) {
        this.playerData = data.playerData,
        this.world = data.world,
        this.bossFlag = data.bossFlag
        this.selectedAllies = [];
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
        this.load.image('combat', 'assets/buttons/continue.png')
    }

    create() {

        this.cameras.main.fadeIn(800, 0, 0, 0);
        
        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.PRE);

        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,this.backgrounds[this.world]);

        this.showObjects(this.playerData.ownedObjects);

        this.createContinueButton();
        

        //Crear aliados en la escena y hacer los del DOM clickables
        for(let i = 0; i < this.playerData.ownedAllies.length; i++) {
            const ally = this.playerData.ownedAllies[i];
            this.playerData.ownedAllies[i] = Ally.clone(ally, this);
        }
  
        [...this.DOMallies.children].forEach(ally => {
            this.makeClickable(ally);
        });
        this.makeInteractives();
        this.selectedAllies = [];
    }

    /**
     * Añade un aliado al array de aliados seleccionados .selectedAllies, siempre que se supere el límite
     * @param {Ally} ally - Aliado que se añade al array
     */
    addAlly(ally) {
        if((this.selectedAllies.length >= 3) || (this.selectedAllies.length > 0 && this.selectedAllies.some(x => x === ally))) {
            return;
        }
        this.audioManager.playSound(MusicKeys.ADDING_ALLY);
        this.selectedAllies.push(ally);
        this.repositionSelectedAllies();
    }

    /**
     * Elimina a un aliado de .selectedAllies y lo oculta en la escena
     * @param {Ally} ally 
     */
    removeAlly(ally) {
        const index = this.selectedAllies.indexOf(ally);
        if(index != -1) {
            this.audioManager.playSound(MusicKeys.REMOVING_ALLY);
            this.selectedAllies.splice(index, 1);
            ally.x = -150;
            ally.y = -150;
            ally.warriorUI.setStatsPosition(ally.x, ally.y);
            this.repositionSelectedAllies();
        }
    }
    
    /**
     * Si un aliado ya estaba seleccionado (en .selectedAllies), lo elimina; si no, lo añade
     * @param {HTMLDivElement} domAlly - División del DOM que representa al aliado a tratar por la función
     */
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
    
    /**
     * Añade un event listener a una división del DOM que represente a un aliado.
     * Este evento, le indica que se llame a toggleAlly, de esta clase, al clickar en la división
     * 
     * También añade esta división a un set que contiene todas las divisiones que tienen este event listener,
     * el set .clickableAllies
     * @param {HTMLDivElement} domAlly - División del DOM a la que se le va a añadir el evento
     */
    makeClickable(domAlly) {
        if(!this.clickableAllies.has(domAlly)) {
            //EventListener en el DOM
            domAlly.addEventListener('click', () => {
                this.toggleAlly(domAlly);
                console.log(domAlly.dataset.name);
            });
            this.clickableAllies.add(domAlly);
        }
    
    }
    
    /**
     * Hace que los aliados obtenidos por el jugador (el array .ownedAllies) sean interactuables en la ventana del juego,
     * y les añade un evento pointerdown que les aplica el efecto de un objeto previamente seleccionado, cuando se les hace click
     */
    makeInteractives() {
        this.playerData.ownedAllies.forEach(ally => {
            ally.setInteractive();
            ally.on('pointerdown', () => {
                console.log(ally.name);
                if(this.selectedObject) {
                    this.applyObjectToAlly(ally);
                }
            });
        });
    }
    
    /**
     * Elimina una división del DOM del set .clickableAllies, que indica qué divisiones del DOM tienen el evento de click
     * para seleccionarlos o deseleccionarlos
     * 
     * Se debe llamar en el caso de que se quiera eliminar un aliado del DOM (en el juego nunca se le llama, porque solo se eliminan aliados
     * del DOM al reiniciar el juego, en cuyo caso, todas las escenas son paradas, y por lo tanto este set queda vacío)
     * @param {HTMLDivElement} domAlly - División del DOM que representa un aliado, a la que se le va a sacar del set
     */
    removeFromClickable(domAlly) {
        this.clickableAllies.delete(domAlly);
    }

    //se enseñan los objetos en el lado derecho de la pantalla del juego
    showObjects(objectsList){
    console.log('Mostrando objetos:', objectsList);
    
    let x = 1000;
    let y = 100;
    const ySpacing = 100;
    
    for(let i = 0; i < objectsList.length; i++){
        let obj = objectsList[i];
        
        if (!obj || !obj.scene) {
            console.log('Creando GameObject para objeto:', obj);
            
            // Guarda los valores originales antes de modificar el objeto
            const originalObj = objectsList[i];
            const originalName = originalObj.name;
            const originalLife = originalObj.life;
            const originalAttack = originalObj.attack;
            
            // Crea un sprite temporal para el objeto
            const texture = originalObj.texture || '';
            obj = this.add.image(x, y + (i * ySpacing), texture);
            
            obj.originalObject = originalObj;
             
            obj.name = originalName;
            obj.life = originalLife;
            obj.attack = originalAttack;
            
            // Reemplaza en el array
            this.playerData.ownedObjects[i] = obj;
        }
        
        // Configura el objeto
        obj.setPosition(x, y + (i * ySpacing))
           .setDisplaySize(this.ObjectSize, this.ObjectSize)
           .setInteractive()
           .setVisible(true);

        obj.on('pointerdown', () => {
            this.selectObject(obj);
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
        // Crear tooltip con información del objeto
         this.currentTooltip = this.add.text(x-40, y - 30, 
        `${obj.name}\nHP: ${obj.life || 0}\nATK: ${obj.attack || 0}`, {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: "Caveat Brush",
            backgroundColor: '#4F4637',
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

    /**
     * Reposiciona los aliados cuando son elegidos a la escena
     */
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

/**
 * Al seleccionar el objeto le cambia de color y si ya hubo uno seleccionado o cuando es el mismo objeto lo delecciona de this.selectedObject 
 * @param {Object} object -Objeto seleccionado
 */
    selectObject(object) {
        this.audioManager.playSound(MusicKeys.CHOSEN_FOOD);
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
            
            console.log(`Objeto seleccionado: ${object.name}`);
        }
    }

    /**
     * Remueve el color tintado del objecto
     */
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

    /**
     * Aplicación de los effectos del objeto al ally
     * @param {Object} ally -Aliado a aplicar el efecto
     * @returns 
     */
    applyObjectToAlly(ally) {
        if (!this.selectedObject) return;
        this.audioManager.playSound(MusicKeys.ALLY_EATING);
        console.log(`Aplicando ${this.selectedObject.name} a ${ally.name}`);
        
        const originalObject = this.selectedObject.originalObject || this.selectedObject;
    
        // Aplicar efectos del objeto
        this.applyObjectEffects(ally, originalObject);
        
        // Remover objeto del DOM y del inventario
        this.removeUsedObject(originalObject);
        
        // Deseleccionar objeto
        this.deselectObject();
    }

    /**
     * Aplica los cambios de las estadísticas del aliado (ally) usando el objeto
     * @param {Object} ally -Aliado a aplicar el efecto
     * @param {Object} object -Objeto al que se utiliza
     */
    applyObjectEffects(ally, object) {
        const originalLife = ally.life;
        const originalAttack = ally.attack;
        
        console.log(object.life + ", " + object.attack)
        // Aplicar modificaciones
        const newLife = originalLife + object.life;
        const newAttack = originalAttack + object.attack;
        
        // Actualizar stats del aliado
        ally.setLife(Math.max(1, newLife)); // Vida mínima 1
        ally.setAttack(Math.max(1, newAttack)); // Ataque mínimo 1


        ally.warriorUI.setNewStats(ally.life, ally.attack);

        if (ally.updateStatsUI) {
            ally.updateStatsUI();
        }
        
        // Mostrar feedback visual
        this.showObjectEffect(ally, object);
            
        console.log(`Aliado ${ally.name} actualizado - Vida: ${ally.life}, Ataque: ${ally.attack}`);
    }

    /**
     * Animación de texto que enseña los cambios del objeto aplicados al aliado
     * @param {Object} ally -Aliado objetivo
     * @param {Object} object -Objeto que se le aplica
     */
    showObjectEffect(ally, object) {
        const effectText = this.add.text(ally.x, ally.y - 50, 
            `+${object.life}❤ +${object.attack}⚔`, 
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
/**
 * Remueve el objeto usado del inventario del usuario
 * @param {Object} object -Objeto usado a remover
 */
    removeUsedObject(object) {
       // Remover del array local
        const objectIndex = this.playerData.ownedObjects.findIndex(obj => {
        const objToCompare = obj.originalObject || obj;
        return objToCompare.name === object.name;
        });
    
        if (objectIndex !== -1) {
            const objToRemove = this.playerData.ownedObjects[objectIndex];
            if (objToRemove && objToRemove.destroy) {
                objToRemove.destroy();
            }
        this.playerData.ownedObjects.splice(objectIndex, 1);
        }
    
        console.log(`Objeto ${object.name} usado y eliminado`);
    }

    /**
     * Crea un boton para lanzar la escena de combate
     */
    createContinueButton(){

        const playButton = this.add.image(200 ,50,'combat').setInteractive().setDisplaySize(400,130);
        playButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
  
        //pasa los aliados al debugCombat
        playButton.on('pointerdown',()=>{
            if(this.selectedAllies.length > 0) {
                this.audioManager.playSound(MusicKeys.GENERIC_BUTTON);   
                this.scene.start('debugCombat',{
                    playerData: this.playerData,
                    selectedAllies: this.selectedAllies,
                    world: this.world,
                    bossFlag: this.bossFlag
                });
            }
            console.log("yendo al combate");
        });

        //borde del botón de jugar
        const border = this.add.graphics();
        border.lineStyle(4, 0x000000); 
        border.strokeRect(
            playButton.x - playButton.displayWidth/2, 
            playButton.y - playButton.displayHeight/2, 
            playButton.displayWidth, 
            playButton.displayHeight
        );

        playButton.on('pointerover', () => {
            border.clear(); 
            border.lineStyle(4, 0xffffff, 0.7); 
            border.strokeRect(
                playButton.x - playButton.displayWidth/2,
                playButton.y - playButton.displayHeight/2,
                playButton.displayWidth,
                playButton.displayHeight
            );
        });

        playButton.on('pointerout', () => {
            border.clear();
            border.lineStyle(4, 0x000000, 1); 
            border.strokeRect(
                playButton.x - playButton.displayWidth/2,
                playButton.y - playButton.displayHeight/2,
                playButton.displayWidth,
                playButton.displayHeight
            );
        });
    }
}