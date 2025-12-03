let instance = null;

export class AudioManager { //será un patron de silgueton
    constructor(scene) {
        this.scene = scene;
        this.currentMusic = null;
    }
    
    // Método estático para obtener instancia
    static getInstance(scene = null) {
        if (!instance && scene) {
            instance = new AudioManager(scene);
        } else if (scene && instance) {
            instance.scene = scene;
        }
        return instance;
    }
    
    // Reproducir música de fondo
    playMusic(key) {
        // Si ya está sonando esta música, no hacer nada
        if (this.currentMusic && this.currentMusic.key === key) {
            return;
        }
        
        // Detener música actual
        this.stopMusic();
        
        // Reproducir nueva música
        this.currentMusic = this.scene.sound.add(key, {
            loop: true,
            volume: 0.5
        });
        this.currentMusic.key = key; // Guardar referencia de la clave
        this.currentMusic.play();
    }
    
    // Detener música
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }
    
    // Pausar música
    pauseMusic() {
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.currentMusic.pause();
        }
    }
    
    // Reanudar música
    resumeMusic() {
        if (this.currentMusic && !this.currentMusic.isPlaying) {
            this.currentMusic.resume();
        }
    }
}

// Exportar la clase, no la instancia
export default AudioManager;