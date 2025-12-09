// definir diálogos
export const DialogueKeys = {
    INTRO: 'introduction_dialogue',

    ES: 'españa_dialogue',
    USA: 'estados_unidos_dialogue',
    CH: 'china_dialogue',
    AU: 'australia_dialogue',

    TIENDA: 'market_dialogue',
    VICTORY: 'victory_dialogue',
    GAME_OVER: 'gameover_dialogue',
};

// sitios de los archivos de diálogo
export const DialogueFiles = {
    [DialogueKeys.INTRO]: 'jsons/dialogues/intro.json',

    [DialogueKeys.ES]: 'jsons/dialogues/spain.json',
    [DialogueKeys.USA]: 'jsons/dialogues/usa.json', 
    [DialogueKeys.CH]: 'jsons/dialogues/china.json',
    [DialogueKeys.AU]: 'jsons/dialogues/australia.json', 

    [DialogueKeys.TIENDA]:'jsons/dialogues/market.json',
    [DialogueKeys.VICTORY]: 'jsons/dialogues/victory.json',
    [DialogueKeys.GAME_OVER]: 'jsons/dialogues/gameover.json', 
};