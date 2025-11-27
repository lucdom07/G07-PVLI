export default class DialogText{

	constructor(scene, opts){
		this.scene = scene;
		this.init(opts);
	}

	init(opts) {
		// Mira si hay parámetros que se pasan, en caso de que no, se usan los por defecto
		if (!opts) opts = {};
		
		// set properties from opts object or use defaults
		this.borderThickness = opts.borderThickness || 2;
		this.borderColor = opts.borderColor || 0xFFFFFF;
		this.borderAlpha = opts.borderAlpha || 1;
		this.windowAlpha = opts.windowAlpha || 0.8;
		this.windowColor = opts.windowColor || 0x000000;
		this.windowHeight = opts.windowHeight || 150;
		this.padding = opts.padding || 32;
		this.dialogSpeed = opts.dialogSpeed || 3;
		this.fontSize = opts.fontSize || 24
		this.fontFamily = opts.fontFamily || undefined
		
		// se usa para animar el texto
		this.eventCounter = 0;
		
		// si la ventana de diálogo se muestra
		this.visible = true;
		
		// texto que hay en la ventana
		this.text;
		
		// texto que se renderizará en la ventana
		this.dialog;
		this.graphics;
		
		//Crea la ventana de dialogo
		this._createWindow();
	}

	// Método que cierra y abre la ventana de diálogo
	toggleWindow() {
		this.visible = !this.visible;
		if (this.text) 
			this.text.visible = this.visible;
		if (this.graphics) 
			this.graphics.visible = this.visible;
	}

	// con esta función se nos permite añadir texto a la ventana
	// Este método se llamara desde la escena que corresponda
	setText(text, animate) {
		//el parametro animate nos permite saber si el texto sera animado o no
		this.eventCounter = 0;
		
		//se crea un array con cada caracter en la cadena de texto y se 
		// guarda en la propiedad diálogo
		this.dialog = text.split('');

		//se mira si hay otro evento de tiempo corriendo y lo elimina
		if (this.timedEvent) 
			this.timedEvent.remove();

		//esta variable es un string vacio si animate es true, de otra manera es la variable text
		var tempText = animate ? '' : text;
		
		//llama al metodo que calcula la pos del texto y lo crea
		this._setText(tempText); 

		if (animate) {
			//se crea un evento temporizado
			this.timedEvent = this.scene.time.addEvent({
				//delay indica el tiempo en ms hasta que se empieza el evento      
				delay: 150 - (this.dialogSpeed * 30),
				//se llama a la funcion de animar el texto
				//Cada vez que se llama a la funcion de animar se aumenta el eventCounter
				callback: this._animateText,
				//especifica en qué scope se muestra el texto
				callbackScope: this,
				//el evento se repite
				loop: true
			});
		}
		
	}

	// Consigue el ancho del juego (en funcion del tamaño en la escena) 
	_getGameWidth() {
		return this.scene.sys.game.config.width;
	}

	// Consigue el alto del juego (en funcion del tamaño de la escena) 
	_getGameHeight() {
		return this.scene.sys.game.config.height;
	}

	// Calcula las dimensiones y pos de la ventana en funcion del tamaño de la pantalla de juego
	_calculateWindowDimensions(width, height) {
		var x = this.padding;
		var y = height - this.windowHeight - this.padding;
		var rectWidth = width - (this.padding * 2);
		var rectHeight = this.windowHeight;
		return {
			x,
			y,
			rectWidth,
			rectHeight
		};
	}

	// Crea la ventana interior, donde se muestra el texto 
	_createInnerWindow(x, y, rectWidth, rectHeight) {
		//rellena con el color y alpha especificados en las propiedades
		this.graphics.fillStyle(this.windowColor, this.windowAlpha);
		
		//Se crea el rectangulo pasandole las propiedades de posicion y dimensiones
		this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
	}

	// Creates the border rectangle of the dialog window
	_createOuterWindow(x, y, rectWidth, rectHeight) {
		//Se usa para especificar el estilo de la linea exterior: grosor, color...
		this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
		
		//permite dibujar un rectangulo sin darle relleno
		this.graphics.strokeRect(x, y, rectWidth, rectHeight);
	}

	// Método que crea la ventana de diálogo
	_createWindow() {
		//Obtenemos las dimensiones del juego
		var gameHeight = this._getGameHeight();
		var gameWidth = this._getGameWidth();

		//Se calcula la dimension de la ventana de diálogo
		var dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
		this.graphics = this.scene.add.graphics();
		
		//Se crean las ventanas interior y exterior
		this._createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
		this._createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
		
	}


	// Hace aparecer al texto lentamente en pantalla
	_animateText() {
		this.eventCounter++;
		
		//se va actualizando el texto de nuestro game object llamando a setText
		this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
		
		//Cuando eventCounter sea igual a la longitud del texto, se detiene el evento
		if (this.eventCounter === this.dialog.length) {
			this.timedEvent.remove();
		}
	}

	// Calcula la pos del texto en la ventana
	_setText(text) {
		// Resetea el game object del texto si ya estaba seteada la propiedad del texto del plugin
		if (this.text) 
			this.text.destroy();

		var x = this.padding + 10;
		var y = this._getGameHeight() - this.windowHeight - this.padding + 10;

		//Crea un game object que sea texto
		this.text = this.scene.make.text({
			x,
			y,
			text,
			style: {
				//se obliga al texto a permanecer dentro de unos limites determinados
				wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 25 },
				fontSize: this.fontSize,
				fontFamily: this.fontFamily
			}
		});
	}

  
};