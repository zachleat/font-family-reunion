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
			},
			generate: {
				command: 'node parse-results.js',
				options: {
					stdout: true,
					execOptions: {
						cwd: 'results/'
					}
				}
			}
		}
	});

	// Upload to Production
	grunt.registerTask('generate', ['shell:generate']);
	grunt.registerTask('deploy', ['generate', 'shell:upload']);
};
