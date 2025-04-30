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

import * as Up from '../utils/phaser/common'
import * as Audio from '../utils/phaser/audio'

import { game } from '../constants'
import { debug, log } from '../utils/general'
import { addExit } from '../utils/phaser/exit'


/* Types */

type Playlight = {
	darkCircle: Phaser.GameObjects.Image,
	redCircle: Phaser.GameObjects.Image,
	rotation: number,
	startAngle: number,
	endAngle: number,
	x: number,
	y: number,
	radius: number,
	maskShape: Phaser.GameObjects.Graphics,
	tween: Phaser.Tweens.Tween | undefined,
}

/* Constants */

const initialRotation = 120
const initialStartAngle = 0
const initialEndAngle = 0
const maxAngle = 300

/* Main part */

export default class Looper extends Phaser.Scene {

	constructor() {
		super( game.scenes.Looper )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Up.assets.load({ game: game, scene: this })
	}

	// update() {
	// }
}

async function go ( scene: Phaser.Scene ): Promise<void> {

	// Sound Effects

	// Access Phaser's Web Audio context
	const webAudio = scene.sound as Phaser.Sound.WebAudioSoundManager
	const context = webAudio.context

	// // Filter
	// const filter = context.createBiquadFilter()
	// filter.type = 'lowpass' // or 'highpass', 'bandpass'
	// filter.frequency.value = 200 // Hz

	// Create delay node
	const delay = context.createDelay()
	delay.delayTime.value = 0.47 // seconds

	// Optional feedback loop
	const feedback = context.createGain()
	feedback.gain.value = 0.5
	delay.connect(feedback)
	feedback.connect(delay)

	// Create Reverb Node
	const convolver = context.createConvolver()

	// Decode the impulse response (IR) buffer
	const irData = scene.cache.binary.get( game.binaries.looper.impulseresponse.key ) // raw ArrayBuffer
	console.log( irData )
	await context.decodeAudioData(irData.slice(0), decoded => {
		convolver.buffer = decoded
	})

	// Create gain node for output volume
	const audiobus = context.createGain()

	// Connect everything: Phaser → Delay → Output → Speakers

	let delayActive = false
	let reverbActive = false

	// @ts-ignore: Accessing internal property (still works!)
	const masterGain = (webAudio as any).masterVolumeNode

	// masterGain.disconnect() // Remove default output
	masterGain.connect( audiobus )
	audiobus.connect( context.destination )

	// Ambience
	//
	// const backgraund = scene.add.graphics()
	// backgraund.fillStyle(0x0000ff, 1); // Black with 50% opacity
	// backgraund.fillRect(0, 0, 1600, 900); // Size of the game screen

	const background = Up.addBackground({ game: game, scene: scene, key: game.images.looper.background.key })

	// Sounds
	const looperSounds = game.sounds.looper

	const switchSmall = Audio.get({ scene, keyAndVolume: looperSounds.switchsmall })

	type Bank = [
		Audio.SoundAndVolume,
		Audio.SoundAndVolume,
		Audio.SoundAndVolume,
		Audio.SoundAndVolume,
		Audio.SoundAndVolume,
	]

	const bank1: Bank = [
		Audio.get({ scene, keyAndVolume: looperSounds.pop_punk_drums }),
		Audio.get({ scene, keyAndVolume: looperSounds.pop_punk_bass }),
		Audio.get({ scene, keyAndVolume: looperSounds.pop_punk_chords }),
		Audio.get({ scene, keyAndVolume: looperSounds.pop_punk_melody }),
		Audio.get({ scene, keyAndVolume: looperSounds.pop_punk_texture }),
	]
	const bank2: Bank = [
		Audio.get({ scene, keyAndVolume: looperSounds.boom_bap_drums }),
		Audio.get({ scene, keyAndVolume: looperSounds.boom_bap_texture }),
		Audio.get({ scene, keyAndVolume: looperSounds.boom_bap_melody }),
		Audio.get({ scene, keyAndVolume: looperSounds.boom_bap_chords }),
		Audio.get({ scene, keyAndVolume: looperSounds.boom_bap_bass }),
	]
	const bank3: Bank = [
		Audio.get({ scene, keyAndVolume: looperSounds.ghost_drums }),
		Audio.get({ scene, keyAndVolume: looperSounds.ghost_bass }),
		Audio.get({ scene, keyAndVolume: looperSounds.ghost_texture }),
		Audio.get({ scene, keyAndVolume: looperSounds.ghost_chords }),
		Audio.get({ scene, keyAndVolume: looperSounds.ghost_melody }),
	]
	const bank4: Bank = [
		Audio.get({ scene, keyAndVolume: looperSounds.indian_bass }),
		Audio.get({ scene, keyAndVolume: looperSounds.indian_drums }),
		Audio.get({ scene, keyAndVolume: looperSounds.indian_chords }),
		Audio.get({ scene, keyAndVolume: looperSounds.indian_melody }),
		Audio.get({ scene, keyAndVolume: looperSounds.indian_texture }),
	]

	const banks = [ bank1, bank2, bank3, bank4 ]

	let loadedBank = bank1
    convolver.connect(context.destination);

	// Objects

	const delayButton = scene.add.circle( 1395, 150, 75, 0x111111 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 )
	delayButton.off('pointerdown').on( 'pointerdown', () => {
		if ( delayActive ) {
			delayButton.setAlpha( 0.001 )
			masterGain.disconnect( delay )
			delay.disconnect( audiobus )
		} else {
			delayButton.setAlpha( 0.501 )
			delay.connect( audiobus )
			masterGain.connect( delay )
		}
		delayActive = !delayActive
	})

	const reverbButton = scene.add.circle( 235, 157, 75, 0x111111 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 )
	reverbButton.off('pointerdown').on( 'pointerdown', () => {
		if ( reverbActive ) {
			reverbButton.setAlpha( 0.001 )
			audiobus.disconnect( convolver )
			convolver.disconnect( context.destination )
		} else {
			reverbButton.setAlpha( 0.501 )
			convolver.connect( context.destination )
			audiobus.connect( convolver )
		}
		reverbActive = !reverbActive
	})

	const bankButtons = [
		scene.add.circle(  683, 273, 40, 0x993399 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
		scene.add.circle(  772, 275, 40, 0x993399 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 ),
		scene.add.circle(  860, 272, 40, 0x993399 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 ),
		scene.add.circle(  950, 270, 40, 0x993399 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 ),
	]

	const playButtons = [
		scene.add.circle(  300, 690, 100, 0x111111 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
		scene.add.circle(  560, 690, 100, 0x111111 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
		scene.add.circle(  820, 690, 100, 0x111111 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
		scene.add.circle( 1080, 690, 100, 0x111111 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
		scene.add.circle( 1340, 685, 100, 0x111111 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
	]
	const pauseButtons = [
		scene.add.circle(  235, 550, 32, 0x111111 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 ),
		scene.add.circle(  496, 547, 32, 0x111111 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 ),
		scene.add.circle(  758, 546, 32, 0x111111 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 ),
		scene.add.circle( 1017, 545, 32, 0x111111 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 ),
		scene.add.circle( 1283, 543, 32, 0x111111 ).setInteractive().setAlpha( debug ? 0.001 : 0.001 ),
	]
	const slowButtons = [
		scene.add.ellipse(  239, 382, 65, 28, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
		scene.add.ellipse(  500, 380, 65, 28, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
		scene.add.ellipse(  762, 379, 65, 28, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
		scene.add.ellipse( 1021, 378, 68, 30, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
		scene.add.ellipse( 1280, 376, 65, 28, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
	]
	const fastButtons = [
		scene.add.ellipse(  239, 450, 65, 28, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
		scene.add.ellipse(  500, 447, 65, 28, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
		scene.add.ellipse(  762, 446, 65, 28, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
		scene.add.ellipse( 1021, 445, 68, 30, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
		scene.add.ellipse( 1280, 443, 65, 28, 0x111111 ).setInteractive().setAlpha( debug ? 0.201 : 0.001 ),
	]
	const sliders = [
		scene.add.rectangle(  355, 400, 100, 50, 0x993399 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
		scene.add.rectangle(  617, 400, 100, 50, 0x993399 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
		scene.add.rectangle(  878, 400, 100, 50, 0x993399 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
		scene.add.rectangle( 1140, 400, 100, 50, 0x993399 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
		scene.add.rectangle( 1400, 400, 100, 50, 0x993399 ).setInteractive().setAlpha( debug ? 0.501 : 0.501 ),
	]


	scene.input.addPointer()
	scene.input.addPointer()
	scene.input.addPointer()
	scene.input.addPointer()

	// Sliders
	const minY = 400
	const maxY = 540
	sliders.forEach( slider => {
		scene.input.setDraggable( slider )
	})
	scene.input.on('drag', (
		pointer: Phaser.Input.Pointer,
		gameObject: Phaser.GameObjects.Rectangle,
		dragX: number,
		dragY: number,
	) => {
		if ( sliders.includes( gameObject ) ) {
			gameObject.y = Phaser.Math.Clamp(dragY, minY, maxY)
			const volume = 1 - (gameObject.y - minY) / (maxY - minY);
			loadedBank[ sliders.indexOf( gameObject ) ].sound.setVolume( volume )
		}
	})

	// Buttons
	for ( const [index, button] of bankButtons.entries() ) {
		button.off('pointerdown').on( 'pointerdown', () => {
			bankButtons.forEach( button => button.setAlpha( 0.001 ) )
			button.setAlpha( 0.501 )
			Audio.play( switchSmall )
			playButtons.forEach( button => button.setAlpha( 0.501 ) )
			pauseButtons.forEach( button => button.setAlpha( 0.001 ) )
			slowButtons.forEach( button => button.setAlpha( 0.001 ) )
			fastButtons.forEach( button => button.setAlpha( 0.001 ) )
			loadedBank.forEach( sound => sound.sound.setRate( 1 ).stop() )
			loadedBank = banks[ index ]
		})
	}

	for ( const [index, button] of playButtons.entries() ) {
		button.off('pointerdown').on( 'pointerdown', () => {
			pauseButtons[ index ].setAlpha( 0.001 )
			button.setAlpha( (button.alpha + 0.5) % 1 )
			const audio = loadedBank[ index ]
			const volume = 1 - (sliders[ index ].y - minY) / (maxY - minY);
			Audio.toggleLoop({ sound: audio.sound, volume })
		})
	}

	for ( const [index, button] of pauseButtons.entries() ) {

		button.off('pointerdown').on( 'pointerdown', () => {
			button.setAlpha( 0.501 )
			const audio = loadedBank[ index ]
			if ( audio.sound.isPlaying ) audio.sound.pause()
		})
		button.off('pointerup').on( 'pointerup', () => {
			button.setAlpha( 0.001 )
			const audio = loadedBank[ index ]
			if ( audio.sound.isPaused ) audio.sound.resume()
		})
	}

	for ( const [index, button] of slowButtons.entries() ) {
			const speed = 0.75

		button.off('pointerdown').on( 'pointerdown', () => {
			const audio = loadedBank[ index ]
			if ( audio.sound.rate === speed ) {
				button.setAlpha( 0.001 )
				audio.sound.setRate( 1 )
			} else {
				fastButtons[ index ].setAlpha( 0.001 )
				button.setAlpha( 0.501 )
				audio.sound.setRate( speed )
			}
		})
	}
	for ( const [index, button] of fastButtons.entries() ) {
		const speed = 1.5

		button.off('pointerdown').on( 'pointerdown', () => {
			const audio = loadedBank[ index ]
			if ( audio.sound.rate === speed ) {
				button.setAlpha( 0.001 )
				audio.sound.setRate( 1 )
			} else {
				slowButtons[ index ].setAlpha( 0.001 )
				button.setAlpha( 0.501 )
				audio.sound.setRate( speed )
			}
		})
	}

	const playlights: Array<Playlight> = [
		{
			x: 295,
			y: 690,
			radius: 85,
			darkCircle: scene.add.image(  295, 690, game.images.looper.darkCircle.key ),
			redCircle: scene.add.image(  295, 690, game.images.looper.redCircle.key ),
			rotation: initialRotation,
			startAngle: initialStartAngle,
			endAngle: initialEndAngle,
			maskShape: scene.make.graphics( {}, false )
				.lineStyle( 20, 0xffffff )
				.beginPath()
				.arc( 295, 690, 85,
					Phaser.Math.DegToRad( initialRotation + initialStartAngle ),
					Phaser.Math.DegToRad( initialRotation + initialEndAngle ),
					false
				)
				.strokePath(),
			tween: undefined,
		},
		{
			x: 556,
			y: 690,
			radius: 85,
			darkCircle: scene.add.image(  556, 690, game.images.looper.darkCircle.key ),
			redCircle: scene.add.image(  556, 690, game.images.looper.redCircle.key ),
			rotation: initialRotation,
			startAngle: initialStartAngle,
			endAngle: initialEndAngle,
			maskShape: scene.make.graphics( {}, false )
				.lineStyle( 20, 0xffffff )
				.beginPath()
				.arc( 556, 690, 85,
					Phaser.Math.DegToRad( initialRotation + initialStartAngle ),
					Phaser.Math.DegToRad( initialRotation + initialEndAngle ),
					false
				)
				.strokePath(),
			tween: undefined,
		},
		{
			x: 820,
			y: 690,
			radius: 85,
			darkCircle: scene.add.image(  820, 690, game.images.looper.darkCircle.key ),
			redCircle: scene.add.image(  820, 690, game.images.looper.redCircle.key ),
			rotation: initialRotation,
			startAngle: initialStartAngle,
			endAngle: initialEndAngle,
			maskShape: scene.make.graphics( {}, false )
				.lineStyle( 20, 0xffffff )
				.beginPath()
				.arc( 820, 690, 85,
					Phaser.Math.DegToRad( initialRotation + initialStartAngle ),
					Phaser.Math.DegToRad( initialRotation + initialEndAngle ),
					false
				)
				.strokePath(),
			tween: undefined,
		},
		{
			x: 1080,
			y: 690,
			radius: 85,
			darkCircle: scene.add.image(  1080, 690, game.images.looper.darkCircle.key ),
			redCircle: scene.add.image(  1080, 690, game.images.looper.redCircle.key ),
			rotation: initialRotation,
			startAngle: initialStartAngle,
			endAngle: initialEndAngle,
			maskShape: scene.make.graphics( {}, false )
				.lineStyle( 20, 0xffffff )
				.beginPath()
				.arc( 1080, 690, 85,
					Phaser.Math.DegToRad( initialRotation + initialStartAngle ),
					Phaser.Math.DegToRad( initialRotation + initialEndAngle ),
					false
				)
				.strokePath(),
			tween: undefined,
		},
		{
			x: 1345,
			y: 684,
			radius: 85,
			darkCircle: scene.add.image(  1345, 684, game.images.looper.darkCircle.key ),
			redCircle: scene.add.image(  1345, 684, game.images.looper.redCircle.key ),
			rotation: initialRotation,
			startAngle: initialStartAngle,
			endAngle: initialEndAngle,
			maskShape: scene.make.graphics( {}, false )
				.lineStyle( 20, 0xffffff )
				.beginPath()
				.arc( 1345, 684, 85,
					Phaser.Math.DegToRad( initialRotation + initialStartAngle ),
					Phaser.Math.DegToRad( initialRotation + initialEndAngle ),
					false
				)
				.strokePath(),
			tween: undefined,
		},
	]

	for ( const playlight of playlights ) {
		playlight.redCircle.setMask( playlight.maskShape.createGeometryMask() )
	}

	for ( const bank of banks ) {
		for ( let i = 0; i < playlights.length; i++ ) {
			bank[ i ].sound.off('play').on( 'play', () => {
				startPlaylight({ scene, playlight: playlights[ i ], sound: bank[ i ].sound })
			})
			bank[ i ].sound.off('looped').on( 'looped', () => {
				startPlaylight({ scene, playlight: playlights[ i ], sound: bank[ i ].sound })
			})
			bank[ i ].sound.off('paused').on( 'pause', () => {
				playlights[ i ].tween?.pause()
			})
			bank[ i ].sound.off('resume').on( 'resume', () => {
				playlights[ i ].tween?.resume()
			})
		}
	}


	// Exits
	const showroomBottom = scene.add.rectangle( 0, 820, 1600, 80, 0x553366).setOrigin( 0 ).setInteractive()
		.setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: showroomBottom,
		nextScene: game.scenes.Showroom,
	})
	const showroomLowerLeft = scene.add.rectangle( 0, 600, 110, 220, 0x553366).setOrigin( 0 ).setInteractive()
		.setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: showroomLowerLeft,
		nextScene: game.scenes.Showroom,
	})
	const showroomUpperLeft = scene.add.rectangle( 0, 0, 90, 600, 0x553366).setOrigin( 0 ).setInteractive()
		.setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: showroomUpperLeft,
		nextScene: game.scenes.Showroom,
	})
	const showroomLowerRight = scene.add.rectangle( 1500, 600, 100, 220, 0x553366).setOrigin( 0 ).setInteractive()
		.setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: showroomLowerRight,
		nextScene: game.scenes.Showroom,
	})
}

function startPlaylight(p: { scene: Phaser.Scene, playlight: Playlight, sound: Audio.Sound }) {

	p.playlight.tween?.stop()
	p.playlight.tween?.destroy()
	resetPlaylight({ playlight: p.playlight })

	p.playlight.tween = p.scene.tweens.addCounter({
		from: 0,
		to: 100,
		duration: p.sound.totalDuration * 1000 ,
		loop: -1,
		ease: 'linear',
		onUpdate: tween => {
			const progress = p.sound.seek / p.sound.totalDuration
			if ( p.playlight.endAngle < maxAngle ) {
				p.playlight.endAngle = 2 * (progress) * maxAngle
			} else if ( p.playlight.startAngle >= maxAngle ) {
				p.playlight.startAngle = initialStartAngle
				p.playlight.endAngle = initialEndAngle
			} else {
				p.playlight.startAngle = 2 * (( progress - 0.5 )) * maxAngle
			}
			updateArcMask({ playlight: p.playlight })
		},
		onComplete: () => {
			resetPlaylight({ playlight: p.playlight })
		},
		onStop: () => {
			resetPlaylight({ playlight: p.playlight })
		},
	})

	p.sound.once( 'stop', () => {
		p.playlight.tween?.stop()
		p.playlight.tween?.destroy()
	})
}

function resetPlaylight(p: { playlight: Playlight }) {
	p.playlight.startAngle = initialStartAngle
	p.playlight.endAngle = initialEndAngle
	updateArcMask({ playlight: p.playlight })
}

function updateArcMask(p: { playlight: Playlight }) {

	p.playlight.maskShape.clear()
	p.playlight.maskShape.lineStyle( 20, 0xffffff )
	p.playlight.maskShape.beginPath()
	p.playlight.maskShape.arc(
		p.playlight.x,
		p.playlight.y,
		p.playlight.radius,
		Phaser.Math.DegToRad( p.playlight.rotation + p.playlight.startAngle ),
		Phaser.Math.DegToRad( p.playlight.rotation + p.playlight.endAngle ),
		false
	)
	p.playlight.maskShape.strokePath()
	p.playlight.redCircle.setMask( p.playlight.maskShape.createGeometryMask() )
}

