import RainLayer from 'mapbox-gl-rain-layer/src/index.js';
import precipitationSVG from '@fortawesome/fontawesome-free/svgs/solid/cloud-showers-heavy.svg';

function addColor(url, color) {
    const encodedColor = color.replace('#', '%23');
    return url.replace('%3e', ` fill=\'${encodedColor}\' stroke=\'${encodedColor}\'%3e`);
}

class PrecipitationPlugin {

    constructor() {
        const me = this;

        me.id = 'precipitation';
        me.name = {
            en: 'Precipitation',
            es: 'Precipitación',
            fr: 'Précipitation',
            ja: '降水',
            ko: '강수',
            ne: 'वर्षा',
            pt: 'Precipitação',
            th: 'ฝน',
            'zh-Hans': '降水',
            'zh-Hant': '降水'
        };
        me.iconStyle = {
            backgroundSize: '32px',
            backgroundImage: `url("${addColor(precipitationSVG, 'white')}")`
        };
        me.clockModes = ['realtime'];
        me.viewModes = ['ground'];
        me.layer = new RainLayer({
            id: me.id,
            rainColor: '#00f',
            meshOpacity: 0,
            repaint: false
        });
        me._onRefresh = me._onRefresh.bind(me);
    }

    onAdd(map) {
        const me = this;

        me.map = map;
        map.addLayer(me.layer);
    }

    onRemove(map) {
        map.removeLayer(this.id);
    }

    onEnabled() {
        const me = this;

        me.layer.on('refresh', me._onRefresh);
        document.addEventListener('visibilitychange', me._onRefresh);
        me._onRefresh();
    }

    onDisabled() {
        const me = this;

        me.layer.off('refresh', me._onRefresh);
        document.removeEventListener('visibilitychange', me._onRefresh);
    }

    onVisibilityChanged(visible) {
        const me = this;

        me.map.setLayerVisibility(me.id, visible ? 'visible' : 'none');
    }

    _onRefresh() {
        const {layer, map} = this;

        layer.setRainColor(map.hasDarkBackground() ? '#ccf' : '#00f');
        layer.setSnowColor(map.hasDarkBackground() ? '#fff' : '#ccf');
    }

}

export default function() {
    return new PrecipitationPlugin();
}
