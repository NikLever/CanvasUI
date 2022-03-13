import babel from '@rollup/plugin-babel';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';

const devsrvConfig = require( './devsrv.config.js' );
const threejsVersion = devsrvConfig.buildOptions.defaultValue;
const EOL = os.EOL;

const jsFolder = path.resolve( './dist/examples/js' );
const jsmFolder = path.resolve( './dist/examples/jsm' );
const jsmSrc = path.resolve( './dist/examples/jsm_src' );

fs.moveSync(jsmFolder, jsmSrc);
fs.pathExistsSync(jsmFolder);

const files = [
    'CanvasUI.js',
    'VRButton.js'
];

const babelrc = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false,
                "targets": ">1%",
                "loose": true,
                "bugfixes": true
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-proposal-class-properties",
            {
                "loose": true
            }
        ]
    ]
}

function header() {

	return {

		renderChunk( code ) {

			return `/**
 * @license
 * Copyright 2020-2022 CanvasUI Nik Lever
 * SPDX-License-Identifier: GPL-v3
 */
${ code }`;

		}

	};

}

function babelCleanup() {

	return {

		transform( code ) {

			// remove comments messed up by babel that break eslint
			// example:
			// 	  setSize: function ()
			//    /* width, height */
			//    {
			//             ↓
			// 	  setSize: function () {
			code = code.replace( new RegExp( `\\(\\)${EOL}\\s*\\/\\*([a-zA-Z0-9_, ]+)\\*\\/${EOL}\\s*{`, 'g' ), '( ) {' );

			return {
				code: code,
				map: null
			};

		}

	};

}

function unmodularize() {

	return {

		renderChunk( code, { fileName } ) {

			// Namespace the modules that end with Utils
			const fileNameNoExtension = fileName.slice( 0, fileName.indexOf( '.' ) );
			const namespace = fileNameNoExtension.endsWith( 'Utils' ) ? fileNameNoExtension : undefined;

			// export { Example };
			// ↓
			// THREE.Example = Example;
			code = code.replace( /export { ([a-zA-Z0-9_, ]+) };/g, ( match, p1 ) => {

				const exps = p1.split( ', ' );

				let output = '';

				if ( namespace ) {

					output += `THREE.${namespace} = {};${ EOL }`;
					output += exps.map( exp => `THREE.${namespace}.${exp} = ${exp};` ).join( EOL );

				} else {

					output += exps.map( exp => `THREE.${exp} = ${exp};` ).join( EOL );

				}


				return output;

			} );

			// import { Example } from '...';
			// but excluding imports importing from the libs/ folder
			const imports = [];
			code = code.replace( /import { ([a-zA-Z0-9_, ]+) } from '((?!libs).)*';/g, ( match, p1 ) => {

				const imps = p1.split( ', ' );
				imps.reverse();
				imports.push( ...imps );

				return '';

			} );

			// import * as Example from '...';
			// but excluding imports importing from the libs/ folder
			code = code.replace( /import \* as ([a-zA-Z0-9_, ]+) from '((?!libs).)*';/g, ( match, p1 ) => {

				const imp = p1;
				if ( imp !== 'THREE' ) {

					imports.push( imp );

				}

				return '';

			} );


			// new Example()
			// (Example)
			// [Example]
			// Example2
			// ↓
			// new THREE.Example()
			// (THREE.Example)
			// [THREE.Example]
			// Example2
			function prefixThree( word ) {

				code = code.replace( new RegExp( `([\\s([!])${word}([^a-zA-Z0-9_])`, 'g' ), ( match, p1, p2 ) => {

					return `${p1}THREE.${word}${p2}`;

				} );

			}

			imports.forEach( prefixThree );


			// Do it again for this particular example
			// new Example(Example)
			// ↓
			// new THREE.Example(THREE.Example)
			imports.forEach( prefixThree );

			// import * as THREE from '...';
			code = code.replace( /import \* as THREE from '(.*)';/g, '' );

			// Remove library imports that are exposed as
			// global variables in the non-module world
			code = code.replace( /import (.*) from '(.*)\/libs\/(.*)';/g, '' );

			// remove newline at the start of file
			code = code.trimStart();

			code = `( function () {${EOL}${code}${EOL}} )();`;

			return {
				code: code,
				map: null
			};

		}

	};

}

function removeJsmSrc() {
    return {
        name:'removeJsmSrc',
        buildEnd:(err) => {
            fs.removeSync(jsmSrc);
        }
    }
}

function onwarn(warning) {
    if ( warning.code === 'CIRCULAR_DEPENDENCY' && warning.importer.match(/examples/) ) 
      return;
  
    console.warn(`(!) ${warning.message}`);
}

// Create a rollup config for each .js file
const mapJs = files.map( (file, idx) => {

	const inputPath = path.join( jsmSrc, file );
	const outputPathJs = path.resolve( jsFolder, file );

	const rollupConfig = {
		input: inputPath,
		plugins: [
            header(),
			babel( {
				babelHelpers: 'bundled',
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
			unmodularize(),
		],

		output: {
			format: 'es',
			file: outputPathJs
        },
        onwarn,
        external: [ `https://cdn.skypack.dev/three@${threejsVersion}`] // <-- suppresses the warning
	};

    return rollupConfig;

} );



// Create a rollup config for each .js file
const mapJsm = files.map( (file, idx) => {

	const inputPath = path.join( jsmSrc, file );
	const outputPathJsm = path.resolve( jsmFolder, file );

	const rollupConfig = {
		input: inputPath,
		plugins: [
            header(),
			babel( {
				babelHelpers: 'bundled',
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
		],

		output: {
            file: outputPathJsm,
        },
        onwarn,
        external: [ `https://cdn.skypack.dev/three@${threejsVersion}`] // <-- suppresses the warning
	};

    if (idx === files.length-1) {
        rollupConfig.plugins.push(removeJsmSrc());
        //rollupConfig.plugins.push( del( { targets: jsmSrc, verbose:true } ) );
    }

    return rollupConfig;

} );

const maps = mapJs.concat(mapJsm);

export default maps;