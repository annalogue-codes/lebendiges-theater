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
import { game, SCENES } from '../constants'

export default class Snooze extends Phaser.Scene {
	constructor() {
		super( SCENES.SNOOZE )
	}
	init () {//
		//  Inject our CSS
		const styleElement = document.createElement('style')
		document.head.appendChild(styleElement)
		const sheet = styleElement.sheet
		if (!sheet) return

		const troika = "@font-face { font-family: 'TmonMonsori'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/TmonMonsori.woff') format('woff'); font-weight: normal; font-style: normal; }"
		sheet.insertRule(troika, 0);

		// const caroni = '@font-face { font-family: "Caroni"; src: url("assets/fonts/ttf/caroni.otf") format("opentype"); }';
		// sheet.insertRule(caroni, 0);
	}
	// preload() {
	// }
	create() {
		// Overlay
		this.add.renderTexture(0, 0, game.width, game.height).setOrigin(0, 0).fill(0x200030, 0.5)
		//  Our Text object to display.
        const pause = this.add.text( game.width / 2, game.height / 2, 'Pause', { fontFamily: 'TmonMonsori', fontSize: '100px', fontStyle: '400', color: '#fffffa' })
		pause.setShadow( 0, 0, '#cccccc', 50 )
		pause.setOrigin( 0.5 )
		pause.setPadding( 100 )
	}
	// update() {
	// }
}
