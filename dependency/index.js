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
            default: 'latest'
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

        var bowerHook = '//===== bowerHook =====//',
            exportsHook = '//===== exportsHook =====//',
            path = 'bower.json',
            file,
            bowerHookReplace = ',"' + this.dependencyName + '"' + ': ' + '"' + (this.versionNumber == '' ? '' : '~') + this.versionNumber + '"',
            exportsHookReplace = ',"' + this.dependencyName + '"' + ': ' + '{ "js": "' + this.mainFile + '" }';

        if (fs.existsSync(path)) {
            file = this.readFileAsString(path);

            if (file.indexOf(bowerHook) === -1 || file.indexOf(exportsHook) === -1) {
                this.log(chalk.red('You need to have both hooks properly placed inside your bower.json'));
            } else {
                file = file.replace(bowerHook, bowerHookReplace + '\n        ' + bowerHook);
                file = file.replace(exportsHook, exportsHookReplace + '\n        ' + exportsHook);

                this.write(path, file);
            }

        } else {
            this.log(chalk.red('You need to have a bower.json file in order to be able to add a dependency'));
        }

    }
});

module.exports = DependencyGenerator;
