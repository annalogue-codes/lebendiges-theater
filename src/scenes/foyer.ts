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
// import _ from 'lodash'
import { game, SCENES, IMAGES, AMBIENCE } from '../constants'
import * as Cat from '../sprites/cat'
import { debug } from '../helpers/general'
import * as Ph from '../helpers/special'

/* Main part */

// enum Position {
// 	floorFront = 'floorFront',
// 	barFront = 'barFront',
// 	barEnd = 'barEnd',
// }

export default class Foyer extends Phaser.Scene {

	constructor() {
		super( SCENES.FOYER )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {

		// Ambience
		Ph.addBackground( this, IMAGES.FOYER )
		Ph.addAmbience({ scene: this, key: AMBIENCE.JAZZY, volume: 0.05, fadeIn: 3000 })

		// Objects
		const entranceExit = this.add.rectangle( 0, 0.4 * game.height, 0.2 * game.width, 1 * game.height, 0x553366)
			.setOrigin( 0, 0 )
			.setDepth( 11 )
			.setInteractive()
		entranceExit.alpha = debug ? 0.5 : 0.001
		Ph.addExit({ scene: this,
			exit: entranceExit,
			nextScene: SCENES.ENTRANCE,
			soundsToKeep: [
				this.sound.get( AMBIENCE.CITYRAIN )
			],
		})

		const cat = Cat.newCat( this, 1230, 805, 1 )
		cat.follower.setDepth( 15 )
		cat.follower.setFlipX( true )

		// motions.walkFromDoor({ cat: cat })
		motions.jumpOnBar({ cat: cat })


		// createMouse(this)
		this.add.image( 0.3 * game.width, 0.6 * game.height, IMAGES.ATZEBOW )
			.setOrigin( 0, 0 )
			.setDepth( 5 )

		// Debug
		if (debug) {
			const path = new Phaser.Curves.Path( 950,  780 ).splineTo([
				Ph.vec( 1130,  638 ),
				Ph.vec( 1200,  624 ),
			])
			const graphics = this.add.graphics()
			graphics.lineStyle(3, 0xff0000, 1)
			path.draw(graphics, 128)
		}

		console.log(`${this.scene.key} created.`)
	}

	// update() {
	// }
}

const motions: { [key: string]: Cat.Motion } = {

	walkFromDoor: ( p ) => {
		const duration = 5000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.jumpOnBar,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setScale( 0.9 * p.cat.fullScale )
		p.cat.follower.setFlipX( true )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.9 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.chain([
				{ key: Cat.CATWALK },
			])
		})
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)

		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			console.log('jumpOnBar next')
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
		const path = new Phaser.Curves.Path( 400,  850 ).splineTo([
			Ph.vec(  1100,  740 ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			yoyo: false,
			repeat: 0,
			// ease: 'quad.inout',
			ease: ease,
			positionOnPath: true,
			rotateToPath: true,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				Cat.sitDown({ cat: p.cat })
			},
		})
	},
	jumpOnBar: ( p ) => {
		console.log('jumpOnBar started')

		const duration = 600
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.walkOnBar,
		]

		p.cat.follower.setRotation( 0 )
		p.cat.follower.setScale( 0.9 * p.cat.fullScale )
		p.cat.follower.flipX = true

		const ease = Phaser.Math.Easing.Quadratic.Out

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.9 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})

		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP, () => {
			console.log('flip')
			p.cat.follower.setFlipX( true )
			console.log( p.cat.follower.flipX )
		})
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.setFlipX( false )
			p.cat.follower.play({ key: Cat.CATJUMP })
			// 	.once( 'animationcomplete', () => {
			// 	console.log('flip')
			// 	p.cat.follower.setFlipX( true )
			// 	console.log( p.cat.follower.flipX )
			// })
		})
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			console.log('jumpOnBar next')
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
		const path = new Phaser.Curves.Path( 1100, 740 ).splineTo([
		// const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Ph.vec( 1170,  608 ),
			Ph.vec( 1215,  565 ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			delay: 1000,
			yoyo: false,
			repeat: 0,
			ease: ease,
			positionOnPath: true,
			rotateToPath: false,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				Cat.sitDown({ cat: p.cat })
			}
		})
	},
	walkOnBar: ( p ) => {
		const duration = 3000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.jumpFromBar,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0.07 * Math.PI )
		p.cat.follower.setScale( 0.9 * p.cat.fullScale )
		p.cat.follower.setFlipX( false )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.6 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.chain([
				{ key: Cat.CATWALK },
			])
		})
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)

		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			console.log('jumpOnBar next')
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Ph.vec(  930,  530 ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			yoyo: false,
			repeat: 0,
			// ease: 'quad.inout',
			ease: ease,
			positionOnPath: true,
			rotateToPath: false,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				Cat.sitDown({ cat: p.cat })
			},
		})
	},
	jumpFromBar: ( p ) => {
		const duration = 800
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setScale( 0.6 * p.cat.fullScale )
		p.cat.follower.flipX = false
		p.cat.follower.setDepth( 4 )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.6 * p.cat.fullScale,
			duration: duration + 1000,
			ease: ease,
		})
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP, () => {
			p.cat.follower.setFlipX( true )
			p.cat.follower.setRotation( 0 )
		})
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.setFlipX( true )
			p.cat.follower.setRotation( -0.5 * Math.PI )
			p.cat.follower.chain([
				{ key: Cat.CATJUMP },
			])
		})
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)

		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			Cat.idle({ cat: p.cat, duration: 600000 })
		})
		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Ph.vec(  850,  600 ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			delay: 1000,
			yoyo: false,
			repeat: 0,
			// ease: 'quad.inout',
			ease: ease,
			positionOnPath: true,
			rotateToPath: false,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				Cat.sitDown({ cat: p.cat })
			},
		})
	},
}
// globalThis.motions = motions


// const createMouse = (scene: Phaser.Scene) => {
//
// 	const mouse = scene.physics.add.sprite(676, 550, 'fox', 0)
// 		.setScale(0.415)
//
// 	// Animations
// 	scene.anims.create({
// 		key: MOUSEIDLE,
// 		// frames: [ { key: ATZI, frame: 0 } ],
// 		frames: scene.anims.generateFrameNumbers( 'mouse', { start: 0, end: 0 } ),
// 		frameRate: 2,
// 		repeat: 4,
// 	})
// 	scene.anims.create({
// 		key: MOUSEBREATH,
// 		frames: scene.anims.generateFrameNumbers( 'mouse', { start: 0, end: 3 } ),
// 		frameRate: 3,
// 		yoyo: true,
// 		// repeat: -1,
// 	})
//
// 	mouse.on('animationcomplete-' + MOUSEIDLE, () => {
// 		// const rnd = Phaser.Math.Between(0, 1)
// 		// mouse.anims.play( { key: MOUSEBREATH, repeat: rnd })
// 		mouse.anims.play( { key: MOUSEBREATH, repeat: 0 })
// 	})
// 	mouse.on('animationcomplete-' + MOUSEBREATH, () => {
// 		const rnd = Phaser.Math.Between(6, 12)
// 		mouse.anims.play( { key: MOUSEIDLE, repeat: rnd })
// 	})
//
// 	mouse.anims.play(MOUSEIDLE)
//
// 	// Interactivity
// 	mouse.setInteractive()
//
// 	const purr = scene.sound.add(Cat.PURR)
// 	purr.on('complete', () => {
// 		mouse.once('pointerover', () => {
// 			purr.play({ volume: 1 })
// 		})
// 	})
// 	purr.on('stop', () => {
// 		mouse.once('pointerover', () => {
// 			purr.play({ volume: 1 })
// 		})
// 	})
// 	mouse.once('pointerover', () => {
// 		purr.play({ volume: 1 })
// 	})
// 	mouse.on('pointerout', () => {
// 		const tween = scene.tweens.add({
// 			targets:  scene.sound.getAll(Cat.PURR),
// 			volume:   0,
// 			duration: 500
// 		})
// 		tween.once('complete', () => {
// 			purr.stop()
// 		})
//
// 	})
//
// 	return mouse
// }




// declare global {
// 	/* eslint-disable no-var */
// 	var cat: any
// 	var motions: any
// 	/* eslint-enable no-var */
// }
//
