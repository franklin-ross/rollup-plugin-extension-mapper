"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = plugin;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function plugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


  //List of transform functions to try for each path. The first which returns a value wins.
  var transformers = [];

  //Ensures the provided string begins with a period and adds one if not.
  var ensureHasLeadingDot = function ensureHasLeadingDot(ext) {
    return ext.startsWith(".") ? ext : "." + ext;
  };

  //Builds a list of transform functions.

  var _loop = function _loop(_extension) {
    if (options.hasOwnProperty(_extension)) {
      var value = options[_extension];
      _extension = ensureHasLeadingDot(_extension);
      var transform = void 0;
      if (typeof value === "function") {
        transform = value;
      } else if (typeof value === "string") {
        var newExtension = ensureHasLeadingDot(value);
        var oldExtension = _extension;
        transform = function transform(importee, importer) {
          var newFileName = importee.substr(0, importee.length - oldExtension.length) + newExtension;
          var importDir = _path2.default.dirname(importer);
          return _path2.default.resolve(importDir, newFileName);
        };
      } else {
        console.warn("rollup-plugin-extension-mapper expects the value of options." + _extension + " to be a string or a function");
        return "continue";
      }

      transformers.push(function (importee, importer) {
        if (typeof importee === "string" && importee.endsWith(_extension)) {
          return transform(importee, importer);
        }
        return undefined;
      });
    }

    extension = _extension;
  };

  for (var extension in options) {
    var _ret = _loop(extension);

    if (_ret === "continue") continue;
  }return {
    resolveId: function resolveId(importee, importer) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = transformers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var transformer = _step.value;

          var result = transformer(importee, importer);
          if (result) {
            return result;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return undefined;
    }
  };
}
