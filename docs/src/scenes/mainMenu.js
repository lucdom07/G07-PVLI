export default class mainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu'});
    }

    preload(){
        this.load.image('button','../../assets/button.jpg')
    }

    create(){

        //texto de título
        this.add.text(400,150,'The furrytastic invasion',
            {fontSize: '48px',
            color: '#ffffff'
            }
        ).setOrigin(0.5);

        //texto de botón de juego

        const playButton = this.add.image(300,100,'button').setInteractive();


        const label = this.add.text(400,150,'Jugar', 
        {fontSize: '30px',
            color: '#fffffff'
        }
        ).setOrigin(0);

        playButton.setPosition(400, 550);
        label.setPosition(400, 550);

        playButton.on('pointerdown',()=>{
            this.scene.start('debugCombat');
        });
    }

    
}

