module.exports = function(grunt){
	'use strict';

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-sass');

	grunt.initConfig({
		browserify: {
			main : {
				files : {
					'webserver/static/js/main.js' : ['webserver/src/js/main.js'],
				},
				options: {
					transform: ['brfs'],
				},
			},
		},
		express: {
			server: {
				options: {
					script: 'start-server.js',
				},
			},
		},
		watch: {
			express: {
				files: ['webserver/**/*.js'],
				tasks: ['express:server'],
				options: {
					spawn: false,
				}
			},
			browserify: {
				files: ['webserver/src/js/**/*.js'],
				tasks: ['browserify'],
			},
			sass: {
				files: ['webserver/src/sass/**/*.{scss,sass}'],
				tasks: ['sass'],
			},
		},
		sass: {
			dist: {
				files: {
					'webserver/static/css/main.css' : 'webserver/src/sass/main.scss'
				}
			},
		},
	});

	grunt.registerTask('build', ['browserify', 'sass']);
	grunt.registerTask('server', ['express:server']);
	grunt.registerTask('default', ['build', 'server', 'watch']);
};
