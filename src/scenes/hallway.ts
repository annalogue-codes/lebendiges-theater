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
import * as Up from '../utils/phaser'
import * as Cat from '../sprites/cat'

/* Main part */

// const jazzVolume = 0.1
// const lofiVolume = 0.4

export default class Hallway extends Phaser.Scene {

	constructor() {
		super( game.scenes.HALLWAY )
	}

	// init() {
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
	Up.addBackground({ game: game, scene: scene, key: game.images.HALLWAY.BACKGROUND.key })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.AMBIENCE.LOFI.key, volume: game.soundsPersistant.AMBIENCE.LOFI.volume, fadeIn: 3000 })
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPERSISTANT.AMBIENCE.JAZZ.key, volume: getState().entranceopen ? jazzVolume : 0 })

	// Objects
	scene.add.image( 186 * s, 252 * s, game.images.HALLWAY.RAILING.key ).setOrigin( 0 ).setDepth( 10 )
		// .setSize(        18 * s, 43 * s )
		// .setDisplaySize( 18 * s, 43 * s )
	scene.add.image( 631 * s, 82 * s, game.images.HALLWAY.RAILINGSTAGE.key ).setOrigin( 0 ).setDepth( 20 )

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
	Up.addExit({
		game: game,
		scene: scene,
		exit: stairsOne,
		nextScene: game.scenes.FOYER,
	})
	const stairsTwo = scene.add.rectangle( 115 * s, 200 * s, 55 * s, 55 * s, 0x553366)
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: stairsTwo,
		nextScene: game.scenes.FOYER,
	})
	const playroom = scene.add.rectangle( 35 * s, 160 * s, 70 * s, 85 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: playroom,
		nextScene: game.scenes.SHOWROOM,
		// soundsToKeep: [
		// 	game.soundsPERSISTANT.AMBIENCE.CITYRAIN,
		// 	game.soundsPERSISTANT.AMBIENCE.JAZZ,
		// ],
	})
	const stageDoor = scene.add.rectangle( 635 * s, 30 * s, 165 * s, 155 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: stageDoor,
		nextScene: game.scenes.STAGEDOOR,
		// soundsToKeep: [
		// 	game.soundsPERSISTANT.AMBIENCE.CITYRAIN,
		// 	game.soundsPERSISTANT.AMBIENCE.JAZZ,
		// ],
	})

	log(`${scene.scene.key} created.`)
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
		log('walkToShowRoom')
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

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 1.4 * p.cat.fullScale,
			duration: duration,
			ease: ease,
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

