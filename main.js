import kaboom from "./libs/kaboom.mjs"
import { load } from "./util/loader.js"
import { UIManager } from "./util/UIManager.js";
import { Level } from "./util/levelManager.js";
import { level1Layout } from "./content/level1/Level1Layout.js";
import { level1Mappings } from "./content/level1/Level1Layout.js";
import { attachCamera } from "./util/camera.js";
import { Player } from "./entity/player.js";
import { Level1Config } from "./content/level1/config.js";

kaboom({
    frameRate:  20
});

const scenes = {
    menu: () => {
        UIManager.displayMainMenu()
    },

    controls: () => {

    },
    1: () => {
        setGravity(Level1Config.gravity)

        const level = new Level()
        level.drawBackground("menuBackground")
        level.drawMapLayout(level1Layout, level1Mappings)

        const player = new Player(
            Level1Config.playerStartPosX, 
            Level1Config.playerStartPosY,
            Level1Config.playerSpeed,
            Level1Config.jumpForce,
            Level1Config.nbLives,
            1,
            false
        )

        player.update()
        attachCamera(player.gameObj, 0, 368)

        level.drawWaves("lava")
    },
    2: () => {},
    3: () => {},
    4: () => {},
    5: () => {}
};

for (const key in scenes) {
    scene(key, scenes[key]);
};

load.assets();
go(1);