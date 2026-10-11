'use strict';
const path=require('path'),fs=require('fs');
let esbuild;
try{esbuild=require('esbuild')}catch(e){esbuild=require('C:/Users/Public/OpenPQ/living-kyoto-reference-proof-20261010/kyoto-higashiyama/node_modules/esbuild')}
esbuild.buildSync({entryPoints:[path.join(__dirname,'scene-v3.js')],outfile:path.join(__dirname,'bundle.js'),bundle:true,format:'iife',platform:'browser',target:'es2020',minify:true,nodePaths:[path.join(__dirname,'node_modules'),'C:/Users/Public/OpenPQ/living-kyoto-reference-proof-20261010/kyoto-higashiyama/node_modules'],logLevel:'warning'});
console.log('BUILT_SIGNATURE_V3',fs.statSync(path.join(__dirname,'bundle.js')).size);