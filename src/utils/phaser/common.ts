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
import { log } from '../general'

const ASSETSLOADED = 'assetsloaded'

type Config = {
	// ascii letters only
	name: string,
	width: number,
	height: number,
	scale: number,
	// in milliseconds
	durationSceneTransition: number,
	// 300 is a good setting for jump and runs
	gravity: number,
}

interface State {
	hasStarted: boolean,
	paused: boolean,
	previousScene: string,
	currentScene: string,
	solo: Array<string>,
}

type PartialState = Partial<State>


// LocalStorage API
function hasState ( p: { key: string, initialState: State }) { return {

	state: {
		key: p.key,
		initial: p.initialState,

		isEmpty: function (): boolean {
			const stored = localStorage.getItem( p.key )
			const isEmpty = ( stored === undefined )
			return isEmpty
		},

		get: function (): State {
			const stored = localStorage.getItem( p.key )
			const state = ( stored === null ) ? p.initialState : JSON.parse( stored )
			return state
		},

		set: function ( newState: State ): State {
			localStorage.setItem( p.key, JSON.stringify( newState ) )
			return newState
		},

		add: function ( changedProperties: PartialState ): State {
			const newState = { ...this.get(), ...changedProperties }
			this.set( newState )
			return newState
		},
	}
}}


// Cache API
function hasCache ( p: { cacheName: string }) { return {

	cache: {
		available: 'caches' in self,
		options: {
			ignoreSearch: true,
			ignoreMethod: true,
			ignoreVary: true
		},
		name: p.cacheName,
		cache: caches.open( p.cacheName ),

		// Delete any old caches to respect user's disk space.
		deleteOldCaches: async function (): Promise<void> {
			const keys = await caches.keys()

			for (const key of keys) {
				if ( key === p.cacheName ) {
					continue
				}
				caches.delete( key )
			}
		},
		open: async function (): Promise<Cache> {
			const cache = await caches.open( p.cacheName )
			return cache
		},
		add: async function ( key: string ): Promise<boolean> {
			const cache = await caches.open( p.cacheName )
			// Don't add if it's already in there.
			const inCache = await cache.match( key )
			if (inCache) {
				log(`Already in cache: ${key}`)
				return false
			}

			await cache.add( key )
			log(`Added to cache: ${key}`)
			return true
		},
		getItemUrl: async function ( key: string ): Promise<string> {
			const cache = await caches.open( p.cacheName )
			let item = await cache.match( key, this.options )
			while ( item === undefined ) {
				await cache.add( key )
				item = await cache.match( key, this.options )
			}

			const blob = await item.blob()
			const url = URL.createObjectURL( blob )
			return url
		},

		loadImage: async function ({ scene, key }: {
			scene: Phaser.Scene,
			key: string
		}): Promise<Phaser.Loader.LoaderPlugin> {

			const url = await this.getItemUrl( key )
			const image = scene.load.image( key, url )
			log(`Loaded image from cache: ${key}`)

			//IMPROVE: is this really the proper name for the return value?
			return image
		},
		loadSprite: async function ({ scene, key, width, height }: {
			scene: Phaser.Scene,
			key: string,
			width: number,
			height: number,
		}): Promise<Phaser.Loader.LoaderPlugin> {

			const url = await this.getItemUrl( key )
			const sprite = scene.load.spritesheet( key, url, { frameWidth: width, frameHeight: height } )
			log(`Loaded sprite from cache: ${key}`)

			//IMPROVE: is this really the proper name for the return value?
			return sprite
		},
		loadAudio: async function ({ scene, key }: {
			scene: Phaser.Scene,
			key: string,
		}): Promise<Phaser.Loader.LoaderPlugin> {

			const url = await this.getItemUrl( key )
			const audio = scene.load.audio( key, [url] )
			log(`Loaded audio from cache: ${key}`)

			//IMPROVE: is this really the proper name for the return value?
			return audio
		},
		loadVideo: async function ({ scene, key }: {
			scene: Phaser.Scene,
			key: string,
		}): Promise<Phaser.Loader.LoaderPlugin> {

			const url = await this.getItemUrl( key )
			const video = scene.load.video( key, [url] )
			log(`Loaded video from cache: ${key}`)

			//IMPROVE: is this really the proper name for the return value?
			return video
		},
		loadBinary: async function ({ scene, key }: {
			scene: Phaser.Scene,
			key: string
		}): Promise<Phaser.Loader.LoaderPlugin> {

			const url = await this.getItemUrl( key )
			const binary = scene.load.binary( key, url )
			log(`Loaded binary from cache: ${key}`)

			//IMPROVE: is this really the proper name for the return value?
			return binary
		},
	}
}}

type KeyAndVolume = { key: string, volume: number }
type KeyAndSize = { key: string, width: number, height: number }

type Game = ReturnType<typeof hasState>  &  ReturnType<typeof hasCache>  &  {
	config: Config,
	scenes:              { [key: string]: string },
	initialScenes: string[],
	images:              { [key: string]: {[key: string]: { key: string } } },
	sprites:             { [key: string]: {[key: string]: KeyAndSize } },
	soundsPersistant:    { [key: string]: {[key: string]: KeyAndVolume } },
	sounds:              { [key: string]: {[key: string]: KeyAndVolume } },
	videos:              { [key: string]: {[key: string]: KeyAndVolume } },
	binaries:            { [key: string]: {[key: string]: { key: string } } },
}

const assets = {
	load: async function ({ game, scene }: {
		game: Game,
		scene: Phaser.Scene,
	}): Promise<void> {

		const cache = game.cache
		const key = scene.scene.key

		// Images
		if ( game.images[ key ] ) for (const value of Object.values( game.images[ key ] )) {
			await cache.loadImage({ scene: scene, key: value.key })
		}

		// Sprites
		if ( game.sprites[ key ] ) for (const value of Object.values( game.sprites[ key ] )) {
			await cache.loadSprite({ scene: scene, key: value.key, width: value.width, height: value.height })
		}

		// Sounds
		if ( game.sounds[ key ] ) for (const value of Object.values( game.sounds[ key ] )) {
			await cache.loadAudio({ scene: scene, key: value.key })
		}

		// Videos
		if ( game.videos[ key ] ) for (const value of Object.values( game.videos[ key ] )) {
			await cache.loadVideo({ scene: scene, key: value.key })
		}

		// Binaries
		if ( game.binaries[ key ] ) for (const value of Object.values( game.binaries[ key ] )) {
			await cache.loadBinary({ scene: scene, key: value.key })
		}

		// Cleanup
		scene.events.on( Phaser.Scenes.Events.SHUTDOWN, () => {
			this.unload({ scene: scene })
		})

		// Load audio
		scene.load.on( Phaser.Loader.Events.COMPLETE, () => {
			// Add Sounds
			if ( game.sounds[ key ] ) for (const value of Object.values( game.sounds[ key ] )) {
				scene.sound.add( value.key, { volume: value.volume } )
			}
			scene.events.emit( ASSETSLOADED )
		})

		scene.load.start()
		return
	},

	unload: function (p: {	scene: Phaser.Scene }): void {
		p.scene.children.list
			.filter( item => (
				item instanceof Phaser.GameObjects.Image ||
				item instanceof Phaser.GameObjects.Sprite ||
				item instanceof Phaser.GameObjects.Video
			))
			// .forEach( item => { item.destroy() } )
			.forEach( item => { if (item) item.destroy() } )
		return
	},
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
	const volume = p.volume ?? 1.0
	const ambience = p.scene.sound.get( p.key )

	if (ambience.isPlaying) {
		p.scene.tweens.add({
			targets: ambience,
			volume: volume,
			duration: p.game.config.durationSceneTransition,
		})
	} else {
		ambience.play({
			volume: p.fadeIn ? 0.0 : volume,
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




// Fullscreen

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

// function aniWithDuration (p: {
// 	cat: Phaser.GameObjects.PathFollower,
// 	key: string,
// 	duration: number,
// 	fraction: number
// }): { key: string, frameRate: number } {
// 	return {
// 		key: p.key,
// 		frameRate: p.cat.anims.get( p.key ).getTotalFrames() * 1000 / (p.fraction * p.duration),
// 	}
// }

function vec (x: number, y: number): Phaser.Math.Vector2 { return new Phaser.Math.Vector2(x, y) }


// Exports

export type {
	Game,
	KeyAndSize,
	KeyAndVolume,
	State,
}
export {
	ASSETSLOADED,
	assets,
	// Other
	hasCache,
	hasState,
	toggleFullscreen,
	startFullscreen,
	stopFullscreen,
	addBackground,
	addAmbience,
	// aniWithDuration,
	vec
}
