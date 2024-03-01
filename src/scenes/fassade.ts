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
import * as Cat from '../sprites/cat'

import { debug, log } from '../utils/general'
import * as Up from '../utils/phaser'

/* Main part */

const jazzVolume = 0.1

export default class Fassade extends Phaser.Scene {

	constructor() {
		super( game.scenes.FASSADE )
	}

	// init() {
	// 	this.scene.scene.events.on( Phaser.Scenes.Events.SHUTDOWN, () => {
	// 		this.tweens.shutdown()
	// 	})
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Up.loadAssets({ game: game, scene: this })
	}

	// update() {
	// }
}

function go ( scene: Phaser.Scene ): void {
	//Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.FASSADE.BACKGROUND.key })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.AMBIENCE.CITYRAIN.key, volume: game.soundsPersistant.AMBIENCE.CITYRAIN.volume, fadeIn: 10000 })
	const jazzVolumeStart = getState().entranceopen ? jazzVolume : 0
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.AMBIENCE.JAZZ.key, volume: jazzVolumeStart })

	addDoors( scene )

	scene.add.image( 411 * s, 276 * s, game.images.FASSADE.PILLAR1.key ).setOrigin( 0 )
		.setSize( 69 * s, 128 * s )
		.setDisplaySize( 69 * s, 128 * s )
		.setDepth( 1 )
	scene.add.image( 527 * s, 282 * s, game.images.FASSADE.PILLAR2.key ).setOrigin( 0 )
		.setSize( 54 * s, 116 * s )
		.setDisplaySize( 54 * s, 116 * s )
		.setDepth( 8 )

	// Objects
	// scene.cameras.main.fadeIn( 3000, 0, 0, 0 )

	const cat = Cat.newCat( scene, 25 * s, 350 * s, 0.6 )
	// globalscene.cat = cat
	cat.follower.setDepth( 5 )
	cat.randomSounds = [
		cat.sounds.meow,
		cat.sounds.meow,
		cat.sounds.meowmeowmeow,
	],
	Cat.playRandomCatSounds({ cat: cat, preDelay: true })

	motions.fromLeft({ cat: cat })

	scene.add.particles(0, 50 * s, game.images.FASSADE.RAINDROP.key, {
		// gravityY: 200,
		x: { min: 0, max: w },
		y: -100 * s,
		frequency: 50,
		lifespan: { min: 2000, max: 2500 },
		// speedY: { min: 50, max: 350 },
		speedY: { min: 125 * s, max: 275 * s },
		scaleX: { min: 1, max: 2 },
		// scaleY: { min: 0.25, max: 4.5 },
		scaleY: 8,
		// quantity: {min: 5, max: 15},
		quantity: 1,
		blendMode: 'ADD',
	}).setDepth( 9 )

	// EXITS
	// door
	const entrance = scene.add.rectangle( 0.617 * w, 0.80 * h, 0.2 * h, 0.15 * h, 0x553366)
		.setDepth( 10 )
		.setAlpha( debug ? 0.5 : 0.001 )

	Up.addExit({
		game: game,
		scene: scene,
		nextScene: game.scenes.ENTRANCE,
		exit: entrance,
		soundsToKeep: [
			game.soundsPersistant.AMBIENCE.CITYRAIN,
			game.soundsPersistant.AMBIENCE.JAZZ,
		],
	})

	// back to Wimmelbild
	if ( getState().arrivedAtWimmelbild ) {
		const wimmelbild = scene.add.rectangle( 0 * w, 0.1 * h, 0.17 * w, 0.9 * h, 0x553366)
			.setOrigin( 0 )
			.setDepth( 10 )
			.setAlpha( debug ? 0.5 : 0.001 )

		Up.addExit({
			game: game,
			scene: scene,
			nextScene: game.scenes.WIMMELBILD,
			exit: wimmelbild,
		})
	}

	log(`${scene.scene.key} created.`)
}

function addDoors ( scene: Phaser.Scene ): void {
	scene.add.image( 466 * s, 345 * s, game.images.FASSADE.DOORINNER.key ).setOrigin( 0 )
		.setSize(        35 * s, 44 * s )
		.setDisplaySize( 35 * s, 44 * s )
	const doorLeft = scene.add.image( 467 * s, 346 * s, game.images.FASSADE.DOORLEFT.key ).setOrigin( 0 )
		.setSize(        18 * s, 43 * s )
		.setDisplaySize( 18 * s, 43 * s )
	const doorRight = scene.add.image( 483 * s, 346 * s, game.images.FASSADE.DOORRIGHT.key ).setOrigin( 0 )
		.setSize(        16 * s, 42 * s )
		.setDisplaySize( 16 * s, 42 * s )

	const ease = Phaser.Math.Easing.Cubic.InOut
	const duration = 1500

	const jazz = scene.sound.get( game.soundsPersistant.AMBIENCE.JAZZ.key )
	function openDoors (p?: { now?: boolean }): void {
		const delay = ( p?.now ) ? 0 : Phaser.Math.Between( 3, 10 )
		const dura  = ( p?.now ) ? 0 : duration
		scene.tweens.add({
			targets: doorLeft,
			x: doorLeft.x - doorLeft.width,
			duration: dura,
			ease: ease,
			delay: delay * 1000,
		})
		scene.tweens.add({
			targets: doorRight,
			x: doorRight.x + doorRight.width,
			duration: dura,
			ease: ease,
			delay: delay * 1000,
		})

		scene.tweens.add({
			targets: jazz,
			volume: jazzVolume,
			duration: dura,
			delay: delay * 1000,
			onStart: () => {
				addState({ entranceopen: true })
			},
			onComplete: () => {
				closeDoors()
			},
		})
	}
	function closeDoors(): void {
		const delay = 7000
		scene.tweens.add({
			targets: doorLeft,
			x: doorLeft.x + doorLeft.width,
			duration: duration,
			ease: ease,
			delay: delay,
			onStart: () => {
				addState({ entranceopen: false })
			},
			onComplete: () => {
				openDoors()
			},
		})
		scene.tweens.add({
			targets: doorRight,
			x: doorRight.x - doorRight.width,
			duration: duration,
			ease: ease,
			delay: delay,
		})
		scene.tweens.add({
			targets: jazz,
			volume: 0,
			duration: duration,
			delay: delay,
		})
	}
	if ( getState().entranceopen ) {
		openDoors({ now: true })
		return
	}
	openDoors()
}

const motions: { [key: string]: Cat.Motion } = {

	fromLeft: ( p ) => {
		const duration = 10000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.toRight,
		]
		p.cat.follower.setRotation( 0.07 * Math.PI )
		p.cat.follower.setScale( 0.4 * p.cat.fullScale )
		p.cat.follower.flipX = true

		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.8 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})

		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.chain([
				{ key: Cat.CATWALK, frameRate: 10 },
			])
		})
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
		const path = new Phaser.Curves.Path( 25 * s, 375 * s).splineTo([
			Up.vec( 180 * s, 372 * s),
			Up.vec( 250 * s, 385 * s),
			Up.vec( 375 * s, 400 * s),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			yoyo: false,
			repeat: 0,
			ease: ease,
			positionOnPath: true,
			rotateToPath: true,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				Cat.sitDown({ cat: p.cat })
			}
		})
		return
	},

	toRight: ( p ) => {
		const duration = 8000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			motions.toDoor,
		]
		p.cat.follower.setRotation( -0.03 * Math.PI )
		p.cat.follower.setScale( 0.9 * p.cat.fullScale )
		p.cat.follower.flipX = true

		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.6 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.chain([
				{ key: Cat.CATWALK, frameRate: 10 },
			])
		})
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)

		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			Cat.idle({ cat: p.cat, duration: 6000 })
		})
		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Up.vec( 550 * s, 420 * s ),
			Up.vec( 775 * s, 380 * s ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			yoyo: false,
			repeat: 0,
			ease: ease,
			positionOnPath: true,
			rotateToPath: true,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				Cat.sitDown({ cat: p.cat })
			},
		})

		return
	},

	toDoor: ( p ) => {
		// const pillarTwo = p.cat.follower.scene.cache.obj.get( game.images.FASSADEPILLARTWO ) as Phaser.GameObjects.Image
		// pillarTwo.setZ( 10 )

		const duration = 6000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
		]
		// p.cat.follower.setRotation( -0.03 * Math.PI )
		p.cat.follower.setScale( 0.6 * p.cat.fullScale )
		p.cat.follower.flipX = false

		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.6 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.chain([
				{ key: Cat.CATWALK, frameRate: 10 },
			])
		})
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)

		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			Cat.idle({ cat: p.cat, duration: 600000 })
		})
		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Up.vec( 600 * s, 375 * s ),
			Up.vec( 540 * s, 385 * s ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			yoyo: false,
			repeat: 0,
			ease: ease,
			positionOnPath: true,
			rotateToPath: true,
			rotationOffset: 180,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				Cat.sitDown({ cat: p.cat })
			},
		})

		return
	},
}
// globalThis.motions = motions



// declare global {
// 	/* eslint-disable no-var */
// 	var cat: any
// 	var motions: any
// 	/* eslint-enable no-var */
// }
