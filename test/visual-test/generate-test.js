var ejs = require('ejs'),
	fs = require('fs'),
	families = require( "../src/font-families.json" ).families,
	testString = 'AxmTYklsjo190QW@#% This is a test string',
	defaults = {
		"sans-serif": true,
		serif: true,
		monospace: true,
		fantasy: true,
		cursive: true
	},
	getFontFamily = function( family ) {
		return 'font-family: ' + family;
	},
	getQuotedFontFamily = function( family ) {
		if( family in defaults ) {
			return getFontFamily( family );
		}

		return 'font-family: \'' + family + '\'';
	},
	html = [];

families.forEach(function( family ) {
	html.push( '<div class="pair"><div style="' + getQuotedFontFamily( family ) + ', monospace">' + testString + ' ' + family + '</div><div style="' + getFontFamily( "monospace" ) + '">' + testString + '</div></div>' );
	html.push( '<div class="pair"><div style="' + getQuotedFontFamily( family ) + ', serif">' + testString + ' ' + family + '</div><div style="' + getFontFamily( "serif" ) + '">' + testString + '</div></div>' );
});

var template = fs.readFileSync( "./manual-test.ejs", 'utf8' ),
	str = ejs.render( template, { content: html.join( "\n" ) });

fs.writeFile( "./manual-test.html", str, function( error ) {
	if( error ) {
		console.log( 'Test template error: ', error );
	} else {
		console.log( "Test template success." );
	}
});