export class Level {
    drawLava() {
        let offset = -100
        for (let i = 0; i < 26; i++) {
          add([sprite("obj", { anim: "lava"}), pos(offset, 675), scale(4), fixed()])
          offset += 64
        }
      } //ini buat bikin lava ikut kamera

    drawMapLayout(levelLayout, mappings, Scale) {
        const layerSettings = {
            tileWidth : 16,
            tileHeight : 16, 
            tiles : mappings
        }

        this.map = []
        for (const layerLayout of levelLayout) {
            this.map.push(addLevel(layerLayout, layerSettings));
        }
        
        for (const layer of this.map) {
            layer.use(scale(Scale));
        }
    }    //ini buat bikin map

    drawBackground(bgSpriteName) {
        add([sprite(bgSpriteName), fixed(), scale(0.80)]);
    }   //ini buat bikin background

}