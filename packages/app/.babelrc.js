module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-solid',
        {
          moduleName: 'gtk-renderer',
          generate: 'universal',
        },
      ],
      '@babel/preset-typescript',
      [
        '@babel/env',
        {
          modules: 'commonjs',
          targets: {
            node: 'current',
          },
        },
      ],
    ],
    // plugins: [
    //   '@babel/plugin-proposal-class-properties',
    //   '@babel/plugin-proposal-object-rest-spread',
    //   [
    //     'babel-plugin-replace-imports',
    //     {
    //       test: /^(solid-js)$/,
    //       replacer: 'solid-js/web/dist/web.cjs',
    //     },
    //   ],
    // ],
  };
};
