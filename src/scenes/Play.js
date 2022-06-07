class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('bigBat', './assets/bigBat.png');
        this.load.image('smallBat', './assets/smallBat.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('heart', './assets/heart.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // gray UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x696969).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add bigBats (x2)
        this.bat02 = new BigBat(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'bigBat', 0, 25).setOrigin(0, 0);
        this.bat03 = new BigBat(this, game.config.width, borderUISize*6 + borderPadding*4, 'bigBat', 0, 25).setOrigin(0, 0);
        // add smallBat (x1)
        this.bat01 = new SmallBat(this, game.config.width + borderUISize*6, borderUISize*4, 'smallBat', 0, 100).setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or < for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.bat01.update();
            this.bat02.update();
            this.bat03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.bat03)) {
            this.p1Rocket.reset();
            this.batExplode(this.bat03);
        }
        if(this.checkCollision(this.p1Rocket, this.bat02)) {
            this.p1Rocket.reset();
            this.batExplode(this.bat02);
        }
        if(this.checkCollision(this.p1Rocket, this.bat01)) {
            this.p1Rocket.reset();
            this.batExplode(this.bat01);
        }
    }

    checkCollision(rocket, bat) {
        // simple AABB checking
        if (rocket.x < bat.x + bat.width && rocket.x + rocket.width > bat.x && rocket.y < bat.y + bat.height && rocket.height + rocket.y > bat.y) {
            return true;
        } else {
            return false;
        }
    }

    batExplode(bat) {
        // temporarily hide bat
        bat.alpha = 0;
        // create explosion sprite at the bat's position
        let boom = this.add.sprite(bat.x, bat.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => { // callback after anim completes
            bat.reset();
            bat.alpha = 1;
            boom.destroy();
        });
        // create particle emitter at the bat's position
        // help with coding this part was found on the following websites
        // https://phaser.io/examples/v3/view/game-objects/particle-emitter/create-emitter
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Particles.ParticleEmitter.html#toc66__anchor
        var particles = this.add.particles('heart');
        var emitter = particles.createEmitter();
        emitter.setPosition((bat.x + (bat.width / 2)), (bat.y + (bat.height / 2)));
        //emitter.emitParticleAt(bat.x, bat.y, 10);
        emitter.setSpeed(200);
        emitter.explode(20, this.x, this.y);
        //emitter.setBlendMode(Phaser.BlendModes.ADD);
        // score add and repaint
        this.p1Score += bat.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}
