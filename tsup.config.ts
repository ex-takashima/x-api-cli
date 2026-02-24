import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    target: "node20",
    outDir: "dist",
    clean: true,
    sourcemap: true,
    dts: false,
    splitting: false,
    shims: true,
  },
  {
    entry: { "bin/xli": "src/bin.ts" },
    format: ["esm"],
    target: "node20",
    outDir: "dist",
    clean: false,
    sourcemap: false,
    dts: false,
    splitting: false,
    shims: true,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
