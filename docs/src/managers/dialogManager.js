export default class DialogueManager {
    constructor(scene, dialogues, config = {}) {
        this.scene = scene;
        this.dialogues = dialogues || [];
        this.index = 0;
        this.active = false;

        // Configuración de UI opcional
        this.config = Object.assign({
            nameStyle: { fontSize: "40px", color: "#ffffff", fontFamily: "Caveat Brush" },
            dialogStyle: { fontSize: "40px", color: "#000000", fontFamily: "Caveat Brush", padding: 32, windowHeight: 180, dialogSpeed: 3 },
            dialogBoxClass: null // Para usar tu DialogText personalizado
        }, config);

        this.nameText = null;
        this.dialogBox = null;

        // Bind para listeners
        this.next = this.next.bind(this);
        this.skip = this.skip.bind(this);
    }

    start() {
        if (!this.dialogues.length) {
            console.warn("No hay diálogos para mostrar");
            return;
        }

        this.active = true;
        this.index = 0;

        // Crear UI de nombre si no existe
        if (!this.nameText) {
            this.nameText = this.scene.add.text(50, 350, "", this.config.nameStyle);
        }

        // Crear UI de caja de diálogo si no existe
        if (!this.dialogBox) {
            if (this.config.dialogBoxClass) {
                this.dialogBox = new this.config.dialogBoxClass(this.scene, this.config.dialogStyle);
            } else {
                // fallback simple
                this.dialogBox = this.scene.add.text(50, 400, "", this.config.dialogStyle);
            }
        }

        // Avanzar con click
        this.scene.input.on("pointerdown", this.next);

        this.showDialogue();
    }

    showDialogue() {
        const d = this.dialogues[this.index];
        if (!d) {
            this.end();
            return;
        }

        this.nameText.setText(d.chara?.name ?? d.name ?? "");
        if (this.dialogBox.setText) {
            // Si es DialogText
            this.dialogBox.setText(d.text, d.animated ?? true);
        } else {
            // fallback simple
            this.dialogBox.setText(d.text ?? "");
        }
    }

    next() {
        if (!this.active) return;
        this.index++;
        if (this.index >= this.dialogues.length) {
            this.end();
            return;
        }
        this.showDialogue();
    }

    skip() {
        this.index = this.dialogues.length;
        this.end();
    }

    end() {
        this.active = false;
        this.scene.events.emit("dialogueEnd");
    }
}
