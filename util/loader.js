export const load = {
    assets: () => {
        loadSprite("player", "assets/player.png");
        loadSprite("menuBackground", "assets/forestBackground.png");
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
        loadSprite("plate", "assets/plate.png")
        loadSprite("spike", "assets/spike.png", {
            sliceX: 2,
            sliceY: 2,
            anims: {
                spike: 2
            }
        });

        loadSprite("leftButton", "assets/leftButton.png")
        loadSprite("rightButton", "assets/rightButton.png")
        loadSprite("jumpButton", "assets/jumpButton.png")
    }
}