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

const debug = false
const presentation = false

function log<T>(s: any, content?: T): T | undefined {
	if (debug) console.log(s)
	return content
}

function fromMaybe<T>( fallBack: T, maybeVar: T ): T {
	if ( typeof maybeVar === 'undefined' ) return fallBack
	return maybeVar
}

const sleep = ( ms: number ) => {
	return new Promise( resolve => setTimeout( resolve, ms ) )
}

const onMobileDevice = () => {
	// check for common mobile user agents
	if (
		navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/i) ||
		navigator.userAgent.match(/Windows Phone/i)
	) {
		// the user is using a mobile device
		return true
	}
	return false
}

export {
	debug,
	presentation,
	log,
	fromMaybe,
	sleep,
	onMobileDevice
}

