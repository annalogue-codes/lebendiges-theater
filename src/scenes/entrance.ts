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

import { game, getState, setState, SCENES, IMAGES, SOUNDS, AMBIENCE } from '../constants'
import { debug, } from '../helpers/general'
import * as Ph from '../helpers/special'
import * as Cat from '../sprites/cat'

/* Main part */

const doorLeftXClosed = 0.2875 * game.width
const doorLeftXOpen = 0.1875 * game.width
const doorRightXClosed = 0.40625 * game.width
const doorRightXOpen = 0.5125 * game.width
const doorLeftY  = 0.23333 * game.height
const doorRightY = 0.23333 * game.height

export default class Entrance extends Phaser.Scene {

	constructor() {
		super( SCENES.ENTRANCE )
	}

	init() {//
	}

	preload() {
		// Ambience
	}

	create() {

		//Ambience
		Ph.addBackground( this, IMAGES.ENTRANCEFRAME ).setDepth( 10 )
		Ph.addAmbience({ scene: this, key: AMBIENCE.CITYRAIN, volume: 1, fadeIn: 0 })
		Ph.addAmbience({ scene: this, key: AMBIENCE.LOFI, volume: 0.4, fadeIn: 0 })

		// Objects
		const inner = this.add.image( 0.26 * game.width, 0.21 * game.height, IMAGES.ENTRANCEINNER )
			.setOrigin( 0, 0 )
			.setDepth( 1 )
			.setInteractive()
		const doorLeft = this.add.image( ( getState().entranceopen ? doorLeftXOpen : doorLeftXClosed ), doorLeftY, IMAGES.ENTRANCEDOORLEFT )
			.setOrigin( 0, 0 )
			.setDepth( 5 )
		const doorRight = this.add.image( ( getState().entranceopen ? doorRightXOpen : doorRightXClosed ), doorRightY, IMAGES.ENTRANCEDOORRIGHT )
			.setOrigin( 0, 0 )
			.setDepth( 5 )

		const doorArea = this.add.rectangle( 0.28 * game.width, 0.22 * game.height, 0.26 * game.width, 0.58 * game.height, 0x553366)
			.setOrigin( 0, 0 )
			.setDepth( getState().entranceopen ? 0 : 11 )
			.setInteractive()
		doorArea.alpha = debug ? 0.5 : 0.001
		doorArea.off( Phaser.Input.Events.POINTER_UP )
		doorArea.on( Phaser.Input.Events.POINTER_UP, () => {
			onDoors({ doorLeft: doorLeft, doorRight: doorRight, doorArea: doorArea })
		})

		if (getState().entranceopen) closeDoors({ doorLeft: doorLeft, doorRight: doorRight, doorArea: doorArea })

		const fassadeAreaOne = this.add.rectangle( 0, 0, 0.16 * game.width, 0.93 * game.height, 0x553366)
			.setOrigin( 0, 0 )
			.setDepth( 11 )
			.setInteractive()
		fassadeAreaOne.alpha = debug ? 0.5 : 0.001
		const fassadeAreaTwo = this.add.rectangle( 0, 0.93 * game.height, 0.6 * game.width, 1 * game.height, 0x553366)
			.setOrigin( 0, 0 )
			.setDepth( 11 )
			.setInteractive()
		fassadeAreaTwo.alpha = debug ? 0.5 : 0.001
		Ph.addExit({ scene: this,
			exit: fassadeAreaOne,
			nextScene: SCENES.FASSADE,
			soundsToKeep: [
				this.sound.get( AMBIENCE.CITYRAIN )
			],
		})
		Ph.addExit({ scene: this,
			exit: fassadeAreaTwo,
			nextScene: SCENES.FASSADE,
			soundsToKeep: [
				this.sound.get( AMBIENCE.CITYRAIN )
			],
		})
		Ph.addExit({ scene: this,
			exit: inner,
			nextScene: SCENES.FOYER,
			soundsToKeep: [
			],
		})

		const cat = Cat.newCat( this, 1230, 805, 1.5 )
		cat.follower.setDepth( 15 )
		cat.follower.setFlipX( false )

		const woman = addWoman({ scene: this })
		womanSpeak({ woman: woman,
			init: true,
			pre: () => {
				Cat.stopRandomCatSounds({ cat: cat })
			},
			post: () => {
				Cat.playRandomCatSounds({ cat: cat, preDelay: true, timeInterval: [30, 50] })
			}
		})

		this.add.particles(0, 100, IMAGES.RAIN, {
			// gravityY: 200,
			x: { min: 0, max: game.width },
			y: -200,
			frequency: 100,
			lifespan: {min: 5000, max: 6000},
			// speedY: { min: 50, max: 350 },
			speedY: { min: 150, max: 350 },
			scaleX: { min: 1 * game.scale, max: 2 * game.scale },
			scaleY: { min: 1 * game.scale, max: 4 * game.scale },
			quantity: 1,
			blendMode: 'ADD',
		}).setDepth( 20 )

		console.log(`${this.scene.key} created.`)
	}

	update() {//
	}
}

const onDoors = (p: { doorLeft: Phaser.GameObjects.Image, doorRight: Phaser.GameObjects.Image, doorArea: Phaser.GameObjects.Rectangle }) => {
	setState({ entranceopen: true })
	p.doorArea.setDepth(0)
	const scene = p.doorLeft.scene
	const ease = Phaser.Math.Easing.Cubic.InOut
	const duration = 1500
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
	})
	closeDoors({ doorLeft: p.doorLeft, doorRight: p.doorRight, doorArea: p.doorArea })
}
const closeDoors = (p: { doorLeft: Phaser.GameObjects.Image, doorRight: Phaser.GameObjects.Image, doorArea: Phaser.GameObjects.Rectangle }) => {
	const scene = p.doorLeft.scene
	const ease = Phaser.Math.Easing.Cubic.InOut
	const duration = 1500
	scene.tweens.add({
		delay: duration * 5,
		targets: p.doorLeft,
		x: doorLeftXClosed,
		duration: duration,
		ease: ease,
	})
	scene.tweens.add({
		delay: duration * 5,
		targets: p.doorRight,
		x: doorRightXClosed,
		duration: duration,
		ease: ease,
		onComplete: () => {
			setState({ entranceopen: false })
			p.doorArea.setDepth( 11 )
		}
	})
}

const addWoman = (p: { scene: Phaser.Scene }) => {
	const woman = p.scene.add.sprite( 0.606 * game.width, 0.45 * game.height, IMAGES.WOMANINPOSTER, 0 )
		.setScale( 0.9 )
		.setOrigin( 0, 0 )
		.setDepth( 12 )
		.setInteractive()

	woman.anims.create({
		key: 'womanSpeaking',
		frameRate: 6,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...woman.anims.generateFrameNumbers( IMAGES.WOMANINPOSTER, {
				start: 0,
				end: 6,
			}),
			...woman.anims.generateFrameNumbers( IMAGES.WOMANINPOSTER, {
				start: 5,
				end: 2,
			}),
			...woman.anims.generateFrameNumbers( IMAGES.WOMANINPOSTER, {
				start: 3,
				end: 6,
			}),
			// ...woman.anims.generateFrameNumbers( IMAGES.WOMANINPOSTER, {
			// 	start: 5,
			// 	end: 2,
			// }),
			// ...woman.anims.generateFrameNumbers( IMAGES.WOMANINPOSTER, {
			// 	start: 3,
			// 	end: 6,
			// }),
			...woman.anims.generateFrameNumbers( IMAGES.WOMANINPOSTER, {
				start: 5,
				end: 2,
			}),
			...woman.anims.generateFrameNumbers( IMAGES.WOMANINPOSTER, {
				start: 3,
				end: 8,
			}),
		],
	})

	return woman
}
const womanSpeak = (p: { woman: Phaser.GameObjects.Sprite, delay?: number, pre?: () => void, post?: () => void, init: boolean }) => {
	if (p.pre) p.pre()
	const speech = p.woman.scene.sound.get( SOUNDS.WOMANSPEECH )
	speech.off( Phaser.Sound.Events.COMPLETE )
	speech.once( Phaser.Sound.Events.COMPLETE, () => {
		p.woman.anims.stopOnFrame( p.woman.anims.get( 'womanSpeaking' ).frames[0] )
		p.woman.off( Phaser.Input.Events.POINTER_UP )
		p.woman.once( Phaser.Input.Events.POINTER_UP, () => {
			womanSpeak({ woman: p.woman, delay: 0, pre: p.pre, post: p.post, init: false })
		})
		if (p.post) p.post()
	})
	if ( p.init && getState().womanHasSpoken ) {
		p.woman.off( Phaser.Input.Events.POINTER_UP )
		p.woman.once( Phaser.Input.Events.POINTER_UP, () => {
			womanSpeak({ woman: p.woman, delay: 0, pre: p.pre, post: p.post, init: false })
		})
		return
	}
	setState({ womanHasSpoken: true })
	const delay = (p.delay === undefined) ? 4 : p.delay
	speech.play({ volume: 0.7, delay: delay + 0.7 })
	p.woman.play({ key: 'womanSpeaking', delay: delay * 1000 })
}

// declare global {
// 	/* eslint-disable no-var */
// 	var cat: any
// 	var motions: any
// 	/* eslint-enable no-var */
// }
