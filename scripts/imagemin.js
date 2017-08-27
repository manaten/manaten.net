#!/usr/bin/env node
'use strict';
const imagemin = require('imagemin');
const fs = require('fs');

const DEFAULT_PLUGINS = [
  'gifsicle',
  'jpegtran',
  'optipng',
  'svgo'
];
const requirePlugins = plugins => plugins.map(x => require(`imagemin-${x}`)());

(async () => {
  const input = process.argv.filter(arg => /(png|jpe?g|gif)/.test(arg));
  const plugins = requirePlugins(DEFAULT_PLUGINS);

  for (const inputPath of input) {
    const outputData = (await imagemin([inputPath], {plugins}))[0].data;
    console.log(`${inputPath}: ${fs.statSync(inputPath).size} byte -> ${outputData.length} byte.`);
    fs.writeFileSync(inputPath, outputData);
  }
})().catch(e => {
  console.log(e.message, e);
  process.exit(1);
});
