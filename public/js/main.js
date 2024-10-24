import kaboom from "/public/js/libs/kaboom.mjs";
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

const socket = io();

kaboom({
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

// function teleport(object, portalIn, portalOut) {
//     object.onCollide( `${portalIn}` , () => {
//         object.pos = portalOut.pos
//         socket.emit('update', object.pos)
//     })
// }

const scenes = {
    levelSelect: () => {
        socket.on('progress', (level) => {
            socket.emit('inLevel', false)
            UIManager.displayLevel(level)
            console.log(level)
            
            if (level >= 0)
            onClick("1", () => {
                go(1)
            })
            if (level >= 1)
            onClick("2", () => {
                go(2)
            })
            if (level >= 2)
            onClick("3", () => {
                go(3)
            })
            if (level >= 3)
            onClick("4", () => {
                go(4)
            })
        })
    },

    1: () => {
        socket.emit('inLevel', true)
        setGravity(Level1Config.gravity)

        const level = new Level()
        level.drawBackground("menuBackground")
        level.drawMapLayout(level1Layout, level1Mappings, Level1Config.Scale)

        const frontEndPlayers = {}
        
        socket.emit('moveSpeed', Level1Config.playerSpeed)
        
        socket.on('updatePlayers', (backEndPlayers) => {
            for (const id in backEndPlayers) {
                const backEndPlayer = backEndPlayers[id]
                
                if (!frontEndPlayers[id]) {
                    frontEndPlayers[id] = new Player(
                        Level1Config.playerSpeed,
                        Level1Config.jumpForce,
                        Level1Config.nbLives,
                        "a",
                        "d",
                        "w",
                        backEndPlayer.playerNumber,
                        1,
                        false
                    )
                    frontEndPlayers[id].makePlayer(backEndPlayer.x + 16, backEndPlayer.y, id, Level1Config.Scale)
                    frontEndPlayers[id].update();

                    frontEndPlayers[id].gameObj.onCollide("spike", () => {
                        socket.emit('respawning')
                    })

                    frontEndPlayers[id].gameObj.onCollide("key", (key) => {
                        destroy(key)
                        Level1Config.hasKey = true
                        socket.emit('key')
                    })

                    frontEndPlayers[id].gameObj.onCollide("door", (door) => {
                        if (Level1Config.hasKey) {
                            destroy(door)
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

                    frontEndPlayers[id].gameObj.onCollide("grass", () => {
                        if (frontEndPlayers[id].isTouchingIce) {
                            frontEndPlayers[id].isTouchingIce = false
                            frontEndPlayers[id].speed = 0
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("finish", () => {
                        frontEndPlayers[id].win = true
                        socket.emit('win', (frontEndPlayers[id].playerNumber))
                    })

                    buttonPressed(frontEndPlayers[id].gameObj, "Level1Config",`button${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)
                    buttonUnpressed(frontEndPlayers[id].gameObj, "Level1Config", `button${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)

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

        onKeyDown("w", () => {
            frontEndPlayers[socket.id].jump()
            socket.emit('keyPress', 'w')
        })
        
        onKeyRelease("w", () => {
            frontEndPlayers[socket.id].isJumping = false
            socket.emit('keyRelease', 'w')
        })

        onKeyDown("a", () => {
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

        socket.on('respawn', () => {
            for (const id in frontEndPlayers) {
                frontEndPlayers[id].respawnPlayers()
            }
        })

        socket.on('keyGet', () => {
            console.log('keyGet')
            Level1Config.hasKey = true
            console.log(Level1Config.hasKey)
        })

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
                camX[id] = frontEndPlayers[id].gameObj.pos.x
                if (frontEndPlayers[id].gameObj.pos.y > 400) {
                    socket.emit('respawning')
                }
            }

            let sum = 0;
            for (const id in camX) {
                sum += camX[id]
            }
            camPos(sum / 2, 84)     // camera position x = rata rata posisi player, kalau 2 player (x + x) / 2
            camScale(2, 2)
        
            if (Level1Config.button1 && Level1Config.button2) {
                Level1Config.hasKey = true
            }

            console.log(Level1Config.button1, Level1Config.button2, Level1Config.hasKey)
        })

        setInterval(() => {
            for (const id in frontEndPlayers) {
                const player = frontEndPlayers[id]
                player.Move(player.speed)
                // console.log(player.gameObj.pos)
                if (player.isJumping) 
                    player.jump()
                // socket.emit('update', player.gameObj.pos)
            }
        }, 15)

        setInterval(() => {
            socket.emit('update', frontEndPlayers[socket.id].gameObj.pos)
        }, 100)

        // const player1 = new Player(
        //     Level1Config.playerSpeed,
        //     Level1Config.jumpForce,
        //     Level1Config.nbLives,
        //     "a",
        //     "d",
        //     "w",
        //     1,
        //     false
        // )
        
        // const player2 = new Player(
        //     Level1Config.playerSpeed,
        //     Level1Config.jumpForce,
        //     Level1Config.nbLives,
        //     "left",
        //     "right",
        //     "up",
        //     1,
        //     false
        // )

        // player1.makePlayer(Level1Config.playerStartPosX + 16, Level1Config.playerStartPosY, "player1", Level1Config.Scale)
        // player2.makePlayer(Level1Config.playerStartPosX, Level1Config.playerStartPosY, "player2", Level1Config.Scale)

        // player1.update()
        // player2.update()

        // onCollide("player1", "ice", () => {!player1.isTouchingIce ? (player1.isTouchingIce = true, player1.speed = 0) : null})
        // onCollide("player1", "grass", () => {player1.isTouchingIce ? (player1.isTouchingIce = false, player1.speed = 0) : null})
        // onCollide("player2", "ice", () => {!player2.isTouchingIce ? (player2.isTouchingIce = true, player2.speed = 0) : null})
        // onCollide("player2", "grass", () => {player2.isTouchingIce ? (player2.isTouchingIce = false, player2.speed = 0) : null})

        // buttonPressed(player1.gameObj, "Level1Config","button1", Level1Config.Scale)
        // buttonUnpressed(player1.gameObj, "Level1Config", "button1", Level1Config.Scale)

        // buttonPressed(player2.gameObj, "Level1Config", "button2", Level1Config.Scale)
        // buttonUnpressed(player2.gameObj, "Level1Config", "button2", Level1Config.Scale)

        // onKeyDown("space", () => {
        //     player1.gameObj.Move(0, -1000)
        //     player2.gameObj.Move(0, -1000)
        // })


        // player1.gameObj.onCollide("key", (key) => {     //player1 collision with key
        //     destroy(key)
        //     Level1Config.hasKey = true
        // })

        // player2.gameObj.onCollide("key", (key) => {     //player2 collision with key
        //     destroy(key)
        //     Level1Config.hasKey = true
        // })

        // player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
        //     if (Level1Config.hasKey) {
        //         destroy(door)
        //         Level1Config.hasKey = false
        //     }
        // })

        // player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
        //     if (Level1Config.hasKey) {
        //         destroy(door)
        //         Level1Config.hasKey = false
        //     }
        // })

        // player1.gameObj.onCollide("finish", () => {   //player1 collision with finish
        //     Level1Config.win1 = true
        // })

        // player2.gameObj.onCollide("finish", () => {   //player2 collision with finish
        //     Level1Config.win2 = true
        // })
        
        // player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
        //     player1.respawnPlayers()
        //     player2.respawnPlayers()
        //     player1.death++
        // })
        
        // player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
        //     player1.respawnPlayers()
        //     player2.respawnPlayers()
        //     player2.death++
        // })

        // onUpdate(() => {
        //     if (Level1Config.button1 && Level1Config.button2) {
        //         Level1Config.hasKey = true
        //     }
        //     player1.Move(player1.speed)
        //     player2.Move(player2.speed)
            
        //     if (player1.gameObj.pos.y > 400) {
        //         player1.respawnPlayers()
        //         player2.respawnPlayers()
        //         player1.death++
        //     }
            
        //     if (player2.gameObj.pos.y > 400) {
        //         player1.respawnPlayers()
        //         player2.respawnPlayers()
        //         player2.death++
        //     }

        //     if (Level1Config.win1 && Level1Config.win2) {
        //         go(2)
        //     }
        //     console.log(player1.death, player2.death)
        // })
        // attachCamera(player1.gameObj, player2.gameObj, 0, 84, Level1Config.levelZoom)
        
        // level.drawWaves("lava")
    },
    
    2: () => {
        socket.emit('inLevel', true)
        setGravity(Level2Config.gravity)

        const level = new Level()
        level.drawBackground("menuBackground")
        level.drawMapLayout(level2Layout, level2Mappings, Level2Config.Scale)

        const frontEndPlayers = {}
        
        socket.emit('moveSpeed', Level2Config.playerSpeed)
        
        socket.on('updatePlayers', (backEndPlayers) => {
            for (const id in backEndPlayers) {
                const backEndPlayer = backEndPlayers[id]
                
                if (!frontEndPlayers[id]) {
                    frontEndPlayers[id] = new Player(
                        Level2Config.playerSpeed,
                        Level2Config.jumpForce,
                        Level2Config.nbLives,
                        "a",
                        "d",
                        "w",
                        backEndPlayer.playerNumber,
                        1,
                        false
                    )
                    frontEndPlayers[id].makePlayer(backEndPlayer.x + 16, backEndPlayer.y, id, Level2Config.Scale)
                    frontEndPlayers[id].update();

                    frontEndPlayers[id].gameObj.onCollide("spike", () => {
                        socket.emit('respawning')
                    })

                    frontEndPlayers[id].gameObj.onCollide("key", (key) => {
                        destroy(key)
                        Level2Config.hasKey = true
                        socket.emit('key')
                    })

                    frontEndPlayers[id].gameObj.onCollide("door", (door) => {
                        if (Level2Config.hasKey) {
                            destroy(door)
                            Level2Config.hasKey = false
                            socket.emit('door')
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("ice", () => {
                        if (!frontEndPlayers[id].isTouchingIce) {
                            frontEndPlayers[id].isTouchingIce = true
                            frontEndPlayers[id].speed = 0
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("grass", () => {
                        if (frontEndPlayers[id].isTouchingIce) {
                            frontEndPlayers[id].isTouchingIce = false
                            frontEndPlayers[id].speed = 0
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("bouncy", () => {
                        frontEndPlayers[id].bounce()
                    })

                    frontEndPlayers[id].gameObj.onCollide("finish", () => {
                        frontEndPlayers[id].win = true
                        socket.emit('win', (frontEndPlayers[id].playerNumber))
                    })

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

        onKeyDown("w", () => {
            frontEndPlayers[socket.id].jump()
            socket.emit('keyPress', 'w')
        })
        
        onKeyRelease("w", () => {
            frontEndPlayers[socket.id].isJumping = false
            socket.emit('keyRelease', 'w')
        })

        onKeyDown("a", () => {
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

        socket.on('respawn', () => {
            for (const id in frontEndPlayers) {
                frontEndPlayers[id].respawnPlayers()
            }
        })

        socket.on('keyGet', () => {
            console.log('keyGet')
            Level2Config.hasKey = true
            console.log(Level2Config.hasKey)
        })

        socket.on('nextLevel', () => {
            go("levelSelect")
        })

        const camX = {}
        onUpdate(() => {
            for (const id in frontEndPlayers){
                camX[id] = frontEndPlayers[id].gameObj.pos.x
                if (frontEndPlayers[id].gameObj.pos.y > 400) {
                    socket.emit('respawning')
                }
            }

            let sum = 0;
            for (const id in camX) {
                sum += camX[id]
            }
            camPos(sum / 2, 84)     // camera position x = rata rata posisi player, kalau 2 player (x + x) / 2
            camScale(2, 2)
        })

        setInterval(() => {
            for (const id in frontEndPlayers) {
                const player = frontEndPlayers[id]
                player.Move(player.speed)
                // console.log(player.gameObj.pos)
                if (player.isJumping) 
                    player.jump()
                // socket.emit('update', player.gameObj.pos)
            }
        }, 15)

        setInterval(() => {
            socket.emit('update', frontEndPlayers[socket.id].gameObj.pos)
        }, 100)
    //     setGravity(Level2Config.gravity)

    //     const level = new Level()
    //     level.drawBackground("menuBackground")
    //     level.drawMapLayout(level2Layout, level2Mappings, Level2Config.Scale)

    //     const player1 = new Player(
    //         Level2Config.playerSpeed,
    //         Level2Config.jumpForce,
    //         Level2Config.nbLives,
    //         "a",
    //         "d",
    //         "w",
    //         1,
    //         false
    //     )
        
    //     const player2 = new Player(
    //         Level2Config.playerSpeed,
    //         Level2Config.jumpForce,
    //         Level2Config.nbLives,
    //         "left",
    //         "right",
    //         "up",
    //         1,
    //         false
    //     )

    //     player1.makePlayer(Level2Config.playerStartPosX + 16, Level2Config.playerStartPosY, "player1", Level2Config.Scale)
    //     player2.makePlayer(Level2Config.playerStartPosX, Level2Config.playerStartPosY, "player2", Level2Config.Scale)

    //     player1.update()
    //     player2.update()

    //     player1.gameObj.onCollide("key", (key) => {     //player1 collision with key
    //         destroy(key)
    //         Level2Config.hasKey = true
    //     })

    //     player2.gameObj.onCollide("key", (key) => {     //player2 collision with key
    //         destroy(key)
    //         Level2Config.hasKey = true
    //     })

    //     player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
    //         if (Level2Config.hasKey) {
    //             destroy(door)
    //             Level2Config.hasKey = false
    //         }
    //     })

    //     player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
    //         if (Level2Config.hasKey) {
    //             destroy(door)
    //             Level2Config.hasKey = false
    //         }
    //     })

    //     player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
    //         player1.respawnPlayers()
    //         player2.respawnPlayers()
    //         player1.death++
    //     })
        
    //     player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
    //         player1.respawnPlayers()
    //         player2.respawnPlayers()
    //         player2.death++
    //     })

    //     player1.gameObj.onCollide("finish", () => {   //player1 collision with finish
    //         Level2Config.win1 = true
    //     })

    //     player2.gameObj.onCollide("finish", () => {   //player2 collision with finish
    //         Level2Config.win2 = true
    //     })

    //     onCollide("player1", "bouncy", () => {player1.bounce()})
    //     onCollide("player2", "bouncy", () => {player2.bounce()})

    //     onUpdate(() => {
    //         player1.Move(player1.speed)
    //         player2.Move(player2.speed)

    //         if (player1.gameObj.pos.y > 300) {
    //             player1.respawnPlayers()
    //             player2.respawnPlayers()
    //             player1.death++
    //         }
            
    //         if (player2.gameObj.pos.y > 300) {
    //             player1.respawnPlayers()
    //             player2.respawnPlayers()
    //             player2.death++
    //         }

    //         if (Level2Config.win1 && Level2Config.win2) {
    //             go(3)
    //         }
    //     })

    //     attachCamera(player1.gameObj, player2.gameObj, 0, 84, Level2Config.levelZoom)
        },

    3: () => {
        socket.emit('inLevel', true)
        setGravity(Level3Config.gravity)

        const level = new Level()
        level.drawBackground("menuBackground")
        level.drawMapLayout(level3Layout, level3Mappings, Level3Config.Scale)

        const frontEndPlayers = {}

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

        buttonPressed(box1, "Level3Config", "button3", Level3Config.Scale)
        buttonUnpressed(box1, "Level3Config", "button3", Level3Config.Scale)

        buttonPressed(box2, "Level3Config", "button4", Level3Config.Scale)
        buttonUnpressed(box2, "Level3Config", "button4", Level3Config.Scale)
        
        socket.emit('moveSpeed', Level3Config.playerSpeed)
        
        socket.on('updatePlayers', (backEndPlayers) => {
            for (const id in backEndPlayers) {
                const backEndPlayer = backEndPlayers[id]
                
                if (!frontEndPlayers[id]) {
                    frontEndPlayers[id] = new Player(
                        Level3Config.playerSpeed,
                        Level3Config.jumpForce,
                        Level3Config.nbLives,
                        "a",
                        "d",
                        "w",
                        backEndPlayer.playerNumber,
                        1,
                        false
                    )
                    frontEndPlayers[id].makePlayer(backEndPlayer.x + 72, backEndPlayer.y + 64, id, Level3Config.Scale)
                    frontEndPlayers[id].update();

                    frontEndPlayers[id].gameObj.onCollide("spike", () => {
                        socket.emit('respawning')
                    })

                    frontEndPlayers[id].gameObj.onCollide("key", (key) => {
                        destroy(key)
                        Level3Config.hasKey = true
                        socket.emit('key')
                    })

                    frontEndPlayers[id].gameObj.onCollide("door", (door) => {
                        if (Level3Config.hasKey) {
                            destroy(door)
                            Level3Config.hasKey = false
                            socket.emit('door')
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("finish", () => {
                        frontEndPlayers[id].win = true
                        socket.emit('win', (frontEndPlayers[id].playerNumber))
                    })

                    buttonPressed(frontEndPlayers[id].gameObj, "Level1Config",`button${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)
                    buttonUnpressed(frontEndPlayers[id].gameObj, "Level1Config", `button${frontEndPlayers[id].playerNumber}`, Level1Config.Scale)

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

        onKeyDown("w", () => {
            frontEndPlayers[socket.id].jump()
            socket.emit('keyPress', 'w')
        })
        
        onKeyRelease("w", () => {
            frontEndPlayers[socket.id].isJumping = false
            socket.emit('keyRelease', 'w')
        })

        onKeyDown("a", () => {
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

        socket.on('respawn', () => {
            for (const id in frontEndPlayers) {
                frontEndPlayers[id].respawnPlayers()
            }
        })

        socket.on('keyGet', () => {
            console.log('keyGet')
            Level3Config.hasKey = true
            console.log(Level3Config.hasKey)
        })

        socket.on('nextLevel', () => {
            go("levelSelect")
        })

        const camX = {}
        onUpdate(() => {
            for (const id in frontEndPlayers){
                if (frontEndPlayers[id].gameObj.pos.y > 400) {
                    socket.emit('respawning')
                }
            }

            if (Level3Config.button1 && Level3Config.button2 && Level3Config.button3 && Level3Config.button4) {
                Level3Config.hasKey = true
                socket.emit('key')
            }

            camPos((16 * 24), 100)
            camScale(2, 2)
        })

        setInterval(() => {
            for (const id in frontEndPlayers) {
                const player = frontEndPlayers[id]
                player.Move(player.speed)
                // console.log(player.gameObj.pos)
                if (player.isJumping) 
                    player.jump()
                // socket.emit('update', player.gameObj.pos)
            }
        }, 15)

        setInterval(() => {
            socket.emit('update', frontEndPlayers[socket.id].gameObj.pos)
        }, 100)
        // setGravity(Level3Config.gravity)

        // const level = new Level()
        // level.drawBackground("background")
        // level.drawMapLayout(level3Layout, level3Mappings, Level3Config.Scale)

        // const player1 = new Player(
        //     Level3Config.playerSpeed,
        //     Level3Config.jumpForce,
        //     Level3Config.nbLives,
        //     "a",
        //     "d",
        //     "w",
        //     1,
        //     false
        // )
        
        // const player2 = new Player(
        //     Level3Config.playerSpeed,
        //     Level3Config.jumpForce,
        //     Level3Config.nbLives,
        //     "left",
        //     "right",
        //     "up",
        //     1,
        //     false
        // )

        // const box1 = add([
        //         sprite("items", {anim: "box"}),
        //         pos(496, 188),
        //         area(),
        //         body(),
        //         anchor("center"),
        //         offscreen(),
        //         scale(Level3Config.Scale),
        //         "box", 
        // ])

        // const box2 = add([
        //         sprite("items", {anim: "box"}),
        //         pos(580, 0),
        //         area(),
        //         body(),
        //         anchor("center"),
        //         offscreen(),
        //         scale(Level3Config.Scale),
        //         "box", 
        // ])

        // player1.makePlayer(Level3Config.playerStartPosX + 16, Level3Config.playerStartPosY, "player1", Level3Config.Scale)
        // player2.makePlayer(Level3Config.playerStartPosX, Level3Config.playerStartPosY, "player2", Level3Config.Scale)

        // player1.update()
        // player2.update()

        // buttonPressed(box1, "Level3Config", "button1", Level3Config.Scale)
        // buttonUnpressed(box1, "Level3Config", "button1", Level3Config.Scale)

        // buttonPressed(box2, "Level3Config", "button2", Level3Config.Scale)
        // buttonUnpressed(box2, "Level3Config", "button2", Level3Config.Scale)

        // buttonPressed(player1.gameObj, "Level3Config", "button3", Level3Config.Scale)
        // buttonUnpressed(player1.gameObj, "Level3Config", "button3", Level3Config.Scale)

        // buttonPressed(player2.gameObj, "Level3Config", "button4", Level3Config.Scale)
        // buttonUnpressed(player2.gameObj, "Level3Config", "button4", Level3Config.Scale)

        // player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
        //     player1.respawnPlayers()
        //     player2.respawnPlayers()
        //     player1.death++
        // })
        
        // player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
        //     player1.respawnPlayers()
        //     player2.respawnPlayers()
        //     player2.death++
        // })

        // player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
        //     if (Level3Config.hasKey) {
        //         destroy(door)
        //         Level3Config.hasKey = false
        //     }
        // })

        // player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
        //     if (Level3Config.hasKey) {
        //         destroy(door)
        //         Level3Config.hasKey = false
        //     }
        // })

        // player1.gameObj.onCollide("finish", () => {   //player1 collision with finish
        //     Level3Config.win1 = true
        // })

        // player2.gameObj.onCollide("finish", () => {   //player2 collision with finish
        //     Level3Config.win2 = true
        // })

        // onUpdate(() => {
        //     player1.Move(player1.speed)
        //     player2.Move(player2.speed)

        //     if (Level3Config.button1 && Level3Config.button2 && Level3Config.button3 && Level3Config.button4) {
        //         Level3Config.hasKey = true
        //     }

        //     if (Level3Config.win1 && Level3Config.win2) {
        //         go(4)
        //     }
        //     // console.log(box2.vel)
        // })
        // camPos((16 * 24), 100)
        // camScale(2, 2)
    },

    4: () => {
        socket.emit('inLevel', true)
        setGravity(Level4Config.gravity)

        const level = new Level()
        level.drawBackground("menuBackground")
        level.drawMapLayout(level4Layout, level4Mappings, Level4Config.Scale)

        const frontEndPlayers = {}

        const portalDestroyed = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false
        }
        const portalIn1 = add([
            sprite("items", { anim: "portal_in" }),
            pos(16 * 6, 16 * 7),
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
        
        socket.emit('moveSpeed', Level4Config.playerSpeed)
        
        socket.on('updatePlayers', (backEndPlayers) => {
            for (const id in backEndPlayers) {
                const backEndPlayer = backEndPlayers[id]
                
                if (!frontEndPlayers[id]) {
                    frontEndPlayers[id] = new Player(
                        Level4Config.playerSpeed,
                        Level4Config.jumpForce,
                        Level4Config.nbLives,
                        "a",
                        "d",
                        "w",
                        backEndPlayer.playerNumber,
                        1,
                        false
                    )
                    frontEndPlayers[id].makePlayer(backEndPlayer.x - 16, backEndPlayer.y + 32, id, Level4Config.Scale)
                    frontEndPlayers[id].update();

                    frontEndPlayers[id].gameObj.onCollide("spike", () => {
                        socket.emit('respawning')
                    })

                    frontEndPlayers[id].gameObj.onCollide("key", (key) => {
                        destroy(key)
                        Level4Config.hasKey = true
                        socket.emit('key')
                    })

                    frontEndPlayers[id].gameObj.onCollide("door", (door) => {
                        if (Level4Config.hasKey) {
                            destroy(door)
                            Level4Config.hasKey = false
                            socket.emit('door')
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("finish", () => {
                        frontEndPlayers[id].win = true
                        socket.emit('win', (frontEndPlayers[id].playerNumber))
                    })

                        buttonPressed(frontEndPlayers[id].gameObj, "Level4Config", `button${frontEndPlayers[id].playerNumber}`, Level4Config.Scale)

                        // teleport(frontEndPlayers[id].gameObj, "portalIn1", portalOut1)
                        // teleport(frontEndPlayers[id].gameObj, "portalIn2", portalOut2)
                        // teleport(frontEndPlayers[id].gameObj, "portalIn3", portalOut3)
                        // teleport(frontEndPlayers[id].gameObj, "portalIn4", portalOut4)
                        // teleport(frontEndPlayers[id].gameObj, "portalIn5", portalOut5)

                        frontEndPlayers[id].gameObj.onCollide( "portalIn1" , () => {
                            frontEndPlayers[id].pos = portalOut1.pos
                            socket.emit('update', frontEndPlayers[id].pos)
                            portalIn1.pos = vec2(-100, -100)
                            portalOut1.pos = vec2(-100, -100)
                            portalDestroyed[1] = true
                        })

                        frontEndPlayers[id].gameObj.onCollide( "portalIn2" , () => {
                            frontEndPlayers[id].pos = portalOut2.pos
                            socket.emit('update', frontEndPlayers[id].pos)
                            portalIn2.pos = vec2(-100, -100)
                            portalOut2.pos = vec2(-100, -100)
                            portalDestroyed[2] = true
                        })

                        frontEndPlayers[id].gameObj.onCollide( "portalIn3" , () => {
                            frontEndPlayers[id].pos = portalOut3.pos
                            socket.emit('update', frontEndPlayers[id].pos)
                            portalIn3.pos = vec2(-100, -100)
                            portalOut3.pos = vec2(-100, -100)
                            portalDestroyed[3] = true
                        })

                        frontEndPlayers[id].gameObj.onCollide( "portalIn4" , () => {
                            frontEndPlayers[id].pos = portalOut4.pos
                            socket.emit('update', frontEndPlayers[id].pos)
                            portalIn4.pos = vec2(-100, -100)
                            portalOut4.pos = vec2(-100, -100)
                            portalDestroyed[4] = true
                        })

                        frontEndPlayers[id].gameObj.onCollide( "portalIn5" , () => {
                            frontEndPlayers[id].pos = portalOut5.pos
                            socket.emit('update', frontEndPlayers[id].pos)
                            portalIn5.pos = vec2(-100, -100)
                            portalOut5.pos = vec2(-100, -100)
                            portalDestroyed[5] = true
                        })


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

        onKeyDown("w", () => {
            frontEndPlayers[socket.id].jump()
            socket.emit('keyPress', 'w')
        })
        
        onKeyRelease("w", () => {
            frontEndPlayers[socket.id].isJumping = false
            socket.emit('keyRelease', 'w')
        })

        onKeyDown("a", () => {
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

        socket.on('respawn', () => {
            for (const id in frontEndPlayers) {
                frontEndPlayers[id].respawnPlayers()

            }
            if (portalDestroyed[1]) {
                portalIn1.pos = vec2(16 * 6, 16 * 7)
                portalOut1.pos = vec2(16 * 11, 16 * 1)
                portalDestroyed[1] = false
            }

            if (portalDestroyed[2]) {
                portalIn2.pos = vec2(16 * 26, 16 * 3)
                portalOut2.pos = vec2(16 * 31, 16 * 1)
                portalDestroyed[2] = false
            }

            if (portalDestroyed[3]) {
                portalIn3.pos = vec2(16 * 26, 16 * 10)
                portalOut3.pos = vec2(16 * 35, 16 * 1)
                portalDestroyed[3] = false
            }

            if (portalDestroyed[4]) {
                portalIn4.pos = vec2(16 * 47, 16 * 10)
                portalOut4.pos = vec2(16 * 43, 16 * 6)
                portalDestroyed[4] = false
            }

            if (portalDestroyed[5]) {
                portalIn5.pos = vec2(16 * 47, 16 * 3)
                portalOut5.pos = vec2(16 * 41, 16 * 6)
                portalDestroyed[5] = false
            }
        })

        socket.on('keyGet', () => {
            console.log('keyGet')
            Level4Config.hasKey = true
            console.log(Level4Config.hasKey)
        })

        socket.on('nextLevel', () => {
            go("levelSelect")
        })

        const camX = {}
        onUpdate(() => {
            for (const id in frontEndPlayers){
                camX[id] = frontEndPlayers[id].gameObj.pos.x
                if (frontEndPlayers[id].gameObj.pos.y > 400) {
                    socket.emit('respawning')
                }
            }

            if (Level4Config.button1 || Level4Config.button2) {
                Level4Config.hasKey = true
            }

            let sum = 0;
            for (const id in camX) {
                sum += camX[id]
            }
            camPos(sum / 2, 116)     // camera position x = rata rata posisi player, kalau 2 player (x + x) / 2
            camScale(2, 2)
        })

        setInterval(() => {
            for (const id in frontEndPlayers) {
                const player = frontEndPlayers[id]
                player.Move(player.speed)
                // console.log(player.gameObj.pos)
                if (player.isJumping) 
                    player.jump()
                // socket.emit('update', player.gameObj.pos)
            }
        }, 15)

        setInterval(() => {
            socket.emit('update', frontEndPlayers[socket.id].gameObj.pos)
        }, 100)
    //     setGravity(Level4Config.gravity)

    //     const level = new Level()
    //     level.drawBackground("menuBackground")
    //     level.drawMapLayout(level4Layout, level4Mappings, Level4Config.Scale)

    //     const player1 = new Player(
    //         Level4Config.playerSpeed,
    //         Level4Config.jumpForce,
    //         Level4Config.nbLives,
    //         "a",
    //         "d",
    //         "w",
    //         1,
    //         false
    //     )
        
    //     const player2 = new Player(
    //         Level4Config.playerSpeed,
    //         Level4Config.jumpForce,
    //         Level4Config.nbLives,
    //         "left",
    //         "right",
    //         "up",
    //         1,
    //         false
    //     )

    //     const portalIn1 = add([
    //         sprite("items", { anim: "portal_in" }),
    //         pos(16 * 6, 16 * 6),
    //         scale(Level4Config.Scale),
    //         area( { shape: new Rect(vec2(0), 16, 14) }),
    //         offscreen(),
    //         "portalIn1"

    //     ])

    //     const portalOut1 = add([
    //         sprite("items", { anim: "portal_out" }),
    //         pos(16 * 11, 16 * 1),
    //         scale(Level4Config.Scale),
    //         area(),
    //         offscreen(),
    //         "portalOut1"
    //     ])

    //     const portalIn2 = add([
    //         sprite("items", { anim: "portal_in" }),
    //         pos(16 * 26, 16 * 3),
    //         scale(Level4Config.Scale),
    //         area( { shape: new Rect(vec2(0), 16, 14) }),
    //         offscreen(),
    //         "portalIn2"
    //     ])

    //     const portalOut2 = add([
    //         sprite("items", { anim: "portal_out" }),
    //         pos(16 * 31, 16 * 1),
    //         scale(Level4Config.Scale),
    //         area(),
    //         offscreen(),
    //         "portalOut2"
    //     ])

    //     const portalIn3 = add([
    //         sprite("items", { anim: "portal_in" }),
    //         pos(16 * 26, 16 * 10),
    //         scale(Level4Config.Scale),
    //         area( { shape: new Rect(vec2(0), 16, 14) }),
    //         offscreen(),
    //         "portalIn3"
    //     ])

    //     const portalOut3 = add([
    //         sprite("items", { anim: "portal_out" }),
    //         pos(16 * 35, 16 * 1),
    //         scale(Level4Config.Scale),
    //         area(),
    //         offscreen(),
    //         "portalOut3"
    //     ])

    //     const portalIn4 = add([
    //         sprite("items", { anim: "portal_in" }),
    //         pos(16 * 47, 16 * 10),
    //         scale(Level4Config.Scale),
    //         area( { shape: new Rect(vec2(0), 16, 14) }),
    //         offscreen(),
    //         "portalIn4"
    //     ])

    //     const portalOut4 = add([
    //         sprite("items", { anim: "portal_out" }),
    //         pos(16 * 43, 16 * 6),
    //         scale(Level4Config.Scale),
    //         area(),
    //         offscreen(),
    //         "portalOut4"
    //     ])

    //     const portalIn5 = add([
    //         sprite("items", { anim: "portal_in" }),
    //         pos(16 * 47, 16 * 3),
    //         scale(Level4Config.Scale),
    //         area( { shape: new Rect(vec2(0), 16, 14) }),
    //         offscreen(),
    //         "portalIn5"
    //     ])

    //     const portalOut5 = add([
    //         sprite("items", { anim: "portal_out" }),
    //         pos(16 * 41, 16 * 6),
    //         scale(Level4Config.Scale),
    //         area(),
    //         offscreen(),
    //         "portalOut5"
    //     ])

    //     player1.makePlayer(Level4Config.playerStartPosX + 32, Level4Config.playerStartPosY, "player1", Level4Config.Scale)
    //     player2.makePlayer(Level4Config.playerStartPosX, Level4Config.playerStartPosY, "player2", Level4Config.Scale)

    //     player1.update()
    //     player2.update()

    //     teleport(player1.gameObj, "portalIn1", portalOut1)
    //     teleport(player2.gameObj, "portalIn1", portalOut1)

    //     teleport(player1.gameObj, "portalIn2", portalOut2)
    //     teleport(player2.gameObj, "portalIn2", portalOut2)

    //     teleport(player1.gameObj, "portalIn3", portalOut3)
    //     teleport(player2.gameObj, "portalIn3", portalOut3)

    //     teleport(player1.gameObj, "portalIn4", portalOut4)
    //     teleport(player2.gameObj, "portalIn4", portalOut4)

    //     teleport(player1.gameObj, "portalIn5", portalOut5)
    //     teleport(player2.gameObj, "portalIn5", portalOut5)

    //     player1.gameObj.onCollide("door", (door) => {   //player1 collision with door
    //         if (Level4Config.hasKey) {
    //             destroy(door)
    //             Level4Config.hasKey = false
    //         }
    //     })

    //     player2.gameObj.onCollide("door", (door) => {   //player2 collision with door
    //         if (Level4Config.hasKey) {
    //             destroy(door)
    //             Level4Config.hasKey = false
    //         }
    //     })

    //     player1.gameObj.onCollide("finish", () => {   //player1 collision with finish
    //         Level4Config.win1 = true
    //     })

    //     player2.gameObj.onCollide("finish", () => {   //player2 collision with finish
    //         Level4Config.win2 = true
    //     })
        
    //     player1.gameObj.onCollide("spike", () => {   //player1 collision with spike
    //         player1.respawnPlayers()
    //         player2.respawnPlayers()
    //         player1.death++
    //     })
        
    //     player2.gameObj.onCollide("spike", () => {   //player2 collision with spike
    //         player1.respawnPlayers()
    //         player2.respawnPlayers()
    //         player2.death++
    //     })

    //     buttonPressed(player1.gameObj, "Level4Config", "button1", Level4Config.Scale)
    //     buttonPressed(player2.gameObj, "Level4Config", "button2", Level4Config.Scale)

    //     onUpdate(() => {
    //         player1.Move(player1.speed)
    //         player2.Move(player2.speed)

    //         if (Level4Config.button1 || Level4Config.button2) {
    //             Level4Config.hasKey = true
    //         }

    //         if (Level4Config.win1 && Level4Config.win2) {
    //             go(5)
    //         }
    //     })
    //     attachCamera(player1.gameObj, player2.gameObj, 0, 116, Level4Config.levelZoom)
    }
};

for (const key in scenes) {
    scene(key, scenes[key]);
};

load.assets();
go(2);