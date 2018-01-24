module.exports = function (grunt) {

	/*
		default tasks for all methods to use
	*/
	var tasks = [
		'clean:build',
		'concat',
		'copy:main',
		'sass:store',
		'jshint:store',
		'uglify',
		'cssmin:store',
		'clean:sass',
		'copy:final'
	];

	var outFolder = "../public/";

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',

		sass: {
			options: {
				debugInfo: false,
				trace: false
			},
			store: {
				files: {
					'build/css/app.css': [
						'build/sass/app.scss'
					]
				}
			}
		},
		cssmin: {
			store: {
				expand: true,
				cwd: 'build/css/',
				src: ['*.css'],
				dest: 'build/css/',
				ext: '.min.css'
			},
		},
		concat: {
			baseline: {
				src: [
					'sass/mixins/*.scss',
					'sass/baseline/common/*.scss',
					'sass/baseline/modules/*.scss'
				],
				dest: 'build/sass/baseline.scss',
			},
			tablet: {
				src: [
					'sass/tablet/common/*.scss',
					'sass/tablet/modules/*.scss'
				],
				dest: 'build/sass/tablet.scss',
			},
			desktop: {
				src: [
					'sass/desktop/common/*.scss',
					'sass/desktop/modules/*.scss'
				],
				dest: 'build/sass/desktop.scss',
			},
			desktopExtended: {
				src: [
					'sass/desktop-extended/common/*.scss',
					'sass/desktop-extended/modules/*.scss'
				],
				dest: 'build/sass/desktop-extended.scss',
			},
			js: {
				src: [
					'js/bynd.js',
					'js/modules/*.js'
				],
				dest: 'build/js/app.js'
			} 
		},
		watch: {
			js: {
				files: [
					'Gruntfile.js',
					'js/**/*.js',
					'sass/**/*.scss',
					"i/**/*"
				],
				tasks: tasks
			},
		},
		clean: {
			build: {
				src: ['build', outFolder],
				options: {
					force: true
				}
			},
			sass: {
				src: ['build/sass']
			}
		},
		jshint: {
			options: {
				debug: true,
				bitwise: true,
				eqeqeq: true,
				passfail: false,
				nomen: false,
				plusplus: false,
				undef: true,
				evil: true,
				curly: true,
				eqnull: true,
				browser: true,
				globals: {
					module: true,
					define: true,
				}
			},
			store: [
				'Gruntfile.js',
				'js/*.js',
				'js/modules/*.js'
			],
		},
		uglify: {
		  app: {
			 files : {
				'build/js/app.min.js' : 'build/js/app.js'
			 }
		  }
		},
		copy: {
		  main: {
			files: [
				{
					expand: true,
					src: 'sass/app.scss',
					dest: 'build'
				},
				{
					expand: true,
					src: 'fonts/*',
					dest: 'build'
				},
				{
					expand: true,
					src: 'i/**/*',
					dest: 'build'
				}
			]
		  },
		  final : {
			expand: true,
			cwd: "build",
			src: "**",
			dest: outFolder
		  }
		}
	});

	grunt.registerTask('watch', [
		'watch:app'
	]);
	grunt.registerTask('default', tasks);
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');

};
