import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import strip from '@rollup/plugin-strip';

const pkg = JSON.parse(fs.readFileSync('package.json'));
const banner = `/*!
 * mt3d-plugin-precipitation v${pkg.version}
 * ${pkg.homepage}
 * (c) 2021-${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} license
 */`;

export default [{
	input: 'src/index.js',
	output: {
		name: 'mt3dPrecipitation',
		file: `dist/${pkg.name}.js`,
		format: 'umd',
		indent: false,
		sourcemap: true,
		banner,
		globals: {
			'mini-tokyo-3d': 'mt3d'
		}
	},
	external: ['mini-tokyo-3d'],
	plugins: [
		replace({
			preventAssignment: true,
			include: ['node_modules/mapbox-gl-rain-layer/**/*.js'],
			'mapbox-gl': '../../../src/mapboxgl.js',
			'three': '../../../src/three.js'
		}),
		resolve({
			browser: true,
			preferBuiltins: false
		}),
		commonjs(),
		image(),
		json()
	]
}, {
	input: 'src/index.js',
	output: {
		name: 'mt3dPrecipitation',
		file: `dist/${pkg.name}.min.js`,
		format: 'umd',
		indent: false,
		sourcemap: true,
		banner,
		globals: {
			'mini-tokyo-3d': 'mt3d'
		}
	},
	external: ['mini-tokyo-3d'],
	plugins: [
		replace({
			preventAssignment: true,
			include: ['node_modules/mapbox-gl-rain-layer/**/*.js'],
			'mapbox-gl': '../../../src/mapboxgl.js',
			'three': '../../../src/three.js'
		}),
		resolve({
			browser: true,
			preferBuiltins: false
		}),
		commonjs(),
		image(),
		json(),
		terser({
			compress: {
				pure_getters: true
			}
		}),
		strip({
			sourceMap: true
		})
	]
}, {
	input: 'src/index.js',
	output: {
		file: pkg.module,
		format: 'esm',
		indent: false,
		banner
	},
	external: ['mini-tokyo-3d'],
	plugins: [
		replace({
			preventAssignment: true,
			include: ['node_modules/mapbox-gl-rain-layer/**/*.js'],
			'mapbox-gl': '../../../src/mapboxgl.js',
			'three': '../../../src/three.js'
		}),
		resolve({
			browser: true,
			preferBuiltins: false
		}),
		commonjs(),
		image(),
		json()
	]
}];
