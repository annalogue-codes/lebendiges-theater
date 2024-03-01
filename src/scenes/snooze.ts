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
import { game, h, w, s } from '../constants'

export default class Snooze extends Phaser.Scene {
	constructor() {
		super( game.scenes.SNOOZE )
	}

	// init () {
	// }

	// preload() {
	// }

	create() {
		// Overlay
		this.add.renderTexture(0, 0, w, h).setOrigin(0, 0).fill(0x200030, 0.5)
		//  Our Text object to display.
		const pause = this.add.text( w / 2, h / 2, 'Pause', { fontFamily: 'TmonMonsori', fontSize: '100px', fontStyle: '400', color: '#fffffa' })
		pause.setShadow( 0, 0, '#cccccc', 25 * s )
		pause.setOrigin( 0.5 )
		pause.setPadding( 50 * s )
	}
	// update() {
	// }
}
