import Dialogue from "../../gameObjects/ui/Dialogue.js";
import Character from "../../gameObjects/ui/character.js";
import DialogText from "../../gameObjects/ui/dialogPlugin.js";
import DialogueManager from "../managers/dialogManager.js";

export default class marketDialogueScene extends Phaser.Scene{

constructor() {
        super("marketDialogue");
        this.playerData = {}
    }

    init(data){
        this.playerData = data;
    }

    preload() {
        
        this.load.json('marketDialogues','./jsons/dialogues/market.json');
        this.load.image('bird','assets/dialogue_sprites/bird_dialogue.png')
    }

    create() {
        const rawData = this.cache.json.get('marketDialogues');

        const dialogues = rawData.map(entry => new Dialogue(
            new Character(entry.name),
            entry.line,
            true,
            entry.sprite
        ));

        this.dialogueManager = new DialogueManager(this, dialogues, {
            dialogBoxClass: DialogText
        });
        this.dialogueManager.start();

        // Botón de Skip
        const width = this.sys.game.config.width;
        this.skipButton = this.add.text(width - 100, 40, "Skip", {
            fontSize: "20px",
            color: "#ff0000",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 }
        }).setInteractive();

        this.skipButton.on("pointerdown", () => {
            this.dialogueManager.skip();
            this.skipButton.destroy();
        });

        // Escuchar fin de diálogos
        this.events.on("dialogueEnd", () => {
            this.scene.resume('debugMarket');
            this.scene.stop();
        });
    }

     

}