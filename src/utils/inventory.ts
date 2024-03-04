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
import * as Set from '../utils/set'
import * as Up from '../utils/phaser'
import { getState, addState, s } from '../constants'



async function load (p: { game: Up.Game, scene: Phaser.Scene }): Promise<void> {
	if ( p.game.images.inventory ) for (const value of Object.values( p.game.images.inventory )) {
		await Up.loadImageFromCache({ cache: p.game.cache, scene: p.scene, key: value.key })
	}
}

type Icons = { [key: string]: Phaser.GameObjects.Image }
function getIcons (p: { game: Up.Game, scene: Phaser.Scene }): Icons {
	let icons: { [key: string]: Phaser.GameObjects.Image } = {}
	for ( const [item, image] of Object.entries( p.game.images.inventory ) ) {
		icons[ item ] = p.scene.add.image( (-200) * s, 395 * s, image.key )
			.setOrigin( 0 ).setDepth( 100 ).setInteractive()
			.setAlpha( 0.001 ).setVisible( false )
	}
	return icons as Icons
}

let open = false
function toggleChest ( icons: { [key: string]: Phaser.GameObjects.Image } ) {
	if (open) { closeChest( icons ) } else { openChest( icons ) }
}
// fixme: make it possible to add eventlisteners...maybe by using the the inventory itself as the listener?
function openChest ( icons: { [key: string]: Phaser.GameObjects.Image } ) {
	const inventory = Set.toArray(getState().inventory)
	let i = 0
	for ( const [item, image] of Object.entries( icons ) ) {
		if ( inventory.includes( item ) ) {
			i += 1
			image.setX( (700 - i * 50) * s ).setAlpha( 0.001 ).setVisible( true )
			image.scene.tweens.addCounter({
				from: 1,
				to: 100,
				duration: 700,
				delay: i * 100,
				ease: 'linear',
				onUpdate: tween => {
					image.setAlpha( tween.getValue() / 100 )
				}
			})
		}
	}
	open = true
}
function closeChest ( icons: { [key: string]: Phaser.GameObjects.Image } ) {
	const inventory = Set.toArray(getState().inventory)
	for ( const [item, image] of Object.entries( icons ) ) {
		if ( inventory.includes( item ) ) {
			image.scene.tweens.addCounter({
				from: 99,
				to: 0,
				duration: 700,
				delay: 100,
				ease: 'linear',
				onUpdate: tween => {
					image.setAlpha( tween.getValue() / 100 + 0.001)
				},
				onComplete: () => {
					image.setX( -200 * s ).setAlpha( 0.001 ).setVisible( false )
				}
			})
		}
	}
	open = false
}

function add ( item: string ) {
	addState({ inventory: Set.add( getState().inventory, item ) })
}
function remove ( item: string ) {
	addState({ inventory: Set.remove( getState().inventory, item ) })
}


export type {
	Icons,
}

export {
	load,
	getIcons,
	toggleChest,
	openChest,
	closeChest,
	add,
	remove,
}

