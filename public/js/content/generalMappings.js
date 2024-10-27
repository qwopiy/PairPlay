export function generateMappings(tileType) {
    return {
        0: () => [
            sprite(`${tileType}-tileset`),
            area(), 
            body({ isStatic: true}), 
            offscreen(),
            "grass"
        ],

        1: () => [
            sprite(`${tileType}-tileset`, { anim: 'tm' }),
            area(), 
            body({ isStatic: true}), 
            offscreen(),
            "grass"
        ],

        2: () => [
            sprite(`${tileType}-tileset`, { anim: 'tr' }),
            area(), 
            body({ isStatic: true}), 
            offscreen(),
            "grass"
        ],

        3: () => [
            sprite(`${tileType}-tileset`, { anim: 'ml' }),
            area(), 
            body({ isStatic: true}), 
            offscreen(),
            "grass"
        ],

        4: () => [
            sprite(`${tileType}-tileset`, { anim: 'mm' }),
            offscreen(),
            "grass"
        ],

        5: () => [
            sprite(`${tileType}-tileset`, { anim: 'mr' }),
            area(), 
            body({ isStatic: true}), 
            offscreen(),
            "grass"
        ],

        6: () => [
            sprite(`${tileType}-tileset`, { anim: 'bl' }),
            offscreen()
        ],

        7: () => [
            sprite(`${tileType}-tileset`, { anim: 'bm' }),
            offscreen()
        ],

        8: () => [
            sprite(`${tileType}-tileset`, { anim: 'br' }),
            offscreen()
        ],
    
        K: () => [
            sprite("items", {anim: "key"}),
            area(),
            offscreen(),
            scale(1),
            "key", 
        ],

        x: () => [
            sprite("items", {anim: "spike"}),
            pos(2, 4),
            area({ shape: new Rect(vec2(2, 12), 12, 4) }),
            "spike", 
            body({ isStatic: true }),
            offscreen(),
            scale(0.75)
        ],

        B: () => [
            sprite("items", {anim: "box"}),
            area(),
            body(),
            anchor("center"),
            offscreen(),
            scale(1),
            "box", 
        ],

        b: () => [
            area({ shape: new Rect(vec2(0), 16, 16) }), 
            body({ isStatic: true }),
            offscreen(),
            "bouncy"
        ],

        //ice
        i: () => [
            sprite("ice", {anim: "fl"}),
            area(), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],

        o: () => [
            sprite("ice", {anim: "fm"}),
            area(), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],

        p: () => [
            sprite("ice", {anim: "fr"}),
            area(), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],

        j: () => [
            sprite("ice", {anim: "gl"}),
            area(), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],

        k: () => [
            sprite("ice", {anim: "gm"}),
            area(), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],

        l: () => [
            sprite("ice", {anim: "gr"}),
            area(), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],

        g: () => [
            sprite("ice", {anim: "gs"}),
            area(), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],

        f: () => [
            sprite("ice", {anim: "fs"}),
            area(), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],

        p: () => [
            sprite("ice", {anim: "iceGround"}),
            area(), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],

        I: () => [
            area({ shape: new Rect(vec2(0), 192, 16) }), 
            body({ isStatic: true }),
            offscreen(),
            "ice"
        ],
        // ice end


        D: () => [
            area({ shape: new Rect(vec2(0), 16, 48)}),
            body({ isStatic: true }),
            offscreen(),
            "door"
        ],

        // o: () => [
        //     sprite("items", {anim: "portal_in"}),
        //     area({ shape: new Rect(vec2(0), 16, 14) }),
        //     offscreen(),
        //     "portal_in"
        // ],

        // O: () => [
        //     sprite("items", {anim: "portal_out"}),
        //     area(),
        //     offscreen(),
        //     "portal_out"
        // ],

        s: () => [
            sprite("items", {anim: "button_off"}),
            area({ shape: new Rect(vec2(4, 8), 8, 8)}),
            offscreen(),
            "button_off"
        ],

        F: () => [
            area({ shape: new Rect(vec2(0), 16, 48)}),
            offscreen(),
            "finish"
        ],

        _: () => [
            area({ shape: new Rect(vec2(0), 1600, 16)}),
            offscreen(),
            "dead"
        ],
    }
}