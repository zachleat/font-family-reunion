var results = require( "./font-families-results.json" ),
	operatingSystems = {},
	lookupTable = {},
	defaults = {};

results.families.forEach(function( family, osId ) {
	operatingSystems[ osId ] = family.os + ' ' + family.version;

	if( family.aliases[ "" ] ) {
		defaults[ osId ] = family.aliases[ "" ];
	}

	family.families.forEach(function( familyName ) {
		var normalizedFamilyName = familyName.toLowerCase();

		if( !lookupTable[ normalizedFamilyName ] ) {
			lookupTable[ normalizedFamilyName ] = {};
		}

		lookupTable[ normalizedFamilyName ][ osId ] = family.aliases[ normalizedFamilyName ] || familyName;
	});
});

var FFRLookup = function( familyList ) {
	this.familyList = familyList;
	this.stack = this.normalizeStack( familyList );
	this.support = this.fetchSupport();
};

FFRLookup.prototype.normalizeStack = function() {
	return this.familyList.split( ',' ).map(function( familyName ) {
		return familyName.trim().toLowerCase();
	});
};

FFRLookup.prototype.fetchSupport = function() {
	var support = {};

	this.stack.forEach(function( familyName, index ) {
		var supportedFamilyName;
		for( var osId in operatingSystems ) {
			supportedFamilyName = lookupTable[ familyName ][ osId ];
			if( !support[ osId ] && supportedFamilyName ) {
				// console.log( 'match ', supportedFamilyName, ' on ', operatingSystems[ osId ] );
				support[ osId ] = supportedFamilyName;
			} else if( !supportedFamilyName ) {
				support[ osId ] = undefined;
				// console.log( 'did not match ', familyName, ' on ', operatingSystems[ osId ] );
			}
		}
	});

	return support;
};

FFRLookup.prototype.toString = function( support ) {
	var str = [];
	for( var osId in this.support ) {
		str.push( operatingSystems[ osId ] + ': ' + ( this.support[ osId ] || defaults[ osId ] ) );
	}
	return str.join( "\n" );
};


var db = new FFRLookup( "Andale Mono, Impact" );

console.log( db.toString(), "\n" );