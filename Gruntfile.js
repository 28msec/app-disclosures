module.exports = function (grunt) {
    'use strict';
    
    var config = {
        www: 'www',
        dist: 'dist'
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.task.loadTasks('tasks');
    
    var LIVERELOAD_PORT = 35728;
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
        aws: grunt.file.readJSON('grunt-aws.json'),
        config: config,
        watch: {
            less: {
                files:  ['<%= config.www %>/{,*/}*.less'],
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
                port: 9008,
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
                    src: [ '*.html', '**/*.html' ],
                    dest: '<%= config.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%=config.www %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= config.www %>/bower_components/font-awesome/fonts',
                    dest: '<%= config.dist %>/fonts',
                    src: ['*']
                }]
            }
        },
        useminPrepare: {
            html: [ '<%= config.www %>/*.html', '<%= config.www %>/**/*.html' ],
            css: '<%= config.www %>/styles/**/*.css',
            options: {
                dest: '<%= config.dist %>'
            }
        },
        usemin: {
            html: [ '<%= config.dist %>/*.html', '<%= config.dist %>/**/*.html' ],
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
                    },
                    {
                        swagger: 'swagger/session.json',
                        moduleName: 'session',
                        className: 'SessionAPI',
                        fileName: 'session.js',
                        angularjs: true
                    }
                ],
                dest: '<%= config.www %>/modules'
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
            src: ['Gruntfile.js', '<%= config.www %>/**/*.js', '!<%= config.www %>/bower_components/**/*.js', 'tasks/**/*.js', 'tests/**/*.js']
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
                        '<%= config.www %>/modules/queries.js'
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
        ngconstant: {
            options: {
                space: '    '
            },
            server: {
                dest: '<%= config.www %>/constants.js',
                name: 'constants',
                wrap: '/*jshint quotmark:double */\n"use strict";\n\n<%= __ngModule %>',
                constants: {
                    'API_URL': 'https://secxbrl-dev.xbrl.io/v1',
                    'DEBUG': true,
                    'HTML5': true
                }
            },
            prod: {
                dest: '<%= config.www %>/constants.js',
                name: 'constants',
                wrap: '/*jshint quotmark:double */\n"use strict";\n\n<%= __ngModule %>',
                constants: {
                    'API_URL': 'https://secxbrl.xbrl.io/v1',
                    'DEBUG': false,
                    'HTML5': true
                }
            },
            ios: {
                dest: '<%= config.www %>/constants.js',
                name: 'constants',
                wrap: '/*jshint quotmark:double */\n"use strict";\n\n<%= __ngModule %>',
                constants: {
                    'API_URL': 'https://secxbrl.xbrl.io/v1',
                    'DEBUG': false,
                    'HTML5': false
                }
            }
        },
        s3: {
            options: {
                key: '<%= aws.key %>',
                secret: '<%= aws.secret %>',
                access: 'public-read',
                maxOperations: 5
            },
            test: {
                bucket: '<%= aws.bucket_test %>',
                upload: [{
                    src: '<%= config.dist %>/**/*',
                    dest: '',
                    rel: '<%= config.dist %>/',
                }]
            },
            prod: {
                bucket: '<%= aws.bucket_prod %>',
                upload: [{
                    src: '<%= config.dist %>/**/*',
                    dest: '',
                    rel: '<%= config.dist %>/',
                }]
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
    grunt.registerTask('build', ['clean:pre', 'less', 'swagger-js-codegen', 'useminPrepare', 'concat', 'copy', 'cssmin', 'htmlmin', 'uglify', 'usemin']);
    grunt.registerTask('deploy:test', [ 'build:test', 's3:test' ]);
    grunt.registerTask('default', ['jsonlint', 'jshint', 'build', 'test']);
};
