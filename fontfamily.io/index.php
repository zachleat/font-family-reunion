<?php
function sanitize( $str ) {
	$str = preg_replace("/[\/\.\"\']/", '', $str );
	$str = mb_convert_encoding($str, 'UTF-8', 'UTF-8');
	$str = htmlentities($str, ENT_QUOTES, 'UTF-8');
	return $str;
}

// http://cubiq.org/the-perfect-php-clean-url-generator
function toAscii( $str ) {
	$str = trim( $str );
	$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $str);
	$clean = strtolower(trim($clean, '-'));

	return preg_replace("/[\/_|+ -]+/", '-', $clean);
}

function denormalizeFamily( $str ) {
	$str = trim( $str );
	return preg_replace("/_/", ' ', $str);
}

$families = sanitize( $_GET[ "families" ] );
$os = sanitize( basename( $_GET[ "os" ] ) );
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>fontfamily.io</title>
	<link rel="stylesheet" href="/src/fontfamily.css">
</head>
<body>
	<h1><a href="/">Font Family Reunion</a></h1>
	<h2>Compatibility tables for default local fonts.</h2>
	<form method="get" action="/">
		<label for="families">font-family: </label>
		<div class="form-group">
			<input type="text" id="families" name="families" value="<?php echo denormalizeFamily( $families ); ?>">
			<button type="submit">Show</button>
		</div>
		<p class="note"><strong>Examples</strong>: <a href="/">(none)</a> <a href="/serif">serif</a> <a href="/sans-serif">sans-serif</a> <a href="/fantasy">fantasy</a> <a href="/cursive">cursive</a> <a href="/Andale_Mono,monospace">Andale Mono, monospace</a></p>
		<p class="note">Per the specification, font-family names are case insensitive. <code>***</code> signifies a <code>font-family</code> that is only available by its aliased name in CSS.</p>
		<p class="note"><em><a href="https://twitter.com/zachleat"><img src="/img/zachleat.png" alt="Avatar of @zachleat" class="avatar"> @zachleat</a></em> <strong><a href="//www.zachleat.com/web/font-family-reunion/">Read more about fontfamily.io</a></strong></p>

	</form>
	<div class="results">
<?php
	if( $os ) {
		$file = "./os/" . toAscii( basename( $os ) ) . ".html";
		if( file_exists( $file ) ) {
			include_once( $file );
		}
	} else {
		$families = explode( ",", $families );
		$families = array_reverse( $families );
		$files = array();
		$files[] = "./defaults/default.html";
		foreach( $families as $family ) {
			$files[] = "./results/" . toAscii( basename( $family ) ) . ".html";
		}
		foreach( $files as $file ) {
			if( file_exists( $file ) ) {
				include( $file );
			}
		}
	}
?>
	</div>
	<script src="/src/fontfaceonload.js"></script>
	<script src="/src/reunion.js"></script>
</body>
</html>