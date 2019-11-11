/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/no-dynamic-require: 0 */
/* eslint global-require: 0 */
/* eslint no-console: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-unused-vars: 0 */
const path = require('path');
const autoprefixer = require('autoprefixer');
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');
const { map } = require('lodash');
const glob = require('glob').sync;

const fileLoaderFinder = makeLoaderFinder('file-loader');
const eslintLoaderFinder = makeLoaderFinder('eslint-loader');

const projectRootPath = path.resolve('.');

const packageJson = require(path.join(projectRootPath, 'package.json'));

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const BASE_CSS_LOADER = {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        sourceMap: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    };

    const POST_CSS_LOADER = {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: true,
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
          }),
        ],
      },
    };

    const LESSLOADER = {
      test: /\.less$/,
      include: [
        path.resolve('./theme'),
        /@plone\/volto\/theme/,
        /@plone\/volto\/theme/,
        /node_modules\/semantic-ui-less/,
      ],
      use: dev
        ? [
            {
              loader: 'style-loader',
            },
            BASE_CSS_LOADER,
            POST_CSS_LOADER,
            {
              loader: 'less-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
              },
            },
          ]
        : [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true,
                modules: false,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            POST_CSS_LOADER,
            {
              loader: 'less-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
              },
            },
          ],
    };

    const SVGLOADER = {
      test: /icons\/.*\.svg$/,
      use: [
        {
          loader: 'svg-loader',
        },
        {
          loader: 'svgo-loader',
          options: {
            plugins: [
              { removeTitle: true },
              { convertPathData: false },
              { removeUselessStrokeAndFill: true },
              { removeViewBox: false },
            ],
          },
        },
      ],
    };

    if (target === 'web') {
      config.plugins.unshift(
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
        }),
      );
    }

    if (target === 'node') {
      config.plugins.unshift(
        new webpack.DefinePlugin({
          __CLIENT__: false,
          __SERVER__: true,
        }),
      );
    }

    config.module.rules.push(LESSLOADER);
    config.module.rules.push(SVGLOADER);

    // Don't load config|variables|overrides) files with file-loader
    // Don't load SVGs from ./src/icons with file-loader
    const fileLoader = config.module.rules.find(fileLoaderFinder);
    fileLoader.exclude = [
      /\.(config|variables|overrides)$/,
      /icons\/.*\.svg$/,
      ...fileLoader.exclude,
    ];

    // Disabling the ESlint pre loader
    config.module.rules.splice(0, 1);

    let voltoPath = `${projectRootPath}`;
    if (packageJson.name !== '@plone/volto') {
      voltoPath = `${projectRootPath}/@plone/volto`;
    }

    const jsconfigPaths = {};
    if (fs.existsSync(`${projectRootPath}/jsconfig.json`)) {
      const jsConfig = require(`${projectRootPath}/jsconfig`).compilerOptions;
      const pathsConfig = jsConfig.paths;
      Object.keys(pathsConfig).forEach(packageName => {
        const packagePath = `${projectRootPath}/${jsConfig.baseUrl}/${
          pathsConfig[packageName][0]
        }`;
        jsconfigPaths[packageName] = packagePath;
        if (packageName === '@plone/volto') {
          voltoPath = packagePath;
        }
      });
    }

    const customizations = {};
    let { customizationPaths } = packageJson;
    if (!customizationPaths) {
      customizationPaths = ['src/customizations/'];
    }
    customizationPaths.forEach(customizationPath => {
      map(
        glob(
          `${customizationPath}**/*.*(svg|png|jpg|jpeg|gif|ico|less|js|jsx)`,
        ),
        filename => {
          const targetPath = filename.replace(
            customizationPath,
            `${voltoPath}/src/`,
          );
          if (fs.existsSync(targetPath)) {
            customizations[
              filename
                .replace(customizationPath, '@plone/volto/')
                .replace(/\.(js|jsx)$/, '')
            ] = path.resolve(filename);
          } else {
            console.log(
              `The file ${filename} doesn't exist in the volto package (${targetPath}), unable to customize.`,
            );
          }
        },
      );
    });

    config.resolve.alias = {
      ...customizations,
      ...config.resolve.alias,
      '../../theme.config$': `${projectRootPath}/theme/theme.config`,
      ...jsconfigPaths,
      '@plone/volto': `${voltoPath}/src`,
      // to be able to reference path uncustomized by webpack
      '@plone/volto-original': `${voltoPath}/src`,
      // be able to reference current package from customized package
      '@package': `${projectRootPath}/src`,
    };

    config.performance = {
      maxAssetSize: 10000000,
      maxEntrypointSize: 10000000,
    };

    const babelRuleIndex = config.module.rules.findIndex(
      rule =>
        rule.use &&
        rule.use[0].loader &&
        rule.use[0].loader.includes('babel-loader'),
    );
    const { include } = config.module.rules[babelRuleIndex];
    if (packageJson.name !== '@plone/volto') {
      include.push(fs.realpathSync(`${voltoPath}/src`));
    }
    config.module.rules[babelRuleIndex] = Object.assign(
      config.module.rules[babelRuleIndex],
      {
        include,
      },
    );
    config.externals =
      target === 'node'
        ? [
            nodeExternals({
              whitelist: [
                dev ? 'webpack/hot/poll?300' : null,
                /\.(eot|woff|woff2|ttf|otf)$/,
                /\.(svg|png|jpg|jpeg|gif|ico)$/,
                /\.(mp4|mp3|ogg|swf|webp)$/,
                /\.(css|scss|sass|sss|less)$/,
                /^@plone\/volto/,
              ].filter(Boolean),
            }),
          ]
        : [];

    return config;
  },
};
