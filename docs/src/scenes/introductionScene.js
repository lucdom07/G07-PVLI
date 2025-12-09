import Dialogue from "../../gameObjects/ui/Dialogue.js";
import Character from "../../gameObjects/ui/character.js";
import DialogText from "../../gameObjects/ui/dialogPlugin.js";
import DialogueManager from "../managers/dialogueManager.js";

import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";
import { DialogueKeys } from "../managers/dialogueConfig.js";

export default class IntroductionScene extends Phaser.Scene {
    constructor() {
        super("introduction");
        this.playerData = {}
        this.audioManager = null;
    }

    init(data){
        this.playerData = data;
    }

    preload() {
        this.load.json("introDialogues", "./jsons/dialogues/intro.json");
        this.load.image("background", "assets/placeholders/background.png");
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
                this.cameras.main.once('camerafadeincomplete', () => {
                    //diálogo de la tienda
                    this.scene.launch("DialogueScene", {
                    dialogueKey: DialogueKeys.INTRO,
                    returnScene: this.scene.key
                });
        });
        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.INTRO);

        const rawData = this.cache.json.get("introDialogues");

        const dialogues = rawData.map(entry => new Dialogue(
            new Character(entry.name),
            entry.line,
            true,
            entry.sprite,
            entry.spritePos
        ));

      
    }
}
