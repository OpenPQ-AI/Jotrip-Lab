'use strict';
const path=require('path'),fs=require('fs');
const esbuild=require('C:/Users/Public/OpenPQ/living-kyoto-reference-proof-20261010/kyoto-higashiyama/node_modules/esbuild');
esbuild.buildSync({entryPoints:[path.join(__dirname,'scene.js')],outfile:path.join(__dirname,'bundle.js'),bundle:true,format:'iife',platform:'browser',target:'es2020',minify:true,nodePaths:['C:/Users/Public/OpenPQ/living-kyoto-reference-proof-20261010/kyoto-higashiyama/node_modules'],logLevel:'warning'});
console.log('BUILT_APOLLO_HERO',fs.statSync(path.join(__dirname,'bundle.js')).size);