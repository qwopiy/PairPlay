export const load = {
    assets: () => {
        loadSprite("player", "assets/player.png", {
            sliceX: 9,
            anims: {
                run: {
                    from: 0,
                    to: 7,
                    loop: true,
                },

                idle: 8,
            }
        });
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
        loadSprite("ice", "assets/ice.png",{
            sliceX: 3,
            sliceY: 3,
            anims: {
                fl: 0,      //float left
                fm: 1,
                fr: 2,

                gl: 3,      //ground left
                gm: 4,
                gr: 5,

                iceGround: 6,

                gs: 7,      //ground single
                fs: 8,      //float single
            }
        });

        loadSprite("1", "assets/FrontPage/Progress1.png")
        loadSprite("2", "assets/FrontPage/Progress2.png")
        loadSprite("3", "assets/FrontPage/Progress3.png")
        loadSprite("4", "assets/FrontPage/Progress4.png")
    },

    sounds: () => {
        loadSound("music", "assets/Sounds/music.wav")
    }
}