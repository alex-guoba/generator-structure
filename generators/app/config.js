module.exports = {
  options: {
    'skip-welcome-message': {
      desc: 'Skips the welcome message',
      type: Boolean
    },
    'skip-install-message': {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    },
    'test-framework': {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    },
    'skip-test-framework': {
      desc: `Skips adding the test framework`,
      type: Boolean
    }
  },
  prompts: [
    {
      type: 'checkbox',
      name: 'features',
      message: 'Which additional features would you like to include?',
      choices: [
        {
          name: 'Sass',
          value: 'includeSass',
          checked: true
        },
        {
          name: 'Bootstrap',
          value: 'includeBootstrap',
          checked: true
        },
        {
          name: 'Modernizr',
          value: 'includeModernizr',
          checked: true
        }
      ]
    },
    {
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Would you like to include jQuery?',
      default: true,
      when: answers => !answers.features.includes('includeBootstrap')
    }
  ],
  dirsToCreate: ['app/images', 'app/fonts'],
  filesToCopy: [
    {
      input: 'babelrc',
      output: '.babelrc'
    },
    {
      input: 'gitignore',
      output: '.gitignore'
    },
    {
      input: 'editorconfig',
      output: '.editorconfig'
    }
  ],
  filesToRender: [
    {
      input: 'gulpfile.js',
      output: 'gulpfile.js'
    },
    {
      input: '_package.json',
      output: 'package.json'
    },
    {
      input: 'main.js',
      output: 'app/scripts/main.js'
    },
    {
      input: 'index.html',
      output: 'app/index.html'
    }
  ]
};

