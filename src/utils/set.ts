
type Set = { [key: string]: boolean }

function newSet ( elements?: string | string[] ): Set {
	const elems = elements ?? []
	const set: Set = {}
	return add( set, elems )
}

function add ( pSet: Set, elements: string | string[] ): Set {
	const set = { ...pSet }
	const elems = [ elements ].flat()
	for ( let elem of elems ) {
		set[elem] = true
	}
	return set
}

function remove ( pSet: Set, elements: string | string[] ): Set {
	const set = { ...pSet }
	const elems = [ elements ].flat()
	for ( let elem of elems ) {
		delete set[elem]
	}
	return set
}

function has ( pSet: Set, elements: string | string[] ): boolean {
	const set = { ...pSet }
	const elems = [ elements ].flat()
	const hasAllOfEm = elems
		.map( e => { return set.hasOwnProperty( e ) })
	const hasAllOfEm2 = hasAllOfEm.every( e => e === true )
	return hasAllOfEm2
}

function hasAny ( pSet: Set, elements: string | string[] ): boolean {
	const set = { ...pSet }
	const elems = [ elements ].flat()
	const hasAnyOfEm = elems.map( e => {
		return set.hasOwnProperty( e )
	}).some( e => e === true )
	return hasAnyOfEm
}

function toArray ( pSet: Set ): Array<string> {
	return Object.keys( pSet )
}


export type {
	Set
}
export {
	newSet,
	add,
	remove,
	has,
	hasAny,
	toArray,
}
