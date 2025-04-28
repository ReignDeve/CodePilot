const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  // 1) Einstiegspunkt deiner App
  entry: path.resolve(__dirname, 'src', 'index.tsx'),

  // 2) Modus: 'development' für Sourcemaps + Hot-Reload, 'production' fürs Minify
  mode: 'development',

  // 3) Ausgabe-Konfiguration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',                // für den Dev-Server
  },

  // 4) Wie Dateien behandelt werden
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,        // JS / JSX mit Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', 
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.css$/,             // CSS importieren
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Assets
        type: 'asset/resource',
      }
    ]
  },

  // 5) Dateiendungen, die du importieren kannst
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  // 6) Dev-Server für lokale Entwicklung
  devServer: {
    static: { directory: path.resolve(__dirname, 'public') },
    compress: true,
    port: 3000,
    historyApiFallback: true,     // für client-side routing
    hot: true,
    open: true
  },

  // 7) Source-Maps aktivieren
  devtool: 'source-map',

  plugins: [
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/microsoft/monaco-editor/blob/main/webpack-plugin/README.md#options
      languages: ["json", "javascript", "typescript"],
    })
  ]
};
