import HierarchyGraph from "../managers/hierarchyGraph.js";

import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";

export default class debugMap extends Phaser.Scene {
    constructor() {
        super({key: 'debugMap'});
        this.playerData = {}
        this.graph = new HierarchyGraph(5, 2);
        this.audioManager = null;
    }

    //En init le pasamos los aliados y el dinero que tiene el jugador para que cuando entre en una sala se lo pueda pasar a la siguiente escena
    init(data) {
        this.playerData = data;
    }

    preload() {
        this.load.image('background','assets/placeholders/background.jpg');
        this.load.image('combatButton','assets/placeholders/buttons/combat_button.jpg');
        this.load.image('marketButton', 'assets/placeholders/buttons/market_button.png');
    }

    create() {
        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.MAPA);

        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'background');

        this.createButtons();
    }

    //Función que se llama en create para crear los botones
    createButtons() {
        this.buttonsRec(0);
    }
    
    buttonsRec(level) {
        if(level === this.graph.levels) return;
        
        const nodes = this.graph.levelMatrix[level].length;
        const divisions = nodes + 1;
        //const divisions = Math.pow(3, nodes);
        //let x = (this.sys.game.canvas.width / divs) * it;
        const x = (this.sys.game.canvas.width /  this.graph.levels) * (level + 1) * 0.8;
        const divs = this.getLevelDivs(level, divisions);

        let i = 0;
        this.graph.levelMatrix[level].forEach(node => {
            
            //let y = (this.sys.game.canvas.height / this.tree.levels) * this.mirrorLevel(node.level) - 50;
            const y = (this.sys.game.canvas.height / divisions) * ((i + 1));
            console.log((i + 1) + " / " + divisions);
            
            let button;
            let key;
            if(node.value === 0) {
                button = this.add.image(100, 50, 'combatButton').setInteractive();
                key = 'combatSetup';
            }
            else {
                button = this.add.image(100, 50, 'marketButton').setInteractive();
                key = 'debugMarket';
            }
            button.setPosition(x, y);
            button.setScale(0.35);
            
            button.on('pointerdown', () =>{     
                if(node.active) {
                    this.enableButtons(node);
                    this.scene.start(key, this.playerData);
                    console.log("Saliendo del mapa");
                }     
            });

            i++;
        });
        
        this.buttonsRec(level + 1);
    }
    
    /**
     * Función que lleva la lógica arborescente de los botones; es decir, cuales deben ser pulsables y cuales no
     * @param {Node} node - Nodo que contiene el botón que está siendo pulsado
     */
    enableButtons(node) {
        const up_parent = node.parents[0];

        node.children.forEach(x => {
            x.active = true;
        });

        if(up_parent) {
            const active = up_parent.children.find(x => x === node);
            up_parent.children.forEach(x => {
                if(x !== active) x.active = false;
            });
        }
        
        node.active = false;
    }

    getLevelDivs(level, divisions) {
        const nodes = this.graph.levelMatrix[level].length;
        const res = [nodes];

        const free_divs = Math.floor((divisions - nodes) / 2);
        const offset = Math.floor(free_divs / nodes);

        for(let i = 0; i < nodes; i++) {
            const div = 1 + i * offset;
            res[i] = div;
        }

        return res;
    }
    
    /*
    Para hacerlo vertical
    mirrorLevel(level) {
        return this.tree.levels - level + 1; 
    }
    */
}