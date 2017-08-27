'use strict';
const imagemin = require('imagemin');
const fs = require('fs');

(async () => {
  const input = process.argv.filter(arg => /(png|jpe?g|gif|svg)/.test(arg));
  const plugins = [
    'gifsicle',
    'jpegtran',
    'optipng',
    'svgo'
  ].map(x => require(`imagemin-${x}`)());

  for (const inputPath of input) {
    const outputData = (await imagemin([inputPath], {plugins}))[0].data;
    console.log(`${inputPath}: ${fs.statSync(inputPath).size} byte -> ${outputData.length} byte.`);
    fs.writeFileSync(inputPath, outputData);
  }
})().catch(e => {
  console.log(e.message, e);
  process.exit(1);
});
