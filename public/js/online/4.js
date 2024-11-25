import kaboom from "../libs/kaboom.mjs";
import { load } from "../util/loader.js"
import { UIManager } from "../util/UIManager.js";
import { Level } from "../util/levelManager.js";
import { level4Layout, level4Mappings } from "../content/level4/level4Layout.js";
import { Player } from "../entity/player.js";
import { Level4Config } from "../content/level4/config.js";

const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('code');
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

kaboom({
    height: 720,
    width: 1280,
    letterbox: true,
    maxFPS: 1000,
    canvas: document.getElementById("game"),
});

const scenes = {
    4: () => {
        Level4Config.win1 = false
        Level4Config.win2 = false
        socket.emit('inLevel', true)
        setGravity(Level4Config.gravity)

        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level4Layout, level4Mappings, Level4Config.Scale)

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

        socket.on('updatePlayers', (backEndPlayers) => {
            for (const id in backEndPlayers) {
                const backEndPlayer = backEndPlayers[id]
                
                if (!frontEndPlayers[id]) {
                    frontEndPlayers[id] = new Player(
                        Level4Config.playerSpeed,
                        Level4Config.jumpForce,
                        Level4Config.nbLives,
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
                        scale(Level4Config.Scale),
                        "ghost"
                    ])
                    frontEndPlayers[id].makePlayer(backEndPlayer.x - 64, backEndPlayer.y + 48, `player${frontEndPlayers[id].playerNumber}`, Level4Config.Scale)
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
                        Level4Config.hasKey = true
                        socket.emit('key')
                    })

                    frontEndPlayers[id].gameObj.onCollide("door", (door) => {
                        if (Level4Config.hasKey) {
                            play("door")
                            door.play("open")
                            setTimeout(() => {
                                destroy(door)
                            }, 400);
                            Level4Config.hasKey = false
                            socket.emit('door')
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("finish", (finish) => {
                        Level4Config.win2 = true
                        frontEndPlayers[id].win = true
                        frontEndPlayers[id].gameObj.move(0, -16000)
                        frontEndPlayers[id].gameObj.use(body({gravityScale: 0}))
                        finish.play("finishOpen")
                        setTimeout(() => {
                            finish.play("finishClose")
                        }, 400);
                        socket.emit('win', (frontEndPlayers[id].playerNumber))
                    })

                    buttonPressed(frontEndPlayers[id].gameObj, "Level4Config", `button${frontEndPlayers[id].playerNumber}`, Level4Config.Scale)

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
            for (let i = 1; i <= 5; i++) {
                if (portalDestroyed[i]) {
                    switch (i) {
                        case 1:
                            portalIn1.pos = vec2(16 * 6, 16 * 7);
                            portalOut1.pos = vec2(16 * 11, 16 * 1);
                            break;
                        case 2:
                            portalIn2.pos = vec2(16 * 26, 16 * 3);
                            portalOut2.pos = vec2(16 * 31, 16 * 1);
                            break;
                        case 3:
                            portalIn3.pos = vec2(16 * 26, 16 * 10);
                            portalOut3.pos = vec2(16 * 35, 16 * 1);
                            break;
                        case 4:
                            portalIn4.pos = vec2(16 * 47, 16 * 10);
                            portalOut4.pos = vec2(16 * 43, 16 * 6);
                            break;
                        case 5:
                            portalIn5.pos = vec2(16 * 47, 16 * 3);
                            portalOut5.pos = vec2(16 * 41, 16 * 6);
                            break;
                    }
                    portalDestroyed[i] = false;
                }
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

            if (Level4Config.button1 || Level4Config.button2) {
                Level4Config.hasKey = true
            }

            let sum = 0;
            for (const id in camX) {
                sum += camX[id]
            }
            camPos(sum / 2, 116)     // camera position x = rata rata posisi player, kalau 2 player (x + x) / 2
            camScale(3, 3)
        })

        setInterval(() => {
            socket.emit('update', frontEndPlayers[socket.id].gameObj.pos)
        }, 100)
    }
}

scene(4, scenes[4]);

load.assets();
load.sounds();
go(4);