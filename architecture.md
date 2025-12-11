# SISTEMA DE JUEGO PRINCIPAL

```mermaid
classDiagram
    class Game {
        -config: Object
        -DOManager: DOMmanager
        +new Phaser.Game(config)
        +scenes: Array
        +physics: Object
        +backgroundColor: String
    }
    
    Game --> BootScene
    Game --> MainMenu
    Game --> DialogueScene
    Game --> DebugMap
    Game --> DebugCombat
    Game --> DebugMarket
    Game --> CombatSetup
```

# JERARQUÍA DE ESCENAS

```mermaid
classDiagram
    class PhaserScene {
        <<abstract>>
        +preload()
        +create()
        +update()
    }
    
    PhaserScene <|-- BootScene
    PhaserScene <|-- MainMenu
    PhaserScene <|-- DialogueScene
    PhaserScene <|-- DebugMap
    PhaserScene <|-- DebugCombat
    PhaserScene <|-- DebugMarket
    PhaserScene <|-- CombatSetup
    
    class BootScene {
        -progressBar: Rectangle
        -progressText: Text
        +preload()
        +create()
        +createLoadingScreen()
        +loadResources()
        +loadAllyTexture()
        +loadEnemyTexture()
        +loadObjectTexture()
        +showPlayButton()
    }
    
    BootScene --> cargaGameObject : usa para precargar
    
    class MainMenu {
        -DOMmanager: DOMmanager
        -playerData: Object
        -audioManager: AudioManager
        -fromReset: Boolean
        +preload()
        +create()
        +loadMichi()
        -getAllyGroup(num)
    }
    
    MainMenu --> DOMmanager : "1..1"
    MainMenu --> AudioManager : "1..1"
    MainMenu ..> DialogueKeys : usa
    MainMenu --> MusicKeys : usa
    
    class DialogueScene {
        -dialogueKey: String
        -returnScene: String
        -nextScene: String
        -playerData: Object
        -manager: DialogueManager
        +init(data)
        +preload()
        +create()
    }
    
    DialogueScene --> DialogueManager : "1..1"
    DialogueScene --> DialogueFiles : usa
    DialogueScene --> DialogText : "0..1"
    
    class DebugMap {
        -playerData: Object
        -audioManager: AudioManager
        -graph: HierarchyGraph
        -world: Number (0-3)
        -bossFlag: Boolean
        +init(data)
        +preload()
        +create()
        +createButtons()
        -buttonsRec(level)
        -enableButtons(node)
    }
    
    DebugMap --> HierarchyGraph : "1..1"
    DebugMap --> AudioManager : "1..1"
    DebugMap --> CombatSetup : lanza
    DebugMap --> DebugMarket : lanza
```

# SISTEMA DE GESTIÓN

```mermaid
classDiagram
    class DOMmanager {
        -DOMallies: HTMLElement
        -ownedAllies: Ally[]
        +addDomAlly(ally)
        +removeDomAlly(ally)
        +inicializa(allies)
        +updateAllies()
        +destroyDomAllies()
    }
    
    DOMmanager --> Ally : "0..*"
    
    class AudioManager {
        <<Singleton>>
        -instance: AudioManager
        -scene: Scene
        -currentMusic: Sound
        +getInstance(scene)
        +playMusic(key)
        +stopMusic()
        +pauseMusic()
        +resumeMusic()
        +playSound(key)
    }
    
    AudioManager --> MusicKeys : referencia
    AudioManager --> AudioFiles : referencia
    
    class DialogueManager {
        -scene: Scene
        -dialogues: Array
        -index: Number
        -active: Boolean
        -nameText: Text
        -dialogBox: DialogText
        -sprite: Sprite
        -background: Image
        +start()
        +showDialogue()
        +next()
        +skip()
        +end()
        -updateSprite(d)
    }
    
    DialogueManager ..> DialogText : usa
    
    class CombatManager {
        -scene: Scene
        -canCallNext: Boolean
        -eventsQueue: Function[]
        -allyTeam: Ally[]
        -enemyTeam: Enemy[]
        -victory: Boolean
        +initCombat(allyTeam, enemyTeam)
        +update(time, dt)
        -callNextEvent()
        -warriorAttack(attacker, targetTeam)
        -addNewEvent(event)
        -checkCombatState()
        -initTeamPositions()
        -removeDeadUnit(team, deadUnitIndex)
        -moveTeam(team, deadUnitIndex, deadUnitX)
        -endCombat()
        -victoria()
        -derrota()
    }
    
    CombatManager --> Ally : "0..3"
    CombatManager --> Enemy : "0..4"
    
    class MarketManager {
        -scene: Scene
        -textureButton: String
        -DomManager: DOMmanager
        -bag: Ally[]
        -maxCapacity: Number (6)
        -marketAllies: Object[]
        -marketObjects: Object[]
        -money: Number
        -objectBag: GlobalObject[]
        +market(bag, allyList, objList, money, ownedObjectsBag)
        -makeStruct(item)
        -generateAlly(allyList, slots)
        -showMarket(money)
        -displayMarketItem(marketItem, index)
        -showMoney()
        -selectForSale(ally, index)
        -cancelSale()
        -buyMarketItem(marketItem)
        -sellAlly(index, sellPrice)
        -showMessage(msg)
        -clearMarket()
        -generateObject(objectList, slots)
    }
    
    MarketManager --> Ally : "0..*"
    MarketManager --> GlobalObject : "0..*"
    MarketManager --> DOMmanager : "1..1"
```

# SISTEMA DE CONFIGURACIÓN DE DATOS

```mermaid
classDiagram
    class DialogueConfig {
        <<Module>>
        +DialogueKeys: Object
        +DialogueFiles: Object
    }
    
    class DialogueKeys {
        <<Constant>>
        INTRO: 'introduction_dialogue'
        ES: 'españa_dialogue'
        USA: 'estados_unidos_dialogue'
        CH: 'china_dialogue'
        AU: 'australia_dialogue'
        TIENDA: 'market_dialogue'
        GAME_OVER: 'gameover_dialogue'
        ENDING: 'gameover_dialogue'
    }
    
    class DialogueFiles {
        <<Constant>>
        [DialogueKeys.INTRO]: 'jsons/dialogues/intro.json'
        [DialogueKeys.ES]: 'jsons/dialogues/spainVictory.json'
        [DialogueKeys.USA]: 'jsons/dialogues/usaVictory.json'
        [DialogueKeys.CH]: 'jsons/dialogues/chinaVictory.json'
        [DialogueKeys.AU]: 'jsons/dialogues/australiaVictory.json'
        [DialogueKeys.TIENDA]: 'jsons/dialogues/market.json'
        [DialogueKeys.GAME_OVER]: 'jsons/dialogues/gameover.json'
        [DialogueKeys.ENDING]: 'jsons/dialogues/ending.json'
    }
    
    DialogueConfig --> DialogueKeys
    DialogueConfig --> DialogueFiles
    
    class AudioConfig {
        <<Module>>
        +MusicKeys: Object
        +AudioFiles: Object
    }
    
    class MusicKeys {
        <<Constant>>
        MENU: 'bad_apple'
        ES: 'españa'
        USA: 'estados_unidos'
        CH: 'china'
        AU: 'australia'
        PRE: 'prebatalla'
        MAPA: 'mapa'
        BATALLA: 'combat'
        TIENDA: 'market'
        PAUSA: 'boss_music'
        VICTORY: 'victory_music'
        GAME_OVER: 'gameover_music'
        INTRO: 'introduction'
        AUSTRALIA_VICTORY: 'australiaVictory'
        SPAIN_VICTORY: 'spainVictory'
        CHINA_VICTORY: 'chinaVictory'
        USA_VICTORY: 'usaVictory'
        ENDING: 'ending'
        ALLY_DAMAGE: 'ay_mama'
    }
    
    class AudioFiles {
        <<Constant>>
        [MusicKeys.MENU]: 'assets/sonidos/sevenNationMeowrmy.mp3'
        [MusicKeys.ES]: 'assets/sonidos/auroraLaMinera_gameVersion.mp3'
        [MusicKeys.USA]: 'assets/sonidos/americanMeowdiot.mp3'
        [MusicKeys.CH]: 'assets/sonidos/battle.mp3'
        [MusicKeys.AU]: 'assets/sonidos/australia.mp3'
        [MusicKeys.PRE]: 'assets/sonidos/battle.mp3'
        [MusicKeys.MAPA]: 'assets/sonidos/auroraLaMinera_gameVersion.mp3'
        [MusicKeys.BATALLA]: 'assets/sonidos/batalla.mp3'
        [MusicKeys.TIENDA]: 'assets/sonidos/shop.mp3'
        [MusicKeys.PAUSA]: 'assets/sonidos/battle.mp3'
        [MusicKeys.VICTORY]: 'assets/sonidos/battle.mp3'
        [MusicKeys.GAME_OVER]: 'assets/sonidos/gameover.mp3'
        [MusicKeys.INTRO]: 'assets/sonidos/creep.mp3'
        [MusicKeys.AUSTRALIA_VICTORY]: 'assets/sonidos/battle.mp3'
        [MusicKeys.SPAIN_VICTORY]: 'assets/sonidos/gerudoValley.mp3'
        [MusicKeys.CHINA_VICTORY]: 'assets/sonidos/yiJianMei.mp3'
        [MusicKeys.USA_VICTORY]: 'assets/sonidos/cottonEyeJoe.mp3'
        [MusicKeys.ENDING]: 'assets/sonidos/lostInThoughtsAllAlone.mp3'
        [MusicKeys.ALLY_DAMAGE]: 'assets/sonidos/aaayMamaaa.mp3'
    }
    
    AudioConfig --> MusicKeys
    AudioConfig --> AudioFiles
```

# SISTEMA DE OBJETOS DEL JUEGO

```mermaid
classDiagram
    class PhaserGameObject {
        <<abstract>>
    }
    
    PhaserGameObject <|-- Character
    PhaserGameObject <|-- GlobalObject
    
    class Character {
        <<abstract>>
        #name: String
        #life: Number
        #attack: Number
        #range: Number
        #texture: String
        #frame: Number
        +getName()
        +getLife()
        +getAttack()
        +getRange()
        +setLife(value)
        +setAttack(value)
        +attackWarrior(target)
        +dieAnimation()
        +setWarriorPosition(x, y)
    }
    
    Character <|-- Ally
    Character <|-- Enemy
    
    class Ally {
        -cost: Number
        -available: Boolean
        -level: Number
        -warriorUI: WarriorUI
        +clone()
        +setWarriorPosition(x, y)
        +isOnTeam(): Boolean
    }
    
    Ally --> WarriorUI : "1..1"
    
    class Enemy {
        -textureURL: String
        +clone()
        +setWarriorPosition(x, y)
    }
    
    class GlobalObject {
        -name: String
        -textureURL: String
        -life: Number
        -attack: Number
        -cost: Number
        -DISPLAY_SIZE: Number (20)
        +getName()
        +getTextureURL()
        +getLife()
        +getAttack()
        +getCost()
        +clone()
    }
    
    class WarriorUI {
        -scene: Scene
        -warrior: Character
        -lifeText: Text
        -attackText: Text
        +setStatsPosition(x, y)
        +updateStats()
        +moveStatsAnimation(x)
        +setNewStats(life, attack)
        +destroy()
    }
    
    WarriorUI --> Character : "1..1"
    
    class cargaGameObject {
        -level: Number
        -scene: Scene
        +getAllyGroup(): Object[]
        +getEnemyGroup(): Object[]
        +getObjectGroup(): Object[]
        +loadAllyGroups(): Ally[]
        +loadEnemyGroups(): Enemy[]
        +loadObjectGroups(): GlobalObject[]
    }
    
    cargaGameObject --> Ally : crea
    cargaGameObject --> Enemy : crea
    cargaGameObject --> GlobalObject : crea
```

# SISTEMA DE GRÁFICOS DE JERARQUÍA

```mermaid
classDiagram
    class Node {
        -value: Number (0:combat, 1:market, 2:boss)
        -active: Boolean
        -children: Node[]
        -parents: Node[]
        +Node(value, parent, active)
    }
    
    class HierarchyGraph {
        -levels: Number (5)
        -root: Node
        -levelMatrix: Node[][]
        -numNodes: Number
        -redundantNodes: Set
        -convergence: Number (Math.floor(levels/2))
        -childrenPerNode: Number (2)
        +HierarchyGraph(numLevels, childrenPerNode)
        -buildGraph(level, parentPairs)
        -getParentPairs(level): Array
    }
    
    HierarchyGraph --> Node : "1..*"
    Node --> Node : "0..*" children
    Node --> Node : "0..2" parents
```

# ESTRUCTURAS DE DATOS

## Objeto playerData
```
playerData: {
    ownedAllies: Ally[],          // Aliados comprados/obtenidos
    money: Number,                // Dinero actual (ej: 20)
    level: Number,                // Nivel actual (0-3)
    ownedObjects: GlobalObject[], // Objetos comprados
    reset: Boolean                // Si viene de un reset
}
```

## Estructuras de JSON

### allyGroup.json
```
{
    "ally0": [
        {
           
        }
    ],
    "ally1": [...],
    "ally2": [...],
    "ally3": [...]
}
```

### enemyGroup.json
```
playerData: {
    ownedAllies: Ally[],          // Aliados comprados/obtenidos
    money: Number,                // Dinero actual (ej: 20)
    level: Number,                // Nivel actual (0-3)
    ownedObjects: GlobalObject[], // Objetos comprados
    reset: Boolean                // Si viene de un reset
}
```

### dialogues/intro.json
```
playerData: {
    ownedAllies: Ally[],          // Aliados comprados/obtenidos
    money: Number,                // Dinero actual (ej: 20)
    level: Number,                // Nivel actual (0-3)
    ownedObjects: GlobalObject[], // Objetos comprados
    reset: Boolean                // Si viene de un reset
}
```
### objects.json
```
playerData: {
    ownedAllies: Ally[],          // Aliados comprados/obtenidos
    money: Number,                // Dinero actual (ej: 20)
    level: Number,                // Nivel actual (0-3)
    ownedObjects: GlobalObject[], // Objetos comprados
    reset: Boolean                // Si viene de un reset
}
```


# JERARQUÍA DE ESCENAS

```mermaid

```

# JERARQUÍA DE ESCENAS

```mermaid

```

# JERARQUÍA DE ESCENAS

```mermaid

```

# JERARQUÍA DE ESCENAS

```mermaid

```

# JERARQUÍA DE ESCENAS

```mermaid

```
