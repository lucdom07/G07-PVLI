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
        this.playerData = data.playerData;
    }

    preload() {
        this.load.image('austBackground','assets/backgrounds/australiaaMap.png');
        this.load.image('combatButton','assets/placeholders/buttons/combat_button.jpg');
        this.load.image('marketButton', 'assets/placeholders/buttons/market_button.png');
        this.load.image('resetButton','assets/buttons/reset.png');
    }

    create() {
        console.log(this.gameObjects);
        //transición de escenas, esta utiliza un this.events.on porque la pausamos y reanudamos durante el transcurso del gameplay
        this.cameras.main.fadeIn(800, 0, 0, 0);

         this.events.on("resume", () => {
                console.log("entrando de nuevo al mapa");
                this.cameras.main.fadeIn(800, 0, 0, 0);
            });

        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.MAPA);

        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'austBackground');

        this.createButtons();
        this.createResetButton();



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
                        this.scene.launch(key, {playerData: this.playerData});
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

    

    createResetButton() {
        
        const resetButton = this.add.image(300, 100, 'resetButton').setInteractive().setDisplaySize(200,65);
        resetButton.setPosition(this.sys.game.canvas.width*0.1,this.sys.game.canvas.height*0.1);
        
        //función de resetear la partida
        resetButton.on('pointerdown',()=>{
            this.cameras.main.fadeOut(800, 0, 0, 0); // duración, R, G, B
            this.cameras.main.once('camerafadeoutcomplete', () => {
                const sceneManager = this.sys.game.scene;

                // Detener TODAS las escenas excepto MainMenu
                sceneManager.getScenes(true).forEach(scene => {
                    if(scene.scene.key !== 'mainMenu') sceneManager.stop(scene.scene.key);
                    
                });

                sceneManager.getScenes(false).forEach(scene => {
                    if(scene.scene.key !== 'mainMenu') sceneManager.stop(scene.scene.key);
                });

                // Detener el menú de pausa
                this.scene.stop();
                this.scene.stop('debugMap');
                // Iniciar MainMenu
                sceneManager.start('mainMenu', { reset: true });

            });
            
        });

         const resetBorder = this.add.graphics();
        resetBorder.lineStyle(4, 0x0000000); 
        resetBorder.strokeRect(
            resetButton.x - resetButton.displayWidth/2, 
            resetButton.y - resetButton.displayHeight/2, 
            resetButton.displayWidth, 
            resetButton.displayHeight
        );

        resetButton.on('pointerover', () => {
            resetBorder.clear(); 
            resetBorder.lineStyle(4, 0xfffffff, 1); 
            resetBorder.strokeRect(
                resetButton.x - resetButton.displayWidth/2, 
                resetButton.y - resetButton.displayHeight/2, 
                resetButton.displayWidth, 
                resetButton.displayHeight
            );
            
        });

        resetButton.on('pointerout', () => {
            resetBorder.clear();
            resetBorder.lineStyle(4, 0x000000, 1); 
            resetBorder.strokeRect(
                resetButton.x - resetButton.displayWidth/2, 
                resetButton.y - resetButton.displayHeight/2, 
                resetButton.displayWidth, 
                resetButton.displayHeight
            );
        });

    }
}

    