export const load = {
    assets: () => {
        loadSprite("player1", "../../assets/player1.png", {
            sliceX: 8,
            sliceY: 5,
            anims: {
                run: {
                    from: 0,
                    to: 7,
                    loop: true,
                },

                push: {
                    from: 8,
                    to: 15,
                    loop: true,
                },

                "jump": 16,
                "jump-up": 17,
                "jump-down": 18,
                "land": 19,

                idle: 24,
            }
        });
        loadSprite("player2", "../../assets/player2.png", {
            sliceX: 8,
            sliceY: 5,
            anims: {
                run: {
                    from: 0,
                    to: 7,
                    loop: true,
                },

                push: {
                    from: 8,
                    to: 15,
                    loop: true,
                },

                "jump": 16,
                "jump-up": 17,
                "jump-down": 18,
                "land": 19,

                idle: 24,
            }
        });
        loadSprite("moveButton", "../../assets/moveButton.png", {
            sliceX: 3,
            anims: {
                left: 0,
                right: 1,
                jump: 2,
            }
        });
        loadSprite("pauseButtons", "../../assets/pauseButtons.png", {
            sliceX: 8,
            anims: {
                pause: 0,
                exit: 1,
                restart: 2,
                resume: 3,
                SFX: 4,
                muteSFX: 5,
                music: 6,
                muteMusic: 7,
            }
        })
        loadSprite("easterEgg", "../../assets/FrontPage/easteregg.png")
        loadSprite("ghost", "../../assets/ghost.png")
        loadSprite("background", "../../assets/background.png")
        loadSprite("ground-tileset", "../../assets/ground-tileset.png", {
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
        loadSprite("door", "../../assets/door.png", {
            sliceX: 5,
            anims: {
                closed: 0,
                open: {
                    from: 1,
                    to: 4,
                    loop: false,
                },
            }
        });
        loadSprite("doorBase", "../../assets/doorBase.png")
        loadSprite("items", "../../assets/items.png", {
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
        loadSprite("ice", "../../assets/ice.png",{
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

        loadSprite("obj", "../../assets/spriteSheet1.png", {
            sliceX: 3,
            sliceY: 3,
            anims: {
                win: 2,
                lava: 4,
                bounce: 5,
                bounceBase: 8,
                finishClose: 6,
                finishOpen: 7,
            }
        })

        loadSprite("1", "../../assets/FrontPage/Progress1.png")
        loadSprite("2", "../../assets/FrontPage/Progress2.png")
        loadSprite("3", "../../assets/FrontPage/Progress3.png")
        loadSprite("4", "../../assets/FrontPage/Progress4.png")
    },

    sounds: () => {
        loadSound("music", "../../assets/Sounds/music.wav")
        loadSound("jump", "../../assets/Sounds/lompat.wav")
        loadSound("walk", "../../assets/Sounds/jalan.wav")
        loadSound("dead", "../../assets/Sounds/mati.wav")
        loadSound("button", "../../assets/Sounds/tombol.wav")
        loadSound("door", "../../assets/Sounds/pintu.wav")
        loadSound("key", "../../assets/Sounds/key.wav")
        loadSound("portal", "../../assets/Sounds/portal.wav")
        loadSound("bounce", "../../assets/Sounds/bounce.wav")
        loadSound("boom", "../../assets/Sounds/boom.mp3")
    }
}