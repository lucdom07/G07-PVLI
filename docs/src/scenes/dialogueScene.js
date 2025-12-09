
import DialogueManager from "../managers/dialogueManager.js";
import { DialogueFiles } from "../managers/dialogueConfig.js";
import DialogText from "../../gameObjects/ui/dialogPlugin.js";

export default class DialogueScene extends Phaser.Scene {
    constructor() {
        super("DialogueScene");
        this.playerData = {};
    }

    init(data) {
        // data.dialogueKey = clave que le pasó otra escena

        this.dialogueKey = data.dialogueKey;
        this.returnScene = data.returnScene ?? null; // opcional
        this.nextScene = data.nextScene ?? null; // opcional
        this.playerData = data.playerData ?? {}; // opcional
        console.log(data);
    }

    preload() {
        const file = DialogueFiles[this.dialogueKey];
        if (!file) {
            console.error("No existe un JSON de diálogos para esta clave:", this.dialogueKey);
            return;
        }

        this.load.json("dialogueData", file);
        this.load.image("bird", "./assets/dialogue_sprites/bird_dialogue.png");
    }

    async create() {
         if (!this.dialogueKey) {
            console.error("No se pasó dialogueKey a DialogueScene");
            return;
        }

        const file = DialogueFiles[this.dialogueKey];
        if (!file) {
            console.error("No existe un JSON de diálogos para esta clave:", this.dialogueKey);
            return;
        }

        // Cargar el JSON en caliente
        const response = await fetch(file);
        const dialogues = await response.json();

        // Inicializar el DialogueManager
        this.manager = new DialogueManager(this, dialogues, { dialogBoxClass: DialogText });
        this.manager.start();

        // Botón de Skip
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

        this.events.once("dialogueEnd", () => {
            if(this.nextScene)
                this.scene.start(this.nextScene, { playerData: this.playerData });
            else if(this.returnScene){
                this.scene.stop();
                this.scene.resume(this.returnScene, this.playerData);
            }
            this.scene.stop();
        });

            
    }
}
