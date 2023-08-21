// Copyright (C) 2023  Annaluise Blume van Delden <hello@annalogue.codes>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import Phaser from 'phaser'
import { CONFIG, SCENES } from '../Constants'

// keys images
const BACKGROUND = 'background'
const CURSOR = 'cursor'
const FLARE = 'flare'
const FLAREANI = 'flareani'
const ATZI = 'atzi'
const ATZIIDLE = 'atziidle'
const ATZIBLINK = 'atziblink'
const FOX = 'fox'
const FOXIDLE = 'foxidle'
const FOXBREATH = 'foxbreath'

// keys sounds
const AMBIENT = 'ambient'
const MIAOW = 'miaow'
const PURR = 'purr'

const directions = ['LEFT', 'RIGHT', 'UP', 'DOWN'] as const
type Direction = typeof directions[number]

export default class CozyRoom extends Phaser.Scene {

	public particles!: Phaser.GameObjects.Particles.ParticleEmitter
	public cursor!: Phaser.GameObjects.Image

	constructor() {
		super( SCENES.COZYROOM )
	}

	init() {//
	}

	preload() {
		this.load.setBaseURL('./')

		// Images
		// load svg as bitmap: see https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Loader.LoaderPlugin-svg
		// this.load.svg('logo',   'logo.svg', { width: windowW, height: windowH } )
		this.load.image(BACKGROUND, 'images/cozyRoom.jpg')
		this.load.image(CURSOR, 'cursors/glowCircle_small.png')
		this.load.atlas(FLARE, 'particles/flares.png', 'particles/flares.json')
		this.load.atlas(ATZI, 'images/atzi.png', 'images/atzi.json')
		this.load.spritesheet('fox', 'images/fox.png', {
			frameWidth: 408,
			frameHeight: 297,
		})

		// Audio
		this.load.audio(AMBIENT, ['music/silent-wood.mp3'])
		this.load.audio(MIAOW, ['sounds/cute-creature-humming.webm'])
		this.load.audio(PURR, ['sounds/purr.webm'])
	}

	create() {
		// Visuals
		// store the width and height of the game screen
		const background = this.add.image(CONFIG.width / 2, CONFIG.height / 2, BACKGROUND)
			.setSize(       CONFIG.width, CONFIG.height)
			.setDisplaySize(CONFIG.width, CONFIG.height)

		const atzi = createAtzi(this)
		const fox = createFox(this)

		fox.on('pointerup', () => {
			if (this.scale.isFullscreen) {
				// scene.scale.stopFullscreen();
			} else {
				this.scale.startFullscreen()
				window.screen.orientation.unlock()
				window.screen.orientation.lock('landscape-primary')
					.catch((error) => {
						console.log( `Locking orientation failed with: ${error}` )
					});
			}
		})

		this.cursor = this.add.image(CONFIG.width - 0.2 * CONFIG.height, 0.8 * CONFIG.height, CURSOR)
			.setScale(0.6)
		this.cursor.tint = 0xfffff0

		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
			this.tweens.add({
				targets: this.cursor,
				x: pointer.x,
				y: pointer.y,
				duration: 100,
				ease: 'Sine.easeOut',
			})
			if (Phaser.Math.Between(1, 2) < 2) {
				this.particles.setConfig({
					scale: { start: 0.6, end: 0 },
					alpha: { start: 1, end: 0 },
					speed: { random: [ 2, 20 ] },
					lifespan: { random: [ 0, 2000 ]},
				})
				this.particles.emitParticle()
				this.particles.setConfig({
					scale: { start: 0.6, end: 2 },
					alpha: { start: 1, end: 0 },
					speed: 0,
					lifespan: 1500,
				})
			}
		}, this)
		// this.tweens.add({
		// 	targets: this.cursor,
		// 	props: { tint: { from: 0xffffff, to: 0xffffd0 } },
		// 	duration: 500,
		// 	yoyo: true,
		// 	ease: 'Sine.easeInOut',
		// 	repeat: -1,
		// })

		// const cursorGlow = this.cursor.postFX.addGlow(0xfffff0, 4, 0, true, 0.1, 32)
		// this.tweens.add({
  //           targets: cursorGlow,
  //           outerStrength: 8,
  //           yoyo: true,
  //           loop: -1,
  //           ease: 'sine.inout'
  //       });
		createFlare(this)

		this.input.setDefaultCursor('url(cursors/emptyDot.png), none');

		// Sound
		this.sound.play(AMBIENT, {
			volume: 0.4,
			loop: true
		})

		// Input
		// handleInput(scene)
	}

	update() {
		// this.updatePlayer()
	}
}

const createFlare = (scene: CozyRoom) => {
	scene.particles = scene.add.particles(0, 0, CURSOR, {
		// frame: [ 'blue', 'green', 'red', 'white', 'yellow' ],
		frame: 0,
		blendMode: 'ADD',
		speed: 0,
		quantity: 1,
		frequency: 6000,
		scale: { start: 0.6, end: 2 },
		alpha: { start: 1, end: 0 },
		// rotate: { start: 0, end: Phaser.Math.Between(0, 360) },
		lifespan: 1500,
		emitting: true,
	})

	// const circle = new Phaser.Geom.Circle(0, 0, 150);
	// scene.particles.addEmitZone({ type: 'edge', source: circle, quantity: 64, total: 128 })

	scene.particles.startFollow( scene.cursor )
}

const createAtzi = (scene: Phaser.Scene) => {

	const atzi = scene.physics.add.sprite(100, 450, ATZI, 2)
		.setScale(1)

	// Animations
	scene.anims.create({
		key: ATZIIDLE,
		// frames: [ { key: ATZI, frame: 0 } ],
		frames: scene.anims.generateFrameNumbers( ATZI, { start: 0, end: 10 } ),
		frameRate: 10,
		repeat: 4,
	});
	scene.anims.create({
		key: ATZIBLINK,
		frames: scene.anims.generateFrameNumbers( ATZI, { start: 4, end: 9 } ),
		frameRate: 10,
		// repeat: -1,
	})

	atzi.on('animationcomplete-' + ATZIIDLE, () => {
		const rnd = Phaser.Math.Between(1, 2)
		atzi.anims.play( { key: ATZIBLINK, repeat: rnd })
	})
	atzi.on('animationcomplete-' + ATZIBLINK, () => {
		const rnd = Phaser.Math.Between(6, 12)
		atzi.anims.play( { key: ATZIIDLE, repeat: rnd })
	})

	atzi.anims.play(ATZIIDLE)

	// Interactivity
	atzi.setInteractive()

	const miaow = scene.sound.add(MIAOW)
	miaow.on('complete', () => {
		atzi.once('pointerover', () => {
			miaow.play({ volume: 0.3 })
		})
	})
	atzi.once('pointerover', () => {
		miaow.play({ volume: 0.3 })
	})

	return atzi
}

const createFox = (scene: Phaser.Scene) => {

	const fox = scene.physics.add.sprite(676, 550, 'fox', 0)
		.setScale(0.415)

	// Animations
	scene.anims.create({
		key: FOXIDLE,
		// frames: [ { key: ATZI, frame: 0 } ],
		frames: scene.anims.generateFrameNumbers( 'fox', { start: 0, end: 0 } ),
		frameRate: 2,
		repeat: 4,
	});
	scene.anims.create({
		key: FOXBREATH,
		frames: scene.anims.generateFrameNumbers( 'fox', { start: 0, end: 3 } ),
		frameRate: 3,
		yoyo: true,
		// repeat: -1,
	})

	fox.on('animationcomplete-' + FOXIDLE, () => {
		// const rnd = Phaser.Math.Between(0, 1)
		// fox.anims.play( { key: FOXBREATH, repeat: rnd })
		fox.anims.play( { key: FOXBREATH, repeat: 0 })
	})
	fox.on('animationcomplete-' + FOXBREATH, () => {
		const rnd = Phaser.Math.Between(6, 12)
		fox.anims.play( { key: FOXIDLE, repeat: rnd })
	})

	fox.anims.play(FOXIDLE)

	// Interactivity
	fox.setInteractive()

	const purr = scene.sound.add(PURR)
	purr.on('complete', () => {
		fox.once('pointerover', () => {
			purr.play({ volume: 1 })
		})
	})
	purr.on('stop', () => {
		fox.once('pointerover', () => {
			purr.play({ volume: 1 })
		})
	})
	fox.once('pointerover', () => {
		purr.play({ volume: 1 })
	})
	fox.on('pointerout', () => {
		const tween = scene.tweens.add({
			targets:  scene.sound.getAll(PURR),
			volume:   0,
			duration: 500
		})
		tween.once('complete', () => {
			purr.stop()
		})

	})

	return fox
}
