import kaboom from "../libs/kaboom.mjs";
import { load } from "../util/loader.js"
import { UIManager } from "../util/UIManager.js";
import { Level } from "../util/levelManager.js";
import { level2Layout, level2Mappings } from "../content/level2/level2Layout.js";
import { Player } from "../entity/player.js";
import { Level2Config } from "../content/level2/config.js";

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

const scenes = {
    2: () => {
        Level2Config.win1 = false
        Level2Config.win2 = false
        socket.emit('inLevel', true)
        setGravity(Level2Config.gravity)

        const level = new Level()
        level.drawBackground("background")
        level.drawMapLayout(level2Layout, level2Mappings, Level2Config.Scale)

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
        
        // update player tiap frame
        socket.on('updatePlayers', (backEndPlayers) => {
            for (const id in backEndPlayers) {
                const backEndPlayer = backEndPlayers[id]
                
                if (!frontEndPlayers[id]) {
                    frontEndPlayers[id] = new Player(
                        Level2Config.playerSpeed,
                        Level2Config.jumpForce,
                        Level2Config.nbLives,
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
                        scale(Level2Config.Scale),
                        "ghost"
                    ])
                    frontEndPlayers[id].makePlayer(backEndPlayer.x + 16, backEndPlayer.y, `player${frontEndPlayers[id].playerNumber}`, Level2Config.Scale)
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
                        Level2Config.hasKey = true
                        socket.emit('key')
                    })

                    frontEndPlayers[id].gameObj.onCollide("door", (door) => {
                        if (Level2Config.hasKey) {
                            play("door")
                            door.play("open")
                            setTimeout(() => {
                                destroy(door)
                            }, 400);
                            Level2Config.hasKey = false
                            socket.emit('door')
                        }
                    })

                    frontEndPlayers[id].gameObj.onCollide("bouncy", () => {
                        frontEndPlayers[id].bounce()
                    })

                    frontEndPlayers[id].gameObj.onCollide("finish", (finish) => {
                        Level2Config.win2 = true
                        frontEndPlayers[id].win = true
                        frontEndPlayers[id].gameObj.move(0, -16000)
                        frontEndPlayers[id].gameObj.use(body({gravityScale: 0}))
                        finish.play("finishOpen")
                        setTimeout(() => {
                            finish.play("finishClose")
                        }, 400);
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

        // controls
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

        onKeyPress("escape", () => {
            
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
            Level2Config.hasKey = true
            console.log(Level2Config.hasKey)
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

            let sum = 0;
            for (const id in camX) {
                sum += camX[id]
            }
            camPos(sum / 2, 84)     // camera position x = rata rata posisi player, kalau 2 player (x + x) / 2
            camScale(4, 4)
        })

        setInterval(() => {
            socket.emit('update', frontEndPlayers[socket.id].gameObj.pos)
        }, 100)
    }
}

scene(2, scenes[2]);

load.assets();
load.sounds();
go(2);