import Ally from "../../gameObjects/characters/ally.js";
import GlobalAlly from "../managers/globalAlly.js";
import DOMmanager from "../managers/DOMManager.js";

export default class CombatSetup extends Phaser.Scene {

    constructor(DOMmanager) {
        super({key: 'combatSetup'});

        this.DOMmanager = DOMmanager;
        //Array con los aliados obtenidos
        this.ownedAllies = [];
        this.money = 0;
        //Array con los aliados seleccionados
        this.selectedAllies = [];
        //División del DOM que muestra los aliados desbloqueados (también de clase DomAlly)
        this.DOMallies = document.getElementById('alliesArray').children;
        //Posiciones de la fila de selección, con un booleano para saber si estan ocupadas
        this.positions = [[0, false], [1, false], [2, false], [3, false], [4, false]];


        this.ownedObjects =[];
        this.selectedObject = null;
        this.DOMobjects = document.getElementById('objectsArray').children;
    }

    init(data) {
        //Array global con todos los aliados (desbloqueados o no)
        //this.globalAllies = data.allies;
        this.ownedAllies = data.ownedAllies;
        this.money = data.money;
        this.ownedObjects = data.ownedObjects || [];
        //Aún no está bien conectado al resto del juego
    }

    preload() {
        this.load.image('pimiento', 'assets/placeholders/warriors/pepper_miku_placeholder.png');
        this.load.image('tortuga','assets/placeholders/warriors/green_miku_placeholder.png');
        this.load.image('chupacabra','assets/placeholders/warriors/dark_blue_miku_placeholder.png');
        this.load.image('perro','assets/placeholders/warriors/orange_miku_placeholder.png');
        this.load.image('foca','assets/placeholders/warriors/light_blue_miku_placeholder.png');
        this.load.image('warf','assets/placeholders/warriors/garnet_miku_placeholder.png');
        this.load.image('background','assets/placeholders/background.png')
        this.load.image('combatButton', 'assets/placeholders/buttons/combat_button.jpg')
    }

    create() {

        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,'background');

        //Subscribir eventos de click a los aliados del DOM
        for(let i = 0; i < this.DOMallies.length; i++) {
            let index = i;
            let ally = this.DOMmanager.getArray()[i];
            this.DOMallies.item(i).addEventListener('click', () => {
                this.toggleAlly(ally, index);
                console.log(ally.getName());
            });
        }

        //Subscribir eventos de click a los objetos del DOM
        for(let i = 0; i < this.DOMobjects.length; i++) {
            let object = this.DOMmanager.getObjectsArray()[i];
            this.DOMobjects.item(i).addEventListener('click', () => {
                this.selectObject(object, i);
            });
        }

        const playButton = this.add.image(200 ,50,'combatButton').setInteractive();

        playButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
  
        //pasa los aliados al debugCombat
        playButton.on('pointerdown',()=>{
            if(this.selectedAllies.length > 0 && this.selectedAllies.length === 3) {
                this.scene.start('debugCombat',{
                    ownedAllies: this.ownedAllies,
                    money: this.money,
                    selectedAllies: this.selectedAllies
                });
            }
        });

      //Código provisional hasta tener el resto de componentes del juego

        this.ownedAllies = [
            new GlobalAlly("pimiento", 'pimiento',36,0,20,0,0,true),
            new GlobalAlly("tortuga",'tortuga' ,20,0,5,0,0,true),
            new GlobalAlly("chupacabra",'chupacabra',21,0,10,0,0,true),
            new GlobalAlly("perro",'perro',36,0,20,0,0,true),
            new GlobalAlly("foca",'foca',36,0,20,0,0,true),
            new GlobalAlly("warf",'warf',35,0,7,0,0,true)
        ];
    }
    //Determina si la ally esta en la tropa para removerlo o añadirlo
    toggleAlly(ally) {
        if(this.selectedObject){
            this.applyObjectToAlly(ally);
        }else{
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

    FALTARIA PONER UN LIMITE AL MAXIMO DE ALIADOS
    */
    addAlly(ally) {
        //if(this.ownedAllies.find(x => x.getName() === ally.getName()) && 
            //  !this.selectedAllies.some(x => x.getName() === ally.getName())) {


        if (this.selectedAllies.length >= 3) {
            return;
        }

        if(!this.selectedAllies.some(x => x.getName() === ally.getName())) {

            let i = 0;
            
            while(i < this.ownedAllies.length) {

                if(ally.getName() === this.ownedAllies[i].getName()) {

                    ally.toggleOnTeam();
                    let newAlly = ally.AllyFromGlobalAlly(this, 100 + i * 125, 300);
                    this.selectedAllies.push(newAlly); 
                    this.repositionSelectedAllies();
                    break;
                }
                i++;
            }
        }
    }

    /*
    Elimina un aliado de selectedAllies.

    FALTARIA QUE NO SE PUEDA ABNDONAR LA ESCENA CON 0 ALIADOS
    */
    removeAlly(ally) {
        let i = 0;
        let found = false;

        for(; i < this.selectedAllies.length; i++) {

            if(this.selectedAllies[i].getName() === ally.getName()) {
                found = true;
                break;
            }
        }

        if(found) {
            ally.toggleOnTeam();
            const removed = this.selectedAllies[i];
            if (removed && removed.destroy) removed.destroy();
            this.selectedAllies.splice(i, 1);
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

    selectObject(object, index) {
        if (this.selectedObject === object) {
            // Deseleccionar si ya está seleccionado
            this.deselectObject();
        } else {
            // Deseleccionar objeto anterior
            this.deselectObject();
            
            // Seleccionar nuevo objeto
            this.selectedObject = object;
            this.highlightObject(index, true);
            
            // Cambiar cursor para indicar que se puede aplicar a un aliado
            this.game.canvas.style.cursor = "crosshair";
            
            console.log(`Objeto seleccionado: ${object.getName()}`);
        }
    }

    deselectObject() {
        if (this.selectedObject) {
            // Remover highlight de todos los objetos
            for(let i = 0; i < this.DOMobjects.length; i++) {
                this.highlightObject(i, false);
            }
            
            this.selectedObject = null;
            this.game.canvas.style.cursor = "default";
        }
    }

    highlightObject(index, selected) {
        const objectElement = this.DOMobjects.item(index);
        if (objectElement) {
            const img = objectElement.querySelector('img');
            if (img) {
                if (selected) {
                    img.style.border = "3px solid yellow";
                    img.style.transform = "scale(1.1)";
                } else {
                    img.style.border = "none";
                    img.style.transform = "scale(1)";
                }
            }
        }
    }

    applyObjectToAlly(ally) {
        if (!this.selectedObject) return;

        console.log(`Aplicando ${this.selectedObject.getName()} a ${ally.getName()}`);
        
        // Encontrar el aliado en selectedAllies
        const sceneAlly = this.selectedAllies.find(a => a.getName() === ally.getName());
        
        if (sceneAlly) {
            // Aplicar efectos del objeto
            this.applyObjectEffects(sceneAlly, this.selectedObject);
            
            // Remover objeto del DOM y del inventario
            this.removeUsedObject(this.selectedObject);
            
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
        
        // Actualizar stats del aliado
        ally.setLife(Math.max(0, newLife)); // Vida mínima 0
        ally.setAttack(Math.max(0, newAttack)); // Ataque mínimo 0
        
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
    }

    removeUsedObject(object) {
        // Remover del DOM manager
        this.DOMmanager.removeObject(object.getName());
        
        // Remover del array local
        const objectIndex = this.ownedObjects.findIndex(obj => obj.getName() === object.getName());
        if (objectIndex !== -1) {
            this.ownedObjects.splice(objectIndex, 1);
        }
        
        console.log(`Objeto ${object.getName()} usado y eliminado`);
    }

}