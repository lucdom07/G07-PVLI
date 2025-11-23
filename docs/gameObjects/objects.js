
export default class Object extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,name,life,attack,texture,frame,cost,level){
        super(scene,x,y,texture,frame);
        this.name = name;
        this.life = life;
        this.attack = attack;
        this.cost = cost;
        this.level = level;

        this.DISPLAY_SIZE = 100;
        this.setDisplaySize(this.DISPLAY_SIZE, this. DISPLAY_SIZE);
        this.scene.add.existing(this);
    }

    //retorna el nombre del objeto
    getName(){
        return this.name;
    }

    clone(){
        const clone = new Object(
            this.scene,
            this.x,
            this.y,
            this.name,
            this.life,
            this.attack,
            this.texture,
            this.frame,
            this.cost,
            this.level
        );
        return clone;
    }

}