import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";

export default class Combat{

    constructor(scene){
        this.scene = scene;
        this.isCombatActived = false;
        this.WARRIOR_Y = 300;
        this.FIRST_ALLY_POS = 350;
        this.WARRIORS_SEPARATION = 120;
        this.TEAM_DISTANCE = 190
        this.FIRST_ENEMY_POS = this.FIRST_ALLY_POS + this.TEAM_DISTANCE;
    }

    //genera los enemigos dependiendo de la lista que se le mete, la lista metida depende del nivel en el que va el jugador y
    //tendrá la misma longitud que del jugador
    generateEnemy(ally, enemyList) { //genera los enemigos de la escena
        const enemyTeam = []; //crea lista vacia de los enemigos
        const enemyCount = ally.length; //coje el tam de los ally

        for (let i =0; i < enemyCount; i++){
            const index = Phaser.Math.Between(0, enemyList.length-1); //se coge los indices del 0 asta el tam del ally
            const enemyTemplate = enemyList[index]; //coje el enemigo aleatorio

            const enemy = enemyTemplate.clone(); //se clona

            console.log(enemy);

            enemyTeam.push(enemy); //se añade al equipo
        }
        return enemyTeam; //retorna el enemy
    }

    //tengo que tener 2 arrays, uno de ally y otro de enemy, mientras que los dos tengan cosas, se sigue
    //hasta que uno de los dos termine
    async combat(ally,enemyList){ 
        if(this.isCombatActived) return;

         console.log(ally);

        this.isCombatActived = true;
        const enemyTeam = this.generateEnemy(ally, enemyList);

        this.positionTeams(ally, enemyTeam);

        while (ally.length > 0 && enemyTeam.length > 0) {
            await this.executeCombatRound(ally, enemyTeam);
            
            // Pequeña pausa entre rondas para mejor visualización
            await this.delay(1000);
        }

        if(ally.length == enemyTeam.length){ //cuando son en empate
            console.log("EMPATE");
        }
        const playerWins = ally.length > 0;
        this.endCombat(playerWins, ally, enemyTeam);
        
        return playerWins;
    }

    positionTeams(ally, enemyTeam) {

        // Posicionar aliados
        ally.forEach((ally, index) => {
            ally.setWarriorPosition(this.FIRST_ALLY_POS - index * this.WARRIORS_SEPARATION, this.WARRIOR_Y);
             if (!ally.scene) {
            this.scene.add.existing(ally);
        }
        });
        
        // Posicionar enemigos
        enemyTeam.forEach((enemy, index) => {
            enemy.setWarriorPosition(this.FIRST_ENEMY_POS + index * this.WARRIORS_SEPARATION, this.WARRIOR_Y);
            if (!enemy.scene) {
                this.scene.add.existing(enemy);
            }
        });
    }

    async executeCombatRound(ally, enemyTeam) {
        const maxActions = Math.max(ally.length,enemyTeam.length);
        for(let i=0; i<maxActions; i++){
            if (i < ally.length && enemyTeam.length > 0 && ally[i] && ally[i].life > 0) {
            await this.executeSingleAttack(ally[i], enemyTeam, 'player');
            await this.delay(1000); // Pausa entre ataques individuales´
                this.removeDeadUnits(enemyTeam);
            }
            
            // Enemigo ataca si existe en esta posición
            if (i < enemyTeam.length && ally.length > 0 && enemyTeam[i] && enemyTeam[i].life > 0) {
            await this.executeSingleAttack(enemyTeam[i], ally, 'enemy');
            await this.delay(1000); // Pausa entre ataques individuales
                this.removeDeadUnits(ally);
            }

            // Si algún equipo se queda sin unidades, salir del bucle
            console.log("Ronda completada - Aliados:", ally.length, "Enemigos:", enemyTeam.length);
            if (ally.length === 0 || enemyTeam.length === 0) {
                break;
            }
        }
        
    }

    async executeSingleAttack(attacker, defendingTeam, teamType) {
        if (defendingTeam.length === 0) return;
        
        const targetIndex = Math.min(attacker.range, defendingTeam.length - 1);
        const target = defendingTeam[targetIndex];
        
        if (target && defendingTeam.includes(target) && target.life>0) {
            // Animación de ataque
            await this.attackAnimation(attacker, target);
            
            // Aplicar daño
            target.hit(attacker.attack);
            this.createDamageText(target.x, target.y, attacker.attack);
            
            // Pequeña pausa para ver el daño
            await this.delay(800);
        }
    }

  async attackAnimation(attacker, target) {
        const originalX = attacker.x;
        const originalY = attacker.y;
        
        // Mover hacia el objetivo
        await new Promise(resolve => {
            this.scene.tweens.add({
                targets: attacker,
                x: attacker.x + (target.x - attacker.x) * 0.3,
                y: attacker.y + (target.y - attacker.y) * 0.3,
                duration: 300,
                ease: 'Power2',
                onComplete: resolve
            });
        });
        
        // Efecto visual en el objetivo
        this.scene.tweens.add({
            targets: target,
            scaleX: 0.6,
            scaleY: 0.6,
            duration: 100,
            yoyo: true
        });
        
        // Volver a la posición original
        await new Promise(resolve => {
            this.scene.tweens.add({
                targets: attacker,
                x: originalX,
                y: originalY,
                duration: 300,
                ease: 'Power2',
                onComplete: resolve
            });
        });
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
          console.log(`Creando texto de daño: -${damage} en (${x}, ${y})`); // Debug

        const text = this.scene.add.text(x, y - 30, `-${damage}`, {
            fontSize: '24px',
            fill: color,
            stroke: '#000000',
            strokeThickness: 4,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 100,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                if (text && text.destroy) {
                    text.destroy();
                }
            }
        });
    }

    createHealText(x, y, amount) {
        const text = this.scene.add.text(x, y - 30, `+${amount}`, {
            fontSize: '20px',
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 80,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    removeDeadUnits(team) {
        let elimina = false;

        const isAlly = team.length > 0 ? team[0] instanceof Ally : false;


        for (let i = team.length - 1; i >= 0; i--) {
            if (team[i].life <= 0) {

                const deadUnit = team[i];

                deadUnit.setAlpha(0.3);
                deadUnit.setTint(0xff0000);
                
                this.scene.time.delayedCall(500, () => {
                    if (deadUnit && deadUnit.scene) {
                        deadUnit.destroy();
                    }
                });

                team.splice(i, 1);
                elimina = true;
            }
        }

        if(elimina) this.reponer(team, isAlly);
    }

    reponer(team, isAlly){
    if(team.length === 0) return;

    for(let i = 0; i < team.length; i++){
        let targetX, targetY;
        const unit = team[i];
        
        if (isAlly) {
            // Calcular nueva posición para aliados
            targetX = this.FIRST_ALLY_POS + (i * -this.WARRIORS_SEPARATION);
            targetY = this.WARRIOR_Y;
        } else {
            // Calcular nueva posición para enemigos
            targetX = this.FIRST_ENEMY_POS + (i * this.WARRIORS_SEPARATION);
            targetY = this.WARRIOR_Y;
        }
        
        // Animación suave hacia la nueva posición
        this.scene.tweens.add({
            targets: unit, // Ahora unit está definido
            x: targetX,
            y: targetY,
            duration: 500,
            ease: 'Power2'
        });
    }
}

    endCombat(playerWins, ally, enemyTeam) {
            this.isCombatActived = false;
            
            if (playerWins) {
                console.log("¡VICTORIA!");
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
    
    delay(ms) {
        return new Promise(resolve => this.scene.time.delayedCall(ms, resolve));
    }
}