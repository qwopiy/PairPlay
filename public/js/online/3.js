import kaboom from "../libs/kaboom.mjs";
import { load } from "../util/loader.js"
import { UIManager } from "../util/UIManager.js";
import { Level } from "../util/levelManager.js";
import { level3Layout, level3Mappings } from "../content/level3/level3Layout.js";
import { Player } from "../entity/player.js";
import { Level3Config } from "../content/level3/config.js";

const socket = io();
let respawning = false;

function buttonPressed(object, config, Button, Scale) {
    object.onCollide("button_off", (button) => {
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

kaboom({
    height: 720,
    width: 1280,
    letterbox: true,
    maxFPS: 1000,
    canvas: document.getElementById("game"),
});

const scenes = {
    3: () => {
        Level3Config.win1 = false
        Level3Config.win2 = false
        socket.emit('inLevel', true)
        setGravity(Level3Config.gravity)

        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level3Layout, level3Mappings, Level3Config.Scale)

        const music = play("music", {
            volume: 0.2,
            loop: true,
        })
        onSceneLeave(() => {
            for (const id in frontEndPlayers) {
                destroy(frontEndPlayers[id].gameObj)
                delete frontEndPlayers[id]
                // frontEndPlayers[id].walk.stop()
            }
            music.stop()
        })

        // pause menu
        let paused = false
        UIManager.UIButton()
        const pauseMenu = UIManager.pauseMenu()
        onClick("pause", () => {
            if (!paused) {
                paused = true
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = false;
            }
        })
        onClick("resume", () => {
            if (paused) {
                paused = false
            }
            for (const obj in pauseMenu) {
                pauseMenu[obj].hidden = true;
            }
        })
        onClick("exit", () => {
            go("levelSelect")
        })
        onClick("restart", () => {
            socket.emit('keyPress', 'r')
        })
        onClick("SFX", (target) => {
            if (target.curAnim() !== "muteSFX") {
                target.play("muteSFX") 
                volume(0)
            } else {
                target.play("SFX")
                volume(1)
            }
        })
        onClick("music", (target) => {
            music.paused = !music.paused
            target.curAnim() !== "muteMusic" 
            ? target.play("muteMusic") 
            : target.play("music")
        })

        const frontEndPlayers = {}
        const ghost = {}

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

        onCollide("box1", "button_off", (source, target) => {
            source.pos.x = target.pos.x + 8
            source.pos.y = target.pos.y + 8
            source.use(body({ isStatic: true }))
            target.play("button_on")
            Level3Config.button1 = true
        })

        onCollide("box2", "button_off", (source, target) => {
            source.pos.x = target.pos.x + 8
            source.pos.y = target.pos.y + 8
            source.use(body({ isStatic: true }))
            target.play("button_on")
            Level3Config.button2 = true
        })
        
        socket.on('updatePlayers', (backEndPlayers) => {
            for (const id in backEndPlayers) {
                const backEndPlayer = backEndPlayers[id]
                
                if (!frontEndPlayers[id]) {
                    frontEndPlayers[id] = new Player(
                        Level3Config.playerSpeed,
                        Level3Config.jumpForce,
                        Level3Config.nbLives,
                        "",
                        "",
                        "",
                        backEndPlayer.playerNumber,
                        1,
                        false
                    )
                    ghost[id] = add([
                        sprite("ghost"),
                        pos(10000, 10000),
                        anchor("center"),
                        opacity(0.5),
                        scale(Level3Config.Scale),
                        "ghost"
                    ])
                    frontEndPlayers[id].makePlayer(backEndPlayer.x + 48, backEndPlayer.y + 32, `player${frontEndPlayers[id].playerNumber}`, Level3Config.Scale)
                    frontEndPlayers[id].update();
                    
                    frontEndPlayers[id].gameObj.onCollide("spike", () => {
                        ghost[id].pos = frontEndPlayers[id].gameObj.pos
                        frontEndPlayers[id].gameObj.angle = -90
                        frontEndPlayers[id].isRespawning = true
                        ghost.pos = frontEndPlayers[id].gameObj.pos
                        if (!respawning) socket.emit('respawning')
                        respawning = true
                    })

                    frontEndPlayers[id].gameObj.onCollide("key", (key) => {
                        destroy(key)
                        Level3Config.hasKey = true
                        socket.emit('key')
                    })

                    frontEndPlayers[id].gameObj.onCollide("door", (door) => {
                        if (Level3Config.hasKey) {
                            play("door")
                            door.play("open")
                            setTimeout(() => {
                                destroy(door)
                            }, 400);
                            Level3Config.hasKey = false
                            socket.emit('door')
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("finish", (finish) => {
                        Level3Config.win2 = true
                        frontEndPlayers[id].win = true
                        frontEndPlayers[id].gameObj.move(0, -16000)
                        frontEndPlayers[id].gameObj.use(body({gravityScale: 0}))
                        finish.play("finishOpen")
                        setTimeout(() => {
                            finish.play("finishClose")
                        }, 400);
                        socket.emit('win', (frontEndPlayers[id].playerNumber))
                    })

                    buttonPressed(frontEndPlayers[id].gameObj, "Level3Config",`button${frontEndPlayers[id].playerNumber}`, Level3Config.Scale)
                    buttonUnpressed(frontEndPlayers[id].gameObj, "Level3Config", `button${frontEndPlayers[id].playerNumber}`, Level3Config.Scale)

                    frontEndPlayers[id].gameObj.onCollide("box1", () => { frontEndPlayers[id].isPushing = true })
                    frontEndPlayers[id].gameObj.onCollideEnd("box1", () => { frontEndPlayers[id].isPushing = false })
                    frontEndPlayers[id].gameObj.onCollide("box2", () => { frontEndPlayers[id].isPushing = true })
                    frontEndPlayers[id].gameObj.onCollideEnd("box2", () => { frontEndPlayers[id].isPushing = false })

                    console.log(frontEndPlayers[socket.id]);
                } else {
                    frontEndPlayers[id].isMovingLeft = backEndPlayer.isMovingLeft;
                    frontEndPlayers[id].isMovingRight = backEndPlayer.isMovingRight;
                    frontEndPlayers[id].isJumping = backEndPlayer.isJumping;
                }
            }
        })

        socket.on('updateLocation', (pos, id) => {
            frontEndPlayers[id].gameObj.pos.x = pos.x;
            frontEndPlayers[id].gameObj.pos.y = pos.y;
        })
        
        socket.on('disconnected', (id) => {
            destroy(frontEndPlayers[id].gameObj)
            delete frontEndPlayers[id]
        })

        onKeyPress("w", () => {
            frontEndPlayers[socket.id].jump()
            socket.emit('keyPress', 'w')
        })
        
        onKeyRelease("w", () => {
            frontEndPlayers[socket.id].isJumping = false
            socket.emit('keyRelease', 'w')
        })

        onKeyPress("a", () => {
            frontEndPlayers[socket.id].isMovingLeft = true
            socket.emit('keyPress', 'a')
        })
        onKeyRelease("a", () => {
            frontEndPlayers[socket.id].isMovingLeft = false
            socket.emit('keyRelease', 'a')
        })
        
        onKeyPress("d", () => {
            frontEndPlayers[socket.id].isMovingRight = true
            socket.emit('keyPress', 'd')
        })
        onKeyRelease("d", () => {
            frontEndPlayers[socket.id].isMovingRight = false
            socket.emit('keyRelease', 'd')
        })
        
        onKeyPress("r", () => {
            socket.emit('keyPress', 'r')
        })

        onCollide("player1", "player2", () => {
            for (const id in frontEndPlayers) {
                frontEndPlayers[id].isPushing = true
            }
        })
        
        onCollideEnd("player1", "player2", () => {
            for (const id in frontEndPlayers) {
                frontEndPlayers[id].isPushing = false
            }
        })

        socket.on('respawn', () => {
            for (const id in frontEndPlayers) {
                frontEndPlayers[id].respawnPlayers()
                ghost[id].y = 10000
            }
            respawning = false
        })

        socket.on('keyGet', () => {
            console.log('keyGet')
            Level3Config.hasKey = true
            console.log(Level3Config.hasKey)
        })

        let key = true;

        socket.on('nextLevel', () => {
            for (const id in frontEndPlayers) {
                destroy(frontEndPlayers[id].gameObj)
                delete frontEndPlayers[id]
            }
            setTimeout(() => {
            }, 1000);
            go("levelSelect")
        })

        const camX = {}
        onUpdate(() => {
            for (const id in frontEndPlayers){
                const player = frontEndPlayers[id]
                camX[id] = player.gameObj.pos.x
                player.Move(player.speed)
                // console.log(player.gameObj.pos)
                if (player.isJumping) 
                    player.jump()
                if (player.isRespawning) {
                    ghost[id].move(0, -80)
                }
            }

            if (Level3Config.button1 && Level3Config.button2 && Level3Config.button3 && Level3Config.button4 && key) {
                key = false
                add([
                    sprite("items", {anim: "key"}), 
                    pos(16 * 12, 16 * 4),
                    scale(Level1Config.Scale),
                    area(),
                    "key"
                ])
            }

            camPos((16 * 24), 100)
            camScale(2, 2)
        })

        setInterval(() => {
            socket.emit('update', frontEndPlayers[socket.id].gameObj.pos)
        }, 100)
    },
}

scene(3, scenes[3]);

load.assets();
load.sounds();
go(3);