class UI {
    displayLevel(progress) {
        add([
          sprite("menuBackground"), 
          fixed(),
          scale(1),
        ]);
        
        add([
          sprite("1"),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4, center().y),
          scale(0.125),
          opacity(progress >= 0 ? 1 : 0.5),
          "1"
        ])

        add([
          sprite("2"),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4 * 3, center().y),
          scale(0.125),
          opacity(progress >= 1 ? 1 : 0.5),
          "2"
        ])

        add([
          sprite("3"),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4 * 5, center().y),
          scale(0.125),
          opacity(progress >= 2 ? 1 : 0.5),
          "3"
        ])

        add([
          sprite("4"),
          fixed(),
          anchor("center"),
          area(),
          pos(center().x / 4 * 7, center().y),
          scale(0.125),
          opacity(progress >= 3 ? 1 : 0.5),
          "4"
        ])
    }

    
}

export const UIManager = new UI();