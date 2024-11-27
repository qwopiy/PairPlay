import kaboom from "../libs/kaboom.mjs";
import { load } from "../util/loader.js"
import { UIManager } from "../util/UIManager.js";
import { Level } from "../util/levelManager.js";
import { level1Layout, level1Mappings } from "../content/level1/level1Layout.js";
import { Player } from "../entity/player.js";
import { Level1Config } from "../content/level1/config.js";

const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('code');
let respawning = false;

kaboom({
    height: 720,
    width: 1280,
    letterbox: true,
    maxFPS: 1000,
    canvas: document.getElementById("game"),
});

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

const scenes = {
    1: () => {
        socket.emit('join room', roomCode)
        Level1Config.win1 = false
        Level1Config.win2 = false
        socket.emit('inLevel', true)
        setGravity(Level1Config.gravity)

        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level1Layout, level1Mappings, Level1Config.Scale)

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
            socket.emit('exit')
            socket.emit('inLevel', false)
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
            socket.emit('exit', roomCode)
            window.location.href = `levelSelect.html?code=${roomCode}`; 
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

        onKeyPress("space", () => {
            socket.emit('testRoom', 'bintang', roomCode)
        })
        socket.on('testRoom', text => {
            console.log(text)
        })

        // socket.on('createPlayer', (backEndPlayers) => {
        //     for (const id in backEndPlayers) {
        //         const backEndPlayer = backEndPlayers[id]
        //         frontEndPlayers[id] = new Player(
        //             Level1Config.playerSpeed,
        //             Level1Config.jumpForce,
        //             Level1Config.nbLives,
        //             "",
        //             "",
        //             "",
        //             backEndPlayer.playerNumber,
        //             1,
        //             false
        //         )
                
        //         ghost[id] = add([
        //             sprite("ghost"),
        //             pos(10000, 10000),
        //             anchor("center"),
        //             opacity(0.5),
        //             scale(Level1Config.Scale),
        //             "ghost"
        //         ])
        //         frontEndPlayers[id].makePlayer(backEndPlayer.x + 16, backEndPlayer.y, `player${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)
        //         frontEndPlayers[id].update();

        //         frontEndPlayers[id].gameObj.onCollide("spike", () => {
        //             ghost[id].pos = frontEndPlayers[id].gameObj.pos
        //             frontEndPlayers[id].gameObj.angle = -90
        //             frontEndPlayers[id].isRespawning = true
        //             ghost.pos = frontEndPlayers[id].gameObj.pos
        //             if (!respawning) socket.emit('respawning')
        //             respawning = true
        //         })

        //         frontEndPlayers[id].gameObj.onCollide("key", (key) => {
        //             destroy(key)
        //             Level1Config.hasKey = true
        //             socket.emit('key')
        //         })

        //         frontEndPlayers[id].gameObj.onCollide("door", (door) => {
        //             if (Level1Config.hasKey) {
        //                 play("door")
        //                 door.play("open")
        //                 setTimeout(() => {
        //                     destroy(door)
        //                 }, 400);
        //                 Level1Config.hasKey = false
        //                 socket.emit('door')
        //             }
        //         })

        //         frontEndPlayers[id].gameObj.onCollide("ice", () => {
        //             if (!frontEndPlayers[id].isTouchingIce) {
        //                 frontEndPlayers[id].isTouchingIce = true
        //                 frontEndPlayers[id].speed = 0
        //             }
        //         })

        //         frontEndPlayers[id].gameObj.onCollide("ground", () => {
        //             if (frontEndPlayers[id].isTouchingIce) {
        //                 frontEndPlayers[id].isTouchingIce = false
        //                 frontEndPlayers[id].speed = 0
        //             }
        //         })

        //         frontEndPlayers[id].gameObj.onCollide("finish", (finish) => {
        //             Level1Config.win2 = true
        //             frontEndPlayers[id].win = true
        //             frontEndPlayers[id].gameObj.move(0, -16000)
        //             frontEndPlayers[id].gameObj.use(body({gravityScale: 0}))
        //             finish.play("finishOpen")
        //             setTimeout(() => {
        //                 finish.play("finishClose")
        //             }, 400);
        //             socket.emit('win', (frontEndPlayers[id].playerNumber))
        //         })

        //         buttonPressed(frontEndPlayers[id].gameObj, "Level1Config",`button${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)
        //         buttonUnpressed(frontEndPlayers[id].gameObj, "Level1Config", `button${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)

        //         frontEndPlayers[id].gameObj.onCollide("easterEgg", () => {
        //             for (const obj in easterEgg) {
        //                 destroy(easterEgg[obj])
        //             }
        //         })

        //         console.log(frontEndPlayers[socket.id])
        //     }
        // })

        socket.on('updatePlayers', (backEndPlayers) => {
            for (const id in backEndPlayers) {
                const backEndPlayer = backEndPlayers[id]
                
                if (!frontEndPlayers[id]) {
                    frontEndPlayers[id] = new Player(
                        Level1Config.playerSpeed,
                        Level1Config.jumpForce,
                        Level1Config.nbLives,
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
                        scale(Level1Config.Scale),
                        "ghost"
                    ])
                    frontEndPlayers[id].makePlayer(backEndPlayer.x + 16, backEndPlayer.y, `player${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)
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
                        Level1Config.hasKey = true
                        socket.emit('key')
                    })

                    frontEndPlayers[id].gameObj.onCollide("door", (door) => {
                        if (Level1Config.hasKey) {
                            play("door")
                            door.play("open")
                            setTimeout(() => {
                                destroy(door)
                            }, 400);
                            Level1Config.hasKey = false
                            socket.emit('door')
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("ice", () => {
                        if (!frontEndPlayers[id].isTouchingIce) {
                            frontEndPlayers[id].isTouchingIce = true
                            frontEndPlayers[id].speed = 0
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("ground", () => {
                        if (frontEndPlayers[id].isTouchingIce) {
                            frontEndPlayers[id].isTouchingIce = false
                            frontEndPlayers[id].speed = 0
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("finish", (finish) => {
                        Level1Config.win2 = true
                        frontEndPlayers[id].win = true
                        frontEndPlayers[id].gameObj.move(0, -16000)
                        frontEndPlayers[id].gameObj.use(body({gravityScale: 0}))
                        finish.play("finishOpen")
                        setTimeout(() => {
                            finish.play("finishClose")
                        }, 400);
                        socket.emit('win', (frontEndPlayers[id].playerNumber))
                    })

                    buttonPressed(frontEndPlayers[id].gameObj, "Level1Config",`button${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)
                    buttonUnpressed(frontEndPlayers[id].gameObj, "Level1Config", `button${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)

                    frontEndPlayers[id].gameObj.onCollide("easterEgg", () => {
                        for (const obj in easterEgg) {
                            destroy(easterEgg[obj])
                        }
                    })

                    console.log(frontEndPlayers[socket.id]);
                } else {
                    frontEndPlayers[id].isMovingLeft = backEndPlayer.isMovingLeft;
                    frontEndPlayers[id].isMovingRight = backEndPlayer.isMovingRight;
                    frontEndPlayers[id].isJumping = backEndPlayer.isJumping;
                }
            }
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

        socket.on('updateLocation', (pos, id) => {
            frontEndPlayers[id].gameObj.pos.x = pos.x;
            frontEndPlayers[id].gameObj.pos.y = pos.y;
        })
        
        socket.on('disconnected', (id) => {
            destroy(frontEndPlayers[id].gameObj)
            delete frontEndPlayers[id]
        })

        if (isTouchscreen()) {
            onTouchStart((position) => {
                if (position.x < width() / 10) {
                    frontEndPlayers[socket.id].isMovingLeft = true
                    socket.emit('keyPress', 'a')
                } else if (position.x > width() / 10 && position.x < (width() / 10) * 3) {
                    frontEndPlayers[socket.id].isMovingRight = true
                    socket.emit('keyPress', 'd')
                } else {
                    frontEndPlayers[socket.id].jump()
                    socket.emit('keyPress', 'w')
                }
            })
        
            onTouchEnd((position) => {
                if (position.x < width() / 10) {
                    frontEndPlayers[socket.id].isMovingLeft = false
                    socket.emit('keyRelease', 'a')
                } else if (position.x > width() / 10 && position.x < (width() / 10) * 3) {
                    frontEndPlayers[socket.id].isMovingRight = false
                    socket.emit('keyRelease', 'd')
                } else {
                    socket.emit('keyRelease', 'w')
                }
            })
        }

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
            Level1Config.hasKey = true
            console.log(Level1Config.hasKey)
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
                console.log(player.isMovingLeft, player.isMovingRight)
                if (player.isJumping) 
                    player.jump()
                if (player.isRespawning) {
                    ghost[id].move(0, -80)
                }
            }

            let sum = 0;
            for (const id in camX) {
                sum += camX[id]
            }
            camPos(sum / 2, 84)     // camera position x = rata rata posisi player, kalau 2 player (x + x) / 2
            camScale(4, 4)
        
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

            // console.log(Level1Config.button1, Level1Config.button2, Level1Config.hasKey)
        })

        setInterval(() => {
            socket.emit('update', frontEndPlayers[socket.id].gameObj.pos)
        }, 100)
    }
}

scene(1, scenes[1]);

load.assets();
load.sounds();
go(1);