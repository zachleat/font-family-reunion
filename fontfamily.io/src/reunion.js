;(function( win, doc ) {

	// remove trailing ?
	if( "replaceState" in win.history ) {
		win.history.replaceState( {}, "", win.location.href.replace( /\?[.]*/, '' ) );
	}

	if( !( 'addEventListener' in doc ) ) {
		return;
	}

	FontFaceOnload( "icomoon", {
		success: function() {
			document.documentElement.className += " icons-loaded";
		},
		glyphs: "\uE600\uE601\uE602\uE603\uE604"
	});

	var form = doc.getElementsByTagName( "form" )[ 0 ],
		input = form.getElementsByTagName( "input" )[ 0 ],
		commaWhitespaceRegex = /\s*,\s*/g,
		underscoreRegex = /_/g,
		quotesRegex = /[\'\"]/g;

	function setFormAction() {
		form.setAttribute( "action", "/" + normalizeFamily( this.value ) );
	}
	function setInputValue( val ) {
		this.value = denormalizeFamily( this.value );
	}
	function onFormSubmit( input ) {
		input.value = input.value.replace( commaWhitespaceRegex, ',' );
	}
	function normalizeFamily( val ) {
		return val.replace( /(\s|\%20)/g, '_' );
	}
	function denormalizeFamily( val ) {
		return val.replace( quotesRegex, '' ).replace( commaWhitespaceRegex, ', ' ).replace( underscoreRegex, ' ' );
	}


	setFormAction.call( input );
	setInputValue.call( input );
	input.removeAttribute( "name" );
	input.addEventListener( "input", setFormAction, false );
	input.addEventListener( "change", setInputValue, false );
	form.addEventListener( "submit", function() {
		setInputValue.call( input );
		onFormSubmit( input );
		setFormAction.call( input );
	}, false );
})( this, document );