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

import { game, getState, addState, w, h, s } from '../constants'
import { debug } from '../utils/general'
import * as Up from '../utils/phaser'
import * as Set from '../utils/set'
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
		super( game.scenes.ENTRANCE )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Inventory.load({ game: game, scene: this })
		Up.loadAssets({ game: game, scene: this })
	}

	// update() {
	// }
}


function go ( scene: Phaser.Scene ): void {
	// Game has started
	addState({ hasStarted: true })

	//Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.ENTRANCE.BACKGROUND.key }).setDepth( 10 )
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.AMBIENCE.CITYRAIN.key, volume: game.soundsPersistant.AMBIENCE.CITYRAIN.volume, fadeIn: [game.scenes.FASSADE].includes(getState().currentScene) ? 0 : 2000 })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.AMBIENCE.LOFI.key, volume: game.soundsPersistant.AMBIENCE.LOFI.volume, fadeIn: 0 })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.AMBIENCE.JAZZ.key, volume: getState().entranceopen ? jazzVolume : 0 })

	// Objects

	// Stray items
	if ( getState().metAtze && !Set.toArray( getState().inventory ).includes( 'knife' ) ) {
		const knife = scene.add.image( 60 * s, 370 * s, game.images.ENTRANCE.knife.key ).setInteractive().setDepth( 100 ).setAngle( -20 ).setScale( 1.3 )
		knife.on( 'pointerup', () => { Inventory.add( 'knife', knife ) })
	}



	const inner = scene.add.image( 0.26 * w, 0.21 * h, game.images.ENTRANCE.INNER.key )
		.setOrigin( 0, 0 )
		.setDepth( 1 )
		.setInteractive()
	const doorLeft = scene.add.image( doorLeftXClosed, doorLeftY, game.images.ENTRANCE.DOORLEFT.key )
		.setOrigin( 0, 0 )
		.setDepth( 5 )
	const doorRight = scene.add.image( doorRightXClosed, doorRightY, game.images.ENTRANCE.DOORRIGHT.key )
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

	if (getState().entranceopen) {
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
	Up.addExit({
		game: game,
		scene: scene,
		exit: fassadeAreaOne,
		nextScene: game.scenes.FASSADE,
		soundsToKeep: [
			game.soundsPersistant.AMBIENCE.CITYRAIN,
			game.soundsPersistant.AMBIENCE.JAZZ,
		],
	})
	Up.addExit({
		game: game,
		scene: scene,
		exit: fassadeAreaTwo,
		nextScene: game.scenes.FASSADE,
		soundsToKeep: [
			game.soundsPersistant.AMBIENCE.CITYRAIN,
			game.soundsPersistant.AMBIENCE.JAZZ,
		],
	})
	Up.addExit({
		game: game,
		scene: scene,
		exit: inner,
		nextScene: game.scenes.FOYER,
		soundsToKeep: [
			game.soundsPersistant.AMBIENCE.JAZZ,
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

	const woman = addWoman({ scene: scene })
	woman.off( Phaser.Input.Events.POINTER_UP )
	woman.once( Phaser.Input.Events.POINTER_UP, () => {
		womanSpeak({ woman: woman, delay: 0,
			pre:  () => { scene.events.emit( 'soloOn', { solo: 'woman' } ) },
			post: () => { scene.events.emit( 'soloOff' ) },
		})
	})
	if ( !getState().womanHasSpoken ) womanSpeak({ woman: woman,
		pre:  () => { scene.events.emit( 'soloOn', { solo: 'woman' } ) },
		post: () => { scene.events.emit( 'soloOff' ) },
	})

	scene.add.particles(0, 50 * s, game.images.ENTRANCE.RAINDROP.key, {
		// gravityY: 200,
		x: { min: 0, max: w },
		y: -100 * s,
		frequency: 100,
		lifespan: {min: 5000, max: 6000},
		// speedY: { min: 50, max: 350 },
		speedY: { min: 75 * s, max: 175 * s },
		scaleX: { min: 1, max: 2 },
		scaleY: { min: 1, max: 4 },
		quantity: 1,
		blendMode: 'ADD',
	}).setDepth( 20 )

	console.log(`${scene.scene.key} created.`)
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
	const duration = p.now ? 0 : 1500

	const lofi = scene.sound.get( game.soundsPersistant.AMBIENCE.LOFI.key )
	const jazz = scene.sound.get( game.soundsPersistant.AMBIENCE.JAZZ.key )
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
			addState({ entranceopen: true })
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

	const lofi = scene.sound.get( game.soundsPersistant.AMBIENCE.LOFI.key )
	const jazz = scene.sound.get( game.soundsPersistant.AMBIENCE.JAZZ.key )
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
			addState({ entranceopen: false })
		},
		onComplete: () => {
			p.doorArea.setDepth( 11 )
		}
	})
}

function addWoman (p: { scene: Phaser.Scene }): Phaser.GameObjects.Sprite {
	const woman = p.scene.add.sprite( 0.62 * w, 0.45 * h, game.sprites.ENTRANCE.WOMANINPOSTER.key, 0 )
		.setOrigin( 0, 0 )
		.setDepth( 12 )
		.setInteractive()

	woman.anims.create({
		key: 'womanSpeaking',
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			// next iteration
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 0,
				end: 6,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 5,
				end: 3,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 4,
				end: 7,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 6,
				end: 3,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 4,
				end: 9,
			}),
			// next iteration
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 0,
				end: 6,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 5,
				end: 3,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 4,
				end: 7,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 6,
				end: 3,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 4,
				end: 9,
			}),
			// next iteration
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 0,
				end: 6,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 5,
				end: 3,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 4,
				end: 7,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 6,
				end: 3,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 4,
				end: 9,
			}),
			...woman.anims.generateFrameNumbers( game.sprites.ENTRANCE.WOMANINPOSTER.key, {
				start: 0,
				end: 0,
			}),
		],
	})

	return woman
}
function womanSpeak (p: {
	woman: Phaser.GameObjects.Sprite,
	delay?: number,
	pre?: () => void,
	post?: () => void
}): void {
	if (p.pre) p.pre()
	const speech = p.woman.scene.sound.get( game.sounds.ENTRANCE.WOMANINPOSTER.key )
	speech.off( Phaser.Sound.Events.COMPLETE )
	speech.once( Phaser.Sound.Events.COMPLETE, () => {
		p.woman.anims?.stopOnFrame( p.woman.anims.get( 'womanSpeaking' ).frames[0] )
		p.woman.off( Phaser.Input.Events.POINTER_UP )
		p.woman.once( Phaser.Input.Events.POINTER_UP, () => {
			womanSpeak({ woman: p.woman, delay: 0, pre: p.pre, post: p.post })
		})
		if (p.post) p.post()
	})
	addState({ womanHasSpoken: true })
	const d = (p.delay === undefined) ? 4 : p.delay
	speech.play({ volume: game.sounds.ENTRANCE.WOMANINPOSTER.volume, delay: d + 0.7 })
	p.woman.playAfterDelay( 'womanSpeaking', d * 1000 + 50 )
}

// declare global {
// 	/* eslint-disable no-var */
// 	var cat: any
// 	var motions: any
// 	/* eslint-enable no-var */
// }
