class UI {
    displayMainMenu() {
        add([sprite("menuBackground"), ])
        add([
            sprite("logo"),
            fixed(),
            area(),
            anchor("center"),
            pos(center().x, center().y),
            scale(1),
          ]);
    }

    
}

export const UIManager = new UI();