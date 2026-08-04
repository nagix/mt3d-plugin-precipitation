import fs from 'node:fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';

const pkg = JSON.parse(fs.readFileSync('package.json'));

// Unminified development build with source maps, emitted to the git-ignored dev/
// folder. The plugin can't run on its own, so load it into Mini Tokyo 3D's dev
// page via the MT3D_PLUGIN_PRECIPITATION environment variable, which serves this
// file live.
export default [{
    input: 'src/index.js',
    output: {
        name: 'mt3dPrecipitation',
        file: `dev/${pkg.name}.js`,
        format: 'umd',
        indent: false,
        sourcemap: true,
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
}];
