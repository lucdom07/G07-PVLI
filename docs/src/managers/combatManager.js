import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";

export default class CombatManager{
    constructor(scene){
        this.scene = scene;
        //cola de eventos, como mínimo hay una ronda de ataque de dos guerreros y se comprueba si hay algún equipo con 0 guerreros
        //this.eventsQueue = ['allyAttack', 'enemyAttack', 'checkState']; 
        this.canCallNext = true;
        this.nextEvent = ()=>{ this.callNextEvent() };
        this.allyAttack = ()=>{this.warriorAttack(this.allyTeam[0], this.enemyTeam)};
        this.enemyAttack = ()=>{this.warriorAttack(this.enemyTeam[0], this.allyTeam)};
        this.eventsQueue = [ this.allyAttack, this.enemyAttack, ()=>{this.checkCombatState()} ];
        //guardamos el equipo aliado y enemigo en propiedades de esta clase para usarlos en toda la clase sin estar pasándolos como parámetros
        this.allyTeam = [];
        this.enemyTeam = [];
        this.TEAM_DIST_FROM_CANVAS_HALF = 95;
        this.WARRIOR_Y = 300;
        this.WARRIORS_SEPARATION = 120; 
        this.FIRST_ALLY_POS_X = this.scene.sys.game.canvas.width*0.5 - this.TEAM_DIST_FROM_CANVAS_HALF;
        this.FIRST_ENEMY_POS_X = this.scene.sys.game.canvas.width*0.5 + this.TEAM_DIST_FROM_CANVAS_HALF;
    }

    //Inicializa el combate
    //tengo que tener 2 arrays, uno de ally y otro de enemy, mientras que los dos tengan cosas, se sigue hasta que uno de los dos termine
    initCombat(allyTeam, enemyTeam){ 
        //copiamos los aliados en el array de combatManager para que no compartan referencia y no se destruyan los aliados que tiene el jugador en la partida
        this.allyTeam = allyTeam.slice(); 
        this.enemyTeam = enemyTeam;
        this.initTeamPositions();
        //Empieza la llamada de eventos
        //this.callNextEvent();
    }

    update(time, dt){
        this.callNextEvent();
    }

    //Llamar al siguiente evento de la cola
    callNextEvent(){
        if (this.canCallNext && this.eventsQueue.length > 0){
            this.canCallNext = false;
            const followingEvent = this.eventsQueue[0];
            this.eventsQueue.shift();
            console.log(followingEvent);
            followingEvent();
        }
    }

    warriorAttack(attacker, targetTeam){
        if (attacker != undefined){
                const targetIndex = Math.min(attacker.range, targetTeam.length - 1);
                if (targetTeam[targetIndex] != undefined){
                    if (targetTeam[targetIndex].life - attacker.attack <= 0){
                        this.addNewEvent(()=>{this.removeDeadUnit(targetTeam, targetIndex)});
                    }
                    const target = targetTeam[targetIndex];
                    //this.scene.events.emit('warriorAttack', attacker, target, callback);
                    attacker.attackWarrior(target);
                }
        }
        else{
            this.scene.events.emit('canCallNext');
        }
    }

    //Añade un nuevo evento a la cola antes de que revise el estado del combate
    addNewEvent(event){
        this.eventsQueue.splice(this.eventsQueue.length - 2, 0, event);
    }

    checkCombatState(){
        if (this.allyTeam.length == 0 || this.enemyTeam.length == 0){
            this.eventsQueue.push(()=>{this.endCombat()});
        }
        else{
            this.eventsQueue.push(this.allyAttack, this.enemyAttack, ()=>{this.checkCombatState()});
        }
        this.scene.time.delayedCall(300, () => {
            this.scene.events.emit('canCallNext');
        });
    }

    //colocar a los guerreros en pantalla
    initTeamPositions() {
        // Posicionar aliados
        this.allyTeam.forEach((ally, index) => {
            ally.setWarriorPosition(this.FIRST_ALLY_POS_X - index * this.WARRIORS_SEPARATION, this.WARRIOR_Y);
        });
        
        // Posicionar enemigos
        this.enemyTeam.forEach((enemy, index) => {
            enemy.setWarriorPosition(this.FIRST_ENEMY_POS_X + index * this.WARRIORS_SEPARATION, this.WARRIOR_Y);
        });
    }

    removeDeadUnit(team, deadUnitIndex) {
        const deadUnit = team[deadUnitIndex];
        const deadUnitX = deadUnit.x;
        console.log("deadUnitX: " + deadUnitX);
        deadUnit.dieAnimation();
        
        this.scene.time.delayedCall(500, () => {
            deadUnit.destroy();
            console.log("destroyed");
        });

        team.splice(deadUnitIndex, 1);
        if (team.length != 0 && ((deadUnitIndex == 0 && team.length == 1)|| deadUnitIndex != team.length-1)){
            //this.scene.events.emit('moveTeam', team, deadUnitIndex, deadUnit.x);
            this.moveTeam(team, deadUnitIndex, deadUnitX);
        }
        this.scene.time.addEvent({
            delay: 500,
            callback: ()=>{ 
                this.scene.events.emit('canCallNext');
             }
        });
    }

    moveTeam(team, deadUnitIndex, deadUnitX){

        for(let i = 0; deadUnitIndex + i < team.length; i++){
            const unit = team[deadUnitIndex + i];  
            const targetX = unit.calculateNewXInCombat(deadUnitX, i, this.WARRIORS_SEPARATION);
            this.scene.tweens.add({
                targets: unit, // Ahora unit está definido
                x: targetX,
                y: this.WARRIOR_Y,
                duration: 500,
                ease: 'Power2',
            });
            console.log("old x: " + unit.x);
        }
        this.scene.time.addEvent({
            delay: 500,
            callback: ()=>{ 
                //actualizar el atributo x de cada guerrero porque el tweens solo lo cambia visualmente
                for (let i = 0; deadUnitIndex + i < team.length; i++){
                    team[deadUnitIndex + i].x = team[deadUnitIndex + i].calculateNewXInCombat(deadUnitX, i, this.WARRIORS_SEPARATION);
                    console.log("new x: " + team[deadUnitIndex + i].x);
                }
                this.scene.events.emit('canCallNext');
            }
        });
    }

    endCombat() {            
        if (this.allyTeam.length > 0) {
            console.log("¡VICTORIA!");
            this.victoria();
        } else {
            console.log("Derrota...");
            this.derrota();
        }
    }

    victoria() {
        // Texto de VICTORIA
        const victoryText = this.scene.add.text(
            this.scene.cameras.main.centerX, 
            150, 
            '¡VICTORIA!', 
            {
                fontSize: '48px',
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6,
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);
        
        // Animación del texto
        victoryText.setAlpha(0);
        this.scene.tweens.add({
            targets: victoryText,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Animación de los personajes
        this.allyTeam.forEach(unit => {
            this.scene.tweens.add({
                targets: unit,
                scaleX: 0.6,
                scaleY: 0.6,
                duration: 300,
                yoyo: true,
                repeat: 2
            });
        });
    }

    derrota() {
        // Texto de DERROTA
        const defeatText = this.scene.add.text(
            this.scene.cameras.main.centerX, 
            150, 
            'DERROTA', 
            {
                fontSize: '48px',
                fill: '#FF0000',
                stroke: '#000000',
                strokeThickness: 6,
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);
        
        // Animación del texto
        defeatText.setAlpha(0);
        this.scene.tweens.add({
            targets: defeatText,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Animación de los personajes
        this.enemyTeam.forEach(unit => {
            this.scene.tweens.add({
                targets: unit,
                y: unit.y + 20,
                alpha: 0.5,
                duration: 1000
            });
        });
    }
}