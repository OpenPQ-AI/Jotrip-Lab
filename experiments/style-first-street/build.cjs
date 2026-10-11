'use strict';
const esbuild=require('C:/Users/Public/OpenPQ/living-kyoto-reference-proof-20261010/kyoto-higashiyama/node_modules/esbuild');
const path=require('path'),fs=require('fs');
esbuild.buildSync({entryPoints:[path.join(__dirname,'main.js')],outfile:path.join(__dirname,'bundle.js'),bundle:true,format:'iife',platform:'browser',target:'es2022',minify:true,nodePaths:['C:/Users/Public/OpenPQ/living-kyoto-reference-proof-20261010/kyoto-higashiyama/node_modules']});
console.log('BUILT',fs.statSync(path.join(__dirname,'bundle.js')).size);