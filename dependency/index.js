'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');

var _ = require('underscore');
_.str = require('underscore.string');

var DependencyGenerator = yeoman.generators.NamedBase.extend({
    init: function() {

        _.mixin(_.str.exports());
        _.str.include('Underscore.string', 'string');

        this.dependencyName = this.name.toLowerCase();
    },

    askFor: function() {
        var done = this.async();
        var self = this;

        this.log(chalk.magenta('NatGeo CQ Generator'));

        var prompts = [{
            type: 'input',
            name: 'versionNumber',
            message: 'What\'s the version of the dependency?',
            default: 'src/main/content/jcr_root/apps/'
        }, {
            type: 'input',
            name: 'mainFile',
            message: 'What\'s the name of of the main file for the dependency?',
            validate: self._validateRequired
        }];

        this.prompt(prompts, function(props) {

            this.versionNumber = props.versionNumber;
            this.mainFile = props.mainFile;

            done();
        }.bind(this));
    },

    addDependency: function() {

        var bowerHook = '//===== yeoman hook 1 =====//',
            exportsHook = '//===== yeoman hook 2 =====//',
            path = 'bower.json',
            file = this.readFileAsString(path),
            bowerHookReplace = ',"' + this.dependencyName + '"' + ': ' + '"~' + this.versionNumber + '"',
            exportsHookReplace = ',"' + this.dependencyName + '"' + ': ' + '{ "js": "' + this.mainFile + '" }';

        file = file.replace(bowerHook, bowerHookReplace + '\n        ' + bowerHook);
        file = file.replace(exportsHook, exportsHookReplace + '\n        ' + exportsHook);

        this.write(path, file);

    }
});

module.exports = DependencyGenerator;
