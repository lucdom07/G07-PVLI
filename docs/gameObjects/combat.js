import Ally from "./ally";
import Enemy from "./enemy";

export default class Combat{
    constructor(scene){
        this.scene = scene;
        this.isCombatActived = false;
    }

    //genera los enemigos dependiendo de la lista que se le mete, la lista metida depende del nivel en el que va el jugador y
    //tendrá la misma longitud que del jugador
    generateEnemy(ally, enemyList) {
        const enemyTeam = [];
        const enemyCount = ally.lenght;

        for (let i =0; i<enemyCount; i++){
            const index = Phaser.Math.Between(0, enemyList.lenght-1);
            const enemyTemplate = enemyList[index];

            const enemy = new Enemy(
                this.scene,
                600 + (i * 80), // Posición X
                enemyTemplate.y, // Posición Y con variación
                enemyTemplate.life,
                enemyTemplate.attack,
                enemyTemplate.range, // Rango de ataque
                enemyTemplate.texture,
                enemyTemplate.frame || 0
            );
            enemyTeam.push(enemy);
        }
        return enemyTeam;
    }

    //tengo que tener 2 arrays, uno de ally y otro de enemy, mientras que los dos tengan cosas, se sigue
    //hasta que uno de los dos termine
    async combat(ally,enemyList){ 
        if(this.isCombatActived) return;

        this.isCombatActived = true;
        const enemyTeam = this.generateEnemy(ally, enemyList);

        this.positionTeams(ally, enemyTeam);

        while (ally.length > 0 && enemyTeam.length > 0) {
            await this.executeCombatRound(ally, enemyTeam);
            
            // Pequeña pausa entre rondas para mejor visualización
            await this.delay(500);
        }

        if(ally.lenght == enemyTeam.length){ //cuando son en empate

        }
        const playerWins = ally.length > 0;
        this.endCombat(playerWins, ally, enemyTeam);
        
        return playerWins;
    }

    positionTeams(playerTeam, enemyTeam) {
        // Posicionar aliados
        playerTeam.forEach((ally, index) => {
            ally.x = 200 + (index * 80);
            ally.y = 300 + (index * 10);
        });
        
        // Posicionar enemigos
        enemyTeam.forEach((enemy, index) => {
            enemy.x = 600 + (index * 80);
            enemy.y = 300 + (index * 10);
        });
    }

    async executeCombatRound(playerTeam, enemyTeam) {
        // Los equipos atacan simultáneamente
        const playerAttacks = this.calculateAttacks(playerTeam, enemyTeam);
        const enemyAttacks = this.calculateAttacks(enemyTeam, playerTeam);
        
        // Aplicar daño
        this.applyDamage(playerAttacks, enemyTeam);
        this.applyDamage(enemyAttacks, playerTeam);
        
        // Eliminar unidades muertas
        this.removeDeadUnits(playerTeam);
        this.removeDeadUnits(enemyTeam);
        
        console.log("Ronda completada - Aliados:", playerTeam.length, "Enemigos:", enemyTeam.length);
    }

    createHealText(x, y, amount) {
        const text = this.scene.add.text(x, y - 30, `+${amount}`, {
            fontSize: '16px',
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 3
        });
        
        this.scene.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    calculateAttacks(attackingTeam, defendingTeam) {
        const attacks = [];
        
        for (const attacker of attackingTeam) {
            if (defendingTeam.length === 0) break;
            
            const targetIndex = attacker.range;
            if(targetIndex>defendingTeam.length){
                targetIndex= defendingTeam.lenght-1;
            }
            const target = defendingTeam[targetIndex];
            
            attacks.push({
                attacker: attacker,
                target: target,
                damage: attacker.attack
            });
        }
        
        return attacks;
    }

    applyDamage(attacks, defendingTeam) {
        for (const attack of attacks) {
            if (defendingTeam.includes(attack.target)) {
                attack.target.hit(attack.damage);
                this.createDamageText(attack.target.x, attack.target.y, attack.damage);
            }
        }
    }

    createDamageText(x, y, damage, color = '#ff0000'){
        const text = this.scene.add.text(x, y - 30, `-${damage}`, {
            fontSize: '20px',
            fill: color,
            stroke: '#000000',
            strokeThickness: 3
        });
        
        this.scene.tweens.add({
            targets: text,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    removeDeadUnits(team) {
        for (let i = team.length - 1; i >= 0; i--) {
            if (team[i].life <= 0) {
                team[i].setAlpha(0.3);
                team[i].setTint(0xff0000);
                
                this.scene.time.delayedCall(500, () => {
                    if (team[i] && team[i].scene) {
                        team[i].destroy();
                    }
                });
                
                team.splice(i, 1);
            }
        }
    }

    endCombat(playerWins, playerTeam, enemyTeam) {
        this.isCombatActive = false;
        
        if (playerWins) {
            console.log("¡VICTORIA!");
            this.victoria(playerTeam);
        } else {
            console.log("Derrota...");
            this.derrota(enemyTeam);
        }
    }

    victoria(team) {
        team.forEach(unit => {
            this.scene.tweens.add({
                targets: unit,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 300,
                yoyo: true,
                repeat: 2
            });
        });
    }
    
    derrota(team) {
        team.forEach(unit => {
            this.scene.tweens.add({
                targets: unit,
                y: unit.y + 20,
                alpha: 0.5,
                duration: 1000
            });
        });
    }
    
    delay(ms) {
        return new Promise(resolve => this.scene.time.delayedCall(ms, resolve));
    }


}

//genero los enemigos