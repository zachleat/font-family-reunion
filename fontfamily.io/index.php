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
		<input type="text" name="families" value="<?echo $_GET[ "families" ]; ?>">
		<button type="submit">Find</button>
		<p>*** signifies a <code>font-family</code> name that is not explicitly available in CSS and only available as an alias.</p>

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