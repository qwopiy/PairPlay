class UI {
    displayLevel(progress) {
        add([
          sprite("background"), 
          fixed(),
          scale(1),
        ]);
        
        add([
          sprite("1"),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4, center().y - 100),
          scale(0.125),
          opacity(progress >= 0 ? 1 : 0.5),
          "1"
        ])

        add([
          sprite("2"),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4 * 3, center().y - 100),
          scale(0.125),
          opacity(progress >= 1 ? 1 : 0.5),
          "2"
        ])

        add([
          sprite("3"),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4 * 5, center().y - 100),
          scale(0.125),
          opacity(progress >= 2 ? 1 : 0.5),
          "3"
        ])

        add([
          sprite("4"),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4 * 7, center().y - 100),
          scale(0.125),
          opacity(progress >= 3 ? 1 : 0.5),
          "4"
        ])

        add([
          // sprite("5"),
          rect(320, 320),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4 * 2, center().y + 100),
          scale(0.125),
          opacity(progress >= 4 ? 1 : 0.5),
          "5"
        ])
        add([
          // sprite("6"),
          rect(320, 320),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4 * 6, center().y + 100),
          scale(0.125),
          opacity(progress >= 5 ? 1 : 0.5),
          "6"
        ])
    };

    UIButton() {
        add([
          sprite("pauseButtons", { anim: "pause" }),
          scale(3),
          pos(width() - 96, 16),
          area(),
          fixed(),
          z(100),
          "pause"
        ])
    };

    pauseMenu() {
      const pauseMenu = {
        bg: add([
          rect(width(), height()),
          color(0,0,0),
          pos(0,0),
          fixed(),
          opacity(0.5),
          z(99),
          "bg",
          "pauseMenu"
        ]),
        
        box1: add([
          rect(32 * 20, 32 * 10),
          color("e0f0ea"),
          anchor("center"),
          pos(center().x, center().y),
          fixed(),
          z(100),
          "pauseMenu"
        ]),

        box2: add([
          rect(32 * 13, 32 * 5),
          color("3c2a4d"),
          anchor("center"),
          pos(center().x - 72, center().y - 54),
          fixed(),
          z(101),
          "pauseMenu"
        ]),

        resume: add([
          sprite("pauseButtons", { anim: "resume" }),
          area(),
          scale(3),
          anchor("center"),
          pos(center().x + 32 * 6, center().y + 96),
          fixed(),
          z(102),
          "resume",
          "pauseMenu"
        ]),

        restart: add([
          sprite("pauseButtons", { anim: "restart" }),
          area(),
          scale(3),
          anchor("center"),
          pos(center().x, center().y + 96),
          fixed(),
          z(102),
          "restart",
          "pauseMenu"
        ]),

        exit: add([
          sprite("pauseButtons", { anim: "exit" }),
          area(),
          scale(3),
          anchor("center"),
          pos(center().x - 32 * 6, center().y + 96),
          fixed(),
          z(102),
          "exit",
          "pauseMenu"
        ]),

        music: add([
          sprite("pauseButtons", { anim: "music" }),
          area(),
          scale(2),
          anchor("center"),
          pos(center().x + 32 * 7, center().y - 96),
          fixed(),
          z(102),
          "music",
          "pauseMenu"
        ]),

        SFX: add([
          sprite("pauseButtons", { anim: "SFX" }),
          area(),
          scale(2),
          anchor("center"),
          pos(center().x + 32 * 7, center().y),
          fixed(),
          z(102),
          "SFX",
          "pauseMenu"
        ]),

        text: add([
          text(""),
          anchor("center"),
          pos(center().x - 80, center().y - 54),
          fixed(),
          scale(2),
          z(1000),
          "pauseMenu"
        ]),
      }
      for (const obj in pauseMenu) {
        pauseMenu[obj].hidden = true;
      }
      return pauseMenu;
    }

    easteregg() {
      const easteregg = add([
        sprite("easterEgg"),
        area(),
        scale(2),
        anchor("center"),
        pos(center().x, center().y),
        fixed(),
        scale(1),
        z(1000)
      ])
      play("boom", {
        volume: 1,
      })

      onClick(() => {
        destroy(easteregg)
      })
    }

    win() {
      const win = {
        bg: add([
          rect(width(), height()),
          color(0,0,0),
          pos(0,0),
          fixed(),
          opacity(0.5),
          z(99),
          "bg",
          "pauseMenu"
        ]),
        pic: add([
          sprite("win"),
          area(),
          scale(0.5),
          anchor("center"),
          pos(center().x, center().y - 100),
          fixed(),
          z(1000)
        ]),
        text: add([
          text("You win!"),
          anchor("center"),
          pos(center().x, center().y + 200),
          fixed(),
          scale(2),
          z(1000)
        ]),
      }
      play("key")
      onClick(() => {
        for (const obj in win) {
          destroy(win[obj])
        }
      })
    }
}

export const UIManager = new UI();