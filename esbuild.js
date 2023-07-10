const esbuild = require('esbuild');

const build = async () => {
  await esbuild.build({
    entryPoints: [ "./src" ],
    bundle: true,
    minify: true,
    platform: 'browser',
    sourcemap: false,
    outfile: "lib/bundle/parserizer.js"
  });
}

build();