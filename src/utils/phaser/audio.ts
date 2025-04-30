
import Phaser from 'phaser'
import { log } from '../general'
import { KeyAndVolume } from './common'

// type Sound = Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound
type Sound = Phaser.Sound.WebAudioSound
type SoundAndVolume = { sound: Sound, volume: number }

function add ({ scene, keyAndVolume }: {
	scene: Phaser.Scene,
	keyAndVolume: KeyAndVolume,
}): SoundAndVolume {

	const sound = scene.sound.add( keyAndVolume.key, { volume: keyAndVolume.volume } ) as Sound
	return { sound: sound, volume: keyAndVolume.volume }
}

function get ({ scene, keyAndVolume }: {
	scene: Phaser.Scene,
	keyAndVolume: KeyAndVolume,
}): SoundAndVolume {

	const sound = scene.sound.get( keyAndVolume.key ) as Sound
	return { sound: sound, volume: keyAndVolume.volume }
}

function play ( audio: SoundAndVolume ): SoundAndVolume {
// function play ( audio: SoundAndVolume, ...args ): SoundAndVolume {
	// // Guard
	// if ( p.scene.sound.gameLostFocus ) {
	// 	log( `Not playing "${p.audio.sound.key}" because game lost focus.` )
	// 	return p.audio
	// }

	audio.sound.play({ volume: audio.volume })
	// audio.sound.play({ volume: audio.volume, ...args })
	return audio
}

function stop ( audio: SoundAndVolume ): SoundAndVolume {
	audio.sound.stop()
	return audio
}

function togglePause ( audio: SoundAndVolume ): SoundAndVolume {
	if ( audio.sound.isPaused ) {
		audio.sound.resume()
	} else if ( audio.sound.isPlaying ) {
		audio.sound.pause()
	}
	return audio
}

function toggleLoop ( audio: SoundAndVolume ): SoundAndVolume {
	if ( audio.sound.isPaused ) {
		audio.sound.resume()
	} else if ( !audio.sound.isPlaying ) {
		audio.sound.play({ loop: true, volume: audio.volume })
	} else {
		audio.sound.stop()
	}
	return audio
}

function fadeOut ({ scene, sounds, duration, destroy }: {
	scene: Phaser.Scene,
	sounds: Array<Sound | Phaser.GameObjects.Video>,
	duration: number,
	destroy?: boolean,
}): void {

	log( sounds )
	duration = duration === 0 ? 1 : duration

	sounds.forEach( oneSound => {

		if ( !oneSound ) {
			log(`audio.ts fadeOut: sound is ${oneSound}`)
			return
		}

		if ( !oneSound.isPlaying && destroy ) {
			oneSound.destroy()
			return
		}

		oneSound.removeAllListeners( 'complete' )
		const volume = ( 'volume' in oneSound ) ? oneSound.volume : oneSound.getVolume()
		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: duration,
			ease: 'linear',
			onUpdate: tween => {
				oneSound.setVolume( tween.getValue() / 100 * volume )
			},
			onComplete: () => {
				if (oneSound) {
					if ( destroy ) {
						oneSound.destroy()
					} else {
						oneSound.stop()
					}
				}
			},
		})
	})
}

export type {
	Sound,
	SoundAndVolume,
}
export {
	add,
	get,
	fadeOut,
	stop,
	toggleLoop,
	togglePause,
	play,
}
