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
import { game, getState, s } from '../constants'
import * as Cat from '../sprites/cat'
import { debug, log } from '../utils/general'
import * as Set from '../utils/set'
import * as Up from '../utils/phaser'
import * as Inventory from '../utils/inventory'

/* Main part */

export default class Showroom extends Phaser.Scene {

	constructor() {
		super( game.scenes.SHOWROOM )
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
	// Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.SHOWROOM.BACKGROUND.key })
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPERSISTANT.AMBIENCE.LOFI.key, volume: game.soundsPERSISTANT.AMBIENCE.LOFI.volume * (2/3), fadeIn: 3000 })

	// Stray tems
	if ( !Set.toArray( getState().inventory ).includes( 'wig' ) ) {
		const wig = scene.add.image( 150 * s, 200 * s, game.images.SHOWROOM.wig.key ).setInteractive().setDepth( 50 )
		wig.on( 'pointerup', () => { Inventory.add( 'wig', wig ) })
	}

	// The Cat!
	const cat = Cat.newCat( scene, 700 * s, 365 * s, 1 )
	cat.follower.play( Cat.CATSLEEPING )
	cat.follower.setFlipX( true )
	cat.randomSounds = [ cat.sounds.purr ]
	cat.soundTimeInterval = [30, 50]
	Cat.playRandomCatSounds({ cat: cat, preDelay: true })

	// Melodia
	const [ melodia, melodiaFrame ] = createMelodia( scene )

	// Rectangles for interactive items in the scene.
	const tuba = scene.add.rectangle( 152 * s, 240 * s, 50 * s, 100 * s, 0x990099 ).setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	const beanbag = scene.add.rectangle( 212 * s, 285 * s, 110 * s, 80 * s, 0x990099 ).setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()

	// Melodias responses to items clicked in scene.
	const melodiaTuba = scene.sound.get( game.sounds.SHOWROOM.TUBA.key )
	const melodiaParcour = scene.sound.get( game.sounds.SHOWROOM.PARCOUR.key )

	const onTuba = () => {
		melodia.off( Phaser.Animations.Events.ANIMATION_START )
		melodia.once( Phaser.Animations.Events.ANIMATION_START, () => {
			melodiaTuba.play({ volume: game.sounds.SHOWROOM.TUBA.volume })
		})
		melodia.play( 'tuba' )
		melodiaTuba.off( Phaser.Sound.Events.COMPLETE )
		melodiaTuba.once( Phaser.Sound.Events.COMPLETE, () => {
			melodia.stopOnFrame( melodia.anims.get( 'tuba' ).frames[ 0 ] )
			tuba.off( Phaser.Input.Events.POINTER_UP )
			tuba.once( Phaser.Input.Events.POINTER_UP, () => { onTuba() } )
		})
	}
	const onBeanbag = () => {
		melodia.off( Phaser.Animations.Events.ANIMATION_START )
		melodia.once( Phaser.Animations.Events.ANIMATION_START, () => {
			melodiaParcour.play({ volume: game.sounds.SHOWROOM.PARCOUR.volume })
		})
		melodia.play( 'parcour' )
		melodiaParcour.off( Phaser.Sound.Events.COMPLETE )
		melodiaParcour.once( Phaser.Sound.Events.COMPLETE, () => {
			melodia.stopOnFrame( melodia.anims.get( 'parcour' ).frames[ 0 ] )
			beanbag.off( Phaser.Input.Events.POINTER_UP )
			beanbag.once( Phaser.Input.Events.POINTER_UP, () => { onBeanbag() } )
		})
	}

	tuba.off( Phaser.Input.Events.POINTER_UP )
	tuba.once( Phaser.Input.Events.POINTER_UP, () => { onTuba() } )
	beanbag.off( Phaser.Input.Events.POINTER_UP )
	beanbag.once( Phaser.Input.Events.POINTER_UP, () => { onBeanbag() } )

	// // Posters
	// const poster1 = scene.add.rectangle( 535 * s, 0, 65 * s, 100 * s, 0x990099 ).setOrigin( 0 )
	// 	.setAlpha( debug ? 0.5 : 0.001 )
	// 	.setInteractive()
	// const poster2 = scene.add.rectangle( 610 * s, 20 * s, 60 * s, 100 * s, 0x990099 ).setOrigin( 0 )
	// 	.setAlpha( debug ? 0.5 : 0.001 )
	// 	.setInteractive()
	// const poster3 = scene.add.rectangle( 725 * s, 0, 75 * s, 100 * s, 0x990099 ).setOrigin( 0 )
	// 	.setAlpha( debug ? 0.5 : 0.001 )
	// 	.setInteractive()
	//
	// // Images in Flipchart
	// const podium = [
	// 	scene.add.image( 590 * s, 137 * s, game.images.SHOWROOM.PODIUMVERTIKAL01.key )
	// 		.setOrigin( 0 )
	// 		.setSize( 100 * s, 150 * s).setDisplaySize( 100 * s, 150 * s)
	// 		.setAlpha( 0.001 ),
	// 	scene.add.image( 590 * s, 137 * s, game.images.SHOWROOM.PODIUMVERTIKAL02.key )
	// 		.setOrigin( 0 )
	// 		.setSize( 100 * s, 150 * s).setDisplaySize( 100 * s, 150 * s)
	// 		.setAlpha( 0.001 ),
	// ]
	// const stimme = [
	// 	scene.add.image( 590 * s, 137 * s, game.images.SHOWROOM.STIMMEDERZUKUNFTVERTIKAL01.key )
	// 		.setOrigin( 0 )
	// 		.setSize( 100 * s, 150 * s).setDisplaySize( 100 * s, 150 * s)
	// 		.setAlpha( 0.001 ),
	// 	scene.add.image( 590 * s, 137 * s, game.images.SHOWROOM.STIMMEDERZUKUNFTVERTIKAL02.key )
	// 		.setOrigin( 0 )
	// 		.setSize( 100 * s, 150 * s).setDisplaySize( 100 * s, 150 * s)
	// 		.setAlpha( 0.001 ),
	// ]
	// const familiennacht = [
	// 	scene.add.image( 590 * s, 137 * s, game.images.SHOWROOM.FAMILIENNACHTVERTIKAL01.key )
	// 		.setOrigin( 0 )
	// 		.setSize( 100 * s, 150 * s ).setDisplaySize( 100 * s, 150 * s )
	// 		.setAlpha( 0.001 ),
	// 	scene.add.image( 1180, 275, game.images.SHOWROOM.FAMILIENNACHTVERTIKAL02.key )
	// 		.setOrigin( 0 )
	// 		.setSize( 100 * s, 150 * s ).setDisplaySize( 100 * s, 150 * s )
	// 		.setAlpha( 0.001 ),
	// ]
	//
	// let pictures: Phaser.GameObjects.Image[] = []
	//
	// const swapPictures = ( index: number ) => {
	// 	const delay = 6000
	// 	scene.time.delayedCall( delay, () => {
	// 		if ( pictures.length > 1 ) {
	// 			const duration = 1500
	// 			const ease = Phaser.Math.Easing.Sine.InOut
	// 			const pic1 = pictures[ index ]
	// 			const pic2 = pictures[ (index + 1) % pictures.length ]
	// 			scene.tweens.add({
	// 				targets: pic1,
	// 				alpha: 0.001,
	// 				duration: duration,
	// 				ease: ease,
	// 			})
	// 			scene.tweens.add({
	// 				targets: pic2,
	// 				alpha: 1,
	// 				duration: duration,
	// 				ease: ease,
	// 			})
	// 		}
	// 		swapPictures( (index + 1) % pictures.length )
	// 	})
	// }
	// swapPictures( 0 )
	//
	// poster1.off( Phaser.Input.Events.POINTER_UP )
	// poster1.on( Phaser.Input.Events.POINTER_UP, () => {
	// 	pictures.forEach( pic => pic.setAlpha( 0.001 ))
	// 	pictures = podium
	// 	const duration = 1500
	// 	const ease = Phaser.Math.Easing.Sine.InOut
	// 	scene.tweens.add({
	// 		targets: pictures[0],
	// 		alpha: 1,
	// 		duration: duration,
	// 		ease: ease,
	// 	})
	// })
	// poster2.off( Phaser.Input.Events.POINTER_UP )
	// poster2.on( Phaser.Input.Events.POINTER_UP, () => {
	// 	pictures.forEach( pic => pic.setAlpha( 0.001 ))
	// 	pictures = familiennacht
	// 	const duration = 1500
	// 	const ease = Phaser.Math.Easing.Sine.InOut
	// 	scene.tweens.add({
	// 		targets: pictures[0],
	// 		alpha: 1,
	// 		duration: duration,
	// 		ease: ease,
	// 	})
	// })
	// poster3.off( Phaser.Input.Events.POINTER_UP )
	// poster3.on( Phaser.Input.Events.POINTER_UP, () => {
	// 	pictures.forEach( pic => pic.setAlpha( 0.001 ))
	// 	pictures = stimme
	// 	const duration = 1500
	// 	const ease = Phaser.Math.Easing.Sine.InOut
	// 	scene.tweens.add({
	// 		targets: pictures[0],
	// 		alpha: 1,
	// 		duration: duration,
	// 		ease: ease,
	// 	})
	// })




	// Exits
	const hallway = scene.add.rectangle( 0, 0, 75 * s, 235 * s, 0x553366)
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	Up.addExit({
		game: game,
		scene: scene,
		exit: hallway,
		nextScene: game.scenes.HALLWAY,
	})
	const paper = scene.add.rectangle( 110 * s, 375 * s, 200 * s, 75 * s, 0x553366)
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	Up.addExit({
		game: game,
		scene: scene,
		exit: paper,
		nextScene: game.scenes.PAINT,
	})
	const presentation = scene.add.rectangle( 575 * s, 120 * s, 127 * s, 187 * s, 0x553366)
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	Up.addExit({
		game: game,
		scene: scene,
		exit: presentation,
		nextScene: game.scenes.PRESENTATION,
	})
	const windowToBerlin = scene.add.rectangle( 120 * s, 0, 175 * s, 200 * s, 0x553366)
		.setOrigin( 0 )
		.setInteractive()
		.setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: windowToBerlin,
		nextScene: game.scenes.WIMMELBILD,
	})

	log(`${scene.scene.key} created.`)
}



const createMelodia = ( scene: Phaser.Scene ): [ Phaser.GameObjects.Sprite, Phaser.GameObjects.Rectangle ] => {
	const melodia = scene.add.sprite( 345 * s, 205 * s, game.sprites.SHOWROOM.MELODIA.key, 6 ).setOrigin( 0 )
	const melodiaFrame = scene.add.rectangle( 345 * s, 220 * s, 80 * s, 180 * s, 0x990099 ).setOrigin( 0 )
	melodiaFrame.setAlpha( debug ? 0.5 : 0.001 )
	melodiaFrame.setInteractive()

	melodia.anims.create({
		key: 'tuba',
		delay: 0,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...Array.from( { length: 5 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
					start: 1,
					end: 7,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 10,
				end: 12,
			}),
			...Array.from( { length: 3 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
					start: 0,
					end: 7,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 10,
				end: 12,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 5,
				end: 6,
			}),
			...Array.from( { length: 2 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
					start: 1,
					end: 7,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 2,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 10,
				end: 12,
			}),
			...Array.from( { length: 2 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
					start: 1,
					end: 2,
				})
			).flat(),
			...Array.from( { length: 2 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
					start: 1,
					end: 7,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 5,
				end: 6,
			}),
			...Array.from( { length: 6 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
					start: 1,
					end: 1,
				})
			).flat(),
		],
	})
	melodia.anims.create({
		key: 'parcour',
		delay: 0,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 1,
				end: 7,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 2,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 10,
				end: 12,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 5,
				end: 6,
			}),
			...Array.from( { length: 2 }, () => [
				...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
					start: 1,
					end: 1,
				}),
			]).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 2,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 1,
				end: 7,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 2,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 1,
				end: 7,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 2,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 10,
				end: 12,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 5,
				end: 6,
			}),
		],
	})
	melodia.anims.create({
		key: 'wink',
		delay: 0,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 6,
				end: 5,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 9,
				end: 13,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.SHOWROOM.MELODIA.key, {
				start: 5,
				end: 6,
			}),
		],
	})

	melodia.off( 'wink' )
	melodia.on( 'wink', () => {
		scene.time.delayedCall( Phaser.Math.Between( 5, 20 ) * 1000, () => {
			if ( !melodia.anims.isPlaying ) {
				melodia.play( 'wink' )
			}
			melodia.emit( 'wink' )
		})
	})
	melodia.emit( 'wink' )

	return [ melodia, melodiaFrame ]
}




