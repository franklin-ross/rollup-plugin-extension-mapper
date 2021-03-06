"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = plugin;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function plugin(options = {}) {

  //List of transform functions to try for each path. The first which returns a value wins.
  const transformers = [];

  //Ensures the provided string begins with a period and adds one if not.
  const ensureHasLeadingDot = ext => ext.startsWith(".") ? ext : "." + ext;

  //Builds a list of transform functions.
  for (let extension in options) if (options.hasOwnProperty(extension)) {
    const value = options[extension];
    extension = ensureHasLeadingDot(extension);
    let transform;
    if (typeof value === "function") {
      transform = value;
    } else if (typeof value === "string") {
      const newExtension = ensureHasLeadingDot(value);
      const oldExtension = extension;
      transform = (importee, importer) => {
        const newFileName = importee.substr(0, importee.length - oldExtension.length) + newExtension;
        const importDir = _path2.default.dirname(importer);
        return _path2.default.resolve(importDir, newFileName);
      };
    } else {
      console.warn(`rollup-plugin-extension-mapper expects the value of options.${extension} to be a string or a function`);
      continue;
    }

    transformers.push((importee, importer) => {
      if (typeof importee === "string" && importee.endsWith(extension)) {
        return transform(importee, importer);
      }
      return undefined;
    });
  }

  return {
    resolveId(importee, importer) {
      for (let transformer of transformers) {
        const result = transformer(importee, importer);
        if (result) {
          return result;
        }
      }
      return undefined;
    }
  };
}
