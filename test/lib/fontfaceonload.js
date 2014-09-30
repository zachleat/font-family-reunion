;(function( win, doc ) {
	"use strict";

	var DELAY = 100,
		defaultOptions = {
			string: 'AxmTYklsjo190QW@#% This is a test string',
			glyphs: '',
			fallbacks: [ 'sans-serif', 'serif' ],
			primaryMatch: function() {},
			success: function() {},
			error: function() {},
			tolerance: 2,
			timeout: 10000
		},

		defaultHtml = '<div style="white-space:nowrap;font-family:{1};position:absolute;top:0;left:-9999px;font-size:48px;">{2}</div>',
		primary,
		secondary,
		dimensions;

	function getHtml( afterInitialMeasurements, fontFamily, options ) {
		var html = defaultHtml.replace( /\{2\}/, options.string + options.glyphs );
		return html.replace( /\{1\}/, ( afterInitialMeasurements ? '\'' + fontFamily + '\',' : '' ) + options.fallbacks[ 0 ] ) +
			html.replace( /\{1\}/, ( afterInitialMeasurements ? '\'' + fontFamily + '\',' : '' ) + options.fallbacks[ 1 ] );
	}

	function resetChildren( parent ) {
		primary = parent.firstChild;
		secondary = primary.nextSibling;
	}

	function initialMeasurements( options ) {
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
	}

	function load( fontFamily, options ) {
		var startTime = new Date(),
			parent = doc.createElement( 'div' ),
			appended = false;

		if( !options.fallbacks || options.fallbacks.length !== 2 ) {
			throw new Error( "options.fallbacks must be an array of length 2. Currently: " + options.fallbacks.toString() );
		}

		(function checkDimensions() {
			if( !appended && doc.body ) {
				appended = true;
				doc.body.appendChild( parent );

				parent.innerHTML = getHtml( false, fontFamily, options );
				resetChildren( parent );

// console.log( 'initial', primary.offsetWidth, primary.offsetHeight, secondary.offsetWidth, secondary.offsetHeight );
// debugger;

				initialMeasurements( options );

				// Make sure we set the new font-family after we take our initial dimensions:
				// handles the case where FontFaceOnload is called after the font has already
				// loaded.

				// We set the HTML here instead of using style properties (due to unreliable dimension changes)
				parent.innerHTML = getHtml( true, fontFamily, options );
				resetChildren( parent );

// console.log( primary.offsetWidth, primary.offsetHeight, secondary.offsetWidth, secondary.offsetHeight );
// debugger;
			}

			function check( dims, el ) {
				return appended && dimensions &&
					( Math.abs( dims.width - el.offsetWidth ) > options.tolerance ||
						Math.abs( dims.height - el.offsetHeight ) > options.tolerance );
			}
			function cleanup() {
				doc.body.removeChild( parent );
			}

			if( check( dimensions.primary, primary ) ) {
				cleanup();
				options.success();
			} else if( check( dimensions.secondary, secondary ) ) {
				cleanup();
				options.primaryMatch();
				options.success();
			} else if( ( new Date() ).getTime() - startTime.getTime() >= options.timeout ) {
				cleanup();
				options.error();
			} else {
				setTimeout(function() {
					checkDimensions();
				}, DELAY);
			}
		})();
	} // end load()

	var FontFaceOnload = function( fontFamily, options ) {
		var timeout;

		if( !options ) {
			options = {};
		}

		for( var j in defaultOptions ) {
			if( !options.hasOwnProperty( j ) || options[ j ] === undefined ) {
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
