PIXI.Assets.add('asd1', './images/r1.png')
    PIXI.Assets.add('asd2', './images/r2.png')
    PIXI.Assets.add('asd3', './images/r3.png')
    PIXI.Assets.add('asd4', './images/r4.png')
    PIXI.Assets.add('asd5', './images/r5.png')
    PIXI.Assets.add('asd6', './images/r6.png')
    PIXI.Assets.add('red', './images/red.png')
    PIXI.Assets.add('blue', './images/blue.png')

    PIXI.Assets.load(['asd1', 'asd2', 'asd3', 'asd4', 'asd5', 'asd6', 'blue', 'red'], showProgress)
        .then(textures => {
            console.log(textures)
            Object.keys(textures).map(asset => {
                const sprite = PIXI.Sprite.from(textures[asset])
                sprite.anchor.set(0.5)

                if (asset === red || asset === blue) {
                    sprite.x = app.view.width / 2;
                    sprite.y = app.view.height / 2;
                } else {
                    sprite.x = Math.floor(Math.random() * (app.view.width - 1));
                    sprite.y = Math.floor(Math.random() * (app.view.height - 1));
                }
                
                app.stage.addChild(sprite)
            })
            return textures
        })
        .then(textures => {
            console.log(PIXI,app);
            console.log('textures2', textures)
        });