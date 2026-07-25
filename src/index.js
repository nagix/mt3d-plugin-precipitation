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
            de: 'Niederschlag',
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
            rainColor: 'rgba(153, 153, 255, 0.5)',
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
        const me = this,
            map = me.map;

        map.on('light', me._onRefresh);
        me._onRefresh(map.getLight());
    }

    onDisabled() {
        const me = this;

        me.map.off('light', me._onRefresh);
    }

    onVisibilityChanged(visible) {
        const me = this;

        me.map.setLayerVisibility(me.id, visible ? 'visible' : 'none');
    }

    _onRefresh(data) {
        const layer = this.layer,
            brightness = data.brightness,
            dark = brightness < 0.25,
            rg = dark ? 153 + Math.min(brightness * 408, 102) : 51 + Math.min(brightness * 204, 204),
            blue = dark ? 204 + Math.min(brightness * 408, 51) : 153 + Math.min(brightness * 204, 102);

        layer.setRainColor(`rgba(${rg}, ${rg}, ${blue}, 0.5)`);
        layer.setSnowColor(`hsl(0, 0%, ${60 + Math.min(brightness * 160, 40)}%)`);
    }

}

export default function() {
    return new PrecipitationPlugin();
}
