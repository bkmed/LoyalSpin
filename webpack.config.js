const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['./index.web.js'],
  output: {
    path: path.join(__dirname, './build'),
    filename: 'index_bundle.js',
    publicPath: process.env.NODE_ENV === 'production' ? '/Plombier/' : '/',
    clean: true,
  },
  devServer: {
    port: 8002,
    allowedHosts: 'auto',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude:
          /node_modules[/\\](?!(react-native-chart-kit|@react-native-community[\\/]datetimepicker|react-native-image-picker|react-native-vector-icons|react-native-css-interop|nativewind)[/\\])/,

        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  loose: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.m?(js|ts)x?/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.geojson$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|tiff|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /postMock.html$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
    }),
    new NodePolyfillPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, './public/favicon.png'),
          to: path.join(__dirname, './build/favicon.png'),
        },
        {
          from: path.join(__dirname, './public/logo.png'),
          to: path.join(__dirname, './build/logo.png'),
        },
      ],
    }),
    new webpack.NormalModuleReplacementPlugin(
      /react-native-worklets[/\\]lib[/\\]module[/\\]initializers\.js$/,
      path.resolve(__dirname, 'src/services/mocks/react-native-worklets-initializers.js')
    ),
  ],
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-vector-icons/MaterialIcons$': path.resolve(
        __dirname,
        'src/services/mocks/vector-icons/MaterialIcons.web.tsx',
      ),
      'react-native-mmkv': path.resolve(
        __dirname,
        'src/services/mocks/react-native-mmkv',
      ),
      '@notifee/react-native': path.resolve(
        __dirname,
        'src/services/mocks/notifee',
      ),
      '@react-native-firebase/analytics': path.resolve(
        __dirname,
        'src/services/mocks/firebase-analytics',
      ),
      '@react-native-firebase/crashlytics': path.resolve(
        __dirname,
        'src/services/mocks/firebase-crashlytics',
      ),
      '@sentry/react': path.resolve(
        __dirname,
        'src/services/mocks/sentry-react',
      ),
      '@react-native-community/netinfo': path.resolve(
        __dirname,
        'src/services/mocks/netinfo',
      ),
    },
    extensions: [
      '.web.ts',
      '.web.tsx',
      '.web.js',
      '.web.jsx',
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
      '.geojson',
      '.scss',
    ],
  },
};
