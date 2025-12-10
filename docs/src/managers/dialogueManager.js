
export default class DialogueManager {
    constructor(scene, dialogues, config = {}) {
        //escena actual
        this.scene = scene;
        //array de diálogos
        this.dialogues = dialogues || [];
        //índice del diálogo actual
        this.index = 0;
        //estado del gestor
        this.active = false;

        //configuración visual
        this.config = Object.assign({
            nameStyle: { fontSize: "35px", color: "#ffffff", fontFamily: "Caveat Brush" },
            dialogStyle: { fontSize: "30px", color: "#000000", fontFamily: "Caveat Brush", padding: 32, windowHeight: 100, dialogSpeed: 4 },
            dialogBoxClass: null, 

            spriteScale : 0.7
        }, config);

        //nombre del personaje
        this.nameText = null;
        //caja de diálogo
        this.dialogBox = null;
        //sprite del personaje
        this.sprite = null;
        //fondo
        this.background = null;

        //siguiente diálogo
        this.next = this.next.bind(this);
        //saltar diálogos
        this.skip = this.skip.bind(this);
    }

    start() {
        if (!this.dialogues.length) {
            console.warn("No hay diálogos para mostrar");
            return;
        }

        //activamos e inicializamos 
        this.active = true;
        this.index = 0;



        //creamos UI del nombre si no existe
        if (!this.nameText) {
            this.nameText = this.scene.add.text(30, 450, "", this.config.nameStyle);
        }

        //creamos UI de la caja de diálogo si no existe
        if (!this.dialogBox) {
            if (this.config.dialogBoxClass) {
                this.dialogBox = new this.config.dialogBoxClass(this.scene, this.config.dialogStyle);
            } else {
                this.dialogBox = this.scene.add.text(50, 400, "", this.config.dialogStyle);
            }
        }

        //avanzamos al siguiente diálogo con el click
        this.scene.input.on("pointerdown", this.next);
        
        //método para mostrar el diálogo
        this.showDialogue();
    }

    /*
    Muestra el diálogo actual
    */
    showDialogue() {
        //diálogo actual
        const d = this.dialogues[this.index];
        if (!d) {
            this.end();
            return;
        }
  
        if(d.background && d.background!=""){
            if(this.background){
                this.background.destroy();
                this.background = null;
            }
            this.background = this.scene.add.image(this.scene.sys.game.canvas.width*0.5,this.scene.sys.game.canvas.height*0.5,d.background);
            this.background.setDisplaySize(this.scene.sys.game.canvas.width,this.scene.sys.game.canvas.height);
            this.background.setDepth(-2);
        }
        //método que actualiza el sprite del pj si lo hubiera
        this.updateSprite(d);

        //añade el nombre del pj
        this.nameText.setText(d.chara?.name ?? d.name ?? "");
        //añade la línea de diálogo
        if (this.dialogBox.setText) {
            const text = d.line ?? "";
            //animación diálogo
            this.dialogBox.setText(text, d.animated ?? true);
        } else {
            this.dialogBox.setText(d.text ?? "");
        }
       
    }
    /*
    pasa al siguiente diálogo
    */
    next() {
        if (!this.active) return;
        //actualiza el índice de diálogos y muestra el siguiente
        this.index++;
        if (this.index >= this.dialogues.length) {
            this.end();
            return;
        }
        this.showDialogue();
    }

    /*
    salta todos los diálogos actualizando el índice al último disponible
    */
    skip() {
        this.index = this.dialogues.length;
        this.end();
    }

    /*
    creo que es bastante descriptivo..... cierra el manager de diálogos
    */
    end() {
        this.active = false;
        this.scene.events.emit("dialogueEnd");
    }

    /*
    método para actualizar sprite del pj  si lo hubiera
    */
    updateSprite(d){


        if(d.sprite && d.sprite!=""){
            if(this.sprite){
                this.sprite.destroy();
                this.sprite = null;
            }
            
            this.sprite = this.scene.add.image(600,320,d.sprite);
            this.sprite.setVisible(true);
            this.sprite.setScale(this.config.spriteScale);
            this.sprite.setDepth(-1);
        }
      
    }


}

