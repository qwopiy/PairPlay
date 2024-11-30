import kaboom from "../libs/kaboom.mjs";
import { load } from "../util/loader.js"
import { UIManager } from "../util/UIManager.js";

const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('code');
kaboom({
    height: 720,
    width: 1280,
    letterbox: true,
    maxFPS: 1000,
    canvas: document.getElementById("game"),
});

const scenes = {
    levelSelect: () => {
        socket.emit('progressTrigger', roomCode)
        socket.on('progress', (level) => {
            socket.emit('exit')
            socket.emit('inLevel', false)
            const urlParams = new URLSearchParams(window.location.search);
            const roomCode = urlParams.get('code');

            if (roomCode) {
            socket.emit('join room', roomCode);
            }
            socket.on('level', (level, code) => {
                if (roomCode)
                    window.location.href = `${level}.html?code=${code}`
            })

            const music = play("music", {
                volume: 0.2,
                loop: true,
            })
            onSceneLeave(() => {
                music.stop()
            })
            
            UIManager.UIButton()
            onClick("pause", () => {
                music.paused = !music.paused
            })
            
            UIManager.displayLevel(level)
            console.log(level)
            
            if (level >= 0)
            onClick("1", () => {
                socket.emit('level', 1, roomCode)
            })
            if (level >= 1)
            onClick("2", () => {
                socket.emit('level', 2, roomCode)
            })
            if (level >= 2)
            onClick("3", () => {
                socket.emit('level', 3, roomCode)
            })
            if (level >= 3)
            onClick("4", () => {
                socket.emit('level', 4, roomCode)
            })
        })
    }
}


scene('levelSelect', scenes['levelSelect']);

load.assets();
load.sounds();
go("levelSelect");