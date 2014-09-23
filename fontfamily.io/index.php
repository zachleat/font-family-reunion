<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title></title>
	<style>
	body {
		font-family: Helvetica, sans-serif;
		background-color: #F2E8D5;
	}
	.results {
		position: relative;
		margin: 0 auto;
		max-width: 600px;
	}
	.results table {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
	.results table td,
	.results table th {
		width: 50%;
		padding: .4em .8em;
	}
	.results table .unsupported {
		visibility: hidden;
	}
	.results table:first-child .unsupported {
		visibility: visible;
	}
	.results table tbody td:first-child {
		font-size: .875em;
	}
	.results table tbody td:first-child + td {
		color: #fff;
	}

	.supported td + td {
		background-color: #39B54A;
	}
	.aliased td + td {
		background-color: #A8BD04;
	}
	.unsupported td + td {
		background-color: #C44230;
	}
	</style>
</head>
<body>
	<form method="get" action="<?php echo $_SERVER[ "PHP_SELF" ]; ?>">
		<input type="search" name="families" value="<?echo $_GET[ "families" ]; ?>">
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

	$families = explode( ",", $_GET[ "families" ] );
	$families = array_reverse( $families );
	$files = array();
	$files[] = "./defaults/default.html";
	foreach( $families as $family ) {
		$files[] = "./results/" . toAscii( $family ) . ".html";
	}
	foreach( $files as $file ) {
		include $file;
	}
?>
	</div>
	<script src="../bower_components/jquery/dist/jquery.js"></script>
</body>
</html>