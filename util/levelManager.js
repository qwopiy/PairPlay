import { Level1Config } from "../content/level1/config.js"

export class Level {
    drawWaves(type) {
        let offset = -100
        for (let i = 0; i < 26; i++) {
          add([sprite(type), pos(offset, 700), scale(Level1Config.Scale), fixed()])
          offset += 64
        }
      } //ini buat bikin lava ikut kamera

    drawMapLayout(levelLayout, mappings) {
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
            layer.use(scale(Level1Config.Scale));
        }
    }    //ini buat bikin map

    drawBackground(bgSpriteName) {
        add([sprite(bgSpriteName), fixed(), scale(1)]);
    }   //ini buat bikin background

}