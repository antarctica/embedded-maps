const { createApp } = Vue

createApp({
    setup() {
        const antarctica = [[[-180, -90],[180, -90],[180, -60],[-180, -60],[-180, -90]]]
        const sub_antarctica = [[[-180, -60],[180, -60],[180, -50],[-180, -50],[-180, -60]]]
        const geoms = [
            {'geom': antarctica, 'href': './assets/img/antarctica.jpg'}, 
            {'geom': sub_antarctica, 'href': './assets/img/sub_antarctica.jpg'}
        ]

        function getGeom() {
            let urlParams = new URLSearchParams(window.location.search);
            // url and json decode geom query param
            let geom = JSON.parse(decodeURIComponent(urlParams.get('geom')));
            return geom;
        }

        function getHref(geoms, geom) {
            for (let i = 0; i < geoms.length; i++) {
                if (JSON.stringify(geoms[i].geom) === JSON.stringify(geom)) {
                    return geoms[i].href;
                }
            }
            return './assets/img/default.jpg';
        }

        const geom = getGeom();
        const href = getHref(geoms, geom);
        return {
            href
        }
    }
}).mount('#app')
