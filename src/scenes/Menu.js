class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'FEED THE BATS!', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use < > Arrows to move & (F) to feed!', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#000000';
        menuConfig.color = '#FFFFFF';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press < for Novice or > for Expert', menuConfig).setOrigin(0.5);
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // this.add.text(20, 20, "Rocket Patrol Menu");
        // this.scene.start("playScene");
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                bigBatSpeed: 3,
                smallBatSpeed: 7,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                bigBatSpeed: 4,
                smallBatSpeed: 8,
                gameTimer: 45000
            }
            this.sound.play('sfx_select')
            this.scene.start('playScene')
        }
    }
}
