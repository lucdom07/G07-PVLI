
import DialogueManager from "../managers/dialogueManager.js";
import { DialogueFiles } from "../managers/dialogueConfig.js";
import DialogText from "../../gameObjects/ui/dialogPlugin.js";

export default class DialogueScene extends Phaser.Scene {
    constructor() {
        super("DialogueScene");
        this.playerData = {};
    }

    init(data) {
        //key de diálogo (para buscar el json en config)
        this.dialogueKey = data.dialogueKey;
        //escena a la que volver si la escena de diálogo está superpuesta
        this.returnScene = data.returnScene ?? null; 
        //escena a la que ir después de los diálogos
        this.nextScene = data.nextScene ?? null; 

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
    }

    async create() {

        const dialogues = this.cache.json.get(this.dialogueKey);
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
        /*
        BOTÓN DE SKIP
        */
        const width = this.sys.game.config.width;
        this.skipButton = this.add.text(width - 100, 40, "Skip", {
            fontSize: "20px",
            color: "#ff0000",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 }
        }).setInteractive();

        this.skipButton.on("pointerdown", () => {
            if(this.nextScene)
                this.scene.start(this.nextScene, { playerData: this.playerData });
            else if (this.returnScene)
                this.scene.resume(this.returnScene);
            this.scene.stop();
            this.skipButton.destroy();
        });

        //escucho el evento de fin de diálogos para cambiar de escena o reanudar la anterior
        this.events.once("dialogueEnd", () => {
            if(this.nextScene)
                this.scene.start(this.nextScene, { playerData: this.playerData });
            else if(this.returnScene){
                this.scene.stop();
                this.scene.resume(this.returnScene);
            }
            this.scene.stop();
        });   
    }
}
