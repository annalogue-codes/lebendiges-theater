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
import { debug, log } from '../utils/general'
import * as Ug from '../utils/general'
import * as Up from '../utils/phaser'
import * as Cat from '../sprites/cat'

/* Main part */

// const jazzVolume = 0.1
// const lofiVolume = 0.4

export default class Stagedoor extends Phaser.Scene {

	constructor() {
		super( game.scenes.STAGEDOOR )
	}

	// init() {//
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Up.loadAssets({ game: game, scene: this })
	}

	// update() {//
	// }
}

function go ( scene: Phaser.Scene ): void {
	//Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.STAGEDOOR.BACKGROUND.key })
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPERSISTANT.AMBIENCE.LOFI.key, volume: game.soundsPERSISTANT.AMBIENCE.LOFI.volume })
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPERSISTANT.AMBIENCE.JAZZ.key, volume: getState().entranceopen ? jazzVolume : 0 })

	// Sounds
	const welcome = Up.audio.add({ scene: scene, sound: game.sounds.STAGEDOOR.welcome })
	// Objects
	// Cat
	const cat = Cat.newCat( scene, 375 * s, 305 * s, 0.8 )
	cat.follower.setDepth( 15 )
	cat.follower.setFlipX( true )
	cat.randomSounds = [
		cat.sounds.meow,
		cat.sounds.meow,
		cat.sounds.meowmeowmeow,
	]
	Cat.playRandomCatSounds({ cat: cat, preDelay: true })
	// motions.jumpFromStairs({ cat: cat })

	// Bouncer
	const bouncer = scene.add.rectangle( 485 * s, 100 * s, 160 * s, 350 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 25 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	scene.add.image(                      495 * s, 118 * s, game.images.STAGEDOOR.BOUNCER.key ).setOrigin( 0 ).setDepth( 10 )
	const bouncerHead = scene.add.sprite( 514 * s, 115 * s, game.sprites.STAGEDOOR.BOUNCERHEAD.key ).setOrigin( 0 ).setDepth( 11 )
	const bouncerArm  = scene.add.sprite( 374 * s, 226 * s, game.sprites.STAGEDOOR.BOUNCERARM.key, 3 ).setOrigin( 0 ).setDepth( 11 )
	bouncerHead.anims.create({
		key: 'blink',
		frameRate: 6,
		repeat: 1,
		yoyo: true,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERHEAD.key, {
				start: 0, end: 3,
			}),
		],
	})
	bouncerHead.anims.create({
		key: 'blink-quick',
		frameRate: 8,
		repeat: 0,
		yoyo: true,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERHEAD.key, {
				start: 0, end: 2,
			}),
		],
	})
	bouncerHead.anims.create({
		key: 'talk',
		frameRate: 5,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERHEAD.key, {
				start: 7, end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERHEAD.key, {
				start: 5, end: 7,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERHEAD.key, {
				frames: [ 5, 4, 6, 5, 4, 7 ],
			}),
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERHEAD.key, {
				start: 7, end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERHEAD.key, {
				start: 5, end: 7,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERHEAD.key, {
				frames: [ 5, 4, 6, 5, 4, 7 ],
			}),
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERHEAD.key, {
				frames: [ 1, 2, 3, 2, 1 ],
			}),
		],
	})
	let pendingBlink: Phaser.Time.TimerEvent
	bouncerHead.off( Phaser.Animations.Events.ANIMATION_COMPLETE )
	bouncerHead.on(  Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
		const delay = Ug.randomInt( 1000, 12000 )
		const dice = Math.random()
		const key = ( dice < 0.7 ) ? 'blink' : 'blink-quick'
		pendingBlink = scene.time.delayedCall( delay, () => { bouncerHead.play({key: key, repeat: Math.round(1 - dice) }) } )
	})
	bouncer.off( Phaser.Input.Events.POINTER_UP )
	bouncer.on( Phaser.Input.Events.POINTER_UP, () => {
		pendingBlink?.remove()
		bouncerHead.play( 'talk' )
		Up.audio.play({ scene: scene, audio: welcome })
		welcome.sound.on( Phaser.Sound.Events.COMPLETE, () => {
			bouncerHead.stop().setFrame( 0 )
		})
	})
	bouncerHead.play( 'blink' )

	bouncerArm.anims.create({
		key: 'sway',
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERARM.key, {
				start: 1, end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERARM.key, {
				frames: Array(6).fill(4),
			}),
			...scene.anims.generateFrameNumbers( game.sprites.STAGEDOOR.BOUNCERARM.key, {
				start: 3, end: 0,
			}),
		],
	})
	bouncerArm.off( Phaser.Animations.Events.ANIMATION_COMPLETE )
	bouncerArm.on(  Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
		const delay = Ug.randomInt( 1000, 16000 )
		scene.time.delayedCall( delay, () => { bouncerArm.play( 'sway' ) } )
	})
	scene.time.delayedCall( 1500, () => { bouncerArm.play( 'sway' ) } )




	// Exits
	const stage = scene.add.rectangle( 325 * s, 140 * s, 200 * s, 205 * s, 0x553366)
		.setOrigin( 0 ).setDepth( 10 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: stage,
		nextScene: game.scenes.STAGE,
		// soundsToKeep: [
		// 	game.soundsPERSISTANT.AMBIENCE.CITYRAIN,
		// 	game.soundsPERSISTANT.AMBIENCE.JAZZ,
		// ],
	})
	const stairs = scene.add.rectangle( 645 * s, 30 * s, 155 * s, 420 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: stairs,
		nextScene: game.scenes.HALLWAY,
	})
	const hallway = scene.add.rectangle( 0, 215 * s, 175 * s, 235 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: hallway,
		nextScene: game.scenes.HALLWAY,
	})

	log(`${scene.scene.key} created.`)
}

