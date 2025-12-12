
import DialogueManager from "../managers/dialogueManager.js";
import { DialogueFiles } from "../managers/dialogueConfig.js";
import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";
import DialogText from "../../gameObjects/ui/dialogPlugin.js";

export default class DialogueScene extends Phaser.Scene {
    constructor() {
        super("DialogueScene");
        this.playerData = {};
        this.bg = ["introD","austD","spainD","chinaD","ending", "shop"];
        this.audioManager = null;
    }

    init(data) {
        //key de diálogo (para buscar el json en config)
        this.dialogueKey = data.dialogueKey;
        //escena a la que volver si la escena de diálogo está superpuesta
        this.returnScene = data.returnScene ?? null; 
        //escena a la que ir después de los diálogos
        this.nextScene = data.nextScene ?? null; 
        this.backgroundKey = data.backgroundKey ?? null;

        this.playerData = data.playerData ?? {}; 
    }

    preload() {
        //cargo el JSON de diálogos correspondiente al que me han pasado
        const file = DialogueFiles[this.dialogueKey];
        if (!file) {
            console.error("No existe un JSON de diálogos para esta clave:", this.dialogueKey);
            return;
        }

        this.load.json(this.dialogueKey, file);
        this.load.image("bird", "./assets/dialogue_sprites/bird_dialogue.png");
        this.load.image("prueba", "./assets/backgrounds/chinaSetup.png");
        this.load.image("kitty", "./assets/dialogue_sprites/cat_dialogue.png");
        this.load.image("austD","./assets/backgrounds/australiaCombat.png");
        this.load.image("chinaD","./assets/backgrounds/chinaCombat.png");
        this.load.image("spainD","./assets/backgrounds/spainCombat.png");
        this.load.image("introD","./assets/backgrounds/introBackground.png");
        this.load.image("shop","./assets/backgrounds/shopBackground.png");
        this.load.image("ending","./assets/backgrounds/ending.png");
        this.load.image("miauuu","./assets/dialogue_sprites/cat_dialogue2.png");
    }

    create() {
        this.audioManager = AudioManager.getInstance(this);

        const dialogues = this.cache.json.get(this.dialogueKey);

        const world = this.playerData.world ?? 0;
        if(this.returnScene == 'debugMarket'){
            this._addBackground(this.bg[5])
        }
        else
            this._addBackground(this.bg[world] ?? this.bg[0]);


        // instancio al manager de diálogos
        this.manager = new DialogueManager(this, dialogues, { dialogBoxClass: DialogText });
        this.manager.start();

         if (!this.dialogueKey) {
            console.error("No se pasó dialogueKey a DialogueScene");
            return;
        }

        const file = DialogueFiles[this.dialogueKey];
        if (!file) {
            console.error("No existe un JSON de diálogos para esta clave:", this.dialogueKey);
            return;
        }
        
       this.createSkipButton();


        //escucho el evento de fin de diálogos para cambiar de escena o reanudar la anterior
        this.events.once("dialogueEnd", () => {
            if (this.nextScene == 'mainMenu') {

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
            }
            if(this.nextScene) {
                this.scene.stop();
                this.scene.start(this.nextScene,{
                    playerData:this.playerData,
                    world:this.playerData.world
                });
                return;     
            }
            else if(this.returnScene){
                this.scene.stop();
                this.scene.resume(this.returnScene);
            }
            this.scene.stop();
        });   
    }

    /**
     * pone el fondo del diálogo
     * @param {string} key - key del fondo
     */
    _addBackground(key) {
    if(this.background) this.background.destroy();

    this.background = this.add.image(
        this.sys.game.canvas.width * 0.5,
        this.sys.game.canvas.height * 0.5,
        key
    );

    this.background.setDisplaySize(
        this.sys.game.canvas.width,
        this.sys.game.canvas.height
    );

    this.background.setDepth(-10); // siempre detrás de todo
    }

    /**
     * crea el botón para saltar los diálogos
     */
    createSkipButton(){
         const width = this.sys.game.config.width;
        this.skipButton = this.add.text(width - 100, 40, "Saltar", {
            fontSize: "20px",
            color: "#000000",
            backgroundColor: "#ABB3D1",
            fontFamily: "Caveat Brush",
            padding: { x: 10, y: 5 }
        }).setInteractive();

        this.skipButton.on("pointerdown", () => {
            this.audioManager.playSound(MusicKeys.GENERIC_BUTTON);   
            this.events.emit("dialogueEnd");
        });

        this.skipButton.on("pointerover", () => {
            this.skipButton.setStyle({backgroundColor: "#CCD3F0"});
        })
        this.skipButton.on("pointerout", () => {
            this.skipButton.setStyle({backgroundColor: "#ABB3D1"});
        })

    }
}
