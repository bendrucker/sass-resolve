'use strict';
/*jshint asi: true */

var test = require('tap').test
var sort = require('../lib/sort-sass-paths')

function insp(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

var info = 
  { files:
   { 'root@0.0.0': 'root/client/sass/index.scss',
     'app-core@0.21.0': 'root/node_modules/app-core/client/sass/index.scss',
     'app-header@0.0.0': 'root/node_modules/app-header/client/sass/index.scss',
     'app-slideshow@0.6.0': 'root/node_modules/app-slideshow/client/sass/index.scss',
     'core-assets@0.13.0': 'root/node_modules/app-core/node_modules/core-assets/sass/index.scss' },
  deptree:
   { 'root@0.0.0':
      [ 'browserify-shim@3.2.2',
        'app-core@0.21.0',
        'app-header@0.0.0',
        'app-slideshow@0.6.0',
        'handlebars@1.3.0',
        'hbsfy@1.3.2' ],
     'hbsfy@1.3.2': [ 'through@2.3.4' ],
     'through@2.3.4': [],
     'handlebars@1.3.0': [ 'optimist@0.3.7', 'uglify-js@2.3.6' ],
     'app-header@0.0.0':
      [ 'hbsfy@1.3.2',
        'handlebars@1.3.0',
        'browserify-shim@3.2.2',
        'app-core@0.21.0' ],
     'optimist@0.3.7': [ 'wordwrap@0.0.2' ],
     'wordwrap@0.0.2': [],
     'browserify-shim@3.2.2':
      [ 'through@2.3.4',
        'find-parent-dir@0.1.0',
        'resolve@0.6.2',
        'exposify@0.1.3' ],
     'resolve@0.6.2': [],
     'find-parent-dir@0.1.0': [],
     'uglify-js@2.3.6':
      [ 'async@0.2.10',
        'source-map@0.1.33',
        'optimist@0.3.7' ],
     'async@0.2.10': [],
     'source-map@0.1.33': [ 'amdefine@0.1.0' ],
     'amdefine@0.1.0': [],
     'exposify@0.1.3':
      [ 'transformify@0.1.2',
        'through2@0.4.1',
        'detective@2.3.0' ],
     'transformify@0.1.2': [ 'readable-stream@1.1.12' ],
     'through2@0.4.1':
      [ 'readable-stream@1.0.26-4',
        'readable-stream@1.1.12',
        'xtend@2.1.2' ],
     'detective@2.3.0': [ 'esprima@1.0.2', 'escodegen@0.0.15' ],
     'esprima@1.0.2': [],
     'xtend@2.1.2': [ 'object-keys@0.4.0' ],
     'object-keys@0.4.0': [],
     'readable-stream@1.1.12':
      [ 'core-util-is@1.0.1',
        'core-util-is@1.0.1',
        'isarray@0.0.1',
        'isarray@0.0.1',
        'inherits@2.0.1',
        'inherits@2.0.1' ],
     'core-util-is@1.0.1': [],
     'inherits@2.0.1': [],
     'isarray@0.0.1': [],
     'escodegen@0.0.15': [ 'esprima@1.0.2', 'source-map@0.1.33' ],
     'readable-stream@1.0.26-4':
      [ 'core-util-is@1.0.1',
        'isarray@0.0.1',
        'inherits@2.0.1' ],
     'app-slideshow@0.6.0':
      [ 'bestfit@0.1.5',
        'browserify-shim@3.2.2',
        'clone@0.1.11',
        'app-core@0.21.0',
        'debounce@0.0.3',
        'enquire.js@2.1.0',
        'flexslider@0.2.0',
        'hbsfy@0.1.5',
        'hbsfy@1.3.2',
        'hyperquest@0.2.0',
        'imager.js@0.2.0',
        'marked@0.2.10',
        'moment@2.5.1',
        'request@2.29.0',
        'truncate@1.0.2',
        'xtend@2.1.2' ],
     'clone@0.1.11': [],
     'enquire.js@2.1.0': [],
     'debounce@0.0.3': [],
     'flexslider@0.2.0': [],
     'imager.js@0.2.0': [],
     'marked@0.2.10': [],
     'moment@2.5.1': [],
     'truncate@1.0.2': [],
     'bestfit@0.1.5': [ 'xtend@2.1.2' ],
     'app-core@0.21.0':
      [ 'handlebars@1.0.12',
        'handlebars@1.3.0',
        'require-all@0.0.6',
        'hyperquest@0.1.8',
        'bytes@0.2.1',
        'render-routes@0.1.1',
        'once@1.2.0',
        'bunyan@0.22.3',
        'bunyan-format@0.1.1',
        'xtend@2.1.2',
        'cuid@1.2.1',
        'rc@0.3.4',
        'ansicolors@0.3.2',
        'backbone@1.1.0',
        'browserify-swap@0.2.1',
        'browsernizr@1.0.2',
        'core-assets@0.13.0',
        'sass-resolve@2.0.0' ],
     'require-all@0.0.6': [],
     'bytes@0.2.1': [],
     'once@1.2.0': [],
     'cuid@1.2.1': [],
     'ansicolors@0.3.2': [],
     'browsernizr@1.0.2': [],
     'core-assets@0.13.0': [],
     'hyperquest@0.2.0': [ 'through@2.2.7', 'duplexer@0.1.1' ],
     'through@2.2.7': [],
     'duplexer@0.1.1': [],
     'hbsfy@0.1.5':
      [ 'through@2.2.7',
        'handlebars@1.0.12',
        'handlebars@1.3.0' ],
     'render-routes@0.1.1': [ 'handlebars@1.0.12', 'handlebars@1.3.0' ],
     'backbone@1.1.0': [ 'underscore@1.6.0' ],
     'underscore@1.6.0': [],
     'handlebars@1.0.12': [ 'optimist@0.3.7', 'uglify-js@2.3.6' ],
     'hyperquest@0.1.8': [ 'through@2.2.7', 'duplexer@0.1.1' ],
     'bunyan@0.22.3': [ 'mv@2.0.0', 'dtrace-provider@0.2.8' ],
     'dtrace-provider@0.2.8': [],
     'rc@0.3.4':
      [ 'minimist@0.0.8',
        'deep-extend@0.2.8',
        'ini@1.1.0' ],
     'bunyan-format@0.1.1':
      [ 'ansistyles@0.1.3',
        'ansicolors@0.2.1',
        'ansicolors@0.3.2',
        'xtend@2.1.2' ],
     'minimist@0.0.8': [],
     'deep-extend@0.2.8': [],
     'ansistyles@0.1.3': [],
     'ini@1.1.0': [],
     'ansicolors@0.2.1': [],
     'browserify-swap@0.2.1':
      [ 'find-parent-dir@0.1.0',
        'through2@0.2.3',
        'through2@0.4.1',
        'resolve@0.6.2',
        'viralify@0.4.2' ],
     'mv@2.0.0':
      [ 'ncp@0.4.2',
        'rimraf@2.2.6',
        'mkdirp@0.3.5' ],
     'sass-resolve@2.0.0':
      [ 'resolve@0.5.1',
        'asyncreduce@0.1.4',
        'convert-source-map@0.3.3',
        'convert-source-map@0.3.3',
        'xtend@2.1.2',
        'xtend@2.1.2',
        'node-sass@0.8.4' ],
     'ncp@0.4.2': [],
     'rimraf@2.2.6': [],
     'mkdirp@0.3.5': [],
     'resolve@0.5.1': [],
     'convert-source-map@0.3.3': [],
     'through2@0.2.3':
      [ 'readable-stream@1.1.12',
        'readable-stream@1.1.12',
        'xtend@2.1.2',
        'xtend@2.1.2' ],
     'asyncreduce@0.1.4': [ 'runnel@0.5.2' ],
     'runnel@0.5.2': [],
     'viralify@0.4.2':
      [ 'glob@3.2.9',
        'runnel@0.5.2',
        'minimist@0.0.5',
        'minimist@0.0.8',
        'ansicolors@0.3.2' ],
     'minimist@0.0.5': [],
     'glob@3.2.9':
      [ 'minimatch@0.2.14',
        'minimatch@0.2.14',
        'inherits@2.0.1',
        'inherits@2.0.1' ],
     'request@2.29.0':
      [ 'qs@0.6.6',
        'json-stringify-safe@5.0.0',
        'forever-agent@0.5.2',
        'node-uuid@1.4.1',
        'mime@1.2.11',
        'tough-cookie@0.9.15',
        'form-data@0.1.2',
        'tunnel-agent@0.3.0',
        'http-signature@0.10.0',
        'oauth-sign@0.3.0',
        'hawk@1.0.0',
        'aws-sign2@0.5.0' ],
     'qs@0.6.6': [],
     'json-stringify-safe@5.0.0': [],
     'node-uuid@1.4.1': [],
     'forever-agent@0.5.2': [],
     'mime@1.2.11': [],
     'tough-cookie@0.9.15': [],
     'tunnel-agent@0.3.0': [],
     'oauth-sign@0.3.0': [],
     'aws-sign2@0.5.0': [],
     'minimatch@0.2.14': [ 'lru-cache@2.5.0', 'sigmund@1.0.0' ],
     'lru-cache@2.5.0': [],
     'sigmund@1.0.0': [],
     'node-sass@0.8.4':
      [ 'mkdirp@0.3.5',
        'optimist@0.6.1',
        'node-watch@0.3.4',
        'mocha@1.13.0',
        'mocha@1.14.0',
        'chalk@0.3.0',
        'nan@0.6.0' ],
     'node-watch@0.3.4': [],
     'nan@0.6.0': [],
     'form-data@0.1.2':
      [ 'combined-stream@0.0.4',
        'mime@1.2.11',
        'async@0.2.10' ],
     'http-signature@0.10.0':
      [ 'assert-plus@0.1.2',
        'asn1@0.1.11',
        'ctype@0.5.2' ],
     'assert-plus@0.1.2': [],
     'ctype@0.5.2': [],
     'asn1@0.1.11': [],
     'chalk@0.3.0': [ 'has-color@0.1.6', 'ansi-styles@0.2.0' ],
     'has-color@0.1.6': [],
     'ansi-styles@0.2.0': [],
     'optimist@0.6.1':
      [ 'wordwrap@0.0.2',
        'wordwrap@0.0.2',
        'minimist@0.0.8',
        'minimist@0.0.8' ],
     'hawk@1.0.0':
      [ 'hoek@0.9.1',
        'boom@0.4.2',
        'cryptiles@0.2.2',
        'sntp@0.2.4' ],
     'combined-stream@0.0.4': [ 'delayed-stream@0.0.5' ],
     'hoek@0.9.1': [],
     'delayed-stream@0.0.5': [],
     'boom@0.4.2': [ 'hoek@0.9.1' ],
     'cryptiles@0.2.2': [ 'boom@0.4.2' ],
     'sntp@0.2.4': [ 'hoek@0.9.1' ],
     'mocha@1.14.0':
      [ 'commander@2.0.0',
        'growl@1.7.0',
        'jade@0.26.3',
        'diff@1.0.7',
        'debug@0.8.1',
        'mkdirp@0.3.5',
        'glob@3.2.3' ],
     'commander@2.0.0': [],
     'growl@1.7.0': [],
     'diff@1.0.7': [],
     'debug@0.8.1': [],
     'mocha@1.13.0':
      [ 'commander@0.6.1',
        'growl@1.7.0',
        'jade@0.26.3',
        'diff@1.0.7',
        'debug@0.8.1',
        'mkdirp@0.3.5',
        'glob@3.2.3' ],
     'jade@0.26.3':
      [ 'commander@0.6.1',
        'mkdirp@0.3.0',
        'mkdirp@0.3.5' ],
     'commander@0.6.1': [],
     'mkdirp@0.3.0': [],
     'glob@3.2.3':
      [ 'minimatch@0.2.14',
        'minimatch@0.2.14',
        'graceful-fs@2.0.3',
        'inherits@2.0.1',
        'inherits@2.0.1' ],
     'graceful-fs@2.0.3': [] 
  } }

test('\ngiven a dependency tree and all scss files for each package' , function (t) {
  var expected = [ 
    'root/node_modules/app-core/node_modules/core-assets/sass/index.scss',
    'root/node_modules/app-core/client/sass/index.scss',
    'root/node_modules/app-header/client/sass/index.scss',
    'root/node_modules/app-slideshow/client/sass/index.scss',
    'root/client/sass/index.scss' ]
  
  
  t.deepEqual(
      sort(info)
    , expected
    , 'sorts them to to ensure child dependencies come before their parent'
  )
  t.end()
})
