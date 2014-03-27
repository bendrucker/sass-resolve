'use strict';

var path = require('path')
  , asyncReduce = require('asyncreduce')
  , resolve = require('resolve');

/**
 * Processes the package.json found in the given directory
 * 
 * @name processPackage
 * @function
 * @private
 * @param dir {String} the dir that contains the package.json to process
 * @param cb {Function} invoked with an error or the following response object:
 *  - scssFiles: [String] paths to all scss entry files
 *  - deps: [String] paths to all dependencies of this package
 */
module.exports = function (dir, cb) {

  var pack = require(path.join(dir, 'package.json'));

  if (!pack.dependencies) return cb(null, { scssFiles: [], deps: [] });
  
  var deps = Object.keys(pack.dependencies);

  var depsRoots = [];
  var opts = { 
      basedir: dir 
    , extensions: [ '.scss' ]
    , packageFilter: function (pkg, x) { 
        depsRoots.push(x);
        pkg.main = pkg['main.scss'];
        return pkg;
      }
  };

  asyncReduce(
      deps
    , []
    , function (acc, x, cb_) {
        resolve(x, opts, function (err, res) {
          if (err) {
            // we are expecting some modules to not have a sass field
            return (/Cannot find module/).test(err.message) ? cb_(null, acc) : cb_(err);
          }        
          // If main is undefined, resolve tries to be smart and resolve either index.js or module_name.js
          // This caused 'punycode' from browser-builtins to be included which is a bug
          // Forcing all main.scss files to have a '.scss' extension fixes this
          if (path.extname(res) === '.scss') acc.push(res);
          cb_(null, acc);
        });  
      }
    , function (err, scssFiles) {
        if (err) return cb(err);
        cb(null, { scssFiles: scssFiles, deps: depsRoots });
      }
  );
}
