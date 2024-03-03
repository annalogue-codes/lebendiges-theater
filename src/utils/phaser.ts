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
import { log, debug } from '../utils/general'

const SHUTTINGDOWN = 'shuttingdown'
const ASSETSLOADED = 'assetsloaded'

type MinimalState = {
	hasStarted: boolean,
	paused: boolean,
	previousScene: string,
	currentScene: string,
	solo: Array<string>,
}
type GenericState = { [key: string]: any }

type Game = {
	config: {
		// ascii letters only
		name: string,
		width: number,
		height: number,
		scale: number,
		// 300 is a good setting for jump and runs
		gravity: number,
		// in milliseconds
		durationSceneTransition: number,
	},
	stateKey: string,
	initialState: MinimalState & GenericState,
	cache: Cache,
	scenes:              { [key: string]: string },
	images:              { [key: string]: {[key: string]: { key: string } } },
	sprites:             { [key: string]: {[key: string]: { key: string, width: number, height: number } } },
	soundsPersistant:    { [key: string]: {[key: string]: { key: string, volume: number } } },
	sounds:              { [key: string]: {[key: string]: { key: string, volume: number } } },
	videos:              { [key: string]: {[key: string]: { key: string, volume: number } } },
}


// LocalStorage API

function stateIsEmpty (p: {
	game: Game
}): boolean {
	const stored = localStorage.getItem( p.game.stateKey )
	const isEmpty = ( stored === undefined )
	return isEmpty
}
function getState (p: {
	game: Game,
}): GenericState {
	const stored = localStorage.getItem( p.game.stateKey )
	const state = ( stored === null ) ? p.game.initialState : JSON.parse( stored )
	return state
}
function setState (p: {
	game: Game,
	newState: GenericState,
}): GenericState {
	localStorage.setItem( p.game.stateKey, JSON.stringify( p.newState ) )
	return p.newState
}
function addState (p: {
	game: Game,
	change: GenericState
}): GenericState {
	const newState = { ...getState({ game: p.game }), ...p.change }
	setState({ game: p.game, newState: newState })
	return newState
}


// Cache API

const cacheOptions = {
	ignoreSearch: true,
	ignoreMethod: true,
	ignoreVary: true
}

const cacheAvailable = 'caches' in self
log( `Caches available: ${cacheAvailable}` )

async function openCache (p: {
	nameOfCache: string,
}): Promise<Cache> {
	const cache = await caches.open( `${p.nameOfCache}-cache` )
	return cache
}

async function addToCache( p: {
	cache: Cache,
	key: string
}): Promise<boolean> {
	log( `Adding "${p.key}" into cache.` )
	const inCache = await p.cache.match( p.key )
	if (inCache) {
		log( `"${p.key}" already loaded.` )
		return false
	}
	await p.cache.add( p.key )
	return true
}

async function loadImageFromCache (p: {
	cache: Cache,
	scene: Phaser.Scene,
	key: string,
}): Promise<Phaser.Loader.LoaderPlugin | undefined> {
	const item = await p.cache.match( p.key, cacheOptions )
	if ( item === undefined ) {
		log( `Cannot retrieve ${p.key} from cache.` )
		return
	}

	const blob = await item.blob()
	const url = URL.createObjectURL( blob )
	const image = p.scene.load.image( p.key, url )
	return image
}

async function loadSpriteFromCache (p: {
	cache: Cache,
	scene: Phaser.Scene,
	key: string,
	width: number,
	height: number,
}): Promise<Phaser.Loader.LoaderPlugin | undefined> {
	const item = await p.cache.match( p.key, cacheOptions )
	if ( item === undefined ) {
		log( `Cannot retrieve ${p.key} from cache.` )
		return
	}

	const blob = await item.blob()
	const url = URL.createObjectURL( blob )
	const sprite = p.scene.load.spritesheet( p.key, url, { frameWidth: p.width, frameHeight: p.height } )
	return sprite
}

async function loadAudioFromCache (p: {
	cache: Cache,
	scene: Phaser.Scene,
	key: string,
}): Promise<Phaser.Loader.LoaderPlugin | undefined> {
	const item = await p.cache.match( p.key, cacheOptions )
	if ( item === undefined ) {
		log( `Cannot retrieve ${p.key} from cache.` )
		return
	}

	const blob = await item.blob()
	const url = URL.createObjectURL( blob )
	const audio = p.scene.load.audio( p.key, [url] )
	return audio
}

async function loadVideoFromCache (p: {
	cache: Cache,
	scene: Phaser.Scene,
	key: string,
}): Promise<Phaser.Loader.LoaderPlugin | undefined> {
	const item = await p.cache.match( p.key, cacheOptions )
	if ( item === undefined ) {
		log( `Cannot retrieve ${p.key} from cache.` )
		return
	}

	const blob = await item.blob()
	const url = URL.createObjectURL( blob )
	const video = p.scene.load.video( p.key, [url] )
	return video
}

async function loadAssets (p: {
	game: Game,
	scene: Phaser.Scene,
}): Promise<void> {
	// Images
	if ( p.game.images[ p.scene.scene.key.toUpperCase() ] ) for (const value of Object.values( p.game.images[ p.scene.scene.key.toUpperCase() ] )) {
		await loadImageFromCache({ cache: p.game.cache, scene: p.scene, key: value.key })
	}
	// Sprites
	if ( p.game.sprites[ p.scene.scene.key.toUpperCase() ] ) for (const value of Object.values( p.game.sprites[ p.scene.scene.key.toUpperCase() ] )) {
		await loadSpriteFromCache({ cache: p.game.cache, scene: p.scene, key: value.key, width: value.width, height: value.height })
	}
	// Sounds
	if ( p.game.sounds[ p.scene.scene.key.toUpperCase() ] ) for (const value of Object.values( p.game.sounds[ p.scene.scene.key.toUpperCase() ] )) {
		await loadAudioFromCache({ cache: p.game.cache, scene: p.scene, key: value.key })
	}
	// Videos
	if ( p.game.videos[ p.scene.scene.key.toUpperCase() ] ) for (const value of Object.values( p.game.videos[ p.scene.scene.key.toUpperCase() ] )) {
		await loadVideoFromCache({ cache: p.game.cache, scene: p.scene, key: value.key })
	}
	// Cleanup
	p.scene.events.on( Phaser.Scenes.Events.SHUTDOWN, () => {
		unloadAssets({ scene: p.scene })
	})
	// Load audio
	p.scene.load.on( Phaser.Loader.Events.COMPLETE, () => {
		// Add Sounds
		if ( p.game.sounds[ p.scene.scene.key.toUpperCase() ] ) for (const value of Object.values( p.game.sounds[ p.scene.scene.key.toUpperCase() ] )) {
			p.scene.sound.add( value.key )
		}
		p.scene.events.emit( ASSETSLOADED )
	})
	p.scene.load.start()
	return
}

function unloadAssets (p: {	scene: Phaser.Scene }): void {
	p.scene.children.list
		.filter( item => (
			item instanceof Phaser.GameObjects.Image ||
			item instanceof Phaser.GameObjects.Sprite ||
			item instanceof Phaser.GameObjects.Video
		))
		.forEach( item => { if (item) item.destroy() } )
	return
}

const audio: {
	add: (p: {
		scene: Phaser.Scene,
		sound: { key: string, volume: number },
	}) => { sound: Phaser.Sound.BaseSound, volume: number },
	fadeOut: (p: {
		scene: Phaser.Scene,
		sounds: Array<Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound | Phaser.GameObjects.Video>,
		duration: number,
		destroy?: boolean
	}) => void,
	play: (p :{
		scene: Phaser.Scene,
		audio: { sound: Phaser.Sound.BaseSound, volume: number },
	}) => { sound: Phaser.Sound.BaseSound, volume: number },
} = {
	add: (p) => {
		const sound = p.scene.sound.add( p.sound.key )
		return { sound: sound, volume: p.sound.volume }
	},
	fadeOut: (p) => {
		p.sounds.forEach( oneSound => {
			if ( !oneSound.isPlaying && p.destroy ) {
				oneSound.destroy()
				return
			}

			oneSound.removeAllListeners( Phaser.Sound.Events.COMPLETE )
			const volume = ('volume' in oneSound) ? oneSound.volume : oneSound.getVolume()
			p.scene.tweens.addCounter({
				from: 100,
				to: 0,
				duration: p.duration,
				ease: 'linear',
				onUpdate: tween => {
					oneSound.setVolume( tween.getValue() / 100 * volume )
				},
				onComplete: () => {
					if (oneSound) {
						if ( p.destroy ) {
							oneSound.destroy()
						} else {
							oneSound.stop()
						}
					} else {
						log("This audio is not present anymore: ")
					}
				},
			})
		})
	},
	play: (p) => {
		p.audio.sound.play({ volume: p.audio.volume })
		return p.audio
	}
}

function addExit (p: {
	game: Game,
	scene: Phaser.Scene,
	nextScene: string,
	exit: Phaser.GameObjects.GameObject,
	soundsToKeep?: { key: string, volume: number }[],
	pre?: () => void
}): void {
	p.exit.setInteractive()
	p.exit.once( Phaser.Input.Events.POINTER_UP, () => {
		exitTo({ game: p.game, scene: p.scene, nextScene: p.nextScene, soundsToKeep: p.soundsToKeep, pre: p.pre })
	})
	return
}

function exitTo (p: {
	game: Game,
	scene: Phaser.Scene,
	nextScene: string,
	soundsToKeep?: { key: string, volume: number }[],
	pre?: () => void,
	reset?: boolean,
}): void {
	if ( p.nextScene === p.scene.scene.key ) return

	if (p.pre) p.pre()

	p.scene.events.emit( SHUTTINGDOWN )
	p.scene.events.once( Phaser.Scenes.Events.SHUTDOWN, () => {
		log( `${p.scene.scene.key} has stopped.` )
	})
	p.scene.time.removeAllEvents()


	const sceneSoundsKeys = ( !p.game.sounds[ p.scene.scene.key.toUpperCase() ] ) ? [] : Object.values( p.game.sounds[ p.scene.scene.key.toUpperCase() ] ).map( value => value.key )
	const sceneVideos = p.scene.children.getChildren().filter( (child: Phaser.GameObjects.GameObject) => child.type === 'Video' ) as Array<Phaser.GameObjects.Video>
	const sceneSoundsAndVideos = [
		...sceneSoundsKeys.map( key => p.scene.sound.get( key )) as Array<Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound>,
		...sceneVideos,
	]
	const persistantSoundKeys = Object.values( p.game.soundsPersistant ).flatMap( category => Object.values(category).map( value => value.key ) )
	const persistantSounds = persistantSoundKeys.map( key => p.scene.sound.get( key )) as Array<Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound>

	const keeperSoundsKeys = p.soundsToKeep ? p.soundsToKeep.map( s => s.key ) : []
	// FIXME!
	const sceneSoundsToFadeOut    = [ ...sceneSoundsKeys ]
		.filter( key => !keeperSoundsKeys.includes( key ) )
		.map( key => p.scene.sound.get( key )) as Array<Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound>

	const persistantSoundsToFadeOut = [ ...persistantSoundKeys ]
		.filter( key => !keeperSoundsKeys.includes( key ) )
		.map( key => p.scene.sound.get( key ))
		.filter( sound => sound.isPlaying ) as Array<Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound>

	const sceneSoundsAndVideosToFadeOut = [ ...sceneSoundsToFadeOut, ...sceneVideos ]
	audio.fadeOut({
		scene: p.scene,
		sounds: p.reset ? sceneSoundsAndVideos : sceneSoundsAndVideosToFadeOut,
		duration: p.reset ? 0 : 0.8 * p.game.config.durationSceneTransition,
		destroy: true,
	})
	audio.fadeOut({
		scene: p.scene,
		sounds: p.reset ? persistantSounds : persistantSoundsToFadeOut,
		duration: p.reset ? 0 : 0.8 * p.game.config.durationSceneTransition,
		destroy: false,
	})

	addState({ game: p.game, change: { previousScene: p.scene.scene.key, currentScene: p.nextScene } })

	const nextScene = p.scene.scene.get( p.nextScene )
	p.scene.scene.transition({ target: p.nextScene, duration: p.game.config.durationSceneTransition, moveAbove: true,
		onStart: () => {
			nextScene.cameras.cameras.forEach( (camera: Phaser.Cameras.Scene2D.Camera) => camera.setAlpha( 0 ) )
		},
		onUpdate: () => {
			nextScene.cameras.cameras.forEach( (camera: Phaser.Cameras.Scene2D.Camera) => camera.setAlpha( p.scene.scene.transitionProgress ) )
		},
	})
	return
}


// Background and Ambience

function addBackground (p: {
	game: Game,
	scene: Phaser.Scene,
	key: string,
}): Phaser.GameObjects.Image {
	const background = p.scene.add.image( 0, 0, p.key ).setOrigin(0, 0)
		.setSize( p.game.config.width, p.game.config.height )
		.setDisplaySize( p.game.config.width, p.game.config.height )
	return background
}

function addAmbience (p: {
	game: Game,
	scene: Phaser.Scene,
	key: string,
	volume?: number,
	fadeIn?: number,
}): Phaser.Sound.BaseSound {
	const volume = ( p.volume !== undefined ) ? p.volume : 1
	const ambience = p.scene.sound.get( p.key )

	if (ambience.isPlaying) {
		p.scene.tweens.add({
			targets: ambience,
			volume: ( p.volume === undefined ) ? 1 : p.volume,
			duration: p.game.config.durationSceneTransition,
		})
	} else {
		ambience.play({
			volume: p.fadeIn ? 0 : volume,
			loop: true
		})
		if (p.fadeIn) {
			p.scene.tweens.add({
				targets: ambience,
				volume: volume,
				duration: p.fadeIn,
			})
		}
	}
	return ambience
}


// Gesture support

function addGestureSupport ( object: Phaser.GameObjects.GameObject ): void {
	object.scene.input.addPointer()
	object.on( Phaser.Input.Events.POINTER_WHEEL, (pointer: Phaser.Input.Pointer, deltaX: number, deltaY: number, deltaZ: number ) => {
		emitZoom( object, deltaY )
	})
	object.on( Phaser.Input.Events.POINTER_MOVE, ( pointer: Phaser.Input.Pointer ) => {
		log( `pointer moved: ${pointer.id}` )
		const pointer1 = object.scene.input.pointer1
		const pointer2 = object.scene.input.pointer2
		if ( !pointer1.isDown && !pointer2.isDown ) {
			return
		}

		const emitPanFromOnePointer = () => {
			const panX = object.scene.input.activePointer.position.x - object.scene.input.activePointer.prevPosition.x
			const panY = object.scene.input.activePointer.position.y - object.scene.input.activePointer.prevPosition.y
			emitZoomAndPan( object, 1, panX, panY )
		}
		const emitZoomAndPanFromTwoPointers = () => {
			const oldDist = Math.sqrt( (pointer1.prevPosition.x - pointer2.prevPosition.x)**2 + (pointer1.prevPosition.y - pointer2.prevPosition.y)**2 )
			const newDist = Math.sqrt( (pointer1.position.x - pointer2.position.x)**2 + (pointer1.position.y - pointer2.position.y)**2 )
			const zoomFactor = newDist / oldDist
			const oldMidX = ( pointer1.prevPosition.x - pointer2.prevPosition.x ) / 2  +  pointer2.prevPosition.x
			const oldMidY = ( pointer1.prevPosition.y - pointer2.prevPosition.y ) / 2  +  pointer2.prevPosition.y
			const newMidX = ( pointer1.position.x - pointer2.position.x ) / 2  +  pointer2.position.x
			const newMidY = ( pointer1.position.y - pointer2.position.y ) / 2  +  pointer2.position.y
			log( `prevX1: ${pointer1.prevPosition.x}` )
			log( `prevY1: ${pointer1.prevPosition.y}` )
			log( `prevX2: ${pointer2.prevPosition.x}` )
			log( `prevY2: ${pointer2.prevPosition.y}` )
			log( `nextX1: ${pointer1.position.x}` )
			log( `nextY1: ${pointer1.position.y}` )
			log( `nextX2: ${pointer2.position.x}` )
			log( `nextY2: ${pointer2.position.y}` )
			const panX = newMidX - oldMidX
			const panY = newMidY - oldMidY
			emitZoomAndPan( object, zoomFactor, panX, panY )
		}
		if ( pointer1.isDown && pointer2.isDown ) {
			log( 'both' )
			emitZoomAndPanFromTwoPointers()
		} else if ( object.scene.input.activePointer.isDown ){
			log( 'only one' )
			emitPanFromOnePointer()
		}
	})
}

function emitZoom ( object: Phaser.GameObjects.GameObject, zoomDelta: number ): void {
	object.emit( 'atze-inputzoom', zoomDelta )
}
function emitZoomAndPan ( object: Phaser.GameObjects.GameObject, zoomFactor: number, panX: number, panY: number ): void {
	object.emit( 'atze-inputzoomandpan', zoomFactor, panX, panY )
}


// Other

function changeFullscreen (
	scene: Phaser.Scene,
	start: boolean,
	stop: boolean
): void {
	if (stop && scene.scale.isFullscreen) {
		scene.scale.stopFullscreen()
		return
	}
	if (start && !scene.scale.isFullscreen) {
		scene.scale.startFullscreen()
		// scene.scale.lockOrientation( 'landscape-primary' )
		window.screen.orientation.unlock()
		window.screen.orientation.lock('landscape-primary')
			.catch((error) => {
				console.log( `Locking orientation failed with: ${error}` )
			})
	}
	return
}
function toggleFullscreen ( scene: Phaser.Scene ): void { changeFullscreen( scene, true, true  ) }
function startFullscreen  ( scene: Phaser.Scene ): void { changeFullscreen( scene, true, false ) }
function stopFullscreen   ( scene: Phaser.Scene ): void { changeFullscreen( scene, false, true ) }

function aniWithDuration (p: {
	cat: Phaser.GameObjects.PathFollower,
	key: string,
	duration: number,
	fraction: number
}): { key: string, frameRate: number } {
	return {
		key: p.key,
		frameRate: p.cat.anims.get( p.key ).getTotalFrames() * 1000 / (p.fraction * p.duration),
	}
}

function vec (x: number, y: number): Phaser.Math.Vector2 { return new Phaser.Math.Vector2(x, y) }


// Exports

export type {
	Game,
	GenericState,
	MinimalState,
}
export {
	SHUTTINGDOWN,
	ASSETSLOADED,
	audio,
	// LocalStorage
	stateIsEmpty,
	getState,
	setState,
	addState,
	// Cache
	openCache,
	addToCache,
	loadImageFromCache,
	loadSpriteFromCache,
	loadAudioFromCache,
	loadVideoFromCache,
	loadAssets,
	// Other
	toggleFullscreen,
	startFullscreen,
	stopFullscreen,
	addBackground,
	addAmbience,
	addExit,
	exitTo,
	addGestureSupport,
	aniWithDuration,
	vec
}
