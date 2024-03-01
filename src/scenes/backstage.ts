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
import { debug, log, onMobileDevice } from '../utils/general'
import * as Up from '../utils/phaser'

/* Main part */

// const lofiVolume = 0.4

const videoWidth = onMobileDevice() ? 426 : 640
const videoHeight = onMobileDevice() ? 240 : 360
const videoScale = onMobileDevice() ? 0.95 : 1.2

export default class Backstage extends Phaser.Scene {

	constructor() {
		super( game.scenes.BACKSTAGE )
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
		Up.loadAssets({ game: game, scene: this })
	}

	// update() {//
	// }
}

function go ( scene: Phaser.Scene ): void {
	//Ambience
	scene.add.rectangle( 0, 0, w, h, 0xccaa99).setOrigin( 0 ).setDepth( 0 )
	Up.addBackground({ game: game, scene: scene, key: game.images.BACKSTAGE.BACKGROUND.key }).setDepth( 20 )
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPERSISTANT.AMBIENCE.LOFI.key, volume: game.soundsPERSISTANT.AMBIENCE.LOFI.volume, fadeIn: 3000 })

	// Sounds
	const switchLarge = Up.audio.add({ scene: scene, sound: game.sounds.BACKSTAGE.SWITCHLARGE })

	// Objects
	const maske = scene.add.video(340 * s, 210 * s, 'maske')
		.setOrigin( 0.5 )
		.setDepth( 1 )
		.setSize( videoWidth, videoHeight )
		.setScale( videoScale )
	const licht = scene.add.video(340 * s, 210 * s, 'licht')
		.setOrigin( 0.5 )
		.setDepth( 1 )
		.setSize( videoWidth, videoHeight )
		.setScale( videoScale )
	const studio = scene.add.video(340 * s, 210 * s, 'studio')
		.setOrigin( 0.5 )
		.setDepth( 1 )
		.setSize( videoWidth, videoHeight )
		.setScale( videoScale )
	const werkstatt = scene.add.video(340 * s, 210 * s, 'werkstatt')
		.setOrigin( 0.5 )
		.setDepth( 1 )
		.setSize( videoWidth, videoHeight )
		.setScale( videoScale )
	const kasse = scene.add.video(340 * s, 210 * s, 'kasse')
		.setOrigin( 0.5 )
		.setDepth( 1 )
		.setSize( videoWidth, videoHeight )
		.setScale( videoScale )
	// // filters
	// const grain = scene.add.video(340 * s, 210 * s, 'grain')
	// 	.setOrigin( 0.5 )
	// 	.setDepth( 2 )
	// 	.setSize( videoWidth, videoHeight )
	// 	.setScale( 1.65 )
	// 	.setAlpha( 1 )

	const videos = [ maske, licht, studio, werkstatt, kasse ]
	let currentVideo = videos.length - 1
	scene.events.on( Phaser.Scenes.Events.PAUSE, () => {
		videos[currentVideo].pause()
	})
	scene.events.on( Phaser.Scenes.Events.RESUME, () => {
		videos[currentVideo].resume()
	})

	const maxVolume = 1
	videos.forEach( video => video.on( Phaser.GameObjects.Events.VIDEO_COMPLETE, () => {
		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1500,
			ease: 'linear',
			onUpdate: tween => {
				videos[currentVideo].setVolume( tween.getValue() / 100 * maxVolume )
				videos[currentVideo].setAlpha( tween.getValue() / 100 )
			},
			onComplete: () => {
				videos[currentVideo].stop()
				videos[currentVideo].seekTo( 0 )
				videos[currentVideo].setVisible( false )
			},
		})
	}))

	const toggleProgramm = () => {
		// if ( !grain.isPlaying() ) grain.play().setLoop( true )
		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1500,
			ease: 'linear',
			onUpdate: tween => {
				videos[currentVideo].setVolume( tween.getValue() / 100 * maxVolume )
				videos[currentVideo].setAlpha( tween.getValue() / 100 )
			},
			onComplete: () => {
				videos[currentVideo]
					.stop()
					.seekTo( 0 )
					.setVisible( false )
				currentVideo = (currentVideo + 1) % videos.length
				videos[currentVideo]
					.setVolume( 0.001 )
					.setAlpha( 0.001 )
					.play()
					.setVisible( true )
				scene.tweens.addCounter({
					from: 1,
					to: 100,
					duration: 1500,
					ease: 'linear',
					onUpdate: tween => {
						videos[currentVideo].setVolume( tween.getValue() / 100 * maxVolume )
						videos[currentVideo].setAlpha( tween.getValue() / 100 )
					},
				})
			}
		})
	}
	const togglePower = () => {
		if ( videos[currentVideo].isPlaying() ) {
			videos[currentVideo].pause()
		} else {
			videos[currentVideo].resume()
		}
	}

	const knobProgramme = scene.add.rectangle( 550 * s, 45 * s, 105 * s, 90 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 ).setDepth( 25 )
	knobProgramme.on( Phaser.Input.Events.POINTER_UP, () => {
		Up.audio.play({ scene: scene, audio: switchLarge })
		toggleProgramm()
	})

	const knobPower = scene.add.rectangle( 550 * s, 135 * s, 105 * s, 90 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 ).setDepth( 25 )
	knobPower.on( Phaser.Input.Events.POINTER_UP, () => {
		Up.audio.play({ scene: scene, audio: switchLarge })
		togglePower()
	})

	const toggleTint = ( video: Phaser.GameObjects.Video, newTint: number ) => {
		if ( video.tintTopLeft == newTint ) {
			video.clearTint()
		} else {
			console.log( video.tintTopLeft )
			video.tint = newTint
		}
	}
	const knobBlue = scene.add.rectangle( 550 * s, 223 * s, 35 * s, 35 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 ).setDepth( 25 )
	knobBlue.on( Phaser.Input.Events.POINTER_UP, () => {
		toggleTint( videos[currentVideo], 0x6677ff )
	})
	const knobGreen = scene.add.rectangle( 587 * s, 223 * s, 35 * s, 35 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 ).setDepth( 25 )
	knobGreen.on( Phaser.Input.Events.POINTER_UP, () => {
		toggleTint( videos[currentVideo], 0x55ff77 )
	})
	const knobPink = scene.add.rectangle( 625 * s, 223 * s, 35 * s, 35 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 ).setDepth( 25 )
	knobPink.on( Phaser.Input.Events.POINTER_UP, () => {
		toggleTint( videos[currentVideo], 0xff55aa )
	})


	// Exits
	const foyer = scene.add.rectangle( 0, 0, 100 * s, h, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: foyer,
		nextScene: game.scenes.FOYER,
		// soundsToKeep: [
		// 	game.soundsPERSISTANT.AMBIENCE.CITYRAIN,
		// 	game.soundsPERSISTANT.AMBIENCE.JAZZ,
		// ],
	})

	log(`${scene.scene.key} created.`)
}

