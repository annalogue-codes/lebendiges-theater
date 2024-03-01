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
import { game, getState, addState, s } from '../constants'
import { debug, presentation, log, clamp, randomInt, randomElementOf } from '../utils/general'
import * as Set from '../utils/set'
import * as Up from '../utils/phaser'


export default class Wimmelbild extends Phaser.Scene {

	constructor() {
		super( game.scenes.WIMMELBILD )
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
	// reset
	if ( debug || presentation ) addState({ peopleFound: Set.newSet() })

	// Been there done that.
	addState({ arrivedAtWimmelbild: true })

	// Resizable frame
	const cameraWidth = 656 * s
	const cameraOffsetX = 800 * s - cameraWidth
	const camera = scene.cameras.add( cameraOffsetX, 0, cameraWidth, 450 * s, false, 'viewOnBerlin' )
		.setZoom(1)
		.setScroll( cameraOffsetX, 0 )

	// Ambience
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.AMBIENCE.NOBLESBERLIN.key, volume: game.soundsPersistant.AMBIENCE.NOBLESBERLIN.volume * 0.5, fadeIn: 3000 })
	const leftSide = scene.add.rectangle( 0, 0, (800 - 656) * s, 450 * s, 0xebd292).setOrigin( 0 )
	const berlin = scene.add.image( (800 - 656) * s, 0, game.images.WIMMELBILD.BERLIN.key )
		.setOrigin( 0 )
		.setDisplaySize( 656 * s, 450 * s)
		.setInteractive()
	Up.addGestureSupport( berlin )

	// Zoom lenses
	const lensplus = scene.add.image( 715 * s, 400 * s, game.images.WIMMELBILD.LENSPLUS.key )
		.setOrigin( 0 )
		.setDisplaySize( 41 * s, 43 * s )
		.setInteractive().setDepth(10)
	const lensminus = scene.add.image( 752 * s, 400 * s, game.images.WIMMELBILD.LENSMINUS.key )
		.setOrigin( 0 )
		.setDisplaySize( 41 * s, 43 * s)
		.setInteractive()

	const setCameraScrollToBoundaries = () => {
		const boundaryX = camera.width  * ( 1 - 1 / camera.zoom ) / 2
		const boundaryY = camera.height * ( 1 - 1 / camera.zoom ) / 2
		camera.scrollX = clamp( cameraOffsetX - boundaryX, camera.scrollX, cameraOffsetX + boundaryX )
		camera.scrollY = clamp( -boundaryY, camera.scrollY, boundaryY )
	}
	const cameraZoomIn = () => {
		scene.tweens.add({
			targets: camera,
			zoom: Math.min( 8, camera.zoom + 0.5 ),
			duration: 500,
			ease: Phaser.Math.Easing.Quadratic.InOut,
			onUpdate: () => { setCameraScrollToBoundaries() }
		})
	}
	const cameraZoomOut = () => {
		scene.tweens.add({
			targets: camera,
			zoom: Math.max( 1, camera.zoom - 0.5 ),
			duration: 500,
			ease: Phaser.Math.Easing.Quadratic.InOut,
			onUpdate: () => { setCameraScrollToBoundaries() }
		})
	}
	lensplus.on( Phaser.Input.Events.POINTER_DOWN, () => {
		cameraZoomIn()
	})
	lensminus.on( Phaser.Input.Events.POINTER_DOWN, () => {
		cameraZoomOut()
	})

	// const ctrl = scene.input.keyboard?.addKey( Phaser.Input.Keyboard.KeyCodes.CTRL )
	// berlin.on( Phaser.Input.Events.POINTER_WHEEL, (pointer: Phaser.Input.Pointer, deltaX: number, deltaY: number, deltaZ: number ) => {
	// 	camera.zoom = clamp(1, camera.zoom - 0.01 * deltaY * camera.zoom, 8)
	// 	// console.log( 'ctrl' )
	// 	// console.log( ctrl )
	// })
	berlin.on( 'atze-inputzoom', ( zoomDelta: number ) => {
		camera.setZoom( clamp(1, camera.zoom - 0.01 * zoomDelta * camera.zoom, 8) )
		setCameraScrollToBoundaries()
	})
	berlin.on( 'atze-inputzoomandpan', ( zoomFactor: number, panX: number, panY: number ) => {
		camera.setZoom( clamp(1, camera.zoom * zoomFactor, 8) )
		const boundaryX = camera.width  * ( 1 - 1 / camera.zoom ) / 2
		const boundaryY = camera.height * ( 1 - 1 / camera.zoom ) / 2
		const diffX = panX / camera.zoom
		const diffY = panY / camera.zoom
		// console.log( diffX )
		// console.log( diffY )
		camera.scrollX = clamp( cameraOffsetX - boundaryX, camera.scrollX - diffX, cameraOffsetX + boundaryX )
		camera.scrollY = clamp( -boundaryY, camera.scrollY - diffY, boundaryY )
	})
	// berlin.on( Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
	// 	const boundaryX = camera.width  * ( 1 - 1 / camera.zoom ) / 2
	// 	const boundaryY = camera.height * ( 1 - 1 / camera.zoom ) / 2
	// 	let oldX = pointer.x
	// 	let oldY = pointer.y
	// 	berlin.on( Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
	// 		const diffX = (pointer.x - oldX) / camera.zoom
	// 		const diffY = (pointer.y - oldY) / camera.zoom
	// 		camera.scrollX = clamp( cameraOffsetX - boundaryX, camera.scrollX - diffX, cameraOffsetX + boundaryX )
	// 		camera.scrollY = clamp( -boundaryY, camera.scrollY - diffY, boundaryY )
	// 		oldX = pointer.x
	// 		oldY = pointer.y
	// 	})
	// 	berlin.once( Phaser.Input.Events.POINTER_UP, () => {
	// 		berlin.off( Phaser.Input.Events.POINTER_MOVE )
	// 	})
	// })

	// Objects
	const sams = scene.add.sprite( 70 * s, 354 * s, game.sprites.WIMMELBILD.SAMS.key, 0 ).setOrigin( 0 ).setInteractive()
	const samsColor = sams.postFX.addColorMatrix().saturate( Set.has( getState().peopleFound, 'sams' ) ? 0 : -1 , false )

	const albirea = scene.add.sprite( 70 * s, 154 * s, game.sprites.WIMMELBILD.ALBIREA.key, 0 ).setOrigin( 0 ).setInteractive()
	const albireaColor = albirea.postFX.addColorMatrix().saturate( Set.has( getState().peopleFound, 'albirea' ) ? 0 : -1 , false )

	const bach = scene.add.sprite( 5 * s, 104 * s, game.sprites.WIMMELBILD.BACH.key, 0 ).setOrigin( 0 ).setInteractive()
	const bachColor = bach.postFX.addColorMatrix().saturate( Set.has( getState().peopleFound, 'bach' ) ? 0 : -1 , false )

	const bear = scene.add.sprite( 70 * s, 54 * s, game.sprites.WIMMELBILD.BEAR.key, 0 ).setOrigin( 0 ).setInteractive()
	const bearColor = bear.postFX.addColorMatrix().saturate( Set.has( getState().peopleFound, 'bear' ) ? 0 : -1 , false )

	const entlein = scene.add.sprite( 5 * s, 204 * s, game.sprites.WIMMELBILD.ENTLEIN.key, 0 ).setOrigin( 0 ).setInteractive()
	const entleinColor = entlein.postFX.addColorMatrix().saturate( Set.has( getState().peopleFound, 'entlein' ) ? 0 : -1 , false )

	const hauptmann = scene.add.sprite( 70 * s, 254 * s, game.sprites.WIMMELBILD.HAUPTMANN.key, 0 ).setOrigin( 0 ).setInteractive()
	const hauptmannColor = hauptmann.postFX.addColorMatrix().saturate( Set.has( getState().peopleFound, 'hauptmann' ) ? 0 : -1 , false )

	const neinhorn = scene.add.sprite( 5 * s, 304 * s, game.sprites.WIMMELBILD.NEINHORN.key, 0 ).setOrigin( 0 ).setInteractive()
	const neinhornColor = neinhorn.postFX.addColorMatrix().saturate( Set.has( getState().peopleFound, 'neinhorn' ) ? 0 : -1 , false )

	const ronja = scene.add.sprite( 5 * s, 4 * s, game.sprites.WIMMELBILD.RONJA.key, 0 ).setOrigin( 0 ).setInteractive()
	const ronjaColor = ronja.postFX.addColorMatrix().saturate( Set.has( getState().peopleFound, 'ronja' ) ? 0 : -1 , false )

	const characters = { sams, albirea, bach, bear, entlein, hauptmann, neinhorn, ronja }

	albirea.anims.create({
		key: 'speech',
		frameRate: 6,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.ALBIREA.key, {
				start: 1,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.ALBIREA.key, {
				start: 3,
				end: 0,
			}),
		],
	})
	bach.anims.create({
		key: 'speech',
		frameRate: 6,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.BACH.key, {
				start: 1,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.BACH.key, {
				start: 3,
				end: 0,
			}),
		],
	})
	bear.anims.create({
		key: 'speech',
		frameRate: 6,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.BEAR.key, {
				start: 1,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.BEAR.key, {
				start: 3,
				end: 0,
			}),
		],
	})
	entlein.anims.create({
		key: 'speech',
		frameRate: 6,
		repeat: -1,
		repeatDelay: 1000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.ENTLEIN.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.ENTLEIN.key, {
				start: 2,
				end: 0,
			}),
		],
	})
	hauptmann.anims.create({
		key: 'speech',
		frameRate: 6,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.HAUPTMANN.key, {
				start: 1,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.HAUPTMANN.key, {
				start: 3,
				end: 0,
			}),
		],
	})
	neinhorn.anims.create({
		key: 'speech',
		frameRate: 2,
		repeat: -1,
		repeatDelay: 1000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.NEINHORN.key, {
				start: 1,
				end: 0,
			}),
		],
	})
	ronja.anims.create({
		key: 'speech',
		frameRate: 6,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.RONJA.key, {
				start: 1,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.RONJA.key, {
				start: 3,
				end: 0,
			}),
		],
	})
	sams.anims.create({
		key: 'speech',
		frameRate: 6,
		repeat: -1,
		repeatDelay: 1000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.SAMS.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.SAMS.key, {
				start: 2,
				end: 0,
			}),
		],
	})

	// Blinking
	albirea.anims.create({
		key: 'albireaBlink',
		frameRate: 4,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.ALBIREA.key, {
				start: 7,
				end: 6,
			}),
		],
	})
	bach.anims.create({
		key: 'bachBlink',
		frameRate: 2,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.BACH.key, {
				start: 0,
				end: 0,
			}),
		],
	})
	bear.anims.create({
		key: 'bearBlink',
		frameRate: 6,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.BEAR.key, {
				start: 6,
				end: 8,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.BEAR.key, {
				start: 7,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.BEAR.key, {
				start: 0,
				end: 0,
			}),
		],
	})
	entlein.anims.create({
		key: 'entleinBlink',
		frameRate: 8,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.ENTLEIN.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.ENTLEIN.key, {
				start: 2,
				end: 0,
			}),
		],
	})
	hauptmann.anims.create({
		key: 'hauptmannBlink',
		frameRate: 6,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.HAUPTMANN.key, {
				start: 7,
				end: 9,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.HAUPTMANN.key, {
				start: 8,
				end: 6,
			}),
		],
	})
	neinhorn.anims.create({
		key: 'neinhornBlink',
		frameRate: 4,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.NEINHORN.key, {
				start: 1,
				end: 0,
			}),
		],
	})
	ronja.anims.create({
		key: 'ronjaBlink',
		frameRate: 6,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.RONJA.key, {
				start: 7,
				end: 9,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.RONJA.key, {
				start: 8,
				end: 6,
			}),
		],
	})
	sams.anims.create({
		key: 'samsBlink',
		frameRate: 8,
		repeat: 1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.SAMS.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.WIMMELBILD.SAMS.key, {
				start: 2,
				end: 1,
			}),
		],
	})


	// const atzeFrame         = scene.add.rectangle( 632 * s, 175 * s, 30 * s, 35 * s, 0x553366)
	const samsFrame         = scene.add.rectangle( 385 * s, 415 * s, 35 * s, 35 * s, 0x553366)
	const albireaFrame      = scene.add.rectangle( 297 * s, 245 * s, 40 * s, 52 * s, 0x553366)
	const bachFrame         = scene.add.rectangle( 245 * s, 390 * s, 60 * s, 60 * s, 0x553366)
	const bearFrame         = scene.add.rectangle( 500 * s, 102 * s, 45 * s, 45 * s, 0x553366)
	const entleinFrame      = scene.add.rectangle( 220 * s, 287 * s, 45 * s, 45 * s, 0x553366)
	const hauptmannFrame    = scene.add.rectangle( 665 * s, 385 * s, 40 * s, 65 * s, 0x553366)
	const neinhornFrame     = scene.add.rectangle( 210 * s, 102 * s, 45 * s, 45 * s, 0x553366)
	const ronjaFrame        = scene.add.rectangle( 530 * s, 310 * s, 45 * s, 50 * s, 0x553366)

	const frames = [ samsFrame, albireaFrame, bachFrame, bearFrame, entleinFrame, hauptmannFrame, neinhornFrame, ronjaFrame ]
	frames.forEach( (frame: Phaser.GameObjects.Rectangle) => frame.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 ) )

	let pendingBlink: Phaser.Time.TimerEvent
	const randomCharacterBlink = () => {
		Object.keys(characters).forEach( character => (characters as any)[character].off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + character + 'Blink' ) )
		Object.keys(characters).forEach( character => (characters as any)[character].once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + character + 'Blink', () => {
			randomCharacterBlink()
		}))
		if ( pendingBlink ) pendingBlink.remove()
		pendingBlink = scene.time.delayedCall( randomInt(2000, 5000), () => {
			const randomCharacter = randomElementOf( Object.keys(characters).filter( character => Set.has( getState().peopleFound, character ) ) )
			if ( randomCharacter ) { (characters as any)[randomCharacter].play( randomCharacter + 'Blink' ) }
		})
	}
	randomCharacterBlink()

	const characterSpeech = ( key: string, sprite: Phaser.GameObjects.Sprite, delay: number ) => {
		Object.keys(characters).forEach( character => (characters as any)[character].off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + character + 'Blink' ) )
		Object.keys(characters).forEach( character => (characters as any)[character].stopAfterRepeat( 0 ) )
		pendingBlink.remove()
		Object.keys(characters).forEach( character => scene.sound.get( (game.sounds.WIMMELBILD as any)[character.toUpperCase()].key ).stop() )
		const claire = (scene.sound.get( game.soundsPersistant.AMBIENCE.NOBLESBERLIN.key ) as any)
		const claireVolume = claire.volume
		scene.tweens.add({
			targets: claire,
			volume: claireVolume / 15,
			duration: 1000,
			ease: Phaser.Math.Easing.Linear,
		})
		const speech = scene.sound.get( (game.sounds.WIMMELBILD as any)[key.toUpperCase()].key )
		speech.play({ volume: (game.sounds.WIMMELBILD as any)[key.toUpperCase()].volume * 0.3, delay: (delay + 300) / 1000 })
		sprite.play({ key: 'speech', delay: delay })
		speech.on( Phaser.Sound.Events.COMPLETE, () => {
			if ( !scene.sys.isActive ) return

			sprite.stopAfterRepeat( 0 )
			scene.tweens.add({
				targets: claire,
				volume: claireVolume,
				duration: 1000,
				ease: Phaser.Math.Easing.Linear,
			})
			randomCharacterBlink()
		})
	}
	const characterOnPointerUp = ( key: string, sprite: Phaser.GameObjects.Sprite, frame: Phaser.GameObjects.Rectangle, colorMatrix: Phaser.FX.ColorMatrix ) => {
		const duration = 1500
		const ease = Phaser.Math.Easing.Linear
		frame.off( Phaser.Input.Events.POINTER_UP )
		if ( !Set.has( getState().peopleFound, key ) ) {
			frame.once( Phaser.Input.Events.POINTER_UP, () => {
				addState({ peopleFound: Set.add( getState().peopleFound, key ) })
				scene.sound.get( game.sounds.WIMMELBILD.FOUND.key ).play({ volume: game.sounds.WIMMELBILD.FOUND.volume * 0.3 })
				scene.tweens.addCounter({
					from: 0,
					to: 100,
					duration: duration,
					ease: ease,
					onUpdate: tween => { colorMatrix.saturate( -1 + tween.getValue() / 100, false ) },
				})
				characterSpeech( key, sprite, 3000 )
			})
		}
		sprite.on( Phaser.Input.Events.POINTER_UP, () => {
			if ( Set.has( getState().peopleFound, key ) ) {
				characterSpeech( key, sprite, 0 )
			}
		})
	}
	// characterOnPointerUp( 'atze', atze, atzeFrame, atzeColor )
	characterOnPointerUp( 'sams', sams, samsFrame, samsColor )
	characterOnPointerUp( 'albirea', albirea, albireaFrame, albireaColor )
	characterOnPointerUp( 'bach', bach, bachFrame, bachColor )
	characterOnPointerUp( 'bear', bear, bearFrame, bearColor )
	characterOnPointerUp( 'entlein', entlein, entleinFrame, entleinColor )
	characterOnPointerUp( 'hauptmann', hauptmann, hauptmannFrame, hauptmannColor )
	characterOnPointerUp( 'neinhorn', neinhorn, neinhornFrame, neinhornColor )
	characterOnPointerUp( 'ronja', ronja, ronjaFrame, ronjaColor )

	scene.cameras.main.ignore([ berlin, ...frames, lensplus, lensminus ])
	camera.ignore([ lensplus, lensminus, leftSide, ronja, bear, bach, albirea, entlein, hauptmann, neinhorn, sams ])
	scene.cameras.add( 705 * s, 400 * s, 95 * s, 50 * s, false, 'viewOnLenses' )
		.setScroll( 705 * s, 400 * s)
		.ignore([ berlin, leftSide, ...frames, ronja, bear, bach, albirea, entlein, hauptmann, neinhorn, sams ])

	// Exit
	const stage = scene.add.rectangle( 0, 425 * s, 25 * s, 25 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: stage,
		nextScene: game.scenes.STAGE,
	})
	const subway = scene.add.rectangle( 145 * s, 375 * s, 92 * s, 75 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: subway,
		nextScene: game.scenes.FASSADE,
		soundsToKeep: [
			game.soundsPersistant.AMBIENCE.CITYRAIN,
		],
	})
	const subway2 = scene.add.rectangle( 345 * s, 125 * s, 45 * s, 40 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: subway2,
		nextScene: game.scenes.FASSADE,
		soundsToKeep: [
			game.soundsPersistant.AMBIENCE.CITYRAIN,
		],
	})

	log(`${scene.scene.key} created.`)
}



