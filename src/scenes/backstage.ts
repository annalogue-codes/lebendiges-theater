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
import { debug, onMobileDevice, onTablet } from '../utils/general'
import * as Up from '../utils/phaser/common'
import * as Audio from '../utils/phaser/audio'
import * as Inventory from '../utils/inventory'
import { addExit } from '../utils/phaser/exit'

/* Main part */

// const lofiVolume = 0.4

const videoWidth  = ( onMobileDevice() && !onTablet() ) ? 426 : 640
const videoHeight = ( onMobileDevice() && !onTablet() ) ? 240 : 360
const videoScale  = ( onMobileDevice() && !onTablet() ) ? 0.95 : 1.2


export default class Backstage extends Phaser.Scene {

	constructor() {
		super( game.scenes.Backstage )
	}

	// init() {
	// }

	preload() {
		this.load.video('maske', `backstage/videos/${videoHeight}p/01-maskeNeinhorn.mp4`);
		this.load.video('licht', `backstage/videos/${videoHeight}p/02-neinhornLichtUndTon.mp4`);
		this.load.video('studio', `backstage/videos/${videoHeight}p/03-studiobuehne.mp4`);
		this.load.video('werkstatt', `backstage/videos/${videoHeight}p/04-buehnenbauWerkstatt.mp4`);
		this.load.video('kasse', `backstage/videos/${videoHeight}p/05-kasseTickets.mp4`);
		// filters
		// this.load.video('grain', `backstage/videos/filter_grain.mp4`);
	}

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Inventory.load({ game: game, scene: this })
		Up.assets.load({ game: game, scene: this })
	}

	// update() {//
	// }
}

function go ( scene: Phaser.Scene ): void {
	//Ambience
	const background = scene.add.rectangle( 0, 0, w, h, 0xccaa99).setOrigin( 0 ).setDepth( 0 )
	Up.addBackground({ game: game, scene: scene, key: game.images.backstage.background.key }).setDepth( 20 )
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.lofi.key, volume: game.soundsPersistant.ambience.lofi.volume, fadeIn: 3000 })

	// Sounds
	const switchDouble = Audio.add({ scene: scene, keyAndVolume: game.sounds.backstage.switchdouble })
	const switchLarge  = Audio.add({ scene: scene, keyAndVolume: game.sounds.backstage.switchlarge  })
	const switchSmall  = Audio.add({ scene: scene, keyAndVolume: game.sounds.backstage.switchsmall  })

	// Objects
	const maske           = scene.add.video(340 * s, 210 * s, 'maske'           )
	const licht           = scene.add.video(340 * s, 210 * s, 'licht'           )
	const studio          = scene.add.video(340 * s, 210 * s, 'studio'          )
	const werkstatt       = scene.add.video(340 * s, 210 * s, 'werkstatt'       )
	const kasse           = scene.add.video(340 * s, 210 * s, 'kasse'           )

	const videos = [ maske, licht, studio, werkstatt, kasse ]
	videos.forEach( video => {
		video.stop()
			.setOrigin( 0.5 )
			.setDepth( 1 )
			.setSize( videoWidth, videoHeight )
			.setScale( videoScale )
			.setDataEnabled()
	})

	// // filters
	// const grain = scene.add.video(340 * s, 210 * s, 'grain')
	// 	.setOrigin( 0.5 )
	// 	.setDepth( 2 )
	// 	.setSize( videoWidth, videoHeight )
	// 	.setScale( 1.65 )
	// 	.setAlpha( 1 )

	let currentVideo = videos.length
	let currentTween: ( Phaser.Tweens.Tween | undefined ) = undefined

	scene.events.on( Phaser.Scenes.Events.PAUSE, () => {
		videos.forEach( video => {
			video.pause()
		})
	})
	scene.events.on( Phaser.Scenes.Events.RESUME, () => {
		videos.forEach( video => {
			if ( video === videos[currentVideo] ) {
				if ( !video.data.values.paused ) video.resume()
				return
			}
			// deal with bug in firefox
			video.stop().seekTo( 0 )
		})
	})

	const maxVolume = 1
	// FIXME?
	videos.forEach( video => video.on( Phaser.GameObjects.Events.VIDEO_COMPLETE, () => {
		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1500,
			ease: 'linear',
			onUpdate: tween => {
				videos[currentVideo]
					.setVolume( tween.getValue() / 100 * maxVolume )
					.setAlpha( tween.getValue() / 100 )
			},
			onComplete: () => {
				stop( videos[currentVideo] )
					.seekTo( 0 )
					.setVisible( false )
			},
		})
	}))

	const knobProgram = scene.add.sprite( 604 * s,  91 * s, game.sprites.backstage.knobprogram.key )
	const knobYellow1 = scene.add.sprite( 567 * s, 240 * s, game.sprites.backstage.knobyellow1.key )
	const knobYellow2 = scene.add.sprite( 604 * s, 240 * s, game.sprites.backstage.knobyellow2.key )
	const knobRed     = scene.add.sprite( 642 * s, 240 * s, game.sprites.backstage.knobred.key     )
	const knobs = [ knobProgram, knobYellow1, knobYellow2, knobRed ]
	knobs.forEach( knob => knob.setDepth( 25 ).setInteractive() )

	knobProgram.on( Phaser.Input.Events.POINTER_UP, () => {
		Audio.play( switchDouble )
		toggleProgramm()
	})

	const knobPower = scene.add.rectangle( 550 * s, 137 * s, 105 * s, 74 * s, 0x553366)
		.setOrigin( 0 ).setDepth( 25 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	knobPower.on( Phaser.Input.Events.POINTER_UP, () => {
		togglePower()
	})

	let currentKnobYellow1 = 0
	let currentKnobYellow2 = 0
	let rewinding: ( Phaser.Time.TimerEvent | undefined ) = undefined
	knobYellow1.on( Phaser.Input.Events.POINTER_UP, () => {
		if ( !videos[currentVideo] ) return
		resetKnobYellow2( videos[currentVideo] )
		currentKnobYellow1 = ( currentKnobYellow2 !== 0 ) ? 1 : (currentKnobYellow1 + 1) % 3
		knobYellow1.setFrame( currentKnobYellow1 )
		currentKnobYellow2 = 0
		knobYellow2.setFrame( currentKnobYellow2 )
		// videos[currentVideo].setPlaybackRate( currentKnobYellow1 + 1 )
		if ( rewinding ) scene.time.removeEvent( rewinding )

		if ( currentKnobYellow1 == 0 ) {
			Audio.play( switchLarge )
			return
		}
		Audio.play( switchSmall )
		resume( videos[currentVideo] )
		rewind( videos[currentVideo], currentKnobYellow1 )
	})
	knobYellow2.on( Phaser.Input.Events.POINTER_UP, () => {
		if ( !videos[currentVideo] ) return
		resetKnobYellow1( videos[currentKnobYellow1] )
		currentKnobYellow2 = ( currentKnobYellow1 !== 0 ) ? 1 : (currentKnobYellow2 + 1) % 3
		knobYellow2.setFrame( currentKnobYellow2 )
		if ( currentKnobYellow2 == 0 ) {
			Audio.play( switchLarge )
		} else {
			Audio.play( switchSmall )
		}
		resume( videos[currentVideo] )
		videos[currentVideo].setPlaybackRate( currentKnobYellow2 + 1 )
	})
	knobRed.on( Phaser.Input.Events.POINTER_UP, () => {
		toggleTint()
	})
	function resetKnobYellow1 ( video: Phaser.GameObjects.Video ) {
		if ( rewinding ) scene.time.removeEvent( rewinding )
		video.setPlaybackRate( 1 )
		currentKnobYellow1 = 0
		knobYellow1.setFrame( 0 )
	}
	function resetKnobYellow2 ( video?: Phaser.GameObjects.Video ) {
		currentKnobYellow2 = 0
		knobYellow2.setFrame( 0 )
		video?.setPlaybackRate( 1 )
	}
	function resetKnobRed ( video: Phaser.GameObjects.Video ) {
		knobRed.setFrame( 0 )
		video.clearTint()
	}

	function stop ( video: Phaser.GameObjects.Video ) {
		resetKnobYellow1( video )
		resetKnobYellow2( video )
		resetKnobRed( video )
		if ( currentTween) scene.tweens.remove( currentTween )
		video.stop()
		return video
	}
	function pause ( video: Phaser.GameObjects.Video ) {
		resetKnobYellow1( video )
		resetKnobYellow2( video )
		video
			.pause()
			.setData( 'paused', true )
		return video
	}
	function resume ( video: Phaser.GameObjects.Video ) {
		video
			.resume()
			.setData( 'paused', false )
		return video
	}
	function rewind ( video: Phaser.GameObjects.Video, speed: number ) {
		video.setPlaybackRate( 0.1 )
		const rate = 1 * speed
		if ( video.getCurrentTime() < rate + 0.01 ) {
			resetKnobYellow1( video )
			return
		}
		video.setCurrentTime( video.getCurrentTime() - rate )
		rewinding = scene.time.delayedCall( 500, rewind, [ video, speed ] )
	}
	function toggleProgramm () {
		videos.forEach( video => {
			stop( video )
				.seekTo( 0 )
				.setVisible( false )
		})
		if ( currentVideo == videos.length ) {
			knobProgram.setFrame( (currentVideo + 2) % (videos.length + 1) )
			background.fillColor = 0x000000
			currentVideo = (currentVideo + 1) % (videos.length + 1)
			const video = videos[currentVideo]
			video
				.setVolume( 0.001 )
				.setAlpha( 0.001 )
				.seekTo( 0 )
				.play()
				.setVisible( true )
			currentTween = scene.tweens.addCounter({
				from: 1,
				to: 100,
				duration: 1500,
				ease: 'linear',
				onUpdate: tween => {
					video.setVolume( tween.getValue() / 100 * maxVolume )
					video.setAlpha( tween.getValue() / 100 )
				},
			})
			return
		}

		knobProgram.setFrame( (currentVideo + 2) % (videos.length + 1) )
		currentVideo = (currentVideo + 1) % (videos.length + 1)

		if ( currentVideo == videos.length ) {
			background.fillColor = 0xccaa99
			return
		}

		background.fillColor = 0x000000
		const nextVideo = videos[currentVideo]
		nextVideo
			.setVolume( 0.001 )
			.setAlpha( 0.001 )
			.seekTo( 0 )
			.play()
			.setVisible( true )
		currentTween = scene.tweens.addCounter({
			from: 1,
			to: 100,
			duration: 1500,
			ease: 'linear',
			onUpdate: tween => {
				nextVideo.setVolume( tween.getValue() / 100 * maxVolume )
				nextVideo.setAlpha( tween.getValue() / 100 )
			},
		})
	}

	function togglePower () {
		if ( videos[currentVideo].isPlaying() ) {
			Audio.play( switchSmall )
			pause( videos[currentVideo] )
		} else {
			Audio.play( switchLarge )
			resume( videos[currentVideo] )
		}
	}

	const tints = [ 0x6677ff, 0x55ff77, 0xff55aa ]
	let currentTint = tints.length
	let currentKnobRed = 0
	function toggleTint () {
		if ( !videos[currentVideo] ) return

		currentTint = (currentTint + 1) % (tints.length + 1)
		if ( currentTint === tints.length ) {
			Audio.play( switchLarge )
			currentKnobRed = 0
			knobRed.setFrame( 0 )
			videos[currentVideo].clearTint()
			return
		}
		currentKnobRed = (currentKnobRed % 2) + 1
		knobRed.setFrame( currentKnobRed )
		Audio.play( switchSmall )
		videos[currentVideo].tint = tints[currentTint]
	}

	// Stray tems
	if ( !game.state.get().inventory.includes('wunschmaschine') ) {
		const chest = Inventory.createChest({ game, scene })

		const wunschmaschine = scene.add.image( 725 * s, 323 * s, game.images.backstage.wunschmaschine.key )
			.setRotation( 0.2 )
			.setDepth(25)
			.setInteractive()
		wunschmaschine.on( 'pointerup', () => { chest.foundItem({ item: 'wunschmaschine', image: wunschmaschine }) })
	}

	// Exits
	const foyer = scene.add.rectangle( 0, 0, 100 * s, h, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: foyer,
		nextScene: game.scenes.Foyer,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
}

