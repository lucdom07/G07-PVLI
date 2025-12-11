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
    direction LR
    
    class PhaserGameObject {
        <<abstract>>
    }
    
    class Character {
        <<abstract>>
        #name: String
        +Character(name)
    }
    
    class PhaserSprite {
        <<Phaser.GameObjects.Sprite>>
    }
    
    class Dialogue {
        -chara: Character
        -text: String
        -animated: Boolean
        -sprite: String
        +Dialogue(chara, text, isAnimated, sprite)
    }
    
    PhaserGameObject <|-- PhaserSprite
    PhaserSprite <|-- Warrior
    Character <|-- Dialogue
    
    class Warrior {
        <<abstract>>
        #name: String
        #life: Number
        #attack: Number
        #range: Number
        #texture: String
        #frame: Number
        #DISPLAY_SIZE: Number (190)
        #ATTACK_DELAY_TIME: Number (380ms)
        #textureURL: String
        #warriorUI: WarriorUI
        +Warrior(scene, x, y, name, life, attack, range, texture, frame, textureURL)
        +preUpdate(t, dt)
        +setWarriorPosition(newX, newY)
        +attackWarrior(target)
        +takeHit(damage)
        +calculateAttackPos(targetX)*
        +dieAnimation()
        +destroy(fromScene)
    }
    
    Warrior --> WarriorUI : "1..1"
    
    Warrior <|-- Ally
    Warrior <|-- Enemy
    
    class Ally {
        -cost: Number
        -available: Boolean
        +Ally(scene, x, y, name, life, attack, range, texture, frame, cost, available, textureURL)
        +preUpdate(t, dt)
        +takeHit(damage, callback)
        +isAvailable(): Boolean
        +calculateAttackPos(targetX): Number
        +calculateNewXInCombat(previousUnitX, index, WARRIORS_SEPARATION): Number
        +getLife(): Number
        +getAttack(): Number
        +setLife(apply)
        +setAttack(apply)
        +clone(): Ally
        +static clone(ally, scene): Ally
    }
    
    class Enemy {
        +Enemy(scene, x, y, name, life, attack, range, texture, frame, textureURL)
        +preUpdate(t, dt)
        +takeHit(damage, callback)
        +calculateAttackPos(targetX): Number
        +calculateNewXInCombat(previousUnitX, index, WARRIORS_SEPARATION): Number
    }
    
    class WarriorUI {
        -DISTANCE_BELOW_WARRIOR: Number
        -STATS_DISTANCE: Number (50)
        -FEEDBACK_TEXT_DISTANCE: Number
        -stats: Text[]
        +WarriorUI(scene, x, y, life, attack, range, warriorSize)
        +setStatsPosition(newX, newY)
        +moveStatsAnimation(targetX)
        +showDamageFeedback(x, y, damage, lives)
        +updateLivesNumber(lives)
        +destroy(fromScene)
        +createDamageText(x, y, damage, color)
        +setNewStats(life, attack)
    }
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
# SISTEMA DE DIÁLOGOS

```mermaid
classDiagram
    class Character {
        -name: String
        +Character(name)
        +getName(): String
    }
    
    class Dialogue {
        -chara: Character
        -text: String
        -animated: Boolean
        -sprite: String
        +Dialogue(chara, text, isAnimated, sprite)
        +getChara(): Character
        +getText(): String
        +isAnimated(): Boolean
        +getSprite(): String
    }
    
    class DialogText {
        -borderThickness: Number (2)
        -borderColor: Number (0xFFFFFF)
        -borderAlpha: Number (1)
        -windowAlpha: Number (0.8)
        -windowColor: Number (0x000000)
        -windowHeight: Number (150)
        -padding: Number (32)
        -dialogSpeed: Number (3)
        -fontSize: Number (24)
        -eventCounter: Number
        -visible: Boolean
        -text: Text
        -dialog: Array
        -graphics: Graphics
        -timedEvent: TimerEvent
        +setText(text, animate)
        +toggleWindow()
        +_animateText()
    }
    
    class DialogueManager {
        -dialogues: Dialogue[]
        -index: Number
        -active: Boolean
        +start()
        +next()
        +skip()
        +end()
    }
    
    Character --> Dialogue : "1..*"
    DialogueManager --> Dialogue : "0..*"
    DialogueManager ..> DialogText : usa
```

# SISTEMA DE AUDIO

```mermaid
classDiagram
    class AudioConfig {
        <<Module>>
        +MusicKeys: Object
        +AudioFiles: Object
    }
    
    class MusicKeys {
        <<Enum>>
        MENU: 'bad_apple'
        ES: 'españa'
        USA: 'estados_unidos'
        CH: 'china'
        AU: 'australia'
        PRE: 'prebatalla'
        MAPA: 'mapa'
        BATALLA: 'combat'
        TIENDA: 'market'
        ALLY_DAMAGE: 'ay_mama'
        // ... 12 más
    }
    
    class AudioFiles {
        <<Map>>
        [MusicKeys.MENU]: 'assets/sonidos/sevenNationMeowrmy.mp3'
        [MusicKeys.ES]: 'assets/sonidos/auroraLaMinera_gameVersion.mp3'
        [MusicKeys.ALLY_DAMAGE]: 'assets/sonidos/aaayMamaaa.mp3'
        // ... 17 más
    }
    
    class AudioManager {
        <<Singleton>>
        -currentMusic: Sound
        +playMusic(key)
        +playSound(key)
        +stopMusic()
    }
    
    class Ally {
        +takeHit(damage, callback)
    }
    
    AudioConfig --> MusicKeys
    AudioConfig --> AudioFiles
    AudioManager --> MusicKeys : referencia
    AudioManager --> AudioFiles : referencia
    Ally --> AudioManager : "emite evento allyDamageSound"
    
    note for Ally "Cuando recibe daño:\n1. reduce vida\n2. this.scene.events.emit('allyDamageSound')\n3. AudioManager.playSound(MusicKeys.ALLY_DAMAGE)"
```

# FLUJO DE DAÑO Y ANIMACIONES

```mermaid
sequenceDiagram
    participant CM as CombatManager
    participant A as Ally
    participant E as Enemy
    participant WUI as WarriorUI
    participant AM as AudioManager
    
    CM->>A: attackWarrior(E)
    A->>E: takeHit(attackDamage)
    E->>WUI: showDamageFeedback()
    WUI->>WUI: updateLivesNumber()
    WUI->>WUI: createDamageText()
    A->>AM: scene.events.emit('allyDamageSound')
    AM->>AM: playSound(MusicKeys.ALLY_DAMAGE)
    E->>E: setTint(0xffff0000)
    E->>CM: scene.events.emit('canCallNext')
```

# RELACIONES

```mermaid
graph TB
    subgraph "Core Combat System"
        Warrior["Warrior<br/>Base class"]
        Ally["Ally<br/>Player units"]
        Enemy["Enemy<br/>AI units"]
        WarriorUI["WarriorUI<br/>Stats display"]
    end
    
    subgraph "Audio System"
        AudioManager["AudioManager<br/>Singleton"]
        AudioConfig["AudioConfig<br/>MusicKeys + AudioFiles"]
    end
    
    subgraph "Dialogue System"
        Dialogue["Dialogue<br/>Single line"]
        Character["Character<br/>Speaker"]
        DialogText["DialogText<br/>UI Plugin"]
    end
    
    subgraph "Game Scenes"
        CombatSetup["CombatSetup"]
        DebugCombat["DebugCombat"]
        MainMenu["MainMenu"]
    end
    
    subgraph "Managers"
        CombatManager["CombatManager"]
        MarketManager["MarketManager"]
        DOMmanager["DOMmanager"]
    end
    
    %% Warrior System Connections
    Warrior --> Ally
    Warrior --> Enemy
    Warrior --> WarriorUI
    
    %% Audio Connections
    Ally --> AudioManager
    AudioManager --> AudioConfig
    
    %% Dialogue Connections
    Dialogue --> Character
    Dialogue --> DialogText
    
    %% Scene Dependencies
    CombatSetup --> Ally
    DebugCombat --> Enemy
    MainMenu --> Ally
    
    %% Manager Dependencies
    CombatManager --> Ally
    CombatManager --> Enemy
    MarketManager --> Ally
    
    %% Special Relationships
    Ally -- "emits 'allyDamageSound'" --> AudioManager
    CombatManager -- "controls turn order" --> Ally
    CombatManager -- "controls turn order" --> Enemy
    Warrior -- "has-a" --> WarriorUI
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
```mermaid
classDiagram
    class AllyGroup {
        <<JSON Object>>
        +ally0: AllyData[]
        +ally1: AllyData[]
        +ally2: AllyData[]
        +ally3: AllyData[]
    }
    
    class AllyData {
        +name: String
        +textureid: String
        +life: Number (6-14)
        +attack: Number (3-11)
        +range: Number (0-4)
        +cost: Number (7,12,17,22)
        +texture: String (path)
        +available: Boolean
    }
    
    AllyGroup --> AllyData : "4 arrays de aliados"
    
    note for AllyData "Progresión por nivel:\nNivel 0: vida 6-9, ataque 3-5, costo 7\nNivel 1: vida 9-11, ataque 5-7, costo 12\nNivel 2: vida 10-13, ataque 7-9, costo 17\nNivel 3: vida 12-14, ataque 9-11, costo 22"
```

### enemyGroup.json
```mermaid
classDiagram
    class EnemyGroup {
        <<JSON Object>>
        +enemy0: EnemyData[]  // Australia
        +enemy1: EnemyData[]  // China
        +enemy2: EnemyData[]  // España
        +enemy3: EnemyData[]  // USA
    }
    
    class EnemyData {
        +name: String
        +textureid: String
        +life: Number (5-16)
        +attack: Number (4-15)
        +range: Number (0-5)
        +texture: String (path)
    }
    
    EnemyGroup --> EnemyData : "4 arrays de enemigos"
    
    note for EnemyData "El último enemigo de cada array es el BOSS\nÍndice 0-3: enemigos normales\nÍndice 4: BOSS del nivel"
```

### objects.json
```mermaid
classDiagram
    class ObjectGroup {
        <<JSON Object>>
        +objects0: ObjectData[]
        +objects1: ObjectData[]
        +objects2: ObjectData[]
        +objects3: ObjectData[]
    }
    
    class ObjectData {
        +name: String
        +textureid: String
        +life: Number (-7 a 8)
        +attack: Number (0 a 10)
        +cost: Number (5,8,11,14)
        +texture: String (path)
    }
    
    ObjectGroup --> ObjectData : "4 arrays de objetos"
    
    note for ObjectData "Valores de vida pueden ser negativos\n(efectos especiales/detrimento)\nCostos: 5, 8, 11, 14 por nivel"
```

### Relación de diálogos
```mermaid
graph TD
    subgraph "Diálogos de Victoria"
        AU[australiaVictory.json<br/>9 líneas]
        CH[chinaVictory.json<br/>9 líneas]
        ES[spainVictory.json<br/>8 líneas]
        USA[usaVictory.json<br/>9 líneas]
    end
    
    subgraph "Otros Diálogos"
        Market[market.json<br/>3 líneas]
        Ending[ending.json<br/>39 líneas]
        Intro[intro.json<br/>51 líneas]
    end
    
    AU --> L0[Nivel 0 - Australia]
    CH --> L1[Nivel 1 - China]
    ES --> L2[Nivel 2 - España]
    USA --> L3[Nivel 3 - USA]
    
    Ending --> Final[Juego completado]
    Market --> Tienda[Escena de tienda]
```

# PROGRESIÓN
```mermaid
stateDiagram-v2
    [*] --> Nivel0_Australia
    Nivel0_Australia --> Victoria0: Derrotar boss
    Victoria0 --> DiálogoAustralia: australiaVictory.json
    
    DiálogoAustralia --> Nivel1_España
    Nivel1_España --> Victoria1: Derrotar boss
    Victoria1 --> DiálogoEspaña: spainVictory.json
    
    DiálogoChina --> Nivel2_China
    Nivel2_China --> Victoria2: Derrotar boss
    Victoria2 --> DiálogoChina: chinaVictory.json
    
    DiálogoEspaña --> Nivel3_USA
    Nivel3_USA --> Victoria3: Derrotar boss
    Victoria3 --> DiálogoUSA: usaVictory.json
    
    DiálogoUSA --> Final: ending.json
    Final --> [*]
    
    note right of Nivel0_Australia
        Aliados: Michi-Michi, Astra, Cotton, Tueto, Gitab
        Enemigos: Hunter, Johnny Melavo, Astalowsco Jones, Sharon
        BOSS: Melon Moska montado en su Mierdesta
        Objetos: Viejo calcetín, Las llaves perdidas, Agua
    end note
    
    note right of Nivel1_España
        Aliados: Argos, Kurma, Gatoñete, Pablotter
        Enemigos: Manolo, Mariloli, José Luis, Maricarmen
        BOSS: Pedry el ornitorrinco
        Objetos: Bocata de calamares, Vestido flamenca, Ñ, Tortilla de patatas CON CEBOLLA
    end note

    note right of Nivel2_China
        Aliados: QiLing, Po-ka, Kairos, Moflete 
        Enemigos: Pimiento humanoide, Otaku, Profesores, CEO
        BOSS: Güini de Pu
        Objetos:Chancla, Bambu, Emotional Damage, Timo
    end note

    note right of Nivel3_USA
        Aliados: Nutricristo, Señor Anteojo, Pimiento Gatomórfico, Miku
        Enemigos: Kevin, Karen, Barry, J. Bezos
        BOSS: Mister Cheeto
        Objetos: Pistola, Partes de las torres gemelas, Cheese Burger
    end note
```




