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

import { game, w, h, s } from '../constants'
import { debug } from '../utils/general'
import { addExit} from '../utils/phaser/exit'

import * as Up from '../utils/phaser/common'
import * as Audio from '../utils/phaser/audio'
import * as Inventory from '../utils/inventory'
import * as Cat from '../sprites/cat'

/* Main part */

const doorLeftXClosed = 0.2875 * w
const doorLeftXOpen = 0.1875 * w
const doorRightXClosed = 0.40625 * w
const doorRightXOpen = 0.5125 * w
const doorLeftY  = 0.23333 * h
const doorRightY = 0.23333 * h

const jazzVolume = 0.1
const lofiVolume = 0.4

export default class Entrance extends Phaser.Scene {

	constructor() {
		super( game.scenes.Entrance )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Up.assets.load({ game: game, scene: this })
		Inventory.load({ game: game, scene: this })
	}

	// update() {
	// }
}


function go ( scene: Phaser.Scene ): void {
	// Game has started
	game.state.add({ hasStarted: true })

	//Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.entrance.background.key }).setDepth( 10 )
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.cityrain.key, volume: game.soundsPersistant.ambience.cityrain.volume, fadeIn: [game.scenes.Fassade].includes(game.state.get().currentScene) ? 0 : 2000 })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.lofi.key, volume: game.soundsPersistant.ambience.lofi.volume, fadeIn: 0 })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.jazz.key, volume: game.state.get().entranceopen ? jazzVolume : 0 })

	const buehne = Audio.get({ scene, keyAndVolume: game.sounds.entrance.womanbuehne })
	const welcome = Audio.get({ scene, keyAndVolume: game.sounds.entrance.womaninposter })
	const foundKnife = Audio.get({ scene, keyAndVolume: game.sounds.entrance.womanknife })

	let speech = welcome
	let speechTimer: Phaser.Time.TimerEvent

	function womanSpeak (p: {
		woman: Phaser.GameObjects.Sprite,
		soundAndVolume: Audio.SoundAndVolume,
		delay?: number,
	}): void {
		speechTimer?.remove()
		speech = p.soundAndVolume

		speech.sound.off('stop').once( 'stop', () => resetWoman() )
		speech.sound.off('complete').once( 'complete', () => {
			resetWoman()
		})

		const d = (p.delay === undefined) ? 0 : p.delay
		speechTimer = scene.time.delayedCall( d, () => {
			speech.sound.play({ volume: speech.volume, delay: 0.5 })
			p.woman.play('womanSpeaking')
		})
	}

	const woman = addWoman({ scene: scene })

	// IMPROVE: factor this into addWoman and rename addWoman to createWoman.
	function resetWoman () {
		woman.anims?.stopOnFrame( woman.anims.get( 'womanSpeaking' ).frames[0] )
		woman.off('pointerup').once( 'pointerup', () => {
			const topic = ( game.state.get().peopleFound.length > game.state.get().peopleFoundPrevious.length ) ? buehne : welcome
			womanSpeak({ woman: woman, soundAndVolume: topic, delay: 0 })
		})
	}

	if ( game.state.get().peopleFound.length > game.state.get().peopleFoundPrevious.length ) {
		womanSpeak({ woman: woman,
			soundAndVolume: buehne,
			delay: 2500,
		})
	} else if ( !game.state.get().womanWelcomed ) {
		womanSpeak({ woman: woman,
			soundAndVolume: welcome,
			delay: 2500,
		})
		game.state.add({ womanWelcomed: true })
	} else {
		resetWoman()
	}

	// Stray items
	if ( game.state.get().arrivedAtWimmelbild && !game.state.get().inventory.includes('knife') ) {
		const chest = Inventory.createChest({ game, scene })

		const knife = scene.add.image( 60 * s, 370 * s, game.images.entrance.knife.key ).setInteractive().setDepth( 100 ).setAngle( -20 ).setScale( 1.3 )
		knife.off('pointerup').once( 'pointerup', () => {
			speech.sound.stop()
			woman.off( Phaser.Input.Events.POINTER_UP )
			chest.foundItem({ item: 'knife', image: knife })
			womanSpeak({ woman: woman, soundAndVolume: foundKnife, delay: 2000 })
		})
	}

	// Objects

	const inner = scene.add.image( 0.26 * w, 0.21 * h, game.images.entrance.inner.key )
		.setOrigin( 0, 0 )
		.setDepth( 1 )
		.setInteractive()
	const doorLeft = scene.add.image( doorLeftXClosed, doorLeftY, game.images.entrance.doorleft.key )
		.setOrigin( 0, 0 )
		.setDepth( 5 )
	const doorRight = scene.add.image( doorRightXClosed, doorRightY, game.images.entrance.doorright.key )
		.setOrigin( 0, 0 )
		.setDepth( 5 )

	const doorArea = scene.add.rectangle( 0.28 * w, 0.22 * h, 0.26 * w, 0.58 * h, 0x553366)
		.setOrigin( 0, 0 )
		.setDepth( 11 )
		.setInteractive()
	doorArea.alpha = debug ? 0.5 : 0.001
	doorArea.off( Phaser.Input.Events.POINTER_UP )
	doorArea.on( Phaser.Input.Events.POINTER_UP, () => {
		onDoors({ doorLeft: doorLeft, doorRight: doorRight, doorArea: doorArea })
	})

	if (game.state.get().entranceopen) {
		onDoors({ doorLeft: doorLeft, doorRight: doorRight, doorArea: doorArea, now: true })
	}

	const fassadeAreaOne = scene.add.rectangle( 0, 0, 0.16 * w, 0.65 * h, 0x553366)
		.setOrigin( 0, 0 )
		.setDepth( 11 )
		.setInteractive()
	fassadeAreaOne.alpha = debug ? 0.5 : 0.001
	const fassadeAreaTwo = scene.add.rectangle( 0.15 * w, 0.93 * h, 0.45 * w, 1 * h, 0x553366)
		.setOrigin( 0, 0 )
		.setDepth( 11 )
		.setInteractive()
	fassadeAreaTwo.alpha = debug ? 0.5 : 0.001
	addExit({
		game: game,
		scene: scene,
		exit: fassadeAreaOne,
		nextScene: game.scenes.Fassade,
		soundsToKeep: [
			game.soundsPersistant.ambience.cityrain,
			game.soundsPersistant.ambience.jazz,
		],
	})
	addExit({
		game: game,
		scene: scene,
		exit: fassadeAreaTwo,
		nextScene: game.scenes.Fassade,
		soundsToKeep: [
			game.soundsPersistant.ambience.cityrain,
			game.soundsPersistant.ambience.jazz,
		],
	})
	addExit({
		game: game,
		scene: scene,
		exit: inner,
		nextScene: game.scenes.Foyer,
		soundsToKeep: [
			game.soundsPersistant.ambience.jazz,
		],
	})

	const cat = Cat.newCat( scene, 615 * s, 402 * s, 1.5 )
	cat.follower.setDepth( 15 )
	cat.follower.setFlipX( false )
	cat.randomSounds = [
		cat.sounds.meow,
		cat.sounds.meow,
		cat.sounds.meowmeowmeow,
	]
	cat.soundTimeInterval = [10, 40]
	Cat.playRandomCatSounds({ cat: cat, preDelay: true })

	scene.add.particles(0, 50 * s, game.images.entrance.raindrop.key, {
		// gravityY: 200,
		x: { min: 0, max: w },
		y: -100 * s,
		frequency: 100,
		lifespan: {min: 5000, max: 6000},
		speedY: { min: 125 * s, max: 250 * s },
		scaleX: { min: 1, max: 2 },
		scaleY: { min: 1, max: 4 },
		quantity: 1,
		blendMode: 'ADD',
	}).setDepth( 20 )
}

function onDoors (p: {
	doorLeft: Phaser.GameObjects.Image,
	doorRight: Phaser.GameObjects.Image,
	doorArea: Phaser.GameObjects.Rectangle,
	now?: boolean,
}): void {
	p.doorArea.setDepth(0)
	const scene = p.doorLeft.scene
	const ease = Phaser.Math.Easing.Cubic.InOut
	const duration = p.now ? 1 : 1500

	const lofi = scene.sound.get( game.soundsPersistant.ambience.lofi.key )
	const jazz = scene.sound.get( game.soundsPersistant.ambience.jazz.key )
	scene.tweens.add({
		targets: lofi,
		volume: 0,
		duration: duration,
	})
	scene.tweens.add({
		targets: jazz,
		volume: jazzVolume,
		duration: duration,
	})
	scene.tweens.add({
		targets: p.doorLeft,
		x: doorLeftXOpen,
		duration: duration,
		ease: ease,
	})
	scene.tweens.add({
		targets: p.doorRight,
		x: doorRightXOpen,
		duration: duration,
		ease: ease,
		onStart: () => {
			game.state.add({ entranceopen: true })
		},
		onComplete: () => { closeDoors({ doorLeft: p.doorLeft, doorRight: p.doorRight, doorArea: p.doorArea, now: p.now }) },
	})
}
function closeDoors (p: {
	doorLeft: Phaser.GameObjects.Image,
	doorRight: Phaser.GameObjects.Image,
	doorArea: Phaser.GameObjects.Rectangle,
	now?: boolean,
}): void {
	const scene = p.doorLeft.scene
	const ease = Phaser.Math.Easing.Cubic.InOut
	const duration = 1500
	const delay = p.now ? 3000 : 7000

	const lofi = scene.sound.get( game.soundsPersistant.ambience.lofi.key )
	const jazz = scene.sound.get( game.soundsPersistant.ambience.jazz.key )
	scene.tweens.add({
		targets: lofi,
		volume: lofiVolume,
		duration: duration,
		delay: delay,
	})
	scene.tweens.add({
		targets: jazz,
		volume: 0,
		duration: duration,
		delay: delay,
	})
	scene.tweens.add({
		targets: p.doorLeft,
		x: doorLeftXClosed,
		ease: ease,
		duration: duration,
		delay: delay,
	})
	scene.tweens.add({
		targets: p.doorRight,
		x: doorRightXClosed,
		ease: ease,
		duration: duration,
		delay: delay,
		onStart: () => {
			game.state.add({ entranceopen: false })
		},
		onComplete: () => {
			p.doorArea.setDepth( 11 )
		}
	})
}

function addWoman (p: { scene: Phaser.Scene }): Phaser.GameObjects.Sprite {
	const woman = p.scene.add.sprite( 0.62 * w, 0.45 * h, game.sprites.entrance.womaninposter.key, 0 )
		.setOrigin( 0, 0 )
		.setDepth( 12 )
		.setInteractive()

	woman.anims.create({
		key: 'womanSpeaking',
		frameRate: 6,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...woman.anims.generateFrameNumbers( game.sprites.entrance.womaninposter.key, {
				start: 0,
				end: 6,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.entrance.womaninposter.key, {
				start: 5,
				end: 3,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.entrance.womaninposter.key, {
				start: 4,
				end: 7,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.entrance.womaninposter.key, {
				start: 6,
				end: 3,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.entrance.womaninposter.key, {
				start: 4,
				end: 9,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.entrance.womaninposter.key, {
				start: 0,
				end: 0,
			}),
		],
	})

	return woman
}

// declare global {
// 	/* eslint-disable no-var */
// 	var cat: any
// 	var motions: any
// 	/* eslint-enable no-var */
// }
