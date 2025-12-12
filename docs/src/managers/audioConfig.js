// Define todas las músicas
export const MusicKeys = {
    MENU: 'bad_apple',
    
    ES: 'españa',
    USA: 'estados_unidos',
    CH: 'china',
    AU: 'australia_map',
    
    PRE: 'prebatalla',
    MAPA: 'mapa',
    BATALLA: 'combat',
    TIENDA: 'market',
    PAUSA: 'boss_music',
    VICTORY: 'victory_music',
    GAME_OVER: 'gameOver',
    
    //Música diálogos
    INTRO: 'introduction',
    AUSTRALIA_VICTORY: 'australiaVictory',
    SPAIN_VICTORY: 'spainVictory',
    CHINA_VICTORY: 'chinaVictory',
    ENDING: 'ending',

    //Efectos de sonido
    ALLY_DAMAGE: 'meowScream',
    ENEMY_DAMAGE: 'crying',
    ALLY_DYING: 'ay_mama',
    ENEMY_DYING: 'enemyScream',
    
    BUYING: 'buy'
};

// sitios de los archivos de sonido
export const AudioFiles = {
    //Música
    [MusicKeys.MENU]: 'assets/sonidos/sevenNationMeowrmy.mp3', //no tocar
    
    [MusicKeys.ES]: 'assets/sonidos/auroraLaMinera_gameVersion.mp3', //no tocar
    [MusicKeys.USA]: 'assets/sonidos/americanMeowdiot.mp3', //no tocar
    [MusicKeys.CH]: 'assets/sonidos/yeHuaXiang.mp3', //no tocar
    [MusicKeys.AU]: 'assets/sonidos/chandelier.mp3', //no tocar
    
    [MusicKeys.PRE]: 'assets/sonidos/prep.mp3', //no tocar
    [MusicKeys.MAPA]:'assets/sonidos/auroraLaMinera_gameVersion.mp3', //no tocar
    [MusicKeys.BATALLA]:'assets/sonidos/batalla.mp3', //no tocar
    [MusicKeys.TIENDA]:'assets/sonidos/shop.mp3', //no tocar
    [MusicKeys.PAUSA]: 'assets/sonidos/battle.mp3',
    [MusicKeys.VICTORY]: 'assets/sonidos/battle.mp3',
    [MusicKeys.GAME_OVER]: 'assets/sonidos/phantom.mp3', //no tocar
    
    //Música diálogos
    [MusicKeys.INTRO]: 'assets/sonidos/creep.mp3', //no tocar
    [MusicKeys.AUSTRALIA_VICTORY]: 'assets/sonidos/tribalWarDidgeridoo.mp3', //no tocar
    [MusicKeys.SPAIN_VICTORY]: 'assets/sonidos/gerudoValley.mp3', //no tocar
    [MusicKeys.CHINA_VICTORY]: 'assets/sonidos/yiJianMei.mp3', //no tocar
    [MusicKeys.ENDING]: 'assets/sonidos/lostInThoughtsAllAlone.mp3', //no tocar

    //Efectos de sonido
    [MusicKeys.ALLY_DAMAGE]: 'assets/sonidos/meowScream.mp3', //no tocar
    [MusicKeys.ENEMY_DAMAGE]: 'assets/sonidos/cryingCat.mp3', //no tocar
    [MusicKeys.ALLY_DYING]: 'assets/sonidos/aaayMamaaa.mp3', //no tocar
    [MusicKeys.ENEMY_DYING]: 'assets/sonidos/wilhelmScream.mp3', //no tocar

    [MusicKeys.BUYING]: 'assets/sonidos/buyingSound.mp3' //no tocar
};