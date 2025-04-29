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
import * as Up from './phaser/common'
import * as Audio from './phaser/audio'
import { game, s } from '../constants'


// FIXME: convert magic numbers to constants.

async function load (p: { game: Up.Game, scene: Phaser.Scene }): Promise<void> {
	if ( p.game.images.inventory ) for (const value of Object.values( p.game.images.inventory )) {
		await p.game.cache.loadImage({ scene: p.scene, key: value.key })
	}
	if ( p.game.sounds.inventory ) for (const value of Object.values( p.game.sounds.inventory )) {
		await p.game.cache.loadAudio({ scene: p.scene, key: value.key })
	}
	// Load audio
	p.scene.load.on( 'complete', () => {
		// Add Sounds
		if ( p.game.sounds.inventory ) for (const value of Object.values( p.game.sounds.inventory )) {
			p.scene.sound.add( value.key, { volume: value.volume } )
		}
	})
}

// // tentative approach to a better implementation
// function hasChest () { return {
//
// 	chest: {
//		add: function () {
//
//		},
// 	},
//
// 	inventory: {
//
// 	}
// }}

// IMPROVE: restrict the keys to the actual items in the game.
type Icons = { [key: string]: Phaser.GameObjects.Image }

function createChest (p: {
	game: Up.Game,
	scene: Phaser.Scene
}) {

	let items: { [key: string]: Phaser.GameObjects.Image } = {}
	for ( const [item, imageAndSize] of Object.entries( p.game.images.inventory ) ) {
		items[ item ] = p.scene.add.image( 650 * s, 395 * s, imageAndSize.key )
			.setOrigin( 0 ).setDepth( 100 ).setInteractive()
			.setAlpha( 0.001 ).setVisible( false )
	}

	const chestIcon = p.scene.add.image( 715 * s, 395 * s, game.images.inventory.chest.key )
		.setOrigin( 0 ).setDepth( 100 ).setInteractive()
		.setAlpha( 0.001 )
		.setVisible( false )

	let open = false

	const chest = {
		icon: chestIcon,
		items: items,
		isOpen: () => open,

		toggleOpen: function () {
			if ( open ) { this.close() } else { this.open() }
		},

		open: function (q?: { onComplete?: () => void }) {
			const inventory = game.state.get().inventory
			let i = 0
			for ( const item of inventory ) {
				const image = this.items[ item ]
				image.setX( (650 - i * 50) * s ).setAlpha( 0.001 ).setVisible( true )
				image.scene.tweens.addCounter({
					from: 1,
					to: 100,
					duration: 700,
					delay: i * 100,
					onUpdate: tween => {
						image.setAlpha( tween.getValue() / 100 )
					},
				})
				i += 1
			}
			open = true
			if (q && q.onComplete) p.scene.time.delayedCall( 700 + (i-1) * 100, () => q.onComplete!() )
		},

		close: function (q?: { onComplete?: () => void }) {
			const inventory = game.state.get().inventory
			let i = 0
			for ( const item of inventory ) {
				const image = this.items[ item ]
				image.scene.tweens.addCounter({
					from: 100,
					to: 1,
					duration: 700,
					delay: (inventory.length - i) * 100,
					onUpdate: tween => {
						image.setAlpha( tween.getValue() / 100 )
					},
					onComplete: () => {
						image.setAlpha( 0.001 ).setVisible( false )
					}
				})
				i += 1
			}
			open = false
			if (q && q.onComplete) p.scene.time.delayedCall( 700 + (i-1) * 100, () => q.onComplete!() )
		},

		add: function ( item: string ) {
			const inv = new Set( game.state.get().inventory )
			inv.add( item )
			game.state.add({ inventory: [...inv] })

		},

		remove: function ( item: string ) {
			const inv = new Set( game.state.get().inventory )
			inv.delete( item )
			game.state.add({ inventory: [...inv] })
		},

		foundItem: function (q: { item: string, image?: Phaser.GameObjects.Image }) {

			const inv = game.state.get().inventory
			const icon = items[ q.item ]

			const found = Audio.get({ scene: p.scene, keyAndVolume: game.sounds.inventory.found })
			Audio.play( found )

			if ( q.image !== undefined ) {
				p.scene.tweens.addCounter({
					from: 100,
					to: 1,
					duration: 2000,
					onUpdate: tween => {
						q.image!.setAlpha( tween.getValue() / 100 )
					},
					onComplete: () => {
						q.image!.destroy()
					}
				})
			}

			this.show()
			p.scene.time.delayedCall( 600, () => this.open() )
			icon.setX( (650 - (inv.length) * 50) * s ).setAlpha( 0.001 ).setVisible( true )
			p.scene.tweens.addCounter({
				from: 1,
				to: 100,
				duration: 700,
				yoyo: true,
				repeat: 1,
				delay: 600 + 100 * inv.length,
				onUpdate: tween => {
					icon.setAlpha( tween.getValue() / 100 )
				},
				onComplete: () => {
					p.scene.tweens.addCounter({
						from: 1,
						to: 100,
						duration: 700,
						onUpdate: tween => {
							icon.setAlpha( tween.getValue() / 100 )
						},
						onComplete: () => {
							this.add( q.item )
							this.close({ onComplete: () => this.hide() })
						},
					})
				},
			})
		},

		show: function (q?: { onComplete?: () => void }) {

			this.icon.setVisible( true )
			p.scene.tweens.addCounter({
				from: 1,
				to: 100,
				duration: 700,
				onUpdate: tween => {
					this.icon.setAlpha( tween.getValue() / 100 )
				},
				onComplete: q ? ( q.onComplete ?? undefined ) : undefined,
			})
		},

		hide: function () {

			p.scene.tweens.addCounter({
				from: 100,
				to: 1,
				duration: 700,
				onUpdate: tween => {
					this.icon.setAlpha( tween.getValue() / 100 )
				},
				onComplete: () => {
					this.icon.setVisible( false )
				}
			})
		},
	}

	return chest
}
type Chest = ReturnType<typeof createChest>



export type {
	Chest,
	Icons,
}
export {
	load,
	createChest,
}

