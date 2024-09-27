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
            offscreen()
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

        9: () => [
            sprite(`${tileType}-tileset`, { anim: "tl" }),
            area({ shape: new Rect(vec2(0), 16, 3) }),
            "passthrough",
            body({ isStatic: true }),
            offscreen(),
        ],
        a: () => [
            sprite(`${tileType}-tileset`, { anim: "tm" }),
            area({ shape: new Rect(vec2(0), 16, 3) }),
            "passthrough",
            body({ isStatic: true }),
            offscreen(),
        ],
        b: () => [
            sprite(`${tileType}-tileset`, { anim: "tr" }),
            area({ shape: new Rect(vec2(0), 16, 3) }),
            "passthrough",
            body({ isStatic: true }),
            offscreen(),
        ],
        _: () => [
            sprite("plate"),
            area({ shape: new Rect(vec2(0), 32, 8) }),
            "button", 
            offscreen(),
            scale(0.5)
        ],

        x: () => [
            sprite("spike", {anim: "spike"}),
            area({ shape: new Rect(vec2(0), 8, 8) }),
            "spike", 
            body({ isStatic: true }),
            offscreen(),
            scale(2)
        ]
    }
}