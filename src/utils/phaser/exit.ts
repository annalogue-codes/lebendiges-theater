
import Phaser from 'phaser'
import { Game } from './common'
import * as Audio from './audio'


const SHUTTINGDOWN = 'shuttingdown'

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
	p.scene.time.removeAllEvents()


	const sceneSoundsKeys = ( !p.game.sounds[ p.scene.scene.key ] ) ? [] : Object.values( p.game.sounds[ p.scene.scene.key ] ).map( value => value.key )
	const sceneVideos = p.scene.children.getChildren().filter( (child: Phaser.GameObjects.GameObject) => child.type === 'Video' ) as Array<Phaser.GameObjects.Video>
	const sceneSoundsAndVideos = [
		...sceneSoundsKeys.map( key => p.scene.sound.get( key )) as Array<Audio.Sound>,
		...sceneVideos,
	]
	const persistantSoundKeys = Object.values( p.game.soundsPersistant ).flatMap( category => Object.values(category).map( value => value.key ) )
	const persistantSounds = persistantSoundKeys.map( key => p.scene.sound.get( key )) as Array<Audio.Sound>

	const keeperSoundsKeys = p.soundsToKeep ? p.soundsToKeep.map( s => s.key ) : []
	// FIXME!
	const sceneSoundsToFadeOut    = [ ...sceneSoundsKeys ]
		.filter( key => !keeperSoundsKeys.includes( key ) )
		.map( key => p.scene.sound.get( key )) as Array<Audio.Sound>

	const persistantSoundsToFadeOut = [ ...persistantSoundKeys ]
		.filter( key => !keeperSoundsKeys.includes( key ) )
		.map( key => p.scene.sound.get( key ))
		.filter( sound => sound.isPlaying ) as Array<Audio.Sound>

	const sceneSoundsAndVideosToFadeOut = [ ...sceneSoundsToFadeOut, ...sceneVideos ]
	Audio.fadeOut({
		scene: p.scene,
		sounds: p.reset ? sceneSoundsAndVideos : sceneSoundsAndVideosToFadeOut,
		duration: p.reset ? 0 : 0.8 * p.game.config.durationSceneTransition,
		destroy: true,
	})
	Audio.fadeOut({
		scene: p.scene,
		sounds: p.reset ? persistantSounds : persistantSoundsToFadeOut,
		duration: p.reset ? 0 : 0.8 * p.game.config.durationSceneTransition,
		destroy: false,
	})

	p.game.state.add({ previousScene: p.scene.scene.key, currentScene: p.nextScene })

	const nextScene = p.scene.scene.get( p.nextScene )

	// assets.load({ game: p.game, scene: nextScene })
	// nextScene.events.once( ASSETSLOADED, () => {
	//
	// 	p.scene.scene.sleep( nextScene )
	// 	p.scene.scene.manager.processQueue()
	// 	log( "Transition" )
	// 	p.scene.scene.transition({ target: p.nextScene, duration: p.game.config.durationSceneTransition, moveAbove: true,
	// 		onStart: () => {
	// 			nextScene.cameras.cameras.forEach( (camera: Phaser.Cameras.Scene2D.Camera) => camera.setAlpha( 0 ) )
	// 		},
	// 		onUpdate: () => {
	// 			nextScene.cameras.cameras.forEach( (camera: Phaser.Cameras.Scene2D.Camera) => camera.setAlpha( p.scene.scene.transitionProgress ) )
	// 		},
	// 	})
	// })

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


export {
	SHUTTINGDOWN,
	addExit,
	exitTo,
}

