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

import { debug, log } from '../helpers/general'
import * as Ph from '../helpers/special'

/* Main part */

export default class Fassade extends Phaser.Scene {

	constructor() {
		super( SCENES.FASSADE )
	}

	// init() {
	// 	this.scene.scene.events.on( Phaser.Scenes.Events.SHUTDOWN, () => {
	// 		this.tweens.shutdown()
	// 	})
	// }

	// preload() {
	// }

	create() {

		//Ambience
		Ph.addBackground( this, IMAGES.FASSADE )
		Ph.addAmbience({ scene: this, key: AMBIENCE.CITYRAIN, volume: 1, fadeIn: 10000 })

		this.add.image( game.scale * 822, game.scale * 553, IMAGES.FASSADEPILLARONE ).setOrigin(0, 0)
			.setSize( game.scale * 138, game.scale * 257 )
			.setDisplaySize( game.scale * 138, game.scale * 257 )
		this.add.image( game.scale * 1055, game.scale * 565, IMAGES.FASSADEPILLARTWO ).setOrigin(0, 0)
			.setSize( game.scale * 108, game.scale * 232 )
			.setDisplaySize( game.scale * 108, game.scale * 232 )
			.setDepth( 10 )

		// Objects
		this.cameras.main.fadeIn( 3000, 0, 0, 0 )

		const cat = Cat.newCat( this, 50, 700, 0.6 )
		// globalThis.cat = cat
		cat.follower.setDepth( 5 )
		Cat.playRandomCatSounds({ cat: cat, preDelay: true })

		motions.fromLeft({ cat: cat })

		// door
		const entrance = this.add.rectangle( 0.63 * game.width, 0.78 * game.height, 0.2 * game.height, 0.15 * game.height, 0x553366)
		entrance.alpha = debug ? 0.5 : 0.001

		Ph.addExit({ scene: this,
			nextScene: SCENES.ENTRANCE,
			exit: entrance,
			soundsToKeep: [
				this.sound.get( AMBIENCE.CITYRAIN ),
			],
		})

		this.add.particles(0, 100, IMAGES.RAIN, {
			// gravityY: 200,
			x: { min: 0, max: game.width },
			y: -200,
			frequency: 50,
			lifespan: { min: 2000, max: 2500 },
			// speedY: { min: 50, max: 350 },
			speedY: { min: 250, max: 550 },
			scaleX: { min: 1 * game.scale, max: 2 * game.scale },
			// scaleY: { min: 0.25 * game.scale, max: 4.5 * game.scale },
			scaleY: 8,
			// quantity: {min: 5, max: 15},
			quantity: 1,
			blendMode: 'ADD',
		})

		console.log(`${this.scene.key} created.`)
	}

	// update() {
	// }
}


const motions: { [key: string]: Cat.Motion } = {

	fromLeft: ( p ) => {
		console.log('fromLeft started')

		const duration = 10000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.toRight,
		]
		p.cat.follower.setRotation( 0.07 * Math.PI )
		p.cat.follower.setScale( 0.4 * p.cat.fullScale )
		p.cat.follower.flipX = true

		const ease = Phaser.Math.Easing.Linear

		console.log('stillrunning')
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
			console.log('fromLeft next')
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
		const path = new Phaser.Curves.Path( 50, 750 ).splineTo([
			Ph.vec( 360, 745 ),
			Ph.vec( 500, 770 ),
			Ph.vec( 750, 800 ),
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
		console.log('toRight started')

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
			console.log('toRight next')
			Cat.idle({ cat: p.cat, duration: 6000 })
		})
		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Ph.vec( 1100, 840 ),
			Ph.vec( 1550, 760 ),
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
		log('toDoor started')
		// const pillarTwo = p.cat.follower.scene.cache.obj.get( IMAGES.FASSADEPILLARTWO ) as Phaser.GameObjects.Image
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
			console.log('toRight next')
			Cat.idle({ cat: p.cat, duration: 600000 })
		})
		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Ph.vec( 1200, 750 ),
			Ph.vec( 1080, 770 ),
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
