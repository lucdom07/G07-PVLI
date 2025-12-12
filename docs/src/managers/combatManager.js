import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";

export default class CombatManager{
    constructor(scene){
        this.scene = scene;
        this.canCallNext = true;
        this.nextEvent = ()=>{ this.callNextEvent() };
        this.allyAttack = ()=>{this.warriorAttack(this.allyTeam[0], this.enemyTeam)};
        this.enemyAttack = ()=>{this.warriorAttack(this.enemyTeam[0], this.allyTeam)};
        //cola de eventos, como mínimo hay una ronda de ataque de dos guerreros y se comprueba si hay algún equipo con 0 guerreros
        this.eventsQueue = [ this.allyAttack, this.enemyAttack, ()=>{this.checkCombatState()} ];
        //guardamos el equipo aliado y enemigo en propiedades de esta clase para usarlos en toda la clase sin estar pasándolos como parámetros
        this.allyTeam = [];
        this.enemyTeam = [];
        this.victory = false;
        this.TEAM_DIST_FROM_CANVAS_HALF = 95;
        this.WARRIOR_Y = 300;
        this.WARRIORS_SEPARATION = 120; 
        this.FIRST_ALLY_POS_X = this.scene.sys.game.canvas.width*0.5 - this.TEAM_DIST_FROM_CANVAS_HALF;
        this.FIRST_ENEMY_POS_X = this.scene.sys.game.canvas.width*0.5 + this.TEAM_DIST_FROM_CANVAS_HALF;
        //tiempo de delay entre llamadas de las funciones deL combat manager (excepto en checkCombatState())
        this.MANAGER_DELAY_TIME = 380;
    }

    //Inicializa el combate
    initCombat(allyTeam, enemyTeam){ 
        //copiamos los aliados en el array de combatManager para que no compartan referencia y no se destruyan los aliados que tiene el jugador en la partida
        this.allyTeam = allyTeam.slice(); 
        this.enemyTeam = enemyTeam;
        this.initTeamPositions();
    }

    //update que se llama en el update de debugCombat
    update(time, dt){
        this.callNextEvent();
    }

    //Llama al siguiente evento de la cola si canCallNext es igual a true, que sirve como señal para indicar que puede llamar al siguiente evento
    callNextEvent(){
        if (this.canCallNext && this.eventsQueue.length > 0){
            this.canCallNext = false;
            const followingEvent = this.eventsQueue[0];
            //Quitamos el evento de la cola para que en la siguiente llamada se llame al siguiente evento
            this.eventsQueue.shift();
            console.log(followingEvent);
            followingEvent();
        }
    }

    //llama a la función de ataque, determina el target del atacante según el rango y añade un evento antes de checkCombatState en caso de que 
    //el atacante reduzca las vidas del target a 0 o menos
    warriorAttack(attacker, targetTeam){
        if (attacker != undefined){
                const targetIndex = Math.min(attacker.range, targetTeam.length - 1);
                if (targetTeam[targetIndex] != undefined){
                    if (targetTeam[targetIndex].life - attacker.attack <= 0){
                        this.addNewEvent(()=>{this.removeDeadUnit(targetTeam, targetIndex)});
                    }
                    const target = targetTeam[targetIndex];
                    attacker.attackWarrior(target);
                }
        }
        else{
            this.scene.events.emit('canCallNext');
        }
    }

    //Añade un nuevo evento a la cola antes de que revise el estado del combate, por eso el this.eventsQueue.length - 2
    addNewEvent(event){
        this.eventsQueue.splice(this.eventsQueue.length - 2, 0, event);
    }

    //Comprueba si algún equipo ha sido derrotado. En caso contrario se añade otra ronda de ataque
    checkCombatState(){
        if (this.allyTeam.length == 0 || this.enemyTeam.length == 0){
            this.eventsQueue.push(()=>{this.endCombat()});
        }
        else{
            this.eventsQueue.push(this.allyAttack, this.enemyAttack, ()=>{this.checkCombatState()});
        }
        this.scene.time.delayedCall(100, () => {
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

    //elimina al guerrero muerto del juego y en caso de que quede un espacio en blanco entre medias o en la primera posición
    //se llama a moveTeam para que mueva a los guerreros de posición
    removeDeadUnit(team, deadUnitIndex) {
        const deadUnit = team[deadUnitIndex];
        const deadUnitX = deadUnit.x;
        deadUnit.dieAnimation();
        
        this.scene.time.delayedCall(this.MANAGER_DELAY_TIME, () => {
            deadUnit.destroy();
        });

        team.splice(deadUnitIndex, 1);
        if (team.length != 0 && ((deadUnitIndex == 0 && team.length == 1)|| deadUnitIndex != team.length-1)){
            this.moveTeam(team, deadUnitIndex, deadUnitX);
        }
        this.scene.time.addEvent({
            delay: this.MANAGER_DELAY_TIME,
            callback: ()=>{ 
                this.scene.events.emit('canCallNext');
             }
        });
    }

    //mueve a los guerreros y sus stats para ocupar el espacio que ha dejado el guerrero muerto
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
            //animación de las stats para que se muevan junto con la unidad
            unit.warriorUI.moveStatsAnimation(targetX);
        }
        this.scene.time.addEvent({
            delay: this.MANAGER_DELAY_TIME,
            callback: ()=>{ 
                //actualizar el atributo x de cada guerrero porque el tweens solo lo cambia visualmente
                for (let i = 0; deadUnitIndex + i < team.length; i++){
                    const newX = team[deadUnitIndex + i].calculateNewXInCombat(deadUnitX, i, this.WARRIORS_SEPARATION);
                    team[deadUnitIndex + i].setWarriorPosition(newX, this.WARRIOR_Y);
                }
                this.scene.events.emit('canCallNext');
            }
        });
    }

    //comprueba quién ha ganado y se reproduce una animación diferente según el resultado
    endCombat() {            
        if (this.allyTeam.length > 0) {
            console.log("¡VICTORIA!");
            this.victoria();
        } else {
            console.log("Derrota...");
            this.derrota();
        }
        this.scene.time.delayedCall(500, () => {
            this.scene.showExitButton();
        });
    }

    //Animacion del texto de victoria
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
                fontFamily: "Caveat Brush",
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
        this.victory = true;
    }

    //Animacion del texto de derrota
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
                fontFamily: "Caveat Brush",
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