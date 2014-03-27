'use strict';

var resolveSassPaths =  require('./lib/resolve-sass-paths')
 , scss              =  require('./lib/scss')
 , os                =  require('os')
 , path              =  require('path')
 , fs                =  require('fs')
 , xtend             =  require('xtend')
 , deserialize       =  require('./lib/deserialize-mapfile')
 , resolveSources    =  require('./lib/resolve-scss-sources')
 , convertSourceMap  =  require('convert-source-map')
 ;

var tmpdir = os.tmpDir();
var genImportsPath = path.join(tmpdir, 'sass-resolve-generated-imports.scss');

var defaultOpts = { debug: true, inlineSourcesContent: true, inlineSourceMap: true, nowrite: false };

function persistMap(cssFile, conv, inlineSourceMap, nowrite, cb) {
  if (!inlineSourceMap) { 
    fs.writeFile(cssFile + '.map', conv.toJSON(2), 'utf8', function (err) {
      if (err) return cb(err);
      if (!nowrite) return cb();
      fs.readFile(cssFile, 'utf8', cb);
    });
    return;
  }

  // In case we are supposed to inline the source map, we do the following
  // - remove source map pointing to map file
  // - add the sourcemap with all information inlined to the bottom of the content
  // - overwrite the original .css file with the content (unless nowrite was set)
  fs.readFile(cssFile, 'utf8', adaptCss);

  function adaptCss(err, css) {
    if (err) return cb(err);

    css = convertSourceMap.removeMapFileComments(css); 
    css += '\n' + conv.toComment();

    if (nowrite) return cb(null, css);
    fs.writeFile(cssFile, css, 'utf8', function (err) {
      if (err) return cb(err);
      cb(null, nowrite ? css : null);  
    });  
  }

}

/**
 * Resolves paths to all .scss files from the current package and its dependencies.
 * The location of these sass files is indicated in the "main.scss" field inside packags.json.
 * It then generates the css file including all the rules found in the resolved .scss files.
 * Additionally it generates a .css.map file to enable sass source maps if so desired.
 *
 * @name sassResolve
 * @function
 * @param {string}    root                      path to the current package
 * @param {Object=}   opts                      configure if and how source maps are created and if a css file is written
 * @param {boolean=}  opts.debug                (default: true) generate source maps
 * @param {boolean=}  opts.inlineSourcesContent (default: true) inline mapped (.scss) content instead of referring to original the files separately 
 * @param {boolean=}  opts.inlineSourceMap      (default: true) inline entire source map info into the .css file  instead of referring to an external .scss.map file
 * @param {boolean=}  opts.nowrite              (default: false) if true the css will be included as the result and the css file will not be rewritten in case changes are applied
 * @param {function=} opts.imports              allows overriding how imports are resolved (see: resolveScssFiles and importsFromScssFiles)
 * @param {string=}   opts.cssFile              path at which the resulting css file should be saved, the .css.map file is saved right next to it, if not supplied css not be written
 * @param cb {Function} function (err[, css]) {}, called when all scss files have been transpiled, when nowrite is true,
 * the generated css is included in the response, otherwise all data is written to the css file
 */
exports = module.exports = function (root, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = xtend(defaultOpts, opts);

  function noadapt() {
    if (!opts.nowrite) return cb();
    fs.readFile(opts.cssFile, 'utf8', cb);
  }

  function adaptMap(err, res) {
    if (err) return cb(err);
    // TODO: stop gap to support step by step refactoring
    fs.writeFileSync(opts.cssFile, res.css, 'utf8');
    fs.writeFileSync(opts.cssFile + '.map', res.map, 'utf8');

    if (!opts.debug) return noadapt();
    if (!opts.inlineSourcesContent && !opts.inlineSourceMap) return noadapt();

    deserialize(opts.cssFile, function (err, conv) {
      if (err) return cb(err);
      if (opts.inlineSourcesContent) {
        // resolving sources will add them as 'sourcesContent' to conv
        resolveSources(opts.cssFile, conv, function (err) {
          if (err) return cb(err);
          persistMap(opts.cssFile, conv, opts.inlineSourceMap, opts.nowrite, cb);
        })
      } else {
        persistMap(opts.cssFile, conv, opts.inlineSourceMap, opts.nowrite, cb);
      }
    })

  }
  
  (opts.imports || imports)(root, function (err, src) {
    if (err) return cb(err);
    // the imports contain absolute paths, so it doesn't matter where the import file ends up
    fs.writeFile(genImportsPath, src, 'utf8', function (err) {
      if (err) return cb(err);
      scss(genImportsPath, opts.debug, adaptMap);
    });
  });  
}

/**
 * Resolves paths to all .scss files from the current package and its dependencies.
 * The location of these sass files is indicated in the "main.scss" field inside packags.json.
 * 
 * @name resolveScssFiles
 * @function
 * @param root {String} full path to the project whose scss files to resolve
 * @param cb {Function} called back with a list of paths to .scss files or an error if one occurred
 */
exports.resolveScssFiles = resolveSassPaths;

/**
 * Resolves all paths of all .scss files of this project and its dependencies and 
 * generates the sass imports for them
 * 
 * @name imports
 * @function
 * @param root {String} full path to the project whose sass files to resolve
 * @param cb {Function} called back with imports for the .scss files or an error if one occurred
 */
var imports = exports.imports = function (root, cb) {
  resolveSassPaths(root, function (err, scssFiles) {
    if (err) return cb(err);
    var imports = scssFilesToImports(scssFiles);
    cb(null, imports);
  });
}

/**
 * Creates a .scss import string from the previously resolved sass paths (see: resolveScssFiles)
 * This function is called by `imports` and exposed as an advanced api if more manual tweaking is needed.
 * 
 * @name scssFilesToImports
 * @function
 * @param scssFiles {Array} paths to resolved `.scss` files
 * @return {String} of @import statements for each `.scss` file
 */
var scssFilesToImports = exports.scssFilesToImports = function (scssFiles) {
  return scssFiles.map(function (f) {
    return '@import "' + f + '";';
  }).join('\n');
}
