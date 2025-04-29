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

import * as Set from '../utils/set'
import * as Up from '../utils/phaser/common'
import * as Audio from '../utils/phaser/audio'
import * as Inventory from '../utils/inventory'

import * as Cat from '../sprites/cat'

import { game, s } from '../constants'
import { debug } from '../utils/general'
import { randomInt } from '../utils/math'
import { addExit } from '../utils/phaser/exit'

/* Main part */

// const jazzVolume = 0.1
// const lofiVolume = 0.4

export default class Hallway extends Phaser.Scene {

	constructor() {
		super( game.scenes.Hallway )
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
	//Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.hallway.background.key })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.lofi.key, volume: game.soundsPersistant.ambience.lofi.volume, fadeIn: 3000 })
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.jazz.key, volume: game.state.get().entranceopen ? jazzVolume : 0 })

	// Objects

	//// Posters

	const kangaroo = scene.add.sprite( 820, 180, game.sprites.hallway.kangaroo.key ).setOrigin( 0 ).setDepth( 2 )
	kangaroo.anims.create({
		key: 'move',
		frameRate: 6,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.hallway.kangaroo.key, {
				frames: [ 0, 1, 2, 3 ],
			}),
		],
	})
	kangaroo.on( 'animationcomplete', () => {
		kangaroo.setAlpha( 0 ).setFrame( 0 )
		scene.tweens.addCounter({
			from: 1,
			to: 100,
			duration: 700,
			delay: 500,
			onUpdate: tween => {
				kangaroo.setAlpha( tween.getValue() / 100 )
			},
		})
	})
	const kangarooFrame = scene.add.rectangle( 830, 165, 100, 100, 0x553366).setOrigin( 0 ).setDepth( 3 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	kangarooFrame.on( 'pointerover', () => {
		if ( !kangaroo.anims.isPlaying && kangaroo.alpha === 1 ) kangaroo.play( 'move' )
	})


	const friends = scene.add.sprite( 929, 165, game.sprites.hallway.friends.key ).setOrigin( 0 ).setDepth( 2 )
	friends.anims.create({
		key: 'move',
		frameRate: 6,
		yoyo: true,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.hallway.friends.key, {
				frames: [ 0, 1, 2, 3, 4 ],
			}),
		],
	})
	const friendsFrame = scene.add.rectangle( 960, 152, 105, 100, 0x553366).setOrigin( 0 ).setDepth( 3 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	friendsFrame.on( 'pointerover', () => {
		if ( !friends.anims.isPlaying ) friends.play( 'move' )
	})


	const prisoners = scene.add.sprite( 1098, 150, game.sprites.hallway.prisoners.key ).setOrigin( 0 ).setDepth( 2 )
	prisoners.anims.create({
		key: 'move',
		frameRate: 8,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.hallway.prisoners.key, {
				frames: [ 0, 1, 2, 3 ],
			}),
		],
	})
	const prisonersFrame = scene.add.rectangle( 1095, 150, 100, 100, 0x553366).setOrigin( 0 ).setDepth( 3 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	prisonersFrame.on( 'pointerover', () => {
		if ( !prisoners.anims.isPlaying ) prisoners.play( 'move' )
	})
	prisonersFrame.on( 'pointerout', () => { scene.time.delayedCall( 3000, () => prisoners.stopAfterRepeat() ) })


	const guitar = scene.add.sprite( 933, 236, game.sprites.hallway.guitar.key ).setOrigin( 0 ).setDepth( 2 )
	guitar.anims.create({
		key: 'move',
		frameRate: 8,
		repeat: -1,
		yoyo: true,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.hallway.guitar.key, {
				frames: [ 1, 2, 3, 4 ],
			}),
		],
	})
	guitar.on( 'animationstop', () => { guitar.setFrame( 0 ) })
	const guitarFrame = scene.add.rectangle( 960, 257, 100, 85, 0x553366).setOrigin( 0 ).setDepth( 3 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	guitarFrame.on( 'pointerover', () => {
		if ( !guitar.anims.isPlaying ) guitar.play( 'move' )
	})
	guitarFrame.on( 'pointerout', () => { scene.time.delayedCall( 3000, () => guitar.stopAfterRepeat() ) })


	const car = scene.add.sprite( 1092, 256, game.sprites.hallway.car.key ).setOrigin( 0 ).setDepth( 2 )
	car.anims.create({
		key: 'move',
		frameRate: 8,
		repeat: -1,
		repeatDelay: 1000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.hallway.car.key, {
				frames: [ 0, 1, 2, 3, 4, 5, 6 ],
			}),
		],
	})
	car.on( 'animationstop', () => { scene.time.delayedCall( 1000, () => car.setFrame( 0 ) ) })
	const carFrame = scene.add.rectangle( 1092, 255, 103, 85, 0x553366).setOrigin( 0 ).setDepth( 3 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	carFrame.on( 'pointerover', () => {
		if ( !car.anims.isPlaying ) car.play( 'move' )
	})
	carFrame.on( 'pointerout', () => { scene.time.delayedCall( 3000, () => car.stopAfterRepeat() ) })

	const princessKey = game.sprites.hallway.princess.key
	const princess = scene.add.sprite( 960, 360, princessKey ).setOrigin( 0 ).setDepth( 2 )
	princess.anims.create({
		key: 'move',
		frameRate: 8,
		yoyo: true,
		skipMissedFrames: true,
		// frames: [
		// 	...scene.anims.generateFrameNumbers( game.sprites.hallway.princess.key, {
		// 		frames: [ 0, 1, 2, 3, 4 ],
		// 	}),
		// ],
		frames: [
			{ key: princessKey, frame: 0 },
			{ key: princessKey, frame: 1 },
			{ key: princessKey, frame: 2 },
			{ key: princessKey, frame: 3 },
			{ key: princessKey, frame: 4, duration: 1000 },
		],
	})
	const princessFrame = scene.add.rectangle( 960, 348, 100, 90, 0x553366).setOrigin( 0 ).setDepth( 3 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	princessFrame.on( 'pointerover', () => {
		if ( !princess.anims.isPlaying ) princess.play( 'move' )
	})

	//// Railing
	scene.add.image( 186 * s, 252 * s, game.images.hallway.railing.key ).setOrigin( 0 ).setDepth( 10 )
		// .setSize(        18 * s, 43 * s )
		// .setDisplaySize( 18 * s, 43 * s )
	scene.add.image( 635 * s, 82 * s, game.images.hallway.railingstage.key ).setOrigin( 0 ).setDepth( 20 )

	// Stray tems
	if ( !game.state.get().inventory.includes('trumpet') ) {
		const chest = Inventory.createChest({ game, scene })
		const trumpet = scene.add.image( 695 * s, 253 * s, game.images.hallway.trumpet.key ).setInteractive()
		trumpet.on( 'pointerup', () => {
			chest.foundItem({ item: 'trumpet', image: trumpet })
			scene.time.delayedCall( 2000, () => {
				const foundTrumpet = Audio.get({ scene, keyAndVolume: game.sounds.hallway.foundTrumpet})
				Audio.play( foundTrumpet )
			})
		})
	}


	// Bouncer
	scene.add.image( 695 * s, 32 * s, game.images.hallway.bouncer.key ).setOrigin( 0 ).setDepth( 10 )
	const bouncerHead = scene.add.sprite( 716 * s, 33 * s, game.sprites.hallway.bouncerhead.key ).setOrigin( 0 ).setDepth( 11 )
	bouncerHead.anims.create({
		key: 'blink',
		frameRate: 6,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.hallway.bouncerhead.key, {
				frames: [ 1, 0 ],
			}),
		],
	})
	bouncerHead.anims.create({
		key: 'close',
		frameRate: 8,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.hallway.bouncerhead.key, {
				frames: [ 1, 0, 1 ]
			}),
		],
	})
	bouncerHead.off( Phaser.Animations.Events.ANIMATION_COMPLETE )
	bouncerHead.on(  Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
		const rnd = randomInt( 1000, 12000 )
		const dice = Math.random()
		const key = ( dice < 0.7 ) ? 'blink' : 'close'
		scene.time.delayedCall( rnd, () => { bouncerHead.play({key: key, repeat: Math.round(1 - dice) }) } )
	})
	bouncerHead.play( 'blink' )

	// Cat
	const cat = Cat.newCat( scene, 325 * s, 350 * s, 1 )
	cat.follower.setDepth( 5 )
	cat.follower.setFlipX( false )
	cat.randomSounds = [
		cat.sounds.meow,
		cat.sounds.meow,
		cat.sounds.meowmeowmeow,
	]
	Cat.playRandomCatSounds({ cat: cat, preDelay: true })
	motions.jumpFromStairs({ cat: cat })

	// Exits
	const stairsOne = scene.add.rectangle( 240 * s, 265 * s, 425 * s, 150 * s, 0x553366)
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: stairsOne,
		nextScene: game.scenes.Foyer,
	})
	const stairsTwo = scene.add.rectangle( 110 * s, 200 * s, 60 * s, 55 * s, 0x553366)
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: stairsTwo,
		nextScene: game.scenes.Foyer,
	})
	const playroom = scene.add.rectangle( 0, 0, 190, 500, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: playroom,
		nextScene: game.scenes.Showroom,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
	const stageDoor = scene.add.rectangle( 635 * s, 30 * s, 165 * s, 155 * s, 0x553366)
		.setOrigin( 0 ).setDepth( 30 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: stageDoor,
		nextScene: game.scenes.Stagedoor,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
}

const motions: { [key: string]: Cat.Motion } = {

	jumpFromStairs: ( p ) => {
		const duration = 1000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.walkToShowRoom,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setScale( 0.9 * p.cat.fullScale )
		p.cat.follower.setFlipX( false )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.85 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.anims.timeScale = 0.5
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			const path = new Phaser.Curves.Path( 325 * s,  350 * s).splineTo([
				Up.vec( 225 * s, 275 * s),
			])
			p.cat.follower.setPath( path, {
				duration: duration,
				delay: 0,
				yoyo: false,
				repeat: 0,
				// ease: 'quad.inout',
				ease: ease,
				positionOnPath: true,
				rotateToPath: false,
				onComplete: () => {
					p.cat.follower.setRotation( 0.0 * Math.PI )
				},
			})
			p.cat.follower.setFlipX( true )
			p.cat.follower.anims.timeScale = 1.5
			p.cat.follower.play({ key: Cat.CATJUMP })
		})
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP, () => {
			p.cat.follower.setFlipX( false )
			p.cat.follower.anims.timeScale = 2
			p.cat.follower.play({ key: Cat.CATSITDOWN })
		})
		p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			p.cat.follower.anims.timeScale = 1
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
	},

	walkToShowRoom: ( p ) => {

		const duration = 5000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.walkToRightEdge,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setScale( 0.85 * p.cat.fullScale )
		p.cat.follower.setFlipX( false )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.4 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.anims.timeScale = 1
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
				Up.vec( 107 * s, 257 * s),
				Up.vec(  65 * s, 235 * s),
				Up.vec(  60 * s, 235 * s),
			])
			p.cat.follower.setPath( path, {
				duration: duration,
				delay: 0,
				yoyo: false,
				repeat: 0,
				// ease: 'quad.inout',
				ease: ease,
				positionOnPath: true,
				rotateToPath: true,
				rotationOffset: 180,
				onComplete: () => {
					p.cat.follower.setRotation( 0.0 * Math.PI )
					p.cat.follower.anims.stop()
				},
			})
			p.cat.follower.anims.play({ key: Cat.CATWALK })
			p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_STOP )
			p.cat.follower.once( Phaser.Animations.Events.ANIMATION_STOP, () => {
				p.cat.follower.play({ key: Cat.CATSITDOWN})
			})
		})
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			p.cat.follower.anims.timeScale = 1
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
	},
	walkToRightEdge: ( p ) => {
		const duration = 20000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			// Cat.idle({ cat: p.cat, duration: 600000 }),
			Cat.idle,
			motions.jumpToDoor,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setFlipX( true )
		p.cat.follower.setDepth( 15 )
		p.cat.follower.anims.timeScale = 1

		p.cat.follower.scene.tweens.chain({
			targets: p.cat.follower,
			tweens: [
				{ scale: 1.5 * p.cat.fullScale, duration: 0.4 * duration, ease: ease },
				{ scale: 1.5 * p.cat.fullScale, duration: 0.3 * duration, ease: ease },
				{ scale: 1.2 * p.cat.fullScale, duration: 0.3 * duration, ease: ease },
			],
		})

		p.cat.follower.play({ key: Cat.CATGETUP })
		p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
				Up.vec( 125 * s, 350 * s),
				Up.vec( 355 * s, 425 * s),
				Up.vec( 600 * s, 400 * s),
				Up.vec( 750 * s, 365 * s),
				Up.vec( 900 * s, 315 * s),
			])

			p.cat.follower.setPath( path, {
				duration: duration,
				delay: 0,
				yoyo: false,
				repeat: 0,
				// ease: 'quad.inout',
				ease: ease,
				positionOnPath: true,
				rotateToPath: false,
				onComplete: () => {
					p.cat.follower.setRotation( 0.0 * Math.PI )
					p.cat.follower.anims.stop()
					p.cat.follower.emit( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALK )
				},
			})
			p.cat.follower.play({ key: Cat.CATWALKFRONT, repeat: 2, frameRate: 4 })
			p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALKFRONT )
			p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALKFRONT, () => {
				p.cat.follower.play({ key: Cat.CATTURNSIDEWAYS })
				p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATTURNSIDEWAYS )
				p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATTURNSIDEWAYS, () => {
					// p.cat.follower.setRotation( -0.08 * Math.PI )
					p.cat.follower.setRotateToPath( true, 0 )
					p.cat.follower.play({ key: Cat.CATWALK })
					p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALK )
					p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALK, () => {
						p.cat.follower.setRotation( 0 )
						p.cat.follower.play({ key: Cat.CATSITDOWN })
						p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
						p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
							p.cat.follower.anims.timeScale = 1
							p.cat.follower.emit( Cat.NEXTMOTION )
						})
					})
				})
			})
		})
	},
	jumpToDoor: ( p ) => {
		const duration = 1200
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setScale( 0.9 * p.cat.fullScale )
		p.cat.follower.setFlipX( false )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.85 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.anims.timeScale = 0.5
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			const path = new Phaser.Curves.Path( 850 * s, 175 * s).splineTo([
				Up.vec( 810 * s, 145 * s),
				Up.vec( 747 * s, 146 * s),
			])
			p.cat.follower.setPath( path, {
				duration: duration,
				delay: 0,
				yoyo: false,
				repeat: 0,
				// ease: 'quad.inout',
				ease: ease,
				positionOnPath: true,
				rotateToPath: false,
				onComplete: () => {
					p.cat.follower.setRotation( 0.0 * Math.PI )
				},
			})
			p.cat.follower.setFlipX( true )
			p.cat.follower.anims.timeScale = 1.0
			p.cat.follower.setRotation( -0.2 * Math.PI )
			p.cat.follower.play({ key: Cat.CATJUMP })
		})
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP, () => {
			p.cat.follower.setFlipX( false )
			p.cat.follower.anims.timeScale = 3
			p.cat.follower.play({ key: Cat.CATSITDOWN })
		})
		p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
			p.cat.follower.anims.timeScale = 1
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
	},
}

