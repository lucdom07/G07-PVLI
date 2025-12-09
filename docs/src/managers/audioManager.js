import { MusicKeys } from "./audioConfig.js";

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
        console.log("playing " + key);
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
        //Si es la música del menú principal, el tema de España o el del mapa (el tema general que se escucha antes de implementar los países en el juego) 
        // le pone volumen a 1
        if (this.currentMusic.key == MusicKeys.MENU || this.currentMusic.key == MusicKeys.ES || this.currentMusic.key == MusicKeys.MAPA){
            this.currentMusic.setVolume(1);
        }
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

    playSound(key){
        let soundEffect = this.scene.sound.add(key);
        soundEffect.play();
    }
}

// Exportar la clase, no la instancia
export default AudioManager;