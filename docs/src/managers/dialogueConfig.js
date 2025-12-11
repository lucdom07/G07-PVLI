// definir diálogos
export const DialogueKeys = {
    INTRO: 'introduction_dialogue',

    ES: 'españa_dialogue',
    CH: 'china_dialogue',
    AU: 'australia_dialogue',

    TIENDA: 'market_dialogue',
    GAME_OVER: 'gameover_dialogue',

    ENDING: 'ending_dialogue',
};

// sitios de los archivos de diálogo
export const DialogueFiles = {
    [DialogueKeys.INTRO]: 'jsons/dialogues/intro.json',

    [DialogueKeys.ES]: 'jsons/dialogues/spainVictory.json',
    [DialogueKeys.CH]: 'jsons/dialogues/chinaVictory.json',
    [DialogueKeys.AU]: 'jsons/dialogues/australiaVictory.json', 

    [DialogueKeys.TIENDA]:'jsons/dialogues/market.json',
    [DialogueKeys.GAME_OVER]: 'jsons/dialogues/gameover.json',

    [DialogueKeys.ENDING]: 'jsons/dialogues/ending.json', 
};