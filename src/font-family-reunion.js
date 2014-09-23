;(function( w, $ ) {

	var primaryMatch = {
		ajskldfjklasjdfkljaklsdf: $( "#ajskldfjklasjdfkljaklsdf" ),
		cursive: $( "#cursive" ),
		monospace: $( "#monospace" ),
		'sans-serif': $( "#sans-serif" ),
		serif: $( "#serif" ),
		fantasy: $( "#fantasy" )
	};

	var FFR = w.FontFamilyReunion = {
		success: [],
		error: [],
		getFontFamily: function( family ) {
			return 'font-family: ' + family;
		},
		getQuotedFontFamily: function( family ) {
			if( family in primaryMatch ) {
				return FFR.getFontFamily( family );
			}

			return 'font-family: \'' + family + '\'';
		},
		testDefaultMatch: function( family ) {
			// TODO use internal option from FontFaceOnload
			var testString = 'AxmTYklsjo190QW@#% This is a test string',
				fallbacks = {
					ajskldfjklasjdfkljaklsdf: "monospace",
					"sans-serif": "serif",
					serif: "sans-serif",
					cursive: "serif",
					fantasy: "serif",
					monospace: "sans-serif"
				},
				primary,
				secondary;

			for( primary in fallbacks ) {
				secondary = fallbacks[ primary ];
				FontFaceOnload( family, {
					timeout: 0, // local fonts only
					tolerance: 0,
					fallbacks: [ primary, secondary ],
					primaryMatch: function() {
						primaryMatch[ primary ].append( '<div class="pair"><div style="' + FFR.getQuotedFontFamily( family ) + '">' + testString + ' ' + family + '</div><div style="' + FFR.getFontFamily( primary ) + '">' + testString + '</div></div>' );
					}
				});
			}
		}
	};

	$( "#ua" ).html( navigator.userAgent );

	var $error = $( "#error" ),
		$success = $( "#success" ),
		deferreds = [];

	$.getJSON( "../src/font-families.json" ).done(function( data ) {
		for( var j = 0, k = data.families.length; j < k; j++ ) {
			(function( family ) {
				var deferred = $.Deferred(),
					fallbacks = {
						"sans-serif": [ "serif", "monospace" ],
						serif: [ "sans-serif", "monospace" ]
					};

				FontFaceOnload( family, {
					timeout: 0, // local fonts only
					fallbacks: fallbacks[ family ] ? fallbacks[ family ] : undefined,
					success: function() {
						// $success.append( '<p style="' + FFR.getQuotedFontFamily( family ) + '">' + family + '</p><p>' + family + '</p>' );
						FFR.success.push( family );
						deferred.resolve();
					},
					error: function() {
						// $error.append( '<p style="' + FFR.getQuotedFontFamily( family ) + '">' + family + ' </p><p>' + family + '</p>' );
						FFR.error.push( family );
						deferred.resolve();
					}
				});

				deferreds.push( deferred.promise() );
			})( data.families[ j ] );
		}

		$.when.apply( deferreds ).then(function() {
			$success.find( "textarea" ).val( JSON.stringify( FFR.success ) );

			if( false && confirm( "Save?" ) ) {
				$.ajax({
					type: 'POST',
					url: 'http://192.168.2.27:3000/save',
					data: {
						ua: navigator.userAgent,
						families: FFR.success.join( ',' )
					},
					dataType: 'json',
					success: function() {
						alert( 'Saved' );
					}
				});
			}

			var success = FFR.success;
			for( var j = 0, k = success.length; j < k; j++ ) {
				FFR.testDefaultMatch( success[ j ] );
			}
		});
	});

}( this, jQuery ));