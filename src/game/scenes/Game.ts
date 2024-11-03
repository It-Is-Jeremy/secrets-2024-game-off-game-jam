import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    platforms: Phaser.Physics.Arcade.StaticGroup;

    constructor ()
    {
        super('Game');
    }

    preload()
    {
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('unarmed_walking', 
            'assets/sprites/character/male/PNG/Unarmed_Walk/Unarmed_Walk_full.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.spritesheet('unarmed_idle', 
            'assets/sprites/character/male/PNG/Unarmed_Idle/Unarmed_Idle_full.png',
            { frameWidth: 64, frameHeight: 64 }
        );
    
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    

        this.player = this.physics.add.sprite(512, 384, 'unarmed_walking').setScale(1.5);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);



        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('unarmed_walking', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });


        this.anims.create({
            key: 'turn',
            frames: [ { key: 'unarmed_idle', frame: 0 } ],
            frameRate: 10,
            repeat: -1
        });
        
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('unarmed_walking', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

    
        this.player.anims.play('idle', true);
        EventBus.emit('current-scene-ready', this);
    }

    update(time: any, delta:any)
    {


        const cursors = this.input.keyboard!.createCursorKeys();

        if (cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
        
            this.player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            this.player.setVelocityX(160);
        
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
        
            this.player.anims.play('turn');
        }
        
        if (cursors.space.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
            
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
