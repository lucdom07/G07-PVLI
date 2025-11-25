import DialogText from "../../gameObjects/ui/Dialogue.js";

export default class introductionScene extends Phaser.Scene {
    /**
     * Escena de texto cargado con archivos TTF locales.
     * @extends Phaser.Scene
     */
    constructor() {
        super({ key: 'introduction' });
    }

    /**
     * Cargamos todos los assets que vamos a necesitar
     */
    preload(){
        this.load.image('background', 'assets/background.png');
       

        this.load.json('intro','jsons/dialogues/intro.json');
    }
    
    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        

        this.dialog = new DialogText(this, {
            borderThickness: 2,
            borderColor: 0x2e2926,
            borderAlpha: 1,
            windowAlpha: 0.6,
            windowColor: 0xffffff,
            windowHeight: 150,
            padding: 32,
            closeBtnColor: 'darkgoldenrod',
            dialogSpeed: 2,
            fontSize: 24,
            fontFamily: "GameFont"
        });

        this.dialogues = this.cache.json.get('intro');

        this.currentDialogueIndex = 0;
        this.showDialogue()
        
        this.input.on('pointerdown', () => {
            this.nextDialogue();
    });
    }
    
    showDialogue() {
    if (!this.dialogues) {
        console.error("dialogueData está vacío o no se ha cargado correctamente.");
        return;
    }

    if (this.currentDialogueIndex >= this.dialogues.length) {
        this.scene.start('debugMap', this.playerData);
       
    }

    let line = this.dialogues[this.currentDialogueIndex];
   
    this.dialog.setText(`${line.name}: ${line.line}`);    
    }

    nextDialogue() {
        this.currentDialogueIndex++;
        this.showDialogue();
    }
}
    