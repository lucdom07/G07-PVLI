// Define todas las músicas
export const MusicKeys = {
    MENU: 'bad_apple',
    
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
    GAME_OVER: 'gameover_music',
    
    //Música diálogos
    INTRO: 'introduction',
    AUSTRALIA_VICTORY: 'australiaVictory',
    SPAIN_VICTORY: 'spainVictory',
    CHINA_VICTORY: 'chinaVictory',
    USA_VICTORY: 'usaVictory',
    ENDING: 'ending',

    //Efectos de sonido
    ALLY_DAMAGE: 'ay_mama'
};

// sitios de los archivos de sonido
export const AudioFiles = {
    //Música
    [MusicKeys.MENU]: 'assets/sonidos/sevenNationMeowrmy.mp3', //no tocar
    
    [MusicKeys.ES]: 'assets/sonidos/auroraLaMinera_gameVersion.mp3', //no tocar
    [MusicKeys.USA]: 'assets/sonidos/americanMeowdiot.mp3', //no tocar
    [MusicKeys.CH]: 'assets/sonidos/china.mp3', //no tocar
    [MusicKeys.AU]: 'assets/sonidos/australia.mp3', //no tocar
    
    [MusicKeys.PRE]: 'assets/sonidos/battle.mp3',
    [MusicKeys.MAPA]:'assets/sonidos/auroraLaMinera_gameVersion.mp3', //no tocar
    [MusicKeys.BATALLA]:'assets/sonidos/batalla.mp3', //no tocar
    [MusicKeys.TIENDA]:'assets/sonidos/shop.mp3', //no tocar
    [MusicKeys.PAUSA]: 'assets/sonidos/battle.mp3',
    [MusicKeys.VICTORY]: 'assets/sonidos/battle.mp3',
    [MusicKeys.GAME_OVER]: 'assets/sonidos/gameover.mp3', //no tocar
    
    //Música diálogos
    [MusicKeys.INTRO]: 'assets/sonidos/creep.mp3', //no tocar
    [MusicKeys.AUSTRALIA_VICTORY]: 'assets/sonidos/battle.mp3',
    [MusicKeys.SPAIN_VICTORY]: 'assets/sonidos/gerudoValley.mp3', //no tocar
    [MusicKeys.CHINA_VICTORY]: 'assets/sonidos/yiJianMei.mp3', //no tocar
    [MusicKeys.USA_VICTORY]: 'assets/sonidos/cottonEyeJoe.mp3', //no tocar
    [MusicKeys.ENDING]: 'assets/sonidos/lostInThoughtsAllAlone.mp3', //no tocar

    //Efectos de sonido
    [MusicKeys.ALLY_DAMAGE]: 'assets/sonidos/aaayMamaaa.mp3' //no tocar
};