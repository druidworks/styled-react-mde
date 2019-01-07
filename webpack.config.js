const { join, resolve } = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const pkg = require("./package.json");
const libraryName = pkg.name;

console.info("🛠🛠🛠  BUILDING Back End  🛠🛠🛠");

module.exports = {
  entry: {
    "my-lib": "./src/index.tsx",
    "my-lib.min": "./src/index.tsx"
  },
  output: {
    path: join(__dirname, "./_bundles"),
    filename: "[name].js",
    library: libraryName,
    libraryTarget: "umd",
    umdNamedDefine: true
  },

  mode: "production",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    alias: {
      react: resolve(__dirname, "./node_modules/react"),
      "react-dom": resolve(__dirname, "./node_modules/react-dom")
    },
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".jsx", ".js", ".css", ".scss", ".json"]
  },

  module: {
    rules: [
      // All files with a '.css' extention will be handled by style-loader then css-loader
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: resolve(__dirname, "node_modules")
      },

      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 100000,
              outputPath: "images/",
              publicPath: "/static/images/",
              name: "[name].[ext]"
            }
          }
        ],
        exclude: resolve(__dirname, "node_modules")
      },

      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              silent: true,
              compilerOptions: {
                noEmit: false
              },
              happyPackMode: true,
              getCustomTransformers: join(
                __dirname,
                "./webpack.ts-transformers.js"
              )
            }
          }
        ],
        exclude: resolve(__dirname, "node_modules")
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tslint: true,
      checkSyntacticErrors: true,
      colors: true,
      memoryLimit: 4048,
      workers: 4
    })
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  }
};
