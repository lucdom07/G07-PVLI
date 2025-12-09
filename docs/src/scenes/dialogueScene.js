
import DialogueManager from "../managers/dialogueManager.js";
import { DialogueFiles } from "../managers/dialogueConfig.js";
import DialogText from "../../gameObjects/ui/dialogPlugin.js";

export default class DialogueScene extends Phaser.Scene {
    constructor() {
        super("DialogueScene");
    }

    init(data) {
        // data.dialogueKey = clave que le pasó otra escena
        this.dialogueKey = data.dialogueKey;
        this.returnScene = data.returnScene ?? null; // opcional
        this.nextScene = data.nextScene ?? null; // opcional
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

    create() {
        const dialogues = this.cache.json.get("dialogueData");

        this.manager = new DialogueManager(this, dialogues, {dialogBoxClass: DialogText});

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
                this.scene.start(this.nextScene, this.data);
            else if (this.returnScene)
                this.scene.resume(this.returnScene);
                this.scene.stop()
            this.skipButton.destroy();
        });
        
        this.events.once("dialogueEnd", () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);

            this.cameras.main.once("camerafadeoutcomplete", () => {

                if (this.nextScene)
                    this.scene.start(this.nextScene, this.playerData);

                else if (this.returnScene)
                    this.scene.resume(this.returnScene);

                else
                    this.scene.stop(); // fallback

                });
        });

            
    }
}
