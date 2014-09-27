var ejs = require('ejs'),
	fs = require('fs'),
	results = require( "./font-families-results.json" ),
	operatingSystems = {},
	shortCodes = {},
	lookupTable = {};

results.families.forEach(function( family, osId ) {
	operatingSystems[ osId ] = {
		name: family.os,
		version: family.version,
		shortcode: family.shortcode
	};

	if( family.aliases.__default ) {
		if( !lookupTable[ "" ] ) {
			lookupTable[ "" ] = {};
		}

		lookupTable[ "" ][ osId ] = {
			fallback: true,
			alias: family.aliases.__default,
			exceptions: family.exceptions ? family.exceptions.__default : false,
			fontFamily: ""
		};
	}

	var template = fs.readFileSync( "./os-list.ejs", 'utf8' ),
		data = ejs.render( template, {
			os: operatingSystems[ osId ],
			fontFamilies: family.families
		});

	fs.writeFile( "../fontfamily.io/os/" + family.shortcode + ".html", data, function( error ) {
		if( error ) {
			console.log( 'os template error: ', error );
		} else {
			console.log( "os template success." );
		}
	});

	family.families.forEach(function( familyName ) {
		var normalizedFamilyName = familyName.toLowerCase();

		if( !lookupTable[ normalizedFamilyName ] ) {
			lookupTable[ normalizedFamilyName ] = {};
		}

		lookupTable[ normalizedFamilyName ][ osId ] = {
			fallback: false,
			alias: family.aliases[ normalizedFamilyName ],
			exceptions: family.exceptions ? family.exceptions[ normalizedFamilyName ] : false,
			fontFamily: familyName
		};
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
		var supportedFamily;
		for( var osId in operatingSystems ) {
			supportedFamily = lookupTable[ familyName ][ osId ];
			if( !support[ osId ] && supportedFamily ) {
				// console.log( 'match ', supportedFamily, ' on ', operatingSystems[ osId ] );
				support[ osId ] = supportedFamily;
			} else if( !supportedFamily ) {
				support[ osId ] = undefined;
				// console.log( 'did not match ', familyName, ' on ', operatingSystems[ osId ] );
			}
		}
	});

	return support;
};

FFRLookup.prototype.toJSON = function() {
	/* 
	{
		"times new roman": [
			{
				"support": true,
				"alias": false,
				"unsupported": false,
				"fallback": false,
				"shortcode": "win8",
				"name": "Windows 8",
				"fontFamily": "Times New Roman"
			}
		]
	}
	*/
	var arr = [],
		json = {},
		os,
		familyName,
		useAlias;
	
	for( var osId in this.support ) {
		os = operatingSystems[ osId ];
		useAlias = false;
		familyName = this.support[ osId ] ? this.support[ osId ].fontFamily : "";

		if( this.support[ osId ] && ( this.support[ osId ].alias || this.support[ osId ].alias === "" ) ) {
			useAlias = true;
			familyName = this.support[ osId ].alias;
		}

		arr.push({
			support: !!( this.support[ osId ] && !this.support[ osId ].alias ),
			alias: useAlias,
			unsupported: !this.support[ osId ],
			fallback: !!( this.support[ osId ] && this.support[ osId ].fallback ),
			exceptions: this.support[ osId ] && this.support[ osId ].exceptions,
			shortcode: os.shortcode,
			name: os.name,
			version: os.version,
			fontFamily: familyName
		});
	}

	return arr;
};

FFRLookup.prototype.toString = function() {
	var str = [ "\nfont-family: " + this.familyList + ";\n" ];
	for( var osId in this.support ) {
		str.push( operatingSystems[ osId ] + ': ' + ( this.support[ osId ] ? ( this.support[ osId ].alias || this.support[ osId ].fontFamily ) : "(fallback)" ) );
	}
	return str.join( "\n" );
};

// http://code.activestate.com/recipes/577787-slugify-make-a-string-usable-in-a-url-or-filename/
FFRLookup.prototype.getFileName = function() {
	var s = this.familyList;
  s = s.replace( /[^\w\s-]/g, '').trim().toLowerCase();
  s = s.replace( /[-\s]+/g , '-');
  return s;
};

FFRLookup.prototype.getFilePath = function() {
	var filename = this.getFileName();

	if( filename === "" ) {
		return "../fontfamily.io/defaults/default.html";
	}

	return "../fontfamily.io/results/" + filename + ".html";
};

var db,
	template = fs.readFileSync( "./result.ejs", 'utf8' ),
	data;

for( var familyName in lookupTable ) {
	db = new FFRLookup( familyName );
	data = ejs.render( template, {
		slug: db.getFileName(),
		operatingSystems: db.toJSON()
	});

	fs.writeFile( db.getFilePath(), data, function( error ) {
		if( error ) {
			console.log( 'template error: ', error );
		} else {
			console.log( "template success." );
		}
	});
}