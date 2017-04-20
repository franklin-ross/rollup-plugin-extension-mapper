import mapExtensions from "../src/rollup-plugin-extension-mapper.js";
import path from "path";
import { expect } from "chai";

describe("rollup-plugin-extension-mapper", function() {
  const options = [
    { ".scss": ".css" },
    { ".scss": "css" },
    { "scss": "css" },
    { "scss": ".css" },
  ];

  for (const option of options) {
    for (const fromExt in option) {
      const toExt = option[fromExt];
      it(`should change '${fromExt}' to '${toExt}'`, function() {
        const mapper = mapExtensions(option);
        const result = mapper.resolveId("style.scss", "importer.js");
        expect(result).to.equal(path.resolve("style.css"));
      });
    }
  }

  it("should match importee directory to importer", function() {
    const mapper = mapExtensions({ ".scss": "css" });
    const result = mapper.resolveId("style.scss", path.join("path", "to", "importer.js"));
    expect(result).to.equal(path.resolve(path.join("path", "to", "style.css")));
  });

    it("should return null or undefined for other file extensions", function() {
    const mapper = mapExtensions({ ".scss": "css" });
    const result = mapper.resolveId("image.png", "importer.js");
    expect(result).to.not.exit;
  });
});