export const load = {
    assets: () => {
        loadSprite("player", "assets/player.png");
        loadSprite("menuBackground", "assets/forestBackground.png");
        loadSprite("background", "assets/background.png");
        loadSprite("logo", "assets/logo.png");

        loadSprite("grass-tileset", "assets/grass-tileset.png", {
            sliceX: 3,
            sliceY: 3,
            anims: {
                tm: 1,      
                tr: 2,
                ml: 3,
                mm: 4,
                mr: 5,
                bl: 6,
                bm: 7,
                br: 8,
            }
        });
        
        loadSprite("lava", "assets/red.png")
        loadSprite("spikeNaikTurun", "assets/spikeNaikTurun.png")
        loadSprite("items", "assets/items.png", {
            sliceX: 3,
            sliceY: 3,
            anims: {
                box: 0,
                portal_in: 3,
                portal_out: 4,
                key: 5,
                spike: 6,
                
                button_off: 7,
                button_on: 8,
            }
        });

        loadSprite("leftButton", "assets/leftButton.png")
        loadSprite("rightButton", "assets/rightButton.png")
        loadSprite("jumpButton", "assets/jumpButton.png")
    }
}