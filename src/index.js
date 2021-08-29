import RainLayer from '../node_modules/mapbox-gl-rain-layer/src/index.js';
import {Plugin} from 'mini-tokyo-3d';
import precipitationSVG from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/cloud-showers-heavy.svg';

function addColor(url, color) {
    const encodedColor = color.replace('#', '%23');
    return url.replace('%3e', ` fill=\'${encodedColor}\' stroke=\'${encodedColor}\'%3e`);
}

class PrecipitationPlugin extends Plugin {

    constructor(options) {
        super(Object.assign({
            clockModes: ['realtime'],
            viewModes: ['ground']
        }, options));

        const me = this;

        me.id = 'precipitation';
        me.name = {
            en: 'Precipitation',
            ja: '降水',
            ko: '강수',
            ne: 'वर्षा',
            th: 'ฝน',
            'zh-Hans': '降水',
            'zh-Hant': '降水'
        };
        me.iconStyle = {
            backgroundSize: '32px',
            backgroundImage: `url("${addColor(precipitationSVG, 'white')}")`
        };
        me._layer = new RainLayer({
            id: me.id,
            rainColor: '#00f',
            meshOpacity: 0
        });
    }

    onAdd(map) {
        map.map.addLayer(this._layer, 'poi');
    }

    onRemove(map) {
        map.map.removeLayer(this._layer);
    }

    onVisibilityChanged(visible) {
        const me = this;

        me._map.map.setLayoutProperty(me.id, 'visibility', visible ? 'visible' : 'none');
    }

}

export default function(options) {
    return new PrecipitationPlugin(options);
}