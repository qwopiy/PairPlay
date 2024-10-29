import kaboom from "./public/js/libs/kaboom.mjs";
import { load } from "./util/loader.js"
import { UIManager } from "./util/UIManager.js";
import { Level } from "./util/levelManager.js";
import { level1Layout, level1Mappings } from "./content/level1/level1Layout.js";
import { level2Layout, level2Mappings } from "./content/level2/level2Layout.js";
import { level3Layout, level3Mappings } from "./content/level3/level3Layout.js";
import { level4Layout, level4Mappings } from "./content/level4/level4Layout.js";
import { attachCamera } from "./util/camera.js";
import { Player } from "./entity/player.js";
import { Level1Config } from "./content/level1/config.js";
import { Level2Config } from "./content/level2/config.js";
import { Level3Config } from "./content/level3/config.js";
import { Level4Config } from "./content/level4/config.js";

kaboom({
    canvas: document.getElementById("game"),
});

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

var progress = 0;

const scenes = {
    levelSelect: () => {
        const music = play("music", {
            volume: 0.2,
            loop: true,
        })
        onSceneLeave(() => {
            music.stop()
        })
        
        UIManager.UIButton()
        onClick("muteMusic", () => {
            music.paused = !music.paused
        })

        UIManager.displayLevel(progress)
            console.log(progress)
            
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

    },

    1: () => {
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
        
        UIManager.UIButton()
        onClick("muteMusic", () => {
            music.paused = !music.paused
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

        const ghost = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level1Config.Scale),
            "ghost"
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
            Level1Config.hasKey = true
        })

        player2.gameObj.onCollide("key", (key) => {     //player2 collision with key
            destroy(key)
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
            ghost.pos = player1.gameObj.pos
            if (!player2.isRespawning) {
            setTimeout(() => {
                player1.isRespawning = false
                player1.respawnPlayers()
                player2.respawnPlayers()
                Level1Config.win1 = false
                Level1Config.win2 = false
                player1.death++
                }, 3000)
            }
        })
        
        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
            setTimeout(() => {
                player2.isRespawning = false
                player1.respawnPlayers()
                player2.respawnPlayers()
                Level1Config.win1 = false
                Level1Config.win2 = false
                player2.death++
                }, 3000)
            }
        })

        player1.gameObj.onCollide("dead", () => {
            play("dead")
            player1.isRespawning = true
            ghost.pos = player1.gameObj.pos
                if (!player2.isRespawning) {
                    setTimeout(() => {
                        player1.isRespawning = false
                        player1.respawnPlayers()
                        player2.respawnPlayers()
                        Level1Config.win1 = false
                        Level1Config.win2 = false
                        player1.death++
                    }, 3000)
                }
        })

        player2.gameObj.onCollide("dead", () => {
            play("dead")
            player2.isRespawning = true
            ghost.pos = player2.gameObj.pos
                if (!player1.isRespawning) {
                    setTimeout(() => {
                        player2.isRespawning = false
                        player1.respawnPlayers()
                        player2.respawnPlayers()
                        Level1Config.win1 = false
                        Level1Config.win2 = false
                        player2.death++
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
        
        onUpdate(() => {
            console.log(player1.isPushing, player2.isPushing)
            if (player1.isRespawning || player2.isRespawning) {
                ghost.move(0, -80)
            }

            if (Level1Config.button1 && Level1Config.button2) {
                Level1Config.hasKey = true
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)
            
            if (Level1Config.win1 && Level1Config.win2) {
                if (progress < 1)
                    progress++
                go("levelSelect")
            }
            // console.log(player1.death, player2.death)
            // console.log(ghost.pos)
        })
        attachCamera(player1.gameObj, player2.gameObj, 0, 84, Level1Config.levelZoom)
        
        // level.drawLava()
    },
    
    2: () => {
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
        
        UIManager.UIButton()
        onClick("muteMusic", () => {
            music.paused = !music.paused
        })

        const player1 = new Player(
            Level2Config.playerSpeed,
            Level2Config.jumpForce,
            Level2Config.nbLives,
            "a",
            "d",
            "w",
            1,
            1,
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
            1,
            false
        )

        const ghost = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level1Config.Scale),
            "ghost"
        ])

        player1.makePlayer(Level2Config.playerStartPosX + 16, Level2Config.playerStartPosY, "player1", Level2Config.Scale)
        player2.makePlayer(Level2Config.playerStartPosX, Level2Config.playerStartPosY, "player2", Level2Config.Scale)

        player1.update()
        player2.update()

        player1.gameObj.onCollide("key", (key) => {     //player1 collision with key
            destroy(key)
            Level2Config.hasKey = true
        })

        player2.gameObj.onCollide("key", (key) => {     //player2 collision with key
            destroy(key)
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
            ghost.pos = player1.gameObj.pos
            if (!player2.isRespawning) {
            setTimeout(() => {
                player1.isRespawning = false
                player1.respawnPlayers()
                player2.respawnPlayers()
                Level2Config.win1 = false
                Level2Config.win2 = false
                player1.death++
                }, 3000)
            }
        })
        
        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
            setTimeout(() => {
                player2.isRespawning = false
                player1.respawnPlayers()
                player2.respawnPlayers()
                Level2Config.win1 = false
                Level2Config.win2 = false
                player2.death++
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

        player1.gameObj.onCollide("dead", () => {
            play("dead")
            player1.isRespawning = true
            ghost.pos = player1.gameObj.pos
                if (!player2.isRespawning) {
                    setTimeout(() => {
                        player1.isRespawning = false
                        player1.respawnPlayers()
                        player2.respawnPlayers()
                        Level2Config.win1 = false
                        Level2Config.win2 = false
                        player1.death++
                    }, 3000)
                }
        })

        player2.gameObj.onCollide("dead", () => {
            play("dead")
            player2.isRespawning = true
            ghost.pos = player2.gameObj.pos
                if (!player1.isRespawning) {
                    setTimeout(() => {
                        player2.isRespawning = false
                        player1.respawnPlayers()
                        player2.respawnPlayers()
                        Level2Config.win1 = false
                        Level2Config.win2 = false
                        player2.death++
                    }, 3000)
                }
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

        onUpdate(() => {
            if (player1.isRespawning || player2.isRespawning) {
                ghost.move(0, -80)
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)

            if (Level2Config.win1 && Level2Config.win2) {
                if (progress < 2)
                    progress++
                go("levelSelect")
            }
        })

        attachCamera(player1.gameObj, player2.gameObj, 0, 84, Level2Config.levelZoom)
        // level.drawLava()
        },

    3: () => {
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
        
        UIManager.UIButton()
        onClick("muteMusic", () => {
            music.paused = !music.paused
        })

        const player1 = new Player(
            Level3Config.playerSpeed,
            Level3Config.jumpForce,
            Level3Config.nbLives,
            "a",
            "d",
            "w",
            1,
            1,
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
            1,
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
                "box", 
        ])

        const box2 = add([
                sprite("items", {anim: "box"}),
                pos(580, 0),
                area(),
                body(),
                anchor("center"),
                offscreen(),
                scale(Level3Config.Scale),
                "box", 
        ])

        const ghost = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level1Config.Scale),
            "ghost"
        ])

        player1.makePlayer(Level3Config.playerStartPosX + 16, Level3Config.playerStartPosY, "player1", Level3Config.Scale)
        player2.makePlayer(Level3Config.playerStartPosX, Level3Config.playerStartPosY, "player2", Level3Config.Scale)

        player1.update()
        player2.update()

        buttonPressed(box1, "Level3Config", "button1", Level3Config.Scale)
        buttonUnpressed(box1, "Level3Config", "button1", Level3Config.Scale)

        buttonPressed(box2, "Level3Config", "button2", Level3Config.Scale)
        buttonUnpressed(box2, "Level3Config", "button2", Level3Config.Scale)

        buttonPressed(player1.gameObj, "Level3Config", "button3", Level3Config.Scale)
        buttonUnpressed(player1.gameObj, "Level3Config", "button3", Level3Config.Scale)

        buttonPressed(player2.gameObj, "Level3Config", "button4", Level3Config.Scale)
        buttonUnpressed(player2.gameObj, "Level3Config", "button4", Level3Config.Scale)

        player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
            play("dead")
            player1.gameObj.angle = -90
            player1.isRespawning = true
            ghost.pos = player1.gameObj.pos
            if (!player2.isRespawning) {
            setTimeout(() => {
                player1.isRespawning = false
                player1.respawnPlayers()
                player2.respawnPlayers()
                Level3Config.win1 = false
                Level3Config.win2 = false
                player1.death++
                }, 3000)
            }
        })
        
        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
            setTimeout(() => {
                player2.isRespawning = false
                player1.respawnPlayers()
                player2.respawnPlayers()
                Level3Config.win1 = false
                Level3Config.win2 = false
                player2.death++
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

        onCollide("player1", "box", () => { player1.isPushing = true })
        onCollideEnd("player1", "box", () => { player1.isPushing = false })

        onCollide("player2", "box", () => { player2.isPushing = true })
        onCollideEnd("player2", "box", () => { player2.isPushing = false })

        onUpdate(() => {
            if (player1.isRespawning || player2.isRespawning) {
                ghost.move(0, -100)
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)

            if (Level3Config.button1 && Level3Config.button2 && Level3Config.button3 && Level3Config.button4) {
                Level3Config.hasKey = true
            }

            if (Level3Config.win1 && Level3Config.win2) {
                if (progress < 3)
                    progress++
                go("levelSelect")
            }
            // console.log(box2.vel)
        })
        camPos((16 * 24), 100)
        camScale(2, 2)
    },

    4: () => {
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
        
        UIManager.UIButton()
        onClick("muteMusic", () => {
            music.paused = !music.paused
        })

        const player1 = new Player(
            Level4Config.playerSpeed,
            Level4Config.jumpForce,
            Level4Config.nbLives,
            "a",
            "d",
            "w",
            1,
            1,
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
            1,
            false
        )

        const ghost = add([
            sprite("ghost"),
            pos(10000, 10000),
            anchor("center"),
            opacity(0.5),
            scale(Level1Config.Scale),
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
            setTimeout(() => {
                player1.isRespawning = false
                player1.respawnPlayers()
                player2.respawnPlayers()
                Level4Config.win1 = false
                Level4Config.win2 = false
                player1.death++
                }, 3000)
            }
        })
        
        player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
            play("dead")
            player2.gameObj.angle = -90
            player2.isRespawning = true
            ghost.pos = player2.gameObj.pos
            if (!player1.isRespawning) {
            setTimeout(() => {
                player2.isRespawning = false
                player1.respawnPlayers()
                player2.respawnPlayers()
                Level4Config.win1 = false
                Level4Config.win2 = false
                player2.death++
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

        onUpdate(() => {
            if (player1.isRespawning || player2.isRespawning) {
                ghost.move(0, -80)
            }

            player1.Move(player1.speed)
            player2.Move(player2.speed)

            if (Level4Config.button1 || Level4Config.button2) {
                Level4Config.hasKey = true
            }

            if (Level4Config.win1 && Level4Config.win2) {
                if (progress < 4)
                    progress++
                go("levelSelect")
            }
        })
        attachCamera(player1.gameObj, player2.gameObj, 0, 116, Level4Config.levelZoom)
    }
};

for (const key in scenes) {
    scene(key, scenes[key]);
};

load.assets();
load.sounds();
go("levelSelect");