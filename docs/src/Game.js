/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
	type: Phaser.AUTO,
	width:  800,
	height: 600,
	pixelArt: true,
	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	scene: [{preload:preload, create:create}],	// Decimos a Phaser cual es nuestra escena, en este caso la escena es un 
												//objeto formado por el método preload y create definidos más abajo en 
												//este mismo archivo
	physics: { 
		default: 'arcade', 
		arcade: { 
			gravity: { y: 200 }, 
			debug: false 
		} 
	}
};

new Phaser.Game(config);

// preload - método de las escenas donde se pueden cargar los recursos que necesitaremos
function preload (){
		//Cargamos assets de una URL de otra web
		//this.load.setBaseURL('http://labs.phaser.io');
		//this.load.image('sky', 'assets/skies/space.png');
		//this.load.image('logo', 'assets/sprites/phaser3-logo.png');
		//this.load.image('red', 'assets/particles/red.png');
		
		//Cargamos los assets desde nuestra raiz del proyecto
		this.load.image('sky', 'assets/space.png');
		this.load.image('logo', 'assets/phaser3-logo.png');
		this.load.image('red', 'assets/red.png');
}

// create - método de las escenas que se llama una vez la escena está instanciada
function create ()
{
		//Las imagenes tienen como origen el centro por defecto
		//this.add.image(400, 300, 'sky');
		
		//Imagen con origen superior izquierdo
		this.add.image(0, 0, 'sky').setOrigin(0, 0);
		
		var particles = this.add.particles('red');

		var emitter = particles.createEmitter({
			speed: 100,
			scale: { start: 1, end: 0 },
			blendMode: 'ADD'
		});

		var logo = this.physics.add.image(400, 100, 'logo');

		logo.setVelocity(100, 200);
		logo.setBounce(1, 1);
		logo.setCollideWorldBounds(true);

		emitter.startFollow(logo);
}

// las escenas también tienen el método init() y update(time, delta)
// init - se ejecuta cuando se carga la escena. Aquí se pueden pasar datos entre escenas.
// update - se llama cada ciclo de juego, para modificar el estado