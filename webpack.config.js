const webpack = require("webpack"),
      path = require("path"),
      pjson = require("./package.json");

const nodeEnv = process.env.NODE_ENV || "development";

module.exports = {
  mode: nodeEnv,
  entry: {
    bundle: path.join(__dirname, "src/scripts/client.js")
  },
  output: {
    path: path.join(__dirname, "public/bundle"),
    filename: `[name].js`,
    chunkFilename: `[name].js`
  },
  devtool: "source-map",
  target: "web",
  optimization: {
    minimize: (nodeEnv === "production"),
    splitChunks: {
      name: true,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      path.join(__dirname, "lib"),
      path.join(__dirname, "node_modules")
    ],
    alias: {
      lib: path.join(__dirname, "lib/"),
      src: path.join(__dirname, "src/"),
    },
    extensions: [".js", ".jsx"]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: `"${nodeEnv}"`,
        browser: true
      }
    })
  ],
  module: {
    rules: [{
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      }, {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        include: [
          path.join(__dirname, "/src"),
          path.join(__dirname, "/lib")
        ],
        exclude: [path.join(__dirname, "node_modules")],
      }, {
        test: /\.json/,
        loader: "json-loader",
        include: [
          path.join(__dirname, "/src"),
          path.join(__dirname, "/lib"),
        ]
      }, {
        test: /\.(css)$/,
        use: [{ loader: 'style-loader' }, {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]__[local]',
            },
          }, { loader: 'postcss-loader' }],
      }, {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: "url-loader?limit=8192"
      }]
  }
};
