import kaboom from "./libs/kaboom.mjs"
import { load } from "./util/loader.js"
import { UIManager } from "./util/UIManager.js";
import { Level } from "./util/levelManager.js";
import { level1Layout, level1Mappings } from "./content/level1/Level1Layout.js";
import { level4Layout, level4Mappings } from "./content/level4/level4Layout.js";
import { attachCamera } from "./util/camera.js";
import { Player } from "./entity/player.js";
import { Level1Config } from "./content/level1/config.js";
import { Level4Config } from "./content/level4/config.js";

kaboom();

const scenes = {
    menu: () => {
        UIManager.displayMainMenu()
    },

    1: () => {
        setGravity(Level1Config.gravity)

        const level = new Level()
        level.drawBackground("menuBackground")
        level.drawMapLayout(level1Layout, level1Mappings, Level1Config.Scale)

        const player1 = new Player(
            Level1Config.playerSpeed,
            Level1Config.jumpForce,
            Level1Config.nbLives,
            "a",
            "d",
            "w",
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
            1,
            false
        )

        player1.makePlayer(Level1Config.playerStartPosX + 64, Level1Config.playerStartPosY, "player1", Level1Config.Scale)
        player2.makePlayer(Level1Config.playerStartPosX, Level1Config.playerStartPosY, "player2", Level1Config.Scale)

        player1.update()
        player2.update()

        onCollide("player1", "bouncy", () => {player1.bounce()})
        onCollide("player2", "bouncy", () => {player2.bounce()})

        onCollide("player1", "ice", () => {!player1.isTouchingIce ? (player1.isTouchingIce = true, player1.speed = 0) : null})
        onCollide("player1", "grass", () => {player1.isTouchingIce ? (player1.isTouchingIce = false, player1.speed = 0) : null})
        onCollide("player2", "ice", () => {!player2.isTouchingIce ? (player2.isTouchingIce = true, player2.speed = 0) : null})
        onCollide("player2", "grass", () => {player2.isTouchingIce ? (player2.isTouchingIce = false, player2.speed = 0) : null})

        onKeyDown("space", () => {player1.hasKey = true})
        player1.gameObj.onCollide("door", (door) => {
            if (player1.hasKey) {
                destroy(door)
                player1.hasKey = false
            }
        })
        
        onUpdate(() => {
            player1.move(player1.speed)
            player2.move(player2.speed)

            if (player1.gameObj.pos.y > 700 || player2.gameObj.pos.y > 700) {
                player1.respawnPlayers()
                player2.respawnPlayers()
            }
        })
        attachCamera(player1.gameObj, player2.gameObj, 0, 368)

        level.drawWaves("lava")
    },
    2: () => {},
    3: () => {},
    4: () => {
        setGravity(Level4Config.gravity)

        const level = new Level()
        level.drawBackground("menuBackground")
        level.drawMapLayout(level4Layout, level4Mappings, Level4Config.Scale)

        const player1 = new Player(
            Level4Config.playerSpeed,
            Level4Config.jumpForce,
            Level4Config.nbLives,
            "a",
            "d",
            "w",
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
            1,
            false
        )

        player1.makePlayer(Level4Config.playerStartPosX + 64, Level4Config.playerStartPosY, "player1", Level4Config.Scale)
        player2.makePlayer(Level4Config.playerStartPosX, Level4Config.playerStartPosY, "player2", Level4Config.Scale)

        player1.update()
        player2.update()

        onUpdate(() => {
            player1.move(player1.speed)
            player2.move(player2.speed)

            // if (player1.gameObj.pos.y > 700 || player2.gameObj.pos.y > 700) {
            //     player1.respawnPlayers()
            //     player2.respawnPlayers()
            // }
        })
        attachCamera(player1.gameObj, player2.gameObj, 0, 368)
    }
};

for (const key in scenes) {
    scene(key, scenes[key]);
};

load.assets();
go(4);