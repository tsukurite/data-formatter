webpack = require 'webpack'

module.exports =

  context: __dirname

  target: 'web'

  entry:
    index: './javascript/index.js'

  output:
    path: __dirname
    filename: '[name].js'
    chunkFilename: 'chunk-[id].js'

  module:
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]

  resolve:
    extensions: [
      ''
      '.js'
    ]
    modulesDirectories: [
      'node_modules'
    ]

  plugins: [
    new webpack.NoErrorsPlugin
    new webpack.IgnorePlugin(/vertx/)
    new webpack.optimize.OccurenceOrderPlugin
    new webpack.optimize.DedupePlugin
    new webpack.optimize.AggressiveMergingPlugin
    new webpack.BannerPlugin(
      '''
      @license Copyright(c) 2016 IMJ Co., Ltd.
      https://github.com/tsukurite/data-formatter
      Released under the MIT license.
      '''
    ,
      options:
        raw: false
        entryOnly: true
    )
  ].concat(
    if process.argv.some (arg) ->
      /^(?:-p|--optimize-minimize)$/.test(arg)
    then [
      new webpack.optimize.UglifyJsPlugin(
        output:
          comments: true
      )
    ]
    else [
    ]
  )
