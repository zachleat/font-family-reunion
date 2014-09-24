<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>fontfamily.io</title>
	<link rel="stylesheet" href="src/fontfamily.css">
	<link rel="stylesheet" href="src/icomoon/style.css">
</head>
<body>
	<form method="get" action="<?php echo $_SERVER[ "PHP_SELF" ]; ?>">
		<label for="families">font-family: </label>
		<input type="text" id="families" name="families" value="<?echo $_GET[ "families" ]; ?>" placeholder="fantasy">
		<button type="submit">Show</button>
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
	// http://cubiq.org/the-perfect-php-clean-url-generator
	function toAscii( $str ) {
		$str = trim( $str );
		$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $str);
		$clean = strtolower(trim($clean, '-'));
		$clean = preg_replace("/[\/_|+ -]+/", '-', $clean);

		return $clean;
	}

	$families = preg_replace("/[\/\.]/", '', $_GET[ "families" ] );
	$families = explode( ",", $families );
	$families = array_reverse( $families );
	$files = array();
	$files[] = "./defaults/default.html";
	foreach( $families as $family ) {
		$files[] = "./results/" . toAscii( $family ) . ".html";
	}
	foreach( $files as $file ) {
		if( file_exists( $file ) ) {
			include $file;
		}
	}
?>
	</div>
</body>
</html>