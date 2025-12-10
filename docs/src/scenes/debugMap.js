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

    init(data) {
        this.playerData = data;
    }

    preload() {
        this.load.image('auBackground','assets/backgrounds/australiaaMap.png');
        this.load.image('combatButton','assets/placeholders/buttons/combat_button.jpg');
        this.load.image('marketButton', 'assets/placeholders/buttons/market_button.png');
    }

    create() {
        console.log(this.gameObjects);
        //transición de escenas, esta utiliza un this.events.on porque la pausamos y reanudamos durante el transcurso del gameplay
        this.cameras.main.fadeIn(800, 0, 0, 0);

        this.events.on('resume', () => {
        this.cameras.main.fadeIn(600, 0, 0, 0);
        });

        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.MAPA);

        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'auBackground');

        this.createButtons();

        // Botón de pausa
        this.pauseButton = this.add.text(100, 40, "Pause", {
            fontSize: "20px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 }
        }).setInteractive();

        
        this.pauseButton.on("pointerdown", () => {
            this.scene.launch('pauseMenu',{pausedSceneKey : this.sys.settings.key});
            this.scene.pause();
        });

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
            else {
                button = this.add.image(100, 50, 'marketButton').setInteractive();
                key = 'debugMarket';
            }
            button.setPosition(x, y);
            button.setScale(0.35);
            
            button.on('pointerdown', () =>{     
                if(node.active) {
                    this.cameras.main.fadeOut(800, 0, 0, 0); // duración, R, G, B
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.enableButtons(node);
                        this.scene.launch(key, this.playerData);
                        this.scene.pause();
                        console.log("Saliendo del mapa");
                    });
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