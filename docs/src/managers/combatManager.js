import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";

export default class CombatManager{
    constructor(scene){
        this.scene = scene;
        //cola de eventos, como mínimo hay una ronda de ataque de dos guerreros y se comprueba si hay algún equipo con 0 guerreros
        this.eventsQueue = ['allyAttack', 'enemyAttack', 'checkState']; 
        //guardamos el equipo aliado y enemigo en propiedades de esta clase para usarlos en toda la clase sin estar pasándolos como parámetros
        this.allyTeam = [];
        this.enemyTeam = [];
        //guarda los índices los guerreros que son atacados en una ronda. Necesario para métodos removeDeadUnit y moveTeam en caso de que mueran
        //deadWarriorsIndex[0] = índice aliado
        //deadWarriorsIndex[1] = índice enemigo
        this.targetWarriorsIndex = [-1, -1]; 
        this.TEAM_DIST_FROM_CANVAS_HALF = 95
        this.WARRIOR_Y = 300;
        this.WARRIORS_SEPARATION = 120; 
        this.FIRST_ALLY_POS_X = this.scene.sys.game.canvas.width*0.5 - this.TEAM_DIST_FROM_CANVAS_HALF;
        this.FIRST_ENEMY_POS_X = this.scene.sys.game.canvas.width*0.5 + this.TEAM_DIST_FROM_CANVAS_HALF;
    }

    //Inicia el combate
    //tengo que tener 2 arrays, uno de ally y otro de enemy, mientras que los dos tengan cosas, se sigue hasta que uno de los dos termine
    startCombat(allyTeam, enemyTeam){ 
        //copiamos los aliados en el array de combatManager para que no compartan referencia y no se destruyan los aliados que tiene el jugador en la partida
        this.allyTeam = allyTeam.slice(); 
        this.enemyTeam = enemyTeam;
        this.initTeamPositions();
        //Empieza la llamada de eventos
        this.callNextEvent();
        /*
        while (allyTeam.length > 0 && enemyTeam.length > 0) {
            this.scene.events.emit('roundStarts', allyTeam, enemyTeam);
        }

        if(allyTeam.length == enemyTeam.length){ //cuando son en empate
            console.log("EMPATE");
        }
        const playerWins = allyTeam.length > 0;
        this.scene.events.emit('endCombat', playerWins, allyTeam, enemyTeam);
        */
        //this.endCombat(playerWins, allyTeam, enemyTeam);
    }

    //Llamar al siguiente evento de la cola
    callNextEvent(){
        const followingEvent = this.eventsQueue[0];
        this.eventsQueue.shift();
        this.checkEvent(followingEvent);
    }

    //Mira a qué evento hay que llamar según el string que se le pase
    checkEvent(event){
        switch(event){
            case 'allyAttack':
                const targetEnemyIndex = Math.min(this.allyTeam[0].range, this.enemyTeam.length - 1);
                this.targetWarriorsIndex[1] = targetEnemyIndex;
                const enemyTarget = this.enemyTeam[targetEnemyIndex];
                this.scene.events.emit('warriorAttack', this.allyTeam[0], enemyTarget);
                break;
            case 'enemyAttack':
                const targetAllyIndex = Math.min(this.enemyTeam[0].range, this.allyTeam.length - 1);
                this.targetWarriorsIndex[0] = targetAllyIndex;
                const allyTarget = this.allyTeam[targetAllyIndex];
                this.scene.events.emit('warriorAttack', this.enemyTeam[0], allyTarget);
                break;
            case 'removeDeadAlly':
                this.scene.events.emit('removeDeadUnit', this.allyTeam, this.targetWarriorsIndex[0]);
                break;
            case 'removeDeadEnemy':
                this.scene.events.emit('removeDeadUnit', this.enemyTeam, this.targetWarriorsIndex[1]);
                break;
            case 'checkState':
                this.scene.events.emit('checkCombatState');
                break;
            case 'endCombat':
                const playerWins = allyTeam.length > 0;
                this.scene.events.emit('endCombat', playerWins);
                break;
            default:
                break;
        }
    }

    //Añade un nuevo evento a la cola antes de que revise el estado del combate
    addNewEvent(event){
        this.eventsQueue.splice(this.eventsQueue.length - 2, 0, event);
    }

    checkCombatState(){
        if (this.allyTeam.length == 0 || this.enemyTeam.length == 0){
            this.eventsQueue.push('endCombat');
        }
        else{
            this.eventsQueue.push('allyAttack', 'enemyAttack', 'checkState');
        }
        this.scene.events.emit('nextEvent');
    }

    //colocar a los guerreros en pantalla
    initTeamPositions() {
        // Posicionar aliados
        this.allyTeam.forEach((ally, index) => {
            ally.setWarriorPosition(this.FIRST_ALLY_POS - index * this.WARRIORS_SEPARATION, this.WARRIOR_Y);
        });
        
        // Posicionar enemigos
        this.enemyTeam.forEach((enemy, index) => {
            enemy.setWarriorPosition(this.FIRST_ENEMY_POS + index * this.WARRIORS_SEPARATION, this.WARRIOR_Y);
        });
    }

    /*
    executeCombatRound(allyTeam, enemyTeam) {
        const targetEnemyIndex = Math.min(allyTeam[0].range, enemyTeam.length - 1);
        const targetEnemy = enemyTeam[targetEnemyIndex];
        const targetAllyIndex = Math.min(enemyTeam[0].range, allyTeam.length - 1);
        const targetAlly = allyTeam[targetAllyIndex];

        allyTeam[0].attackWarrior(targetEnemy);
        enemyTeam[0].attackWarrior(targetAlly);

        if (targetEnemy.life <= 0){
            this.scene.events.emit('removeDeadUnit', enemyTeam, targetEnemyIndex);
            //this.removeDeadUnit(enemyTeam, targetEnemyIndex);
        }
        if (targetAlly.life <= 0){
            this.scene.events.emit('removeDeadUnit', allyTeam, targetAllyIndex);
            //this.removeDeadUnit(allyTeam, targetAllyIndex);
        }
    }
        */

    removeDeadUnit(team, deadUnitIndex) {
        const deadUnit = team[deadUnitIndex];

        deadUnit.dieAnimation();
        
        this.scene.time.delayedCall(500, () => {
            deadUnit.destroy();
        });

        team.splice(deadUnitIndex, 1);
        if (team.length != 0 && deadUnitIndex != team.length-1){
            //this.scene.events.emit('moveTeam', team, deadUnitIndex, deadUnit.x);
            this.moveTeam(team, deadUnitIndex, deadUnit.x);
        }
    }

    moveTeam(team, deadUnitIndex, deadUnitX){
        for(let i = 0; deadUnitIndex + i < team.length; i++){
            const unit = team[deadUnitIndex + i];            
            const targetX = unit.calculateNewXInCombat(deadUnitX, deadUnitIndex + i, this.WARRIORS_SEPARATION);

            console.log("array: " + team + " Indice del muerto: " + deadUnitIndex + " PosX: " + deadUnitX);

            this.scene.tweens.add({
                targets: unit, // Ahora unit está definido
                x: targetX,
                y: this.WARRIOR_Y,
                duration: 500,
                ease: 'Power2'
            });      
        }
        this.scene.events.emit('nextEvent');
    }

    endCombat(playerWins) {            

            if (playerWins) {
                //console.log("¡VICTORIA!");
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