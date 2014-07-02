module.exports = function (grunt) {
    'use strict';
    
    var config = {
        www: 'www',
        dist: 'dist'
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.task.loadTasks('tasks');
    
    var LIVERELOAD_PORT = 35729;
    var lrSnippet = require('connect-livereload')({
        port: LIVERELOAD_PORT
    });
    var mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };
    var modRewrite = require('connect-modrewrite');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,
        watch: {
            less: {
                files:  ['<%= config.www %>/styles/{,*/}*.less'],
                tasks: ['less']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= config.www %>/**/*.html',
                    '{.tmp,<%= config.www %>}/styles/{,*/}*.css',
                    '{.tmp,<%= config.www %>}/**/*.js',
                    '<%= config.www %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        //Connect
        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            modRewrite([
                                '!\\.html|\\.xml|\\images|\\.js|\\.css|\\.png|\\.jpg|\\.woff|\\.ttf|\\.svg|\\.ico /index.html [L]'
                            ]),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, config.www)
                        ];
                    }
                }
            },
            test: {
                options: {
                    keepalive: false,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            modRewrite([
                                '!\\.html|\\.xml|\\images|\\.js|\\.css|\\.png|\\.jpg|\\.woff|\\.ttf|\\.svg|\\.ico /index.html [L]'
                            ]),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, config.www)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        less: {
            dist: {
                options: {
                },
                files: {
                    '<%= config.www %>/styles/index.css': ['<%= config.www %>/styles/index.less']
                }
            }
        },
        htmlmin: {
            dist: {
                options: {},
                files: [{
                    expand: true,
                    cwd: '<%= config.www %>',
                    src: [ '*.html', 'partials/*.html' ],
                    dest: '<%= config.dist %>'
                }]
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>/scripts',
                    src: '*.js',
                    dest: '<%= config.dist %>/scripts'
                }]
            }
        },
        useminPrepare: {
            html: [ '<%= config.www %>/*.html', '<%= config.www %>/partials/**/*.html' ],
            css: '<%= config.www %>/styles/**/*.css',
            options: {
                dest: '<%= config.dist %>'
            }
        },
        usemin: {
            html: [ '<%= config.dist %>/*.html', '<%= config.dist %>/partials/**/*.html' ],
            css: '<%= config.dist %>/styles/**/*.css',
            options: {
               dirs: ['<%= config.dist %>']
            }
        },
        'swagger-js-codegen': {
            options: {
                apis: [
                    {
                        swagger: 'swagger/queries.json',
                        moduleName: 'queries',
                        className: 'QueriesAPI',
                        fileName: 'queries.js',
                        angularjs: true
                    }
                ],
                dest: '<%= config.www %>/scripts'
            },
            all: {}
        },
        clean: {
            pre: ['dist/', 'coverage/', 'out/'],
            post: []
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: ['Gruntfile.js', '<%= config.www %>/scripts/**/*.js', 'tasks/**/*.js', 'tests/**/*.js'],
        },
        karma: {
            options: {
                configFile: './karma.conf.js'
            },
            dev: {
                browsers: ['Chrome'],
                autoWatch: true,
                singleRun: false
            },
            '1.2.9': {
                options: {
                    files: [
                        '<%= config.www %>/bower_components/angular/angular.js',
                        '<%= config.www %>/bower_components/angular-mocks-1.2.9/angular-mocks.js',
                        '<%= config.www %>/scripts/queries.js'
                    ]
                }
            }
        },
        coveralls: {
            options: {
                'coverage_dir': 'coverage'
            }
        },
        protractor: {
            travis: 'tests/e2e/config/protractor-travis-conf.js',
            local: 'tests/e2e/config/protractor-conf.js'
        },
        jsonlint: {
            all: {
                src: ['package.json', 'swagger/*']
            }
        },
        phonegap: {
            config: {
                root: 'www',
                config: 'config.xml',
                cordova: '.cordova',
                html : 'index.html',
                path: 'phonegap',
                platforms: ['ios'],
                maxBuffer: 2048,
                verbose: false,
                releases: 'releases',
                releaseName: function(){
                     var pkg = grunt.file.readJSON('package.json');
                     return(pkg.name + '-' + pkg.version);
                },
                debuggable: false,
                name: function(){
                    var pkg = grunt.file.readJSON('package.json');
                    return pkg.name;
                }
            }
        }
    });

    grunt.registerTask('e2e', function(){
        var target = process.env.TRAVIS_JOB_NUMBER ? 'travis' : 'local';
        grunt.task.run([
            'webdriver',
            'connect:test',
            'protractor:' + target
        ]); 
    });

    grunt.registerTask('server', function (target) {
        if(target === 'dist'){
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'swagger-js-codegen',
            'less',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', ['clean:pre', 'less', 'karma:1.2.9', 'clean:post', 'e2e']);
    grunt.registerTask('build', ['clean:pre', 'less', 'swagger-js-codegen', 'useminPrepare', 'concat', 'ngmin', 'cssmin', 'htmlmin', 'uglify', 'usemin']);
    grunt.registerTask('default', ['jsonlint', 'jshint', 'build', 'test']);
};
