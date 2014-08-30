;(function( w, $ ) {

	var DEFAULT_FONT_FAMILIES = [ 'cursive', 'fantasy', 'monospace', 'sans-serif', 'serif' ];

	var FontFamilyReunion = w.FontFamilyReunion = {
		success: [],
		error: []
	};

	$( "#ua" ).html( navigator.userAgent );

	var $error = $( "#error" ),
		$success = $( "#success" ),
		primaryMatch = {
			cursive: $( "#cursive" ),
			monospace: $( "#monospace" ),
			'sans-serif': $( "#sans-serif" ),
			serif: $( "#serif" ),
			fantasy: $( "#fantasy" )
		},
		deferreds = [];

	$.getJSON( "src/font-families.json" ).done(function( data ) {
		for( var j = 0, k = data.families.length; j < k; j++ ) {
			(function( family ) {
				var deferred = $.Deferred(),
					fallbacks = [ "sans-serif", "serif", "cursive", "fantasy", "monospace" ],
					testString = "This is a test string gxympq %#@ ";

				FontFaceOnload( family, {
					timeout: 0, // local fonts only
					success: function() {
						FontFamilyReunion.success.push( family );
						deferred.resolve();
					},
					error: function() {
						$error.append( '<p style="font-family: ' + family + '">' + family + '</p><p>' + family + '</p>' );
						FontFamilyReunion.error.push( family );
						deferred.resolve();
					}
				});

				for( var j = 0, k = fallbacks.length; j < k; j++ ) {
					FontFaceOnload( family, {
						timeout: 0, // local fonts only
						tolerance: 0,
						fallbacks: [ fallbacks[ j ], fallbacks[ ( j + 1 ) % fallbacks.length ] ],
						primaryMatch: function() {
							primaryMatch[ fallbacks[ j ] ].append( '<div class="pair"><div style="font-family: ' + family + '">' + family + " " + testString + '</div><div style="font-family: ' + fallbacks[ j ] + '">' + family + " " + testString + '</div></div>' );
						}
					});
				}

				deferreds.push( deferred.promise() );
			})( data.families[ j ] );
		}

		$.when.apply( deferreds ).then(function() {
			$success.append( JSON.stringify( FontFamilyReunion.success ) );
		});
	});

}( this, jQuery ));