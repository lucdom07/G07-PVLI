import Ally from "../../gameObjects/characters/ally.js";
import GlobalObject from "./globalObjects.js";
import Enemy from "../../gameObjects/characters/enemy.js";

export default class cargaGameObject{
    constructor(scene,nivel){
        this.level = nivel;
        this.scene = scene;  
    }

    //obtiene del json un array específico de aliados
    getAllyGroup(){
        const allyKey = `ally${this.level}`;
        const rawData = this.scene.cache.json.get("allyGroup");

        if(rawData && rawData[allyKey]){
            return rawData[allyKey];
        }
        else return null;
    }

    //obtiene del json un array específico de enemigos
    getEnemyGroup(){
        const enemyKey = `enemy${this.level}`;
        const rawData = this.scene.cache.json.get("enemyGroup");

        if(rawData && rawData[enemyKey]){
            return rawData[enemyKey];
        }
        else return null;
    }

    //obtiene del json un array específico de objetos
    getObjectGroup(){
        const objectKey = `objects${this.level}`;
        const rawData = this.scene.cache.json.get("objects");

        if(rawData && rawData[objectKey]){
            return rawData[objectKey];
        }
        else return null;
    }

    //Carga de grupos de aliados junto con sus texturas
    loadAllyGroups(){
        const groupToLoad = this.getAllyGroup();

        if (!groupToLoad) return [];
        
        return groupToLoad.map(allyData => {
            return new Ally(
                this.scene,
                -150,
                -150,
                allyData.name,
                allyData.life,
                allyData.attack,
                allyData.range,
                allyData.name + "Texture",
                0,
                allyData.cost,
                false,
                allyData.texture
            );
        });
    }

    //Carga de grupos de enemigos junto con sus texturas
    loadEnemyGroups(){
        const groupToLoad = this.getEnemyGroup();

        if (!groupToLoad) return [];
        
        return groupToLoad.map(enemyData => {
            return new Enemy(
                this.scene,
                -150,
                -150,
                enemyData.name,
                enemyData.life,
                enemyData.attack,
                enemyData.range,
                enemyData.name+"Texture",
                0,
                enemyData.texture
            );
        });
    }

    //Carga de grupos de objetos junto con sus texturas
    loadObjectGroups(){
        const groupToLoad = this.getObjectGroup();

        if (!groupToLoad) return [];

        return groupToLoad.map(objectData => {
            return new GlobalObject(
                this.scene,
                -150,
                -150,
                objectData.name,
                objectData.texture,
                objectData.life,
                objectData.attack,
                objectData.cost,
                objectData.name+"Texture",
            );
        });
    }
}