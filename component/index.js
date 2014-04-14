'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');

var _ = require('lodash');
_.str = require('underscore.string');

var CqngGenerator = yeoman.generators.NamedBase.extend({
    init: function() {

        _.mixin(_.str.exports());
        _.str.include('Underscore.string', 'string');

        this.componentName = this.name.toLowerCase();
        this.componentNameCapitalized = _.capitalize(this.componentName);
        this.initializedMessage = this.componentNameCapitalized + " " + "component initialized"

    },

    askFor: function() {
        var done = this.async();
        var self = this;

        this.log(chalk.magenta('NatGeo CQ Generator'));

        var prompts = [{
            type: 'input',
            name: 'appsFolder',
            message: 'What\'s the apps folder path?',
            default: 'src/main/content/jcr_root/apps/'
        }, {
            type: 'input',
            name: 'projectName',
            message: 'What\'s the name of the project? (this folder will be inside the previous path. Something like /src/main/content/jcr_root/apps/kids)',
            validate: self._validateRequired
        }, {
            type: 'input',
            name: 'componentTitle',
            message: 'Title for the component?',
            default: this.name
        }, {
            type: 'input',
            name: 'componentDescription',
            message: 'Description for the component?',
            default: this.name
        }];

        this.prompt(prompts, function(props) {

            this.appsFolder = props.appsFolder;
            this.projectName = props.projectName;
            this.componentTitle = props.componentTitle;
            this.componentDescription = props.componentDescription;

            done();
        }.bind(this));
    },

    generateFiles: function() {

        this.mkdir(this.appsFolder + this.projectName + "/" + this.componentName);

        this.template('componentName/_componentName.java', this._getPath(_.capitalize(this.componentName)) + '.java');
        this.template('componentName/_template.jsp', this._getPath('template.jsp'));
        this.template('componentName/content.xml', this._getPath('.content.xml'));

        // Clientlib related files
        this.mkdir(this._getPath("clientlib"));

        this.template('componentName/clientlib/content.xml', this._getPath("clientlib/.content.xml"));
        this.copy('componentName/clientlib/_js.txt', this._getPath("clientlib/js.txt"));
        this.copy('componentName/clientlib/_css.txt', this._getPath("clientlib/css.txt"));

        this.mkdir(this._getPath("clientlib/js"));
        this.mkdir(this._getPath("clientlib/css"));

        this.copy('componentName/clientlib/js/_main.coffee', this._getPath("clientlib/js/main.coffee"));
        this.copy('componentName/clientlib/css/_main.scss', this._getPath("clientlib/css/main.scss"));
    },

    _validateRequired: function(val) {
        if (val === '' || val === null) {
            return 'This is required.'
        }
        return true;
    },

    _getPath: function(f) {
        return this.appsFolder + this.projectName + "/" + this.componentName + "/" + f
    }
});

module.exports = CqngGenerator;