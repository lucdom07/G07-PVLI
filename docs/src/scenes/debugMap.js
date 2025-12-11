import HierarchyGraph from "../managers/hierarchyGraph.js";
import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";

export default class debugMap extends Phaser.Scene {
    constructor() {
        super({key: 'debugMap'});
        this.playerData = {}
        this.audioManager = null;
        this.backgrounds = ['austBackground', 'spainBackground', 'chinaBackground', 'usaBackground'];
        //Niveles del grafo
        this.graphLevels = 5;
        //Numero de hijos de cada nodo del grafo durante una fase de divergencia de este
        this.graphChildrenXNode = 2;
    }

    init(data) {
        this.playerData = data.playerData;
        this.world = data.world || 0;
        this.bossFlag = data.bossFlag || 0;
    }

    preload() {
        this.load.image('austBackground','assets/backgrounds/australiaaMap.png');
        this.load.image('chinaBackground','assets/backgrounds/chinaMap.png');
        this.load.image('spainBackground','assets/backgrounds/spainMap.png');
        this.load.image('usaBackground','assets/backgrounds/usaMap.png');
        this.load.image('combatButton','assets/placeholders/buttons/combat_button.jpg');
        this.load.image('marketButton', 'assets/placeholders/buttons/market_button.png');
        this.load.image('resetButton','assets/buttons/reset.png');
    }

    create() {
        console.log("level: ", this.playerData.level);
        if(this.world < this.backgrounds.length) {
            this.graph = new HierarchyGraph(this.graphLevels, this.graphChildrenXNode);
            //transición de escenas, esta utiliza un this.events.on porque la pausamos y reanudamos durante el transcurso del gameplay
            this.cameras.main.fadeIn(800, 0, 0, 0);
            
            this.events.on("resume", () => {
                console.log("entrando de nuevo al mapa");
                this.cameras.main.fadeIn(800, 0, 0, 0);
            });

            this.audioManager = AudioManager.getInstance(this);
            this.audioManager.playMusic(MusicKeys.MAPA);
            
            this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, this.backgrounds[this.world]);
            
            this.createButtons();
            //this.createResetButton();
        }
        else {
            //victoria
        }
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

        let i = 0;
        this.graph.levelMatrix[level].forEach(node => {
            
            //let y = (this.sys.game.canvas.height / this.tree.levels) * this.mirrorLevel(node.level) - 50;
            const y = (this.sys.game.canvas.height / divisions) * (i + 1);
            
            let button;
            let key;
            if(node.value === 0) {
                button = this.add.image(100, 50, 'combatButton').setInteractive();
                key = 'combatSetup';
            }
            else if(node.value === 1) {
                button = this.add.image(100, 50, 'marketButton').setInteractive();
                key = 'debugMarket';
            }
            else {
                //Aquí va el botón del boss
                button = this.add.image(100, 50, 'combatButton').setInteractive();
                key = 'combatSetup';
            }
            button.setPosition(x, y);
            button.setScale(0.35);
            
            button.on('pointerdown', () =>{     
                if(node.active) {
                    if(node.value === 2) {
                        this.bossFlag = true;
                    }
                    /*
                    */
                    this.cameras.main.fadeOut(800, 0, 0, 0); // duración, R, G, B
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.enableButtons(node);
                        this.scene.pause();
                        this.scene.launch(key, {
                            playerData: this.playerData,
                            bossFlag: this.bossFlag,
                            world: this.world
                        });
                        console.log("Saliendo del mapa");
                    });
                    this.enableButtons(node);
                }     
            });

            i++;
        });
        
        this.buttonsRec(level + 1);
    }
    
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

    

}

    