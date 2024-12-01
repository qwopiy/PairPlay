import kaboom from "../../public/js/libs/kaboom.mjs";
import { load } from "./util/loader.js";
import { UIManager } from "./util/UIManager.js";
import { Level } from "./util/levelManager.js";
import { level1Layout, level1Mappings } from "./content/level1/level1Layout.js";
import { level2Layout, level2Mappings } from "./content/level2/level2Layout.js";
import { level3Layout, level3Mappings } from "./content/level3/level3Layout.js";
import { level4Layout, level4Mappings } from "./content/level4/level4Layout.js";
import { level5Layout, level5Mappings } from "./content/level5/level5Layout.js";
import { level6Layout, level6Mappings } from "./content/level6/level6Layout.js";
import { attachCamera } from "./util/camera.js";
import { Player } from "./entity/player.js";
import { Level1Config } from "./content/level1/config.js";
import { Level2Config } from "./content/level2/config.js";
import { Level3Config } from "./content/level3/config.js";
import { Level4Config } from "./content/level4/config.js";
import { Level5Config } from "./content/level5/config.js";
import { Level6Config } from "./content/level6/config.js";

kaboom({
    // height: 720,
    // width: 1280,
    // letterbox: true,
    maxFPS: 60,
    canvas: document.getElementById("game"),
});

function sendClearData(data) {
    fetch("../../Signup and Login/verify/clearFunction.php" ,{
        "method" : "POST",
        "headers" : {
            "Content-type" : "application/json; charset=utf-8"
        },
        "body" : JSON.stringify(data)
      }).then(function(response){
        return response.json();
      }).then(function(data){
        console.log(data);
      });
}

function sendDeathData(data) {
    fetch("../../Signup and Login/verify/deathFunction.php" ,{
        "method" : "POST",
        "headers" : {
            "Content-type" : "application/json; charset=utf-8"
        },
        "body" : JSON.stringify(data)
      }).then(function(response){
        return response.json();
      }).then(function(data){
        console.log(data);
      });
}

function buttonPressed(object, config, Button, Scale) {
    object.onCollide("button_off", (button) => {
        play("button")
        add([
            sprite("items", { anim: "button_on"}), 
            pos(button.pos.x, button.pos.y), 
            scale(Scale),
            area({ shape: new Rect(vec2(4, 8), 8, 8)}),
            offscreen(),
            "button_on"
        ])
        destroy(button)
        eval(config + "." + Button +" = true")
    }) 
}

function buttonUnpressed(object, config, Button, Scale) {
    object.onCollideEnd("button_on", (button) => {
        add([
            sprite("items", { anim: "button_off"}), 
            pos(button.pos.x, button.pos.y), 
            scale(Scale),
            area({ shape: new Rect(vec2(4, 8), 8, 8)}),
            offscreen(),
            "button_off"
        ])
        destroy(button)
        console.log(button.pos.x, button.pos.y)
        eval(config + "." + Button +" = false")
    }) 
}

function teleport(object, portalIn, portalOut) {
    object.onCollide( `${portalIn}` , () => {
        play("portal")
        object.pos = portalOut.pos
    })
}

let timeSinceDead = time()
let activeLevel = 0;
let death = 0;

const scenes = {
    levelSelect: () => {
        if (progress == 6) 
            UIManager.win()
        death = 0
        activeLevel = 0
        const music = play("music", {
            volume: 0.2,
            loop: true,
        })
        onSceneLeave(() => {
            music.stop()
        })
        const exitGame = add([
            sprite("pauseButtons", { anim: "exit" }),
            area(),
            scale(2),
            pos(32, 32),
            fixed(),
            z(102),
            "exit",
        ])
        onClick("exit", () => {
            window.location.href = "../../index.php"
        })
        UIManager.displayLevel(progress)
            if (progress >= 0)
            onClick("1", () => {
                go(1)
            })
            if (progress >= 1)
            onClick("2", () => {
                go(2)
            })
            if (progress >= 2)
            onClick("3", () => {
                go(3)
            })
            if (progress >= 3)
            onClick("4", () => {
                go(4)
            })
            if (progress >= 4)
            onClick("5", () => {
                go(5)
            })
            if (progress >= 5)
            onClick("6", () => {
                go(6)
            })

    },

    1: () => {
        activeLevel = 1
        timeSinceDead = time()
        Level1Config.hasKey = false
        Level1Config.win1 = false
        Level1Config.win2 = false
        setGravity(Level1Config.gravity)
        
        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level1Layout, level1Mappings, Level1Config.Scale)
        
        const music = play("music", {
            volume: 0.2,
            loop: true,
        })
        onSceneLeave(() => {
            player1.walk.stop()
            player2.walk.stop()
            music.stop()
        })
        
        // pause menu
        let paused = false
        UIManager.UIButton()
        const pauseMenu = UIManager.pauseMenu()
        pauseMenu.text.text = "Level 1"
        onClick("pause", (pause) => {
            if (pause.hidden) return
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
                player2.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })
        onClick("resume", (resume) => {
            if (resume.hidden) return
            if (paused) {
                paused = false
                player1.gameObj.paused = false
                player2.gameObj.paused = false
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = true;
            }
        })
        onClick("exit", (exit) => {
            if (exit.hidden) return
            go("levelSelect")
        })
        onClick("restart", (restart) => {
            if (restart.hidden) return
            timeSinceDead = time()
            player1.respawnPlayers()
            player2.respawnPlayers()

            go(1)
        })
        onClick("SFX", (target) => {
            if (target.hidden) return
            if (target.curAnim() !== "muteSFX") {
                target.play("muteSFX") 
                volume(0)
            } else {
                target.play("SFX")
                volume(1)
            }
        })
        onClick("music", (target) => {
            if (target.hidden) return
            music.paused = !music.paused
            target.curAnim() !== "muteMusic" 
            ? target.play("muteMusic") 
            : target.play("music")
        })

        const player1 = new Player(
            Level1Config.playerSpeed,
            Level1Config.jumpForce,
            Level1Config.nbLives,
            "a",
            "d",
            "w",
            1,
            1,
            false
        )
        
        const player2 = new Player(
            Level1Config.playerSpeed,
            Level1Config.jumpForce,
            Level1Config.nbLives,
            "left",
            "right",
            "up",
            2,
            1,
            false
        )

        const ghost1 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level1Config.Scale),
            "ghost1"
        ])
        const ghost2 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level1Config.Scale),
            "ghost2"
        ])

        player1.makePlayer(Level1Config.playerStartPosX + 16, Level1Config.playerStartPosY, "player1", Level1Config.Scale)
        player2.makePlayer(Level1Config.playerStartPosX, Level1Config.playerStartPosY, "player2", Level1Config.Scale)

        player1.update()
        player2.update()

        onCollide("player1", "ice", () => {!player1.isTouchingIce ? (player1.isTouchingIce = true, player1.speed = 0) : null})
        onCollide("player1", "ground", () => {player1.isTouchingIce ? (player1.isTouchingIce = false, player1.speed = 0) : null})
        onCollide("player2", "ice", () => {!player2.isTouchingIce ? (player2.isTouchingIce = true, player2.speed = 0) : null})
        onCollide("player2", "ground", () => {player2.isTouchingIce ? (player2.isTouchingIce = false, player2.speed = 0) : null})

        buttonPressed(player1.gameObj, "Level1Config","button1", Level1Config.Scale)
        buttonUnpressed(player1.gameObj, "Level1Config", "button1", Level1Config.Scale)

        buttonPressed(player2.gameObj, "Level1Config", "button2", Level1Config.Scale)
        buttonUnpressed(player2.gameObj, "Level1Config", "button2", Level1Config.Scale)

        player1.gameObj.onCollide("key", (key) => {     //player1 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level1Config.hasKey = true
        })

        player2.gameObj.onCollide("key", (key) => {     //player2 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level1Config.hasKey = true
        })

        player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
            if (Level1Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level1Config.hasKey = false
            }
        })

        player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
            if (Level1Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level1Config.hasKey = false
            }
        })

        player1.gameObj.onCollide("finish", (finish) => {   //player1 collision with finish
            Level1Config.win1 = true
            player1.win = true
            player1.gameObj.move(0, -16000)
            player1.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })

        player2.gameObj.onCollide("finish", (finish) => {   //player2 collision with finish
            Level1Config.win2 = true
            player2.win = true
            player2.gameObj.move(0, -16000)
            player2.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })
        
        player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
            play("dead")
            player1.gameObj.angle = -90
            player1.isRespawning = true
            ghost1.pos = player1.gameObj.pos
            if (!player2.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 1) return
                    player1.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level1Config.win1 = false
                    Level1Config.win2 = false
                    timeSinceDead = time()
                    go(1)
                }, 3000)
            }
        })
        
        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost2.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 1) return
                    player1.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level1Config.win1 = false
                    Level1Config.win2 = false
                    timeSinceDead = time()
                    go(1)
                }, 3000)
            }
        })

        onCollide("player1", "player2", () => {
            player1.isPushing = true
            player2.isPushing = true
        })
        
        onCollideEnd("player1", "player2", () => {
            player1.isPushing = false
            player2.isPushing = false
        })
        
        onKeyPress("escape", () => {
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
                player2.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })

        onKeyPress("r", () => {
            timeSinceDead = time()
            player1.respawnPlayers()
            player2.respawnPlayers()

            go(1)
        })


        // easter egg
        const easterEgg = {
            wall1: add([
                sprite("ground-tileset", { anim: "ml" }),
                area(),
                body({ isStatic: true}),
                pos(16 * 26, 16 * 7),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),

            wall2: add([
                sprite("ground-tileset", { anim: "ml" }),
                area(),
                body({ isStatic: true}),
                pos(16 * 26, 16 * 8),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),

            wall3: add([
                sprite("ground-tileset", { anim: "mm" }),
                pos(16 * 27, 16 * 7),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),

            wall4: add([
                sprite("ground-tileset", { anim: "mm" }),
                pos(16 * 27, 16 * 8),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),

            wall5: add([
                sprite("ground-tileset", { anim: "ml" }),
                area(),
                pos(16 * 28, 16 * 7),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),

            wall6: add([
                sprite("ground-tileset", { anim: "ml" }),
                area(),
                pos(16 * 28, 16 * 8),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),

            wall7: add([
                sprite("ground-tileset", { anim: "mm" }),
                pos(16 * 28, 16 * 7),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),

            wall8: add([
                sprite("ground-tileset", { anim: "mm" }),
                pos(16 * 28, 16 * 8),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),

            wall9: add([
                sprite("ground-tileset", { anim: "mm" }),
                pos(16 * 29, 16 * 7),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),

            wall10: add([
                sprite("ground-tileset", { anim: "mm" }),
                pos(16 * 29, 16 * 8),
                offscreen({ hide: true }),
                z(50),
                "easterEgg"
            ]),
        }

        player1.gameObj.onCollide("easterEgg", () => {
            for (const obj in easterEgg) {
                destroy(easterEgg[obj])
            }
            UIManager.easteregg()
            let data = {
                "level": 1,
                "death": 0,
                "easter_egg": 1
            }
            sendDeathData(data)
        })

        player2.gameObj.onCollide("easterEgg", () => {
            for (const obj in easterEgg) {
                destroy(easterEgg[obj])
            }
            UIManager.easteregg()
            let data = {
                "level": 1,
                "death": 0,
                "easter_egg": 1
            }
            sendDeathData(data)
        })

        let key = true
        const timer = add([
            text(""),
            color("e0f0ea"),
            anchor("center"),
            pos(width()/2, 16 * 2),
            scale(1),
            fixed(),
            z(2),
            "timer"
        ])
        const timerbg = add([
            rect(120, 48),
            anchor("center"),
            pos(width()/2, 16 * 2),
            color("3c2a4d"),
            fixed(),
            z(1),
            "timerbg"
        ])

        onUpdate(() => {
            if (!paused)
                timer.text = (time() - timeSinceDead).toFixed(2)
            console.log(player1.isPushing, player2.isPushing)
            if (player1.isRespawning) {
                ghost1.move(0, -80)
            }
            if (player2.isRespawning) {
                ghost2.move(0, -80)
            }

            if (Level1Config.button1 && Level1Config.button2 & key) {
                key = false
                add([
                    sprite("items", {anim: "key"}), 
                    pos(16 * 30, 16 * 2),
                    scale(Level1Config.Scale),
                    area(),
                    "key"
                ])
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)
            
            if (Level1Config.win1 && Level1Config.win2) {
                if (progress < 1)
                    progress++
                console.log((time() - timeSinceDead).toFixed(2))
                console.log(death)
                let data = {
                    "level": 1,
                    "death": death,
                    "time": (time() - timeSinceDead).toFixed(2),
                    "easter_egg": 0,
                    "progress": progress
                }
                sendClearData(data)
                go("levelSelect")
            }
            // console.log(player1.death, player2.death)
            // console.log(ghost.pos)
        })
        attachCamera(player1.gameObj, player2.gameObj, 0, 84, Level1Config.levelZoom)
        
        // level.drawLava()
    },
    
    2: () => {
        activeLevel = 2
        timeSinceDead = time()
        Level2Config.hasKey = false
        Level2Config.win1 = false
        Level2Config.win2 = false
        setGravity(Level2Config.gravity)

        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level2Layout, level2Mappings, Level2Config.Scale)

        const music = play("music", {
            volume: 0.2,
            loop: true,
        })
        onSceneLeave(() => {
            player1.walk.stop()
            player2.walk.stop()
            music.stop()
        })
        
        // pause menu
        let paused = false
        UIManager.UIButton()
        const pauseMenu = UIManager.pauseMenu()
        pauseMenu.text.text = "Level 2"
        onClick("pause", (pause) => {
            if (pause.hidden) return
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })
        onClick("resume", (resume) => {
            if (resume.hidden) return
            if (paused) {
                paused = false
                player1.gameObj.paused = false
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = true;
            }
        })
        onClick("exit", (exit) => {
            if (exit.hidden) return
            go("levelSelect")
        })
        onClick("restart", (restart) => {
            if (restart.hidden) return
            timeSinceDead = time()
            player1.respawnPlayers()

            go(2)
        })
        onClick("SFX", (target) => {
            if (target.hidden) return
            if (target.curAnim() !== "muteSFX") {
                target.play("muteSFX") 
                volume(0)
            } else {
                target.play("SFX")
                volume(1)
            }
        })
        onClick("music", (target) => {
            if (target.hidden) return
            music.paused = !music.paused
            target.curAnim() !== "muteMusic" 
            ? target.play("muteMusic") 
            : target.play("music")
        })

        const player1 = new Player(
            Level2Config.playerSpeed,
            Level2Config.jumpForce,
            Level2Config.nbLives,
            "a",
            "d",
            "w",
            1,
            2,
            false
        )
        
        const player2 = new Player(
            Level2Config.playerSpeed,
            Level2Config.jumpForce,
            Level2Config.nbLives,
            "left",
            "right",
            "up",
            2,
            2,
            false
        )

        const ghost1 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level2Config.Scale),
            "ghost"
        ])
        const ghost2 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level2Config.Scale),
            "ghost"
        ])

        player1.makePlayer(Level2Config.playerStartPosX + 16, Level2Config.playerStartPosY, "player1", Level2Config.Scale)
        player2.makePlayer(Level2Config.playerStartPosX, Level2Config.playerStartPosY, "player2", Level2Config.Scale)

        player1.update()
        player2.update()

        player1.gameObj.onCollide("key", (key) => {     //player1 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level2Config.hasKey = true
        })

        player2.gameObj.onCollide("key", (key) => {     //player2 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level2Config.hasKey = true
        })

        player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
            if (Level2Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level2Config.hasKey = false
            }
        })

        player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
            if (Level2Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level2Config.hasKey = false
            }
        })

        player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
            play("dead")
            player1.gameObj.angle = -90
            player1.isRespawning = true
            ghost1.pos = player1.gameObj.pos
            if (!player2.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 2) return
                    player1.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level2Config.win1 = false
                    Level2Config.win2 = false
                    timeSinceDead = time()
                    go(2)
                }, 3000)
            }
        })
        
        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost2.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 2) return
                    player2.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level2Config.win1 = false
                    Level2Config.win2 = false
                    timeSinceDead = time()
                    go(2)
                }, 3000)
            }
        })

        player1.gameObj.onCollide("finish", (finish) => {   //player1 collision with finish
            Level2Config.win1 = true
            player1.win = true
            player1.gameObj.move(0, -16000)
            player1.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })

        player2.gameObj.onCollide("finish", (finish) => {   //player2 collision with finish
            Level2Config.win2 = true
            player2.win = true
            player2.gameObj.move(0, -16000)
            player2.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })

        onCollide("player1", "bouncy", () => {player1.bounce()})
        onCollide("player2", "bouncy", () => {player2.bounce()})

        onCollide("player1", "player2", () => {
            player1.isPushing = true
            player2.isPushing = true
        })
        
        onCollideEnd("player1", "player2", () => {
            player1.isPushing = false
            player2.isPushing = false
        })

        onKeyPress("escape", () => {
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
                player2.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })

        onKeyPress("r", () => {
            timeSinceDead = time()
            player1.respawnPlayers()

            go(2)
        })

        const timer = add([
            text(""),
            color("e0f0ea"),
            anchor("center"),
            pos(width()/2, 16 * 2),
            scale(1),
            fixed(),
            z(2),
            "timer"
        ])
        const timerbg = add([
            rect(120, 48),
            anchor("center"),
            pos(width()/2, 16 * 2),
            color("3c2a4d"),
            fixed(),
            z(1),
            "timerbg"
        ])

        onUpdate(() => {
            if (!paused)
                timer.text = (time() - timeSinceDead).toFixed(2)
            if (player1.isRespawning) {
                ghost1.move(0, -80)
            }
            if (player2.isRespawning) {
                ghost2.move(0, -80)
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)

            if (Level2Config.win1 && Level2Config.win2) {
                if (progress < 2)
                    progress++
                console.log((time() - timeSinceDead).toFixed(2))
                console.log(death)
                let data = {
                    "level": 2,
                    "death": death,
                    "time": (time() - timeSinceDead).toFixed(2),
                    "easter_egg": 0,
                    "progress": progress
                }
                sendClearData(data)
                go("levelSelect")
            }
        })

        attachCamera(player1.gameObj, player2.gameObj, 0, 84, Level2Config.levelZoom)
        },

    3: () => {
        activeLevel = 3
        timeSinceDead = time()
        Level3Config.hasKey = false
        Level3Config.win1 = false
        Level3Config.win2 = false
        setGravity(Level3Config.gravity)

        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level3Layout, level3Mappings, Level3Config.Scale)

        const music = play("music", {
            volume: 0.2,
            loop: true,
        })
        onSceneLeave(() => {
            player1.walk.stop()
            player2.walk.stop()
            music.stop()
        })
        
        // pause menu
        let paused = false
        UIManager.UIButton()
        const pauseMenu = UIManager.pauseMenu()
        pauseMenu.text.text = "Level 3"
        onClick("pause", (pause) => {
            if (pause.hidden) return
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })
        onClick("resume", (resume) => {
            if (resume.hidden) return
            if (paused) {
                paused = false
                player1.gameObj.paused = false
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = true;
            }
        })
        onClick("exit", (exit) => {
            if (exit.hidden) return
            go("levelSelect")
        })
        onClick("restart", (restart) => {
            if (restart.hidden) return
            timeSinceDead = time()
            player1.respawnPlayers()

            go(3)
        })
        onClick("SFX", (target) => {
            if (target.hidden) return
            if (target.curAnim() !== "muteSFX") {
                target.play("muteSFX") 
                volume(0)
            } else {
                target.play("SFX")
                volume(1)
            }
        })
        onClick("music", (target) => {
            if (target.hidden) return
            music.paused = !music.paused
            target.curAnim() !== "muteMusic" 
            ? target.play("muteMusic") 
            : target.play("music")
        })

        const player1 = new Player(
            Level3Config.playerSpeed,
            Level3Config.jumpForce,
            Level3Config.nbLives,
            "a",
            "d",
            "w",
            1,
            3,
            false
        )
        
        const player2 = new Player(
            Level3Config.playerSpeed,
            Level3Config.jumpForce,
            Level3Config.nbLives,
            "left",
            "right",
            "up",
            2,
            3,
            false
        )

        const box1 = add([
                sprite("items", {anim: "box"}),
                pos(496, 188),
                area(),
                body(),
                anchor("center"),
                offscreen(),
                scale(Level3Config.Scale),
                "box1", 
        ])

        const box2 = add([
                sprite("items", {anim: "box"}),
                pos(580, 0),
                area(),
                body(),
                anchor("center"),
                offscreen(),
                scale(Level3Config.Scale),
                "box2", 
        ])

        const ghost1 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level3Config.Scale),
            "ghost"
        ])
        const ghost2 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level3Config.Scale),
            "ghost"
        ])

        player1.makePlayer(Level3Config.playerStartPosX + 16, Level3Config.playerStartPosY, "player1", Level3Config.Scale)
        player2.makePlayer(Level3Config.playerStartPosX, Level3Config.playerStartPosY, "player2", Level3Config.Scale)

        player1.update()
        player2.update()

        // buttonPressed(box1, "Level3Config", "button1", Level3Config.Scale)
        // buttonUnpressed(box1, "Level3Config", "button1", Level3Config.Scale)
        onCollide("box1", "button_off", (source, target) => {
            source.pos.x = target.pos.x + 8
            source.pos.y = target.pos.y + 8
            source.use(body({ isStatic: true }))
            target.play("button_on")
            Level3Config.button1 = true
        })

        // buttonPressed(box2, "Level3Config", "button2", Level3Config.Scale)
        // buttonUnpressed(box2, "Level3Config", "button2", Level3Config.Scale)

        onCollide("box2", "button_off", (source, target) => {
            source.pos.x = target.pos.x + 8
            source.pos.y = target.pos.y + 8
            source.use(body({ isStatic: true }))
            target.play("button_on")
            Level3Config.button2 = true
        })

        buttonPressed(player1.gameObj, "Level3Config", "button3", Level3Config.Scale)
        buttonUnpressed(player1.gameObj, "Level3Config", "button3", Level3Config.Scale)

        buttonPressed(player2.gameObj, "Level3Config", "button4", Level3Config.Scale)
        buttonUnpressed(player2.gameObj, "Level3Config", "button4", Level3Config.Scale)

        player1.gameObj.onCollide("key", (key) => {     //player1 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level3Config.hasKey = true
        })

        player2.gameObj.onCollide("key", (key) => {     //player2 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level3Config.hasKey = true
        })

        player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
            play("dead")
            player1.gameObj.angle = -90
            player1.isRespawning = true
            ghost1.pos = player1.gameObj.pos
            if (!player2.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 3) return
                    player1.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level3Config.win1 = false
                    Level3Config.win2 = false
                    timeSinceDead = time()
                    go(3)
                }, 3000)
            }
        })
        
        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost2.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 3) return
                    player2.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level3Config.win1 = false
                    Level3Config.win2 = false
                    timeSinceDead = time()
                    go(3)
                }, 3000)
            }
        })

        player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
            if (Level3Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level3Config.hasKey = false
            }
        })

        player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
            if (Level3Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level3Config.hasKey = false
            }
        })

        player1.gameObj.onCollide("finish", (finish) => {   //player1 collision with finish
            Level3Config.win1 = true
            player1.win = true
            player1.gameObj.move(0, -16000)
            player1.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })

        player2.gameObj.onCollide("finish", (finish) => {   //player2 collision with finish
            Level3Config.win2 = true
            player2.win = true
            player2.gameObj.move(0, -16000)
            player2.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })

        onCollide("player1", "player2", () => {
            player1.isPushing = true
            player2.isPushing = true
        })
        
        onCollideEnd("player1", "player2", () => {
            player1.isPushing = false
            player2.isPushing = false
        })

        onCollide("player1", "box1", () => { player1.isPushing = true })
        onCollideEnd("player1", "box1", () => { player1.isPushing = false })
        onCollide("player1", "box2", () => { player1.isPushing = true })
        onCollideEnd("player1", "box2", () => { player1.isPushing = false })

        onCollide("player2", "box1", () => { player2.isPushing = true })
        onCollideEnd("player2", "box1", () => { player2.isPushing = false })
        onCollide("player2", "box2", () => { player2.isPushing = true })
        onCollideEnd("player2", "box2", () => { player2.isPushing = false })

        onKeyPress("escape", () => {
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
                player2.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })

        onKeyPress("r", () => {
            timeSinceDead = time()
            player1.respawnPlayers()

            go(3)
        })

        let key = true
        const timer = add([
            text(""),
            color("e0f0ea"),
            anchor("center"),
            pos(width()/2, 16 * 2),
            scale(1),
            fixed(),
            z(2),
            "timer"
        ])
        const timerbg = add([
            rect(120, 48),
            anchor("center"),
            pos(width()/2, 16 * 2),
            color("3c2a4d"),
            fixed(),
            z(1),
            "timerbg"
        ])
        onUpdate(() => {
            if (!paused)
                timer.text = (time() - timeSinceDead).toFixed(2)
            if (player1.isRespawning) {
                ghost1.move(0, -100)
            }
            if (player2.isRespawning) {
                ghost2.move(0, -100)
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)

            if (Level3Config.button1 && Level3Config.button2 && Level3Config.button3 && Level3Config.button4 && key) {
                key = false
                add([
                    sprite("items", {anim: "key"}), 
                    pos(16 * 12, 16 * 4),
                    scale(Level3Config.Scale),
                    area(),
                    "key"
                ])
            }


            if (Level3Config.win1 && Level3Config.win2) {
                if (progress < 3)
                    progress++
                console.log((time() - timeSinceDead).toFixed(2))
                console.log(death)
                let data = {
                    "level": 3,
                    "death": death,
                    "time": (time() - timeSinceDead).toFixed(2),
                    "easter_egg": 0,
                    "progress": progress
                }
                sendClearData(data)
                go("levelSelect")
            }
            // console.log(box2.vel)
        })
        camPos((16 * 24), 100)
        camScale(2, 2)
    },

    4: () => {
        activeLevel = 4
        timeSinceDead = time()
        Level4Config.hasKey = false
        Level4Config.win1 = false
        Level4Config.win2 = false
        setGravity(Level4Config.gravity)

        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level4Layout, level4Mappings, Level4Config.Scale)

        const music = play("music", {
            volume: 0.2,
            loop: true,
        })
        onSceneLeave(() => {
            player1.walk.stop()
            player2.walk.stop()
            music.stop()
        })
        
        // pause menu
        let paused = false
        UIManager.UIButton()
        const pauseMenu = UIManager.pauseMenu()
        pauseMenu.text.text = "Level 4"
        onClick("pause", (pause) => {
            if (pause.hidden) return
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })
        onClick("resume", (resume) => {
            if (resume.hidden) return
            if (paused) {
                paused = false
                player1.gameObj.paused = false
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = true;
            }
        })
        onClick("exit", (exit) => {
            if (exit.hidden) return
            go("levelSelect")
        })
        onClick("restart", (restart) => {
            if (restart.hidden) return
            timeSinceDead = time()
            player1.respawnPlayers()

            go(4)
        })
        onClick("SFX", (target) => {
            if (target.hidden) return
            if (target.curAnim() !== "muteSFX") {
                target.play("muteSFX") 
                volume(0)
            } else {
                target.play("SFX")
                volume(1)
            }
        })
        onClick("music", (target) => {
            if (target.hidden) return
            music.paused = !music.paused
            target.curAnim() !== "muteMusic" 
            ? target.play("muteMusic") 
            : target.play("music")
        })

        const player1 = new Player(
            Level4Config.playerSpeed,
            Level4Config.jumpForce,
            Level4Config.nbLives,
            "a",
            "d",
            "w",
            1,
            4,
            false
        )
        
        const player2 = new Player(
            Level4Config.playerSpeed,
            Level4Config.jumpForce,
            Level4Config.nbLives,
            "left",
            "right",
            "up",
            2,
            4,
            false
        )

        const ghost1 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level4Config.Scale),
            "ghost"
        ])
        const ghost2 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level4Config.Scale),
            "ghost"
        ])

        const portalIn1 = add([
            sprite("items", { anim: "portal_in" }),
            pos(16 * 6, 16 * 6),
            scale(Level4Config.Scale),
            area( { shape: new Rect(vec2(0), 16, 14) }),
            offscreen(),
            "portalIn1"

        ])

        const portalOut1 = add([
            sprite("items", { anim: "portal_out" }),
            pos(16 * 11, 16 * 1),
            scale(Level4Config.Scale),
            area(),
            offscreen(),
            "portalOut1"
        ])

        const portalIn2 = add([
            sprite("items", { anim: "portal_in" }),
            pos(16 * 26, 16 * 3),
            scale(Level4Config.Scale),
            area( { shape: new Rect(vec2(0), 16, 14) }),
            offscreen(),
            "portalIn2"
        ])

        const portalOut2 = add([
            sprite("items", { anim: "portal_out" }),
            pos(16 * 31, 16 * 1),
            scale(Level4Config.Scale),
            area(),
            offscreen(),
            "portalOut2"
        ])

        const portalIn3 = add([
            sprite("items", { anim: "portal_in" }),
            pos(16 * 26, 16 * 10),
            scale(Level4Config.Scale),
            area( { shape: new Rect(vec2(0), 16, 14) }),
            offscreen(),
            "portalIn3"
        ])

        const portalOut3 = add([
            sprite("items", { anim: "portal_out" }),
            pos(16 * 35, 16 * 1),
            scale(Level4Config.Scale),
            area(),
            offscreen(),
            "portalOut3"
        ])

        const portalIn4 = add([
            sprite("items", { anim: "portal_in" }),
            pos(16 * 47, 16 * 10),
            scale(Level4Config.Scale),
            area( { shape: new Rect(vec2(0), 16, 14) }),
            offscreen(),
            "portalIn4"
        ])

        const portalOut4 = add([
            sprite("items", { anim: "portal_out" }),
            pos(16 * 43, 16 * 6),
            scale(Level4Config.Scale),
            area(),
            offscreen(),
            "portalOut4"
        ])

        const portalIn5 = add([
            sprite("items", { anim: "portal_in" }),
            pos(16 * 47, 16 * 3),
            scale(Level4Config.Scale),
            area( { shape: new Rect(vec2(0), 16, 14) }),
            offscreen(),
            "portalIn5"
        ])

        const portalOut5 = add([
            sprite("items", { anim: "portal_out" }),
            pos(16 * 41, 16 * 6),
            scale(Level4Config.Scale),
            area(),
            offscreen(),
            "portalOut5"
        ])

        player1.makePlayer(Level4Config.playerStartPosX + 32, Level4Config.playerStartPosY, "player1", Level4Config.Scale)
        player2.makePlayer(Level4Config.playerStartPosX, Level4Config.playerStartPosY, "player2", Level4Config.Scale)

        player1.update()
        player2.update()

        teleport(player1.gameObj, "portalIn1", portalOut1)
        teleport(player2.gameObj, "portalIn1", portalOut1)

        teleport(player1.gameObj, "portalIn2", portalOut2)
        teleport(player2.gameObj, "portalIn2", portalOut2)

        teleport(player1.gameObj, "portalIn3", portalOut3)
        teleport(player2.gameObj, "portalIn3", portalOut3)

        teleport(player1.gameObj, "portalIn4", portalOut4)
        teleport(player2.gameObj, "portalIn4", portalOut4)

        teleport(player1.gameObj, "portalIn5", portalOut5)
        teleport(player2.gameObj, "portalIn5", portalOut5)

        player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
            if (Level4Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level4Config.hasKey = false
            }
        })

        player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
            if (Level4Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level4Config.hasKey = false
            }
        })

        player1.gameObj.onCollide("finish", (finish) => {   //player1 collision with finish
            Level4Config.win1 = true
            player1.win = true
            player1.gameObj.move(0, -16000)
            player1.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })

        player2.gameObj.onCollide("finish", (finish) => {   //player2 collision with finish
            Level4Config.win2 = true
            player2.win = true
            player2.gameObj.move(0, -16000)
            player2.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })
        
        player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
            play("dead")
            player1.gameObj.angle = -90
            player1.isRespawning = true
            ghost.pos = player1.gameObj.pos
            if (!player2.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 4) return
                    player1.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level4Config.win1 = false
                    Level4Config.win2 = false
                    timeSinceDead = time()
                    go(4)
                }, 3000)
            }
        })
        
        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 4) return
                    player2.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level4Config.win1 = false
                    Level4Config.win2 = false
                    timeSinceDead = time()
                    go(4)   
                }, 3000)
            }
        })

        onCollide("player1", "player2", () => {
            player1.isPushing = true
            player2.isPushing = true
        })
        
        onCollideEnd("player1", "player2", () => {
            player1.isPushing = false
            player2.isPushing = false
        })

        buttonPressed(player1.gameObj, "Level4Config", "button1", Level4Config.Scale)
        buttonPressed(player2.gameObj, "Level4Config", "button2", Level4Config.Scale)

        onKeyPress("escape", () => {
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
                player2.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })

        onKeyPress("r", () => {
            timeSinceDead = time()
            player1.respawnPlayers()

            go(4)
        })

        const timer = add([
            text(""),
            color("e0f0ea"),
            anchor("center"),
            pos(width()/2, 16 * 2),
            scale(1),
            fixed(),
            z(2),
            "timer"
        ])
        const timerbg = add([
            rect(120, 48),
            anchor("center"),
            pos(width()/2, 16 * 2),
            color("3c2a4d"),
            fixed(),
            z(1),
            "timerbg"
        ])
        onUpdate(() => {
            if (!paused)
                timer.text = (time() - timeSinceDead).toFixed(2)
            if (player1.isRespawning || player2.isRespawning) {
                ghost.move(0, -80)
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)

            if (Level4Config.button1 || Level4Config.button2) {
                console.log("key Get")
                Level4Config.hasKey = true
            }

            if (Level4Config.win1 && Level4Config.win2) {
                if (progress < 4)
                    progress++
                console.log((time() - timeSinceDead).toFixed(2))
                console.log(death)
                let data = {
                    "level": 4,
                    "death": death,
                    "time": (time() - timeSinceDead).toFixed(2),
                    "easter_egg": 0,
                    "progress": progress
                }
                sendClearData(data)
                go("levelSelect")
            }
        })
        attachCamera(player1.gameObj, player2.gameObj, 0, 116, Level4Config.levelZoom)
    },

    5: () => {
        activeLevel = 5
        timeSinceDead = time()
        Level5Config.hasKey = false
        Level5Config.win1 = false
        Level5Config.win2 = false
        setGravity(Level5Config.gravity)
        
        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level5Layout, level5Mappings, Level5Config.Scale)
        
        const music = play("music", {
            volume: 0.2,
            loop: true,
        })
        onSceneLeave(() => {
            player1.walk.stop()
            player2.walk.stop()
            music.stop()
        })
        
        // pause menu
        let paused = false
        UIManager.UIButton()
        const pauseMenu = UIManager.pauseMenu()
        pauseMenu.text.text = "Level 5"
        onClick("pause", (pause) => {
            if (pause.hidden) return
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
                player2.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })
        onClick("resume", (resume) => {
            if (resume.hidden) return
            if (paused) {
                paused = false
                player1.gameObj.paused = false
                player2.gameObj.paused = false
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = true;
            }
        })
        onClick("exit", (exit) => {
            if (exit.hidden) return
            go("levelSelect")
        })
        onClick("restart", (restart) => {
            if (restart.hidden) return
            timeSinceDead = time()
            player1.respawnPlayers()
            player2.respawnPlayers()

            go(5)
        })
        onClick("SFX", (target) => {
            if (target.hidden) return
            if (target.curAnim() !== "muteSFX") {
                target.play("muteSFX") 
                volume(0)
            } else {
                target.play("SFX")
                volume(1)
            }
        })
        onClick("music", (target) => {
            if (target.hidden) return
            music.paused = !music.paused
            target.curAnim() !== "muteMusic" 
            ? target.play("muteMusic") 
            : target.play("music")
        })

        const player1 = new Player(
            Level5Config.playerSpeed,
            Level5Config.jumpForce,
            Level5Config.nbLives,
            "a",
            "d",
            "w",
            1,
            5,
            false
        )
        
        const player2 = new Player(
            Level5Config.playerSpeed,
            Level5Config.jumpForce,
            Level5Config.nbLives,
            "left",
            "right",
            "up",
            2,
            5,
            false
        )

        const ghost1 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level5Config.Scale),
            "ghost1"
        ])
        const ghost2 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level5Config.Scale),
            "ghost2"
        ])

        player1.makePlayer(Level5Config.playerStartPosX + 16, Level5Config.playerStartPosY, "player1", Level5Config.Scale)
        player2.makePlayer(Level5Config.playerStartPosX, Level5Config.playerStartPosY, "player2", Level5Config.Scale)

        player1.update()
        player2.update()

        onCollide("player1", "ice", () => {!player1.isTouchingIce ? (player1.isTouchingIce = true, player1.speed = 0) : null})
        onCollide("player1", "ground", () => {player1.isTouchingIce ? (player1.isTouchingIce = false, player1.speed = 0) : null})
        onCollide("player2", "ice", () => {!player2.isTouchingIce ? (player2.isTouchingIce = true, player2.speed = 0) : null})
        onCollide("player2", "ground", () => {player2.isTouchingIce ? (player2.isTouchingIce = false, player2.speed = 0) : null})

        onCollide("player1", "bouncy", () => {player1.bounce()})
        onCollide("player2", "bouncy", () => {player2.bounce()})

        player1.gameObj.onCollide("key", (key) => {     //player1 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level5Config.hasKey = true
        })

        player2.gameObj.onCollide("key", (key) => {     //player2 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level5Config.hasKey = true
        })

        player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
            if (Level5Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level5Config.hasKey = false
            }
            player1.speed = 0
        })

        player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
            if (Level5Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level5Config.hasKey = false
            }
            player2.speed = 0
        })

        player1.gameObj.onCollide("finish", (finish) => {   //player1 collision with finish
            Level5Config.win1 = true
            player1.win = true
            player1.gameObj.move(0, -16000)
            player1.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })

        player2.gameObj.onCollide("finish", (finish) => {   //player2 collision with finish
            Level5Config.win2 = true
            player2.win = true
            player2.gameObj.move(0, -16000)
            player2.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })
        
        player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
            play("dead")
            player1.gameObj.angle = -90
            player1.isRespawning = true
            ghost1.pos = player1.gameObj.pos
            if (!player2.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 5) return
                    player1.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level5Config.win1 = false
                    Level5Config.win2 = false
                    timeSinceDead = time()
                    go(5)
                }, 3000)
            }
        })
        
        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost2.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 5) return
                    player1.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level5Config.win1 = false
                    Level5Config.win2 = false
                    timeSinceDead = time()
                    go(5)
                }, 3000)
            }
        })

        onCollide("player1", "player2", () => {
            player1.isPushing = true
            player2.isPushing = true
        })
        
        onCollideEnd("player1", "player2", () => {
            player1.isPushing = false
            player2.isPushing = false
        })
        
        onKeyPress("escape", () => {
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
                player2.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })

        onKeyPress("r", () => {
            timeSinceDead = time()
            player1.respawnPlayers()
            player2.respawnPlayers()

            go(5)
        })

        let key = true
        const timer = add([
            text(""),
            color("e0f0ea"),
            anchor("center"),
            pos(width()/2, 16 * 2),
            scale(1),
            fixed(),
            z(2),
            "timer"
        ])
        const timerbg = add([
            rect(120, 48),
            anchor("center"),
            pos(width()/2, 16 * 2),
            color("3c2a4d"),
            fixed(),
            z(1),
            "timerbg"
        ])

        onUpdate(() => {
            if (!paused)
                timer.text = (time() - timeSinceDead).toFixed(2)
            console.log(player1.isPushing, player2.isPushing)
            if (player1.isRespawning) {
                ghost1.move(0, -80)
            }
            if (player2.isRespawning) {
                ghost2.move(0, -80)
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)
            
            if (Level5Config.win1 && Level5Config.win2) {
                if (progress < 5)
                    progress++
                console.log((time() - timeSinceDead).toFixed(2))
                console.log(death)
                let data = {
                    "level": 5,
                    "death": death,
                    "time": (time() - timeSinceDead).toFixed(2),
                    "easter_egg": 0,
                    "progress": progress
                }
                sendClearData(data)
                go("levelSelect")
            }
            // console.log(player1.death, player2.death)
            // console.log(ghost.pos)
        })
        attachCamera(player1.gameObj, player2.gameObj, 0, 84, Level5Config.levelZoom)
        
        // level.drawLava()
    },

    6: () => {
        Level6Config.hasKey = false
        activeLevel = 6
        timeSinceDead = time()
        Level6Config.win1 = false
        Level6Config.win2 = false
        setGravity(Level6Config.gravity)

        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level6Layout, level6Mappings, Level6Config.Scale)

        const music = play("music", {
            volume: 0.2,
            loop: true,
        })
        onSceneLeave(() => {
            player1.walk.stop()
            music.stop()
        })
        
        // pause menu
        let paused = false
        UIManager.UIButton()
        const pauseMenu = UIManager.pauseMenu()
        pauseMenu.text.text = "Level 6"
        onClick("pause", (pause) => {
            if (pause.hidden) return
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })
        onClick("resume", (resume) => {
            if (resume.hidden) return
            if (paused) {
                paused = false
                player1.gameObj.paused = false
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = true;
            }
        })
        onClick("exit", (exit) => {
            if (exit.hidden) return
            go("levelSelect")
        })
        onClick("restart", (restart) => {
            if (restart.hidden) return
            timeSinceDead = time()
            player1.respawnPlayers()

            go(6)
        })
        onClick("SFX", (target) => {
            if (target.hidden) return
            if (target.curAnim() !== "muteSFX") {
                target.play("muteSFX") 
                volume(0)
            } else {
                target.play("SFX")
                volume(1)
            }
        })
        onClick("music", (target) => {
            if (target.hidden) return
            music.paused = !music.paused
            target.curAnim() !== "muteMusic" 
            ? target.play("muteMusic") 
            : target.play("music")
        })

        const player1 = new Player(
            Level6Config.playerSpeed,
            Level6Config.jumpForce,
            Level6Config.nbLives,
            "a",
            "d",
            "w",
            1,
            6,
            false
        )
        const player2 = new Player(
            Level5Config.playerSpeed,
            Level5Config.jumpForce,
            Level5Config.nbLives,
            "left",
            "right",
            "up",
            2,
            6,
            false
        )
        
        const box1 = add([
                sprite("items", {anim: "box"}),
                pos(16 * 15, 188),
                area(),
                body(),
                anchor("center"),
                offscreen(),
                scale(Level6Config.Scale),
                "box1", 
        ])

        const box2 = add([
                sprite("items", {anim: "box"}),
                pos(16 * 21, 100),
                area(),
                body(),
                anchor("center"),
                offscreen(),
                scale(Level6Config.Scale),
                "box2", 
        ])

        const box3 = add([
            sprite("items", {anim: "box"}),
            pos(16 * 23, 0),
            area(),
            body(),
            anchor("center"),
            offscreen(),
            scale(Level6Config.Scale),
            "box3", 
        ])

        const box4 = add([
            sprite("items", {anim: "box"}),
            pos(16 * 15, 0),
            area(),
            body(),
            anchor("center"),
            offscreen(),
            scale(Level6Config.Scale),
            "box4", 
        ])

        const portalIn1 = add([
            sprite("items", { anim: "portal_in" }),
            anchor("center"),
            pos(16 * 10 - 8, 148),
            scale(Level6Config.Scale),
            area( { shape: new Rect(vec2(0), 16, 14) }),
            offscreen(),
            "portalIn1"

        ])

        const portalOut1 = add([
            sprite("items", { anim: "portal_out" }),
            pos(16 * 27, 0),
            scale(Level6Config.Scale),
            area(),
            offscreen(),
            "portalOut1"
        ])

        onCollide("player1","portalIn1", () => {
            play("portal")
            player1.gameObj.pos = portalOut1.pos
        })
        onCollide("player2","portalIn1", () => {
            play("portal")
            player2.gameObj.pos = portalOut1.pos
        })

        const ghost1 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level6Config.Scale),
            "ghost"
        ])
        const ghost2 = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level6Config.Scale),
            "ghost2"
        ])

        player1.makePlayer(Level6Config.playerStartPosX + 16, Level6Config.playerStartPosY, "player1", Level6Config.Scale)
        player2.makePlayer(Level6Config.playerStartPosX, Level6Config.playerStartPosY, "player2", Level6Config.Scale)

        player1.update()
        player2.update()

        onCollide("box1", "button_off", (source, target) => {
            target.play("button_on")
            setTimeout(() => {
                source.pos.x = target.pos.x + 8
                source.pos.y = target.pos.y + 8
                source.use(body({ isStatic: true }))
                Level6Config.button1 = true
            }, 250);
        })

        onCollide("box2", "button_off", (source, target) => {
            target.play("button_on")
            setTimeout(() => {
                source.pos.x = target.pos.x + 8
                source.pos.y = target.pos.y + 8
                source.use(body({ isStatic: true }))
                Level6Config.button2 = true
            }, 250);
        })

        buttonPressed(player1.gameObj, "Level6Config", "button3", Level6Config.Scale)
        buttonUnpressed(player1.gameObj, "Level6Config", "button3", Level6Config.Scale)
        buttonPressed(player2.gameObj, "Level6Config", "button4", Level6Config.Scale)
        buttonUnpressed(player2.gameObj, "Level6Config", "button4", Level6Config.Scale)

        player1.gameObj.onCollide("key", (key) => {     //player1 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level6Config.hasKey = true
        })

        player2.gameObj.onCollide("key", (key) => {     //player2 collision with key
            play("key")
            destroy(key)
            console.log("key Get")
            Level6Config.hasKey = true
        })

        player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
            play("dead")
            player1.gameObj.angle = -90
            player1.isRespawning = true
            ghost1.pos = player1.gameObj.pos
            if (!player2.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 6) return
                    player1.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level6Config.win1 = false
                    Level6Config.win2 = false
                    timeSinceDead = time()
                    go(6)
                }, 3000)
            }
        })

        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost2.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
                death++
                setTimeout(() => {
                    if (activeLevel !== 6) return
                    player1.isRespawning = false
                    player1.respawnPlayers()
                    player2.respawnPlayers()
                    Level6Config.win1 = false
                    Level6Config.win2 = false
                    timeSinceDead = time()
                    go(6)
                }, 3000)
            }
        })

        player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
            if (Level6Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level6Config.hasKey = false
            }
        })

        player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
            if (Level6Config.hasKey) {
                play("door")
                door.play("open")
                setTimeout(() => {
                    destroy(door)
                }, 400);
                Level5Config.hasKey = false
            }
            player2.speed = 0
        })

        player1.gameObj.onCollide("finish", (finish) => {   //player1 collision with finish
            Level6Config.win1 = true
            player1.win = true
            player1.gameObj.move(0, -16000)
            player1.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })

        player2.gameObj.onCollide("finish", (finish) => {   //player2 collision with finish
            Level6Config.win2 = true
            player2.win = true
            player2.gameObj.move(0, -16000)
            player2.gameObj.use(body({gravityScale: 0}))
            finish.play("finishOpen")
            setTimeout(() => {
                finish.play("finishClose")
            }, 400);
        })

        onCollide("player1", "box1", () => { player1.isPushing = true })
        onCollideEnd("player1", "box1", () => { player1.isPushing = false })
        onCollide("player1", "box2", () => { player1.isPushing = true })
        onCollideEnd("player1", "box2", () => { player1.isPushing = false })
        onCollide("player2", "box1", () => { player2.isPushing = true })
        onCollideEnd("player2", "box1", () => { player2.isPushing = false })
        onCollide("player2", "box2", () => { player2.isPushing = true })
        onCollideEnd("player2", "box2", () => { player2.isPushing = false })

        onCollide("player1", "player2", () => {
            player1.isPushing = true
            player2.isPushing = true
        })
        
        onCollideEnd("player1", "player2", () => {
            player1.isPushing = false
            player2.isPushing = false
        })

        onKeyPress("escape", () => {
            if (!paused) {
                paused = true
                player1.gameObj.paused = true
                player2.gameObj.paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })

        onKeyPress("r", () => {
            timeSinceDead = time()
            player1.respawnPlayers()

            go(6)
        })

        let key = true
        const timer = add([
            text(""),
            color("e0f0ea"),
            anchor("center"),
            pos(width()/2, 16 * 2),
            scale(1),
            fixed(),
            z(2),
            "timer"
        ])
        const timerbg = add([
            rect(120, 48),
            anchor("center"),
            pos(width()/2, 16 * 2),
            color("3c2a4d"),
            fixed(),
            z(1),
            "timerbg"
        ])
        onUpdate(() => {
            if (!paused)
                timer.text = (time() - timeSinceDead).toFixed(2)
            if (player1.isRespawning) {
                ghost1.move(0, -100)
            }
            if (player2.isRespawning) {
                ghost2.move(0, -80)
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)

            if (Level6Config.button1 && Level6Config.button2 && Level6Config.button3 && Level6Config.button4 && key) {
                key = false
                add([
                    sprite("items", {anim: "key"}), 
                    pos(464, 98),
                    scale(Level6Config.Scale),
                    area(),
                    "key"
                ])
            }


            if (Level6Config.win1 && Level6Config.win2) {
                if (progress < 6)
                    progress++
                console.log((time() - timeSinceDead).toFixed(2))
                console.log(death)
                let data = {
                    "level": 6,
                    "death": death,
                    "time": (time() - timeSinceDead).toFixed(2),
                    "easter_egg": 0,
                    "progress": progress
                }
                sendClearData(data)
                go("levelSelect")
            }
        })
        camPos((16 * 24), 100)
        if (!isTouchscreen()) camScale(2, 2)
        else camScale(1, 1)
    },
};

for (const key in scenes) {
    scene(key, scenes[key]);
};

load.assets();
load.sounds();
go("levelSelect");