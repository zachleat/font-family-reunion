<?php
function sanitize( $str ) {
	$str = preg_replace("/[\/\.]/", '', $str );
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
	<link rel="stylesheet" href="/src/icomoon/style.css">
</head>
<body>
	<h1><a href="/">Font Family Reunion</a></h1>
	<h2>Quickly find Operating Systems default fonts.</h2>
	<form method="get" action="/">
		<label for="families">font-family: </label>
		<div class="form-group">
			<input type="text" id="families" name="families" value="<?php echo denormalizeFamily( $families ); ?>">
			<button type="submit">Show</button>
		</div>
		<!-- <p>See more examples:
			<ul>
				<li><code>font-family: cursive</code></li>
				<li><code>font-family: Andale Mono, monospace</code></li>
			</ul>
		</p> -->
		<p class="note">*** signifies a <code>font-family</code> that is only available by its aliased name in CSS.</p>

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
	<script src="/src/reunion.js"></script>
</body>
</html>