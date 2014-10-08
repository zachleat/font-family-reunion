/*global module:false,require:false,console:false */
module.exports = function(grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({
		shell: {
			upload: {
				command: 'echo "Note: Requires an \'fontfamily\' host in .ssh/config"; rsync -avz ssh . fontfamily:/home/public/',
				options: {
					stdout: true,
					execOptions: {
						cwd: 'fontfamily.io/'
					}
				}
			}
		}
	});

	// Upload to Production
	grunt.registerTask('deploy', ['shell:upload']);
};
