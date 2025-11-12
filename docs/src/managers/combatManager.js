import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";

export default class CombatManager{
    constructor(scene){
        this.scene = scene;
        this.isCombatActived = false;
        this.WARRIOR_Y = 300;
        this.FIRST_ALLY_POS = 350;
        this.WARRIORS_SEPARATION = 120;
        this.TEAM_DISTANCE = 190
        this.FIRST_ENEMY_POS = this.FIRST_ALLY_POS + this.TEAM_DISTANCE;
    }

    //Inicia el combate
    //tengo que tener 2 arrays, uno de ally y otro de enemy, mientras que los dos tengan cosas, se sigue
    //hasta que uno de los dos termine
    startCombat(allyTeam, enemyTeam){ 
        this.initTeamPositions(allyTeam, enemyTeam);
        while (allyTeam.length > 0 && enemyTeam.length > 0) {
            this.executeCombatRound(allyTeam, enemyTeam);
            /*
            Pequeña pausa entre rondas para mejor visualización
            this.scene.time.addEvent({
                delay: 1000,
                callback: ()=>{}
            });
            */
        }

        if(allyTeam.length == enemyTeam.length){ //cuando son en empate
            console.log("EMPATE");
        }

        const playerWins = allyTeam.length > 0;
        this.scene.events.emit('endCombat', playerWins, allyTeam, enemyTeam);
        /*
        this.scene.time.addEvent({
            delay: 1000,
            callback: ()=>{this.endCombat(playerWins, allyTeam, enemyTeam)}
        });
        */
    }

    //colocar a los guerreros en pantalla
    initTeamPositions(allyTeam, enemyTeam) {
        // Posicionar aliados
        allyTeam.forEach((ally, index) => {
            ally.setWarriorPosition(this.FIRST_ALLY_POS - index * this.WARRIORS_SEPARATION, this.WARRIOR_Y);
        });
        
        // Posicionar enemigos
        enemyTeam.forEach((enemy, index) => {
            enemy.setWarriorPosition(this.FIRST_ENEMY_POS + index * this.WARRIORS_SEPARATION, this.WARRIOR_Y);
        });
    }

    executeCombatRound(allyTeam, enemyTeam) {
        const targetEnemyIndex = Math.min(allyTeam[0].range, enemyTeam.length - 1);
        const targetEnemy = enemyTeam[targetEnemyIndex];
        const targetAllyIndex = Math.min(enemyTeam[0].range, enemyTeam.length - 1);
        const targetAlly = allyTeam[targetAllyIndex];

        this.executeWarriorsAttack(allyTeam[0], enemyTeam[0], targetEnemy, targetAlly);

        if (targetEnemy.life <= 0){
            this.removeDeadUnit(enemyTeam, targetEnemyIndex);
        }
        if (targetAlly.life <= 0){
            this.removeDeadUnit(allyTeam, targetAllyIndex);
        }
    }

    executeWarriorsAttack(attackerAlly, attackerEnemy, targetFromAlly, targetFromEnemy) {        
        this.scene.events.emit('warriorAttack', attackerAlly, targetFromAlly);
        this.scene.events.emit('warriorAttack', attackerEnemy, targetFromEnemy);

        /*
        this.scene.time.addEvent({
            delay: 1000,
            callback: ()=>{attackerAlly.attackWarrior(targetFromAlly)}
        }); // Pequeña pausa para ver el daño
        attackerEnemy.attackWarrior(targetFromEnemy);
        this.scene.time.addEvent({
            delay: 1000,
             callback: ()=>{attackerEnemy.attackWarrior(targetFromEnemy)}
        }); // Pequeña pausa para ver el daño
        */
    }

    removeDeadUnit(team, deadUnitIndex) {
        const deadUnit = team[deadUnitIndex];

        deadUnit.dieAnimation();
        
        this.scene.time.delayedCall(500, () => {
            deadUnit.destroy();
        });

        team.splice(deadUnitIndex, 1);
        if (team.length != 0 && deadUnitIndex != team.length-1){
            this.scene.events.emit('moveTeam', team, deadUnitIndex, deadUnit.x);
        }
    }

    moveTeam(team, deadUnitIndex, deadUnitX){
        for(let i = 0; deadUnitIndex + i < team.length; i++){
            const unit = team[deadUnitIndex + i];            
            const targetX = unit.calculateNewXInCombat(deadUnitX, deadUnitIndex + i, this.WARRIORS_SEPARATION);
            this.scene.tweens.add({
                targets: unit, // Ahora unit está definido
                x: targetX,
                y: this.WARRIOR_Y,
                duration: 500,
                ease: 'Power2'
            });      
        }
    }

    endCombat(playerWins, ally, enemyTeam) {            
            if (playerWins) {
                //console.log("¡VICTORIA!");
                this.victoria(ally);
            } else {
                console.log("Derrota...");
                this.derrota(enemyTeam);
            }
    }

    victoria(team) {
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
        team.forEach(unit => {
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

    derrota(team) {
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
        team.forEach(unit => {
            this.scene.tweens.add({
                targets: unit,
                y: unit.y + 20,
                alpha: 0.5,
                duration: 1000
            });
        });
    }
}