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

import * as Up from '../utils/phaser/common'
import * as Cat from '../sprites/cat'

import { game, s } from '../constants'
import { randomInt } from '../utils/math'
import * as Audio from '../utils/phaser/audio'
import { debug } from '../utils/general'
import { addExit } from '../utils/phaser/exit'

/* Main part */

// const jazzVolume = 0.1
// const lofiVolume = 0.4

export default class Stagedoor extends Phaser.Scene {

	constructor() {
		super( game.scenes.Stagedoor )
	}

	// init() {//
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Up.assets.load({ game: game, scene: this })
	}

	// update() {//
	// }
}

function go ( scene: Phaser.Scene ): void {
	//Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.stagedoor.background.key })
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.lofi.key, volume: game.soundsPersistant.ambience.lofi.volume })
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.jazz.key, volume: game.state.get().entranceopen ? jazzVolume : 0 })

	// Sounds

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
	scene.add.image(                      495 * s, 118 * s, game.images.stagedoor.bouncer.key ).setOrigin( 0 ).setDepth( 10 )
	const bouncerHead = scene.add.sprite( 514 * s, 115 * s, game.sprites.stagedoor.bouncerhead.key ).setOrigin( 0 ).setDepth( 11 )
	const bouncerArm  = scene.add.sprite( 720, 460, game.sprites.stagedoor.bouncerarm.key, 3 ).setOrigin( 0 ).setDepth( 9 )

	bouncerArm.anims.create({
		key: 'sway',
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerarm.key, {
				start: 1, end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerarm.key, {
				frames: Array(6).fill(4),
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerarm.key, {
				start: 3, end: 0,
			}),
		],
	})
	bouncerArm.off( Phaser.Animations.Events.ANIMATION_COMPLETE )
	bouncerArm.on(  Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
		const delay = randomInt( 1000, 16000 )
		scene.time.delayedCall( delay, () => { bouncerArm.play( 'sway' ) } )
	})
	scene.time.delayedCall( 1500, () => { bouncerArm.play( 'sway' ) } )

	bouncerHead.anims.create({
		key: 'blink',
		frameRate: 6,
		repeat: 1,
		yoyo: true,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerhead.key, {
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
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerhead.key, {
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
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerhead.key, {
				start: 7, end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerhead.key, {
				start: 5, end: 7,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerhead.key, {
				frames: [ 5, 4, 6, 5, 4, 7 ],
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerhead.key, {
				start: 7, end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerhead.key, {
				start: 5, end: 7,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerhead.key, {
				frames: [ 5, 4, 6, 5, 4, 7 ],
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stagedoor.bouncerhead.key, {
				frames: [ 1, 2, 3, 2, 1 ],
			}),
		],
	})
	let pendingBlink: Phaser.Time.TimerEvent
	function bouncerBlink () {
		pendingBlink?.remove()
		const delay = randomInt( 1000, 12000 )
		const dice = Math.random()
		const key = ( dice < 0.7 ) ? 'blink' : 'blink-quick'
		bouncerHead.off( 'animationcomplete' ).on( 'animationcomplete', () => bouncerBlink() )
		pendingBlink = scene.time.delayedCall( delay, () => { bouncerHead.play({key: key, repeat: Math.round(1 - dice) }) } )
	}
	bouncerHead.off( 'animationcomplete' ).on( 'animationcomplete', () => bouncerBlink() )


	let currentTopic = 'willkommen'
	bouncer.off('pointerup').on( 'pointerup', () => { bouncerSpeak( currentTopic ) })

	// IMPROVE: generalize this function and move it into a utility module.
	// BETTER: write a "character" module to provide a character generater function.
	// The returned character has a speak method.
	let bouncerIsTalking = false
	function bouncerSpeak ( topic: string ) {

		if ( bouncerIsTalking ) return

		bouncerIsTalking = true
		pendingBlink?.remove()
		const { sound, volume } = Audio.get({ scene: scene, keyAndVolume: game.sounds.stagedoor[ topic ] })
		bouncerHead.play( 'talk' )
		Audio.play({ sound, volume })
		sound.off( 'complete' )
		sound.once( 'complete', () => {
			bouncerIsTalking = false
			bouncerHead.stop().setFrame( 0 )
			bouncerBlink()
		})
	}

	const numberOfPeople = game.state.get().peopleFound.length
	console.log( `people: ${game.state.get().peopleFound}`)
	if ( numberOfPeople === 0 ) {
		scene.time.delayedCall( 1500, () => bouncerSpeak( 'willkommen' ) )
		// IMPROVE: make a better way to chain this.
		bouncerHead.once( 'animationstop', () => {
			bouncerSpeak( 'buehneleer' )
			bouncerHead.once( 'animationstop', () => {
				currentTopic = 'spielzimmer'
				scene.time.delayedCall( 500, () => bouncerSpeak( 'spielzimmer' ) )
			})
		})
	} else if ( numberOfPeople < 4 ) {

		currentTopic = 'ersteschauspieler'
		scene.time.delayedCall( 1500, () => bouncerSpeak( 'ersteschauspieler' ) )

	} else if ( numberOfPeople < 8 ) {

		currentTopic = 'langsamvoll'
		scene.time.delayedCall( 1500, () => bouncerSpeak( 'langsamvoll' ) )
		bouncerHead.once( 'animationstop', () => {
			bouncerSpeak( 'vielspass' )
		})

	} else {

		currentTopic = 'allewiederda'
		scene.time.delayedCall( 1500, () => bouncerSpeak( 'allewiederda' ) )
		bouncerHead.once( 'animationstop', () => {
			bouncerSpeak( 'vielspass' )
		})
	}




	// Exits
	const stage = scene.add.rectangle( 325 * s, 140 * s, 140 * s, 205 * s, 0x553366)
		.setOrigin( 0 ).setDepth( 10 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: stage,
		nextScene: game.scenes.Stage,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
	const stairs = scene.add.rectangle( 645 * s, 30 * s, 155 * s, 420 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: stairs,
		nextScene: game.scenes.Hallway,
	})
	const hallway = scene.add.rectangle( 0, 215 * s, 175 * s, 235 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: hallway,
		nextScene: game.scenes.Hallway,
	})
}

