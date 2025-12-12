import HierarchyGraph from "../managers/hierarchyGraph.js";
import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";

/**
 * Escena del mapa, donde se elige la sala a la que entrará el jugador (combate, tienda o boss)
 */
export default class debugMap extends Phaser.Scene {
    constructor() {
        super({key: 'debugMap'});
        this.playerData = {}
        this.audioManager = null;
        this.backgrounds = ['austBackground', 'spainBackground', 'chinaBackground', 'usaBackground'];
        this.music = [MusicKeys.AU, MusicKeys.ES, MusicKeys.CH, MusicKeys.USA];
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

        //Botones
        this.load.image('combatButton','assets/buttons/battle.png');
        this.load.image('marketButton', 'assets/buttons/market.png');
        this.load.image('bossButton', 'assets/buttons/boss.png');

        //Botones highlight
        this.load.image('combatButtonH','assets/buttons/battleH.png');
        this.load.image('marketButtonH', 'assets/buttons/marketH.png');
        this.load.image('bossButtonH', 'assets/buttons/bossH.png');
    }

    create() {
        console.log("level: ", this.playerData.level);
        console.log("money: ", this.playerData.money);
        if(this.world < this.backgrounds.length) {
            this.graph = new HierarchyGraph(this.graphLevels, this.graphChildrenXNode);
            //transición de escenas, esta utiliza un this.events.on porque la pausamos y reanudamos durante el transcurso del gameplay
            this.cameras.main.fadeIn(800, 0, 0, 0);
            
            this.events.on("resume", () => {
                console.log("entrando de nuevo al mapa");
                this.cameras.main.fadeIn(800, 0, 0, 0);
            });

            this.audioManager = AudioManager.getInstance(this);
            this.audioManager.playMusic(this.music[this.world]);
            
            this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, this.backgrounds[this.world]);
            
            this.createButtons();
        }
    }
        
    /**
     * Función carcasa para la función recursiva buttonsRec()
     */
    createButtons() {
        this.buttonsRec(0);
    }
    
    /**
     * Función recursiva que crea botones y los añade al grafo. también se encarga de definir la distribución de botones 
     * en la escena (sus posiciones), así como definir el tipo de sala (combate, tienda o boss) y la textura de los botones, según el valor
     * de los nodos, y añadirles el evento de click
     * @param {number} level - Nivel actual de la recursión
     */
    buttonsRec(level) {
        if(level === this.graph.levels) return;
        
        const nodes = this.graph.levelMatrix[level].length;
        const divisions = nodes + 1;
        //const divisions = Math.pow(3, nodes);
        //let x = (this.sys.game.canvas.width / divs) * it;
        const x = (this.sys.game.canvas.width /  this.graph.levels) * (level + 1) * 0.83;

        let i = 0;
        this.graph.levelMatrix[level].forEach(node => {
            
            //let y = (this.sys.game.canvas.height / this.tree.levels) * this.mirrorLevel(node.level) - 50;
            const y = (this.sys.game.canvas.height / divisions) * (i + 1);
            
            let key;
            if(node.value === 0) {
                node.textures = ['combatButton', 'combatButtonH'];
                key = 'combatSetup';
            }
            else if(node.value === 1) {
                node.textures = ['marketButton', 'marketButtonH'];
                key = 'debugMarket';
            }
            else {
                node.textures = ['bossButton', 'bossButtonH'];
                key = 'combatSetup';
            }
            const button = this.add.image(100, 50, null).setInteractive();
            node.button = button;
            node.setActiveState(node.active);
            button.setPosition(x, y);
            button.setScale(0.8);
            
            button.on('pointerdown', () =>{     
                if(node.active) {
                    this.audioManager.playSound(MusicKeys.GENERIC_BUTTON);   
                    if(node.value === 2) {
                        this.bossFlag = true;
                    }
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
    
    /**
     * Activa o desactiva botones según la jerarquía del grafo.
     * 
     * Solo se podrán pulsar los hijos directos del nodo asociado al botón anteriormente pulsado.
     * 
     * Se llamacuando se pulsa un botón
     * @param {Node} node - Nodo asociado al botón pulsado
     */
    enableButtons(node) {
        const up_parent = node.parents[0];

        node.children.forEach(x => {
            x.setActiveState(true);
        });

        if(up_parent) {
            const active = up_parent.children.find(x => x === node);
            up_parent.children.forEach(x => {
                if(x !== active) {
                    x.setActiveState(false);
                }
            });
        }
        
        node.setActiveState(false);
    }

}

    