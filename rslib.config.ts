import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";
import "dotenv/config";

export default defineConfig({
  source: {
    entry: {
      "./content-scripts/index": ["./src/content-scripts/index.tsx"],
      "./popup-scripts/index": ["./src/popup-scripts/index.tsx"],
    },
    define: {
      "process.env.NODE_ENV": '"production"',
      "process.env.USE_MOCK": process.env.USE_MOCK,
    },
  },
  lib: [
    {
      bundle: true,
      dts: false,
      format: "esm",
    },
  ],
  tools: {
    rspack: {
      externals: {}, // This setting exists here so that Rslib bundle all library file into index.js
    },
  },
  output: {
    target: "web",
    copy: {
      patterns: [
        {
          from: "./manifest.json",
          to: "./manifest.json",
        },
        {
          from: "./logoipsum-223.png",
          to: "./logoipsum-223.png",
        },
        {
          from: "./src/popup-scripts/index.html",
          to: "./popup-scripts/index.html",
        },
      ],
    },
  },
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift("babel-plugin-react-compiler");
      },
    }),
  ],
});
