const Generator = require('yeoman-generator');
// const beautify = require('gulp-beautify');
const config = require('./config');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    for (let optionName in config.options) {
      this.option(optionName, config.options[optionName]);
    }

    //// reset appname
    //if (args.length >= 1) {
    //  this.appname = args[0].toLowerCase();
    //}

    // this.option('coffee'); // This method adds support for a `--coffee` flag
    // this.scriptSuffix = (this.options.coffee ? ".coffee": ".js");
  }

  initializing() {
    this.pkg = require('../../package.json');

    // Make sure the test-framework have been installed first if skip-install option not set
    // https://yeoman.io/authoring/composability.html
     if (!this.options['skip-test-framework']) {
      this.composeWith(
        require.resolve(
          `generator-${this.options['test-framework']}/generators/app`
        ),
        {
          'skip-install': this.options['skip-install']
        }
      );
    }
  }

  // Prompts: https://yowebapp.github.io/authoring/user-interactions.html
  //  The prompt module is provided by (Inquirer.js)[https://github.com/SBoudrias/Inquirer.js]
  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(
        yosay(
          "yo demo."
        )
      );
    }

    return this.prompt(config.prompts).then(answers => {
      this.log(answers);

      const features = answers.features;
      const hasFeature = feat => features && features.includes(feat);

      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');
      // bootstrap have dependence on jquery, the answer would be skip
      this.includeJQuery = answers.includeJQuery;
    });
  }

  // configuring
  configuring() {
    this.log("configuring");
  }

  default() {
    this.log("default");
  }

  // Helper and private methods: https://yeoman.io/authoring/running-context.html
  // Filesystem operation: https://yeoman.io/authoring/file-system.html
  _copy(input, output) {
    this.fs.copy(this.templatePath(`files/${input}`), this.destinationPath(output));
  }

  _copyTpl(input, output, data) {
    this.fs.copyTpl(
      this.templatePath(`tpls/${input}`),
      this.destinationPath(output),
      data
    );
  };

  writing() {
    // Add a transform stream to the commit stream.
    // this.queueTransformStream(
    //   beautify({
    //     indent_level: 4, // applied to CSS, HTML, JS
    //     js: {
    //       indent_level: 2 // applied to JS only
    //     }
    //   })
    // );

    const templateData = {
      appname: this.appname,
      date: new Date().toISOString().split('T')[0],
      name: this.pkg.name,  // generator name for render
      version: this.pkg.version,
      includeSass: this.includeSass,
      includeBootstrap: this.includeBootstrap,
      testFramework: this.options['test-framework'],
      includeJQuery: this.includeJQuery,
      includeModernizr: this.includeModernizr,
      includeAnalytics: false,
    };

    // Create extra directories
    config.dirsToCreate.forEach(item => {
      mkdirp(item);
    });

    // Render Files
    config.filesToRender.forEach(file => {
      this._copyTpl(file.input, file.output, templateData);
    });

    // Copy Files
    config.filesToCopy.forEach(file => {
      this._copy(file.input, file.output);
    });

    if (this.includeModernizr) {
      this._copy('modernizr.json', 'modernizr.json');
    }

    let cssFile = `main.${this.includeSass ? 'scss' : 'css'}`;
    this._copyTpl(cssFile, `app/styles/${cssFile}`, templateData);
  }

  conflicts() {
    this.log("conflicts");
  }

  install() {
    this.log("install");
  }

  end() {
    this.log("end");
  }

  // custom
  installingLodash() {
    this.addDependencies('lodash');
  }

  method1() {
    this.log('User Custom Method ran');
  }

  //_private_method() {
  //  this.log('private hey');
  //}

};
