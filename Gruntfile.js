"use strict";

var path = require("path");

module.exports = function (grunt) {
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    dirTmp: ".tmp/",
    dirRelease: "dist/",
    dirDebug: "public/",

    concurrent: {
      dev: ["nodemon:web", "watch:dev"],
      options: {
        logConcurrentOutput: true,
      },
    },
    nodemon: {
      web: {
        script: "server.js",
        options: {
          ignore: ["node_modules/**", "public/**", "test/**"],
        },
      },
    },
    uglify: {
      prod: {
        files: {
          "<%= dirRelease %>main.js": "<%= dirTmp %>main.js",
        },
      },
    },
    browserify: {
      dev: {
        files: {
          "<%= dirDebug %>main.js": "src/main.js",
        },
        options: {
          debug: true,
        },
      },
      prod: {
        files: {
          "<%= dirTmp %>main.js": "src/main.js",
        },
        options: {},
      },
    },
    watch: {
      dev: {
        files: ["./src/**/*.js", "./src/**/*.less", "./views/**/*.pug"],
        tasks: ["browserify:dev"],
        options: {
          livereload: true,
          spawn: false,
          atBegin: true,
        },
      },
    },
  });

  grunt.registerTask("dev", ["concurrent:dev"]);
  grunt.registerTask("release", ["browserify:prod", "uglify:prod"]);
  grunt.registerTask("default", ["dev"]);
};
