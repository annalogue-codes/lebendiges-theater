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

type GameObject = Phaser.GameObjects.GameObject
type Camera = Phaser.Cameras.Scene2D.Camera
type Pointer = Phaser.Input.Pointer

// Gesture support

const wheelFactor = 0.00125
const maxZoom = 8

var continuousMotion = 0
var sum = 0

function addZoomAndPanSupport ({ object, camera }: { object: GameObject, camera: Camera }): void {

	object.scene.input.addPointer()

	const pointer1 = object.scene.input.pointer1
	const pointer2 = object.scene.input.pointer2
	const mousePointer = object.scene.input.mousePointer

	object.on( 'wheel', ( pointer: Pointer, deltaX: number, deltaY: number, deltaZ: number ) => {

		const pos = pointer.position

		const zoomFactor = (1 - wheelFactor * deltaY)
		const oldZoom = camera.zoom
		camera.setZoom( Phaser.Math.Clamp(camera.zoom * zoomFactor, 1, maxZoom) )
		const scaleRatio = camera.zoom / oldZoom

		const cameraCenter = new Phaser.Math.Vector2( camera.centerX, camera.centerY )
		const pan = pos.clone().subtract( cameraCenter ).scale( (scaleRatio - 1) / camera.zoom )

		zoomAndPan({
			camera,
			zoomFactor: 1,
			pan: pan,
		})
	})
	object.scene.input.on( 'pointerup', () => {

		continuousMotion = 0
		sum = 0

		if ( !pointer1.isDown && !pointer2.isDown && !mousePointer.isDown ) {
			object.off( 'pointermove' )
		}
	})
	object.on( 'pointerdown', () => {
		object.off( 'pointermove' )
		object.on( 'pointermove', ( pointer: Pointer ) => { watchPointers({ object, camera, pointer }) })
	})
}

function watchPointers ({ object, camera, pointer }: {
	object: GameObject,
	camera: Camera,
	pointer: Pointer,
}): void {

	// Prevent jerkiness when lifting fingers and putting them somewhere else.
	if ( continuousMotion < 2 ) {
		continuousMotion += 1
		return
	}

	const pointer1 = object.scene.input.pointer1
	const pointer2 = object.scene.input.pointer2

	if ( pointer1.isDown && pointer2.isDown ) {

		const oldDist = pointer1.prevPosition.distance( pointer2.prevPosition )
		const newDist = pointer1.position.distance( pointer2.position )
		const zoomFactor = newDist / oldDist

		// Follow the midpoint of the two pointers.
		const midpointOld = pointer1.prevPosition.clone().add( pointer2.prevPosition ).scale( 1/2 )
		const midpointNew = pointer1.position.clone().add( pointer2.position ).scale( 1/2 )
		const motion = midpointNew.clone().subtract( midpointOld ).scale( (-1) / (2 * camera.zoom) )

		// Zoom into midpoint of fingers.
		const oldZoom = camera.zoom
		camera.setZoom( Phaser.Math.Clamp(camera.zoom * zoomFactor, 1, maxZoom) )
		const scaleRatio = camera.zoom / oldZoom

		const cameraCenter = new Phaser.Math.Vector2( camera.centerX, camera.centerY )
		const shiftViaZoom = midpointNew.clone().subtract( cameraCenter ).scale( (scaleRatio - 1) / camera.zoom )

		// Combine change of midpoint position with shift caused by zoom.
		const pan = motion.clone().add( shiftViaZoom )

		zoomAndPan({ camera, zoomFactor: 1, pan })

	} else {

		const pan = pointer.position.clone().subtract( pointer.prevPosition ).scale( (-1) / camera.zoom )

		zoomAndPan({ camera, zoomFactor: 1, pan })
	}
}

function zoomAndPan ({ camera, zoomFactor, pan }: {
	camera: Camera,
	zoomFactor: number,
	pan: Phaser.Math.Vector2,
}) {
	camera.zoom = Phaser.Math.Clamp(camera.zoom * zoomFactor, 1, maxZoom)

	const boundaryX = camera.width  * (1 - 1 / camera.zoom) / 2
	const boundaryY = camera.height * (1 - 1 / camera.zoom) / 2

	camera.scrollX = Phaser.Math.Clamp( camera.scrollX + pan.x, camera.x - boundaryX, camera.x + boundaryX )
	camera.scrollY = Phaser.Math.Clamp( camera.scrollY + pan.y, -boundaryY, boundaryY )
}

function emitZoom ( camera: Camera, object: GameObject, zoomDelta: number ): void {
	object.emit( 'gesture-inputzoom', camera, zoomDelta )
}
function emitZoomAndPan ( camera: Camera, object: GameObject, zoomFactor: number, panX: number, panY: number ): void {
	object.emit( 'gesture-inputzoomandpan', camera, zoomFactor, panX, panY )
}


export {
	maxZoom,
	addZoomAndPanSupport,
	zoomAndPan,
	emitZoom,
	emitZoomAndPan,
}
