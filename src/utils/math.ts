
type vec2d = { x: number, y: number }

function clamp( min: number, value: number, max: number ) {
	return Math.min( max, Math.max( min, value ) )
}

function distance( a: vec2d, b: vec2d ) {
	return Math.sqrt( (b.x - a.x)**2 + (b.y - a.y)**2 )
}

function random ( min: number, max: number ) {
	return Math.random() * (max - min) + min
}

function randomInt (min: number, max: number) {
	return Math.floor( Math.random() * (max - min + 1) ) + min
}

function randomElementOf <T>( arr: Array<T> ): T {
	return arr[ Math.floor(Math.random() * arr.length) ]
}


export type {
	vec2d,
}
export {
	clamp,
	distance,
	random,
	randomInt,
	randomElementOf,
}
