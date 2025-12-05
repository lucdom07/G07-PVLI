// Define todas las músicas
export const MusicKeys = {
    MENU: 'bad_apple',
    INTRO: 'introduction',

    ES: 'españa',
    USA: 'estados_unidos',
    CH: 'china',
    AU: 'australia',

    PRE: 'prebatalla',
    MAPA: 'mapa',
    BATALLA: 'combat',
    TIENDA: 'market',
    PAUSA: 'boss_music',
    VICTORY: 'victory_music',
    GAME_OVER: 'gameover_music'
};

// sitios de los archivos de sonido
export const AudioFiles = {
    [MusicKeys.MENU]: 'assets/sonidos/sevenNationMeowrmy.mp3', //no tocar
    [MusicKeys.INTRO]: 'assets/sonidos/battle.mp3',

    [MusicKeys.ES]: 'assets/placeholders/audio/bad_apple.mp3',
    [MusicKeys.USA]: 'assets/sonidos/americanMeowdiot.mp3', //no tocar
    [MusicKeys.CH]: 'assets/placeholders/audio/bad_apple.mp3',
    [MusicKeys.AU]: 'assets/sonidos/australia.mp3', //no tocar

    [MusicKeys.PRE]: 'assets/sonidos/battle.mp3',
    [MusicKeys.MAPA]:'assets/placeholders/audio/bad_apple.mp3',
    [MusicKeys.BATALLA]:'assets/sonidos/batalla.mp3', //no tocar
    [MusicKeys.TIENDA]:'assets/sonidos/battle.mp3',
    [MusicKeys.PAUSA]: 'assets/sonidos/battle.mp3',
    [MusicKeys.VICTORY]: 'assets/sonidos/battle.mp3',
    [MusicKeys.GAME_OVER]: 'assets/sonidos/gameover.mp3' //no tocar
};