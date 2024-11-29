export function generateMappings(tileType) {
    return {
        0: () => [
            sprite(`${tileType}-tileset`),
            area(), 
            body({ isStatic: true}), 
            offscreen({ hide: true }),
            "ground"
        ],

        1: () => [
            sprite(`${tileType}-tileset`, { anim: 'tm' }),
            area(), 
            body({ isStatic: true}), 
            offscreen({ hide: true }),
            "ground"
        ],

        2: () => [
            sprite(`${tileType}-tileset`, { anim: 'tr' }),
            area(), 
            body({ isStatic: true}), 
            offscreen({ hide: true }),
            "ground"
        ],

        3: () => [
            sprite(`${tileType}-tileset`, { anim: 'ml' }),
            area(), 
            body({ isStatic: true}), 
            offscreen({ hide: true }),
            "ground"
        ],

        4: () => [
            sprite(`${tileType}-tileset`, { anim: 'mm' }),
            offscreen({ hide: true }),
            "ground"
        ],

        5: () => [
            sprite(`${tileType}-tileset`, { anim: 'mr' }),
            area(), 
            body({ isStatic: true}), 
            offscreen({ hide: true }),
            "ground"
        ],

        6: () => [
            sprite(`${tileType}-tileset`, { anim: 'bl' }),
            offscreen()
        ],

        7: () => [
            sprite(`${tileType}-tileset`, { anim: 'bm' }),
            offscreen({ hide: true }),
            area(), 
            body({ isStatic: true}), 
            offscreen({ hide: true }),
            "ground"
        ],

        8: () => [
            sprite(`${tileType}-tileset`, { anim: 'br' }),
            offscreen({ hide: true }),
            area(), 
            body({ isStatic: true}), 
            offscreen({ hide: true }),
            "ground"
        ],
    
        K: () => [
            sprite("items", {anim: "key"}),
            area(),
            offscreen({ hide: true }),
            scale(1),
            "key", 
        ],

        x: () => [
            sprite("items", {anim: "spike"}),
            pos(2, 4),
            area({ shape: new Rect(vec2(2, 12), 12, 4) }),
            "spike", 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            scale(0.75)
        ],

        B: () => [
            sprite("items", {anim: "box"}),
            area(),
            body(),
            anchor("center"),
            offscreen({ hide: true }),
            scale(1),
            "box", 
        ],

        b: () => [
            sprite("obj", {anim: "bounceBase"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "bouncy"
        ],

        //ice
        i: () => [
            sprite("ice", {anim: "fl"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],

        o: () => [
            sprite("ice", {anim: "fm"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],

        t: () => [
            sprite("ice", {anim: "fr"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],

        j: () => [
            sprite("ice", {anim: "gl"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],

        k: () => [
            sprite("ice", {anim: "gm"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],

        l: () => [
            sprite("ice", {anim: "gr"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],

        g: () => [
            sprite("ice", {anim: "gs"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],

        f: () => [
            sprite("ice", {anim: "fs"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],

        p: () => [
            sprite("ice", {anim: "iceGround"}),
            area(), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],

        I: () => [
            area({ shape: new Rect(vec2(0), 192, 16) }), 
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "ice"
        ],
        // ice end


        D: () => [
            sprite("door", {anim: "closed"}),
            area({ shape: new Rect(vec2(0), 16, 48)}),
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "door"
        ],

        d: () => [
            sprite("doorBase"),
            area(),
            body({ isStatic: true }),
            offscreen({ hide: true }),
            "doorBase"
        ],

        // o: () => [
        //     sprite("items", {anim: "portal_in"}),
        //     area({ shape: new Rect(vec2(0), 16, 14) }),
        //     offscreen({ hide: true }),
        //     "portal_in"
        // ],

        // O: () => [
        //     sprite("items", {anim: "portal_out"}),
        //     area(),
        //     offscreen({ hide: true }),
        //     "portal_out"
        // ],

        s: () => [
            sprite("items", {anim: "button_off"}),
            area({ shape: new Rect(vec2(4, 8), 8, 8)}),
            offscreen({ hide: true }),
            "button_off"
        ],

        F: () => [
            sprite("obj", {anim: "finishClose"}),
            area(),
            offscreen({ hide: true }),
            "finish"
        ],

        _: () => [
            area({ shape: new Rect(vec2(0), 3200, 16)}),
            offscreen({ hide: true }),
            "spike"
        ],

        E: () => [
            sprite("easterEgg"),
            offscreen({ hide: true }),
            scale(0.04),
            z(50)
        ],

        e: () => [
            sprite("ground-tileset", { anim: 'mm' }),
            offscreen({ hide: true }),
            area(),
            body({ isStatic: true}),
            "ground"
        ]
    }
}