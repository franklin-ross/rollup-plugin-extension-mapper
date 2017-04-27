# rollup-plugin-extension-mapper

*A Rollup plugin for changing import extensions*

Changes the file extensions used in imports. Useful in multi-stage builds where Rollup gets the output of another step.

**Installation**

```
npm install --save-dev https://github.com/franklin-ross/rollup-plugin-extension-mapper.git
```

**Programmatic Usage**

```javascript
// rollup.config.js
export default {
  entry: "src/entry.js",
  dest: "dist/main.js",
  moduleName: "my-module",
  plugins: [
    extensionMapper({
      // Makes Rollup look for a *.css file whenever it finds a *.scss file. You might have built
      // the scss into css earlier using node-sass, but you'd still prefer to import the original
      // scss source file in you Javascript source.
      ".scss": ".css"
    }),
    //Do something with the css files.
    postcss({ })
  ]
}
```