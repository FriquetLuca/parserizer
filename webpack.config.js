const path = require('path');
module.exports = [
  {
    mode: 'production',
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts$/, // File must end with .ts
          use: 'ts-loader',
          include: [path.resolve(__dirname, 'src/')]
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },
    output: {
      libraryTarget: 'umd',
      library: 'Parserizer',
      publicPath: 'bundle/',
      filename: 'parserizer.js',
      path: path.resolve(__dirname, 'bundle/')
    },
    optimization: {
      mergeDuplicateChunks: true, // Tells webpack to merge chunks which contain the same modules.
      providedExports: true, // Tells webpack to figure out which exports are provided by modules to generate more efficient code for export * from ...
      removeAvailableModules: true, // Tells webpack to detect and remove modules from chunks when these modules are already included in all parents.
      usedExports: false, // <- remove unused function
    }
  }
];