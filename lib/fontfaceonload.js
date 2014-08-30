;(function( win, doc ) {
	"use strict";

	var DELAY = 100,
		TEST_STRING = 'AxmTYklsjo190QW@',

		html = '<div style="font-family:%s;position:absolute;top:0;left:-9999px;font-size:48px">' + TEST_STRING + '</div>',
		primary,
		secondary,
		dimensions;

	function initialMeasurements( fontFamily, fallbacks ) {
		dimensions = {
			primary: {
				width: primary.offsetWidth,
				height: primary.offsetHeight
			},
			secondary: {
				width: secondary.offsetWidth,
				height: secondary.offsetHeight
			}
		};

		// Make sure we set the new font-family after we take our initial dimensions:
		// handles the case where FontFaceOnload is called after the font has already
		// loaded.
		primary.style.fontFamily = fontFamily + ',' + fallbacks[ 0 ];
		secondary.style.fontFamily = fontFamily + ',' + fallbacks[ 1 ];
	}

	function load( fontFamily, options ) {
		var startTime = new Date(),
			parent = doc.createElement( 'div' ),
			appended = false;

		if( options.fallbacks.length !== 2 ) {
			throw new Error( "options.fallbacks must be an array of length 2. Currently: " + options.fallbacks.toString() );
		}

		parent.innerHTML = html.replace(/\%s/, options.fallbacks[ 0 ] ) + html.replace(/\%s/, options.fallbacks[ 1 ] );
		primary = parent.firstChild;
		secondary = primary.nextSibling;

		if( options.glyphs ) {
			primary.innerHTML += options.glyphs;
			secondary.innerHTML += options.glyphs;
		}

		(function checkDimensions() {
			if( !appended && doc.body ) {
				appended = true;
				doc.body.appendChild( parent );

				initialMeasurements( fontFamily, options.fallbacks[ 0 ], options.fallbacks[ 1 ] );
			}

			function check( dims, el ) {
				return appended && dimensions &&
					( Math.abs( dims.width - el.offsetWidth ) > options.tolerance ||
						Math.abs( dims.height - el.offsetHeight ) > options.tolerance );
			}

			if( check( dimensions.primary, primary ) ) {
				options.success();
			} else if( check( dimensions.secondary, secondary ) ) {
				options.primaryMatch();
				options.success();
			} else if( ( new Date() ).getTime() - startTime.getTime() >= options.timeout ) {
				options.error();
			} else {
				setTimeout(function() {
					checkDimensions();
				}, DELAY);
			}
		})();
	} // end load()

	var FontFaceOnload = function( fontFamily, options ) {
		var defaultOptions = {
				glyphs: '',
				fallbacks: [ 'sans-serif', 'serif' ],
				primaryMatch: function() {},
				success: function() {},
				error: function() {},
				tolerance: 2,
				timeout: 10000
			},
			timeout;

		if( !options ) {
			options = {};
		}

		for( var j in defaultOptions ) {
			if( !options.hasOwnProperty( j ) ) {
				options[ j ] = defaultOptions[ j ];
			}
		}

		if( options.timeout && "fonts" in doc ) {
			doc.fonts.load( "1em " + fontFamily ).then(function() {
				options.success();

				win.clearTimeout( timeout );
			});

			timeout = win.setTimeout(function() {
				options.error();
			}, options.timeout );
		} else {
			load( fontFamily, options );
		}
	};

	// intentional global
	win.FontFaceOnload = FontFaceOnload;
})( this, this.document );
