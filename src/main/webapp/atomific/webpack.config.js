const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sourcePath = path.join(__dirname, './');
const ADS_SERVER = process.env.ADS_SERVER || '172.24.229.72';
const ADS_PORT = process.env.ADS_PORT || '4000';
const definePlugin = new webpack.DefinePlugin({
	ADS_SERVER : JSON.stringify(ADS_SERVER),
	ADS_PORT : JSON.stringify(ADS_PORT)
});
const plugins = [
	new ExtractTextPlugin({ filename: 'style-[hash].min.css', allChunks: true }),
	new webpack.optimize.CommonsChunkPlugin({
		name : 'vendor',
		minChunks : 3,
		chunks: ["vendor"],
		filename : 'vendor-[hash].js',
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name : 'react',
		minChunks : 2,
		chunks: ["react"],
		filename : 'react-[hash].js',
	}),
	definePlugin,
	new webpack.NamedModulesPlugin(),
	new HtmlWebpackPlugin({
		template : path.join(sourcePath, 'index.html'),
		path : sourcePath,
		filename : 'index.html',
	}),
	new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),
	new webpack.optimize.AggressiveMergingPlugin({ moveToParents: true })
];
if(isProduction) {
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		mangle: true,
		sourceMap: true,
		compress: {
			warnings: false, // Suppress uglification warnings
			pure_getters: true,
			unsafe: true,
			unsafe_comps: true,
			screw_ie8: true
		},
		output: {
			comments: false,
		},
		exclude: [/\.min\.js$/gi] // skip pre-minified libs
	}));
	plugins.push(new webpack.LoaderOptionsPlugin({
     minimize: true
   }));
} else {
	plugins.push(
		new webpack.HotModuleReplacementPlugin()
	);
}
module.exports = {
	devtool : isProduction ? 'eval' : 'source-map',
	entry : {
		js : './sales.js',
		vendor : [
			'react',
			'log4javascript',
			'react-addons-css-transition-group',
			'react-bootstrap',
			'react-bootstrap-table',
			'react-nprogress',
			'react-popover',
			'react-redux',
			'react-router',
			'react-stars',
			'redux-form',
			'redux-thunk',
			'react-redux-i18n',
			'react-toggle-display',
			'scroll-to-element',
			'redux'
		]
	},
	output : {
		filename : 'sales.[hash].js',
		publicPath : '/',
		path : path.join(__dirname, './'),
	},
	module : {
		rules : [ {
			test : /\.jsx?$/,
			exclude : /node_modules/,
			use: {
				loader : 'babel-loader',
				query : {
					plugins: [
						"transform-class-properties"
					],
					presets: [
						'react',
						'stage-2',
						['es2015', {'modules': false}]
					]
				},
			},
		},
		{
			test: /\.css$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: { modules: true }
				},
			],
		},{
			test : /\.png$/,
			exclude: /node_modules/,
			use: {
				loader: 'url-loader',
				options: {
					mimetype: 'image/png'
				},
			},
		},{
			test : /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
			exclude: /node_modules/,
			use: {
				loader: 'file-loader',
				query: {
					name: '[name].[ext]'
				},
			},
		}]
	},
	plugins,
	resolve: {
		extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
		alias: {
  		common: path.resolve(__dirname, './common'),
			app : path.resolve(__dirname, './app'),
			lib : path.resolve(__dirname, './lib')
		}
	}
};
