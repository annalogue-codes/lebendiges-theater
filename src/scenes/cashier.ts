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
import * as Audio from '../utils/phaser/audio'
import * as Inventory from '../utils/inventory'
import * as Cat from '../sprites/cat'

import { game, s } from '../constants'
import { debug } from '../utils/general'
import { randomElementOf, randomInt } from '../utils/math'
import { addExit } from '../utils/phaser/exit'

/* Main part */

// enum Position {
// 	floorFront = 'floorFront',
// 	barFront = 'barFront',
// 	barEnd = 'barEnd',
// }

export default class Cashier extends Phaser.Scene {

	constructor() {
		super( game.scenes.Cashier )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Inventory.load({ game: game, scene: this })
		Up.assets.load({ game: game, scene: this })
	}

	// update() {
	// }
}

function go ( scene: Phaser.Scene ): void {

	// Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.cashier.background.key })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.jazz.key, volume: game.soundsPersistant.ambience.jazz.volume, fadeIn: 3000 })

	// Objects

	// Stray tems

	const chest = Inventory.createChest({ game, scene })
	if ( !game.state.get().inventory.includes('bandaid') ) {

		const bandaid = scene.add.image( 700, 410 , game.images.cashier.bandaid.key )
			.setRotation( -0.05 )
			.setInteractive()
		bandaid.on( 'pointerup', () => {
			chest.foundItem({ item: 'bandaid', image: bandaid })
			scene.time.delayedCall( 2000, () => { cashierSpeak( 'bandaid' ) })
		})
	}

	//// Cashier
	const blinking = scene.add.sprite( 137, 153, game.sprites.cashier.blinking.key ).setOrigin( 0 )
		.setVisible( false )
	const talking = scene.add.sprite(  137, 153, game.sprites.cashier.talking.key ).setOrigin( 0 )
		.setVisible( false )
	const cashier = scene.add.rectangle( 69 * s, 75 * s, 156 * s, 300 * s, 0x990099 ).setOrigin( 0 )
		.setDepth( 10 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()

	const heads = [ blinking, talking ]

	blinking.anims.create({
		key: 'blink',
		frameRate: 6,
		yoyo: true,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.cashier.blinking.key, {
				start: 0, end: 4,
			}),
		],
	})
	blinking.anims.create({
		key: 'blink-quick',
		frameRate: 8,
		yoyo: true,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.cashier.blinking.key, {
				start: 0, end: 4,
			}),
		],
	})
	talking.anims.create({
		key: 'talk',
		frameRate: 5,
		yoyo: true,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.cashier.talking.key, {
				frames: [ 0, 1, 2, 1, 2, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0 ]
			}),
		],
	})


	let cashierIsTalking = false
	function cashierSpeak ( topic: string ) {

		if ( cashierIsTalking ) return

		cashierIsTalking = true

		pendingBlink?.remove()
		blinking.stop().setVisible( false )
		talking.setVisible( true ).play( 'talk' )

		const { sound, volume } = Audio.get({ scene: scene, keyAndVolume: game.sounds.cashier[ topic ] })
		Audio.play({ sound, volume })
		sound.off( 'complete' ).once( 'complete', () => {
			cashierIsTalking = false
			talking.stop().setFrame( 0 ).setVisible( false )
			blinking.setVisible( true ).play( 'blink' )
		})
	}

	let pendingBlink: Phaser.Time.TimerEvent
	function cashierBlink () {
		blinking.setVisible( false )
		talking.setVisible( false )
		const delay = randomInt( 1000, 12000 )
		const dice = Math.random()
		const key = ( dice < 0.7 ) ? 'blink' : 'blink-quick'
		pendingBlink = scene.time.delayedCall( delay, () => {
			blinking.setVisible( true ).play({ key: key, repeat: Math.round(1 - dice) })
		})
	}

	heads.forEach( head => head.off('animationcomplete').on( 'animationcomplete', () => { cashierBlink() }) )

	cashier.off('pointerup').on( 'pointerup', () => {
		cashierSpeak( 'repertoire' )
		game.state.add({ cashierSpoke: true })
	})

	let yvetteCount = 0
	const yvette = scene.add.rectangle( 450, 80, 150, 185, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	yvette.off('pointerup').on( 'pointerup', () => {
		cashierSpeak( `yvette_${yvetteCount}` )
		yvetteCount = (yvetteCount + 1) % 2
	})

	const computer = scene.add.rectangle( 980, 650, 500, 250, 0x990099 ).setOrigin( 0 )
		.setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	computer.on( 'pointerup', () => {
		if ( game.state.get().cashierSpoke ) window.open('https://atzeberlin.de/zuschauen', '_blank')
	})


	// Initial logic.
	if ( game.state.get().peopleFound.includes( 'hauptmann' ) && !game.state.get().inventory.includes( 'pass' ) ) {
		cashierIsTalking = true
		scene.time.delayedCall( 4000, () => {
			cashierIsTalking = false
			cashierSpeak( 'pass' )
			talking.once( 'animationstop', () => {
				chest.foundItem({ item: 'pass' })
			})
		})
	} else {
		blinking.play( 'blink' )
	}

	// Exits
	const foyerTopLeft = scene.add.rectangle( 0, 0, 300, 100, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: foyerTopLeft,
		nextScene: game.scenes.Foyer,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
	const foyerBottomLeft = scene.add.rectangle( 0, 800, 850, 100, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: foyerBottomLeft,
		nextScene: game.scenes.Foyer,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
	const foyerLeft = scene.add.rectangle( 0, 0, 100, 500, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: foyerLeft,
		nextScene: game.scenes.Foyer,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
	const foyerTopRight = scene.add.rectangle( 1300, 0, 300, 500, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: foyerTopRight,
		nextScene: game.scenes.Foyer,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
	const foyerRight = scene.add.rectangle( 1500, 800, 1600, 900, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: foyerRight,
		nextScene: game.scenes.Foyer,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})

}

