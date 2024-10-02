export function generateMappings(tileType) {
    return {
        0: () => [
            sprite(`${tileType}-tileset`),
            area(), 
            body({ isStatic: true}), 
            offscreen()
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
            offscreen()
        ],

        3: () => [
            sprite(`${tileType}-tileset`, { anim: 'ml' }),
            area(), 
            body({ isStatic: true}), 
            offscreen()
        ],

        4: () => [
            sprite(`${tileType}-tileset`, { anim: 'mm' }),
            offscreen()
        ],

        5: () => [
            sprite(`${tileType}-tileset`, { anim: 'mr' }),
            area(), 
            body({ isStatic: true}), 
            offscreen()
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
    
        k: () => [
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

        i: () => [
            area({ shape: new Rect(vec2(0), 16, 16) }), 
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

        D: () => [
            area({ shape: new Rect(vec2(0), 16, 48)}),
            body({ isStatic: true }),
            offscreen(),
            "door"
        ],

        o: () => [
            sprite("items", {anim: "portal_in"}),
            area(),
            offscreen(),
            "portal_in"
        ],

        O: () => [
            sprite("items", {anim: "portal_out"}),
            area(),
            offscreen(),
            "portal_out"
        ],

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
    }
}