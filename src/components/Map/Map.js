import React, { Component } from 'react';
import { AxiosLocalCache } from '../../helpers/AxiosLocalCache';
import LocalCache from '../../helpers/LocalCache';
import L from 'leaflet';
import $ from 'jquery';
import './Map.css';
import 'leaflet/dist/leaflet.css';

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.continent_id = 1;
    this.continent_dims = [0, 0];
    this.mapState = {
      position: [128, 128],
      zoom: 1,
      overlays: {
        poi: true,
        vista: true,
        waypoint: true,
        heropoint: true,
        task: true,
        dungeon: true,
        adventures: true,
        maps: false,
      }
    };
    this.overlays = {
      poi: L.layerGroup(),
      vista: L.layerGroup(),
      waypoint: L.layerGroup(),
      heropoint: L.layerGroup(),
      task: L.layerGroup(),
      dungeon: L.layerGroup(),
      adventures: L.layerGroup(),
      maps: L.layerGroup()
    };
    this.unprojectCoords = this.unprojectCoords.bind(this);
    this.setMapBoundaries = this.setMapBoundaries.bind(this);
    this.setMapMarkers = this.setMapMarkers.bind(this);
    this.updateMapInfo = this.updateMapInfo.bind(this);
    this.saveMapState = this.saveMapState.bind(this);
    this.loadMapState = this.loadMapState.bind(this);
  }
  unprojectCoords(coords) {
    if(coords) return this.map.unproject(coords, 7); else return null;
  }
  projectCoords(coords) {
    return this.map.project(coords, 7);
  }
  setMapBoundaries(data) {
    this.continent_dims = [data.continent_dims[0], data.continent_dims[1]];
    this.map.setMaxBounds(new L.LatLngBounds(this.unprojectCoords([0, 0]), this.unprojectCoords([data.continent_dims[0], data.continent_dims[1]])));
  }
  setMapMarkers(data) {
    let region, gameMap, poi, marker_temp, iconUrl = false, defaultIconSize, items_found = 0;
    for(region in data.regions) {
      if(data.regions.hasOwnProperty(region)) {
        region = data.regions[region];
        for(gameMap in region.maps) {
          if(region.maps.hasOwnProperty(gameMap)) {
            items_found = 0;
            gameMap = region.maps[gameMap];
            for(poi in gameMap.points_of_interest) {
              if(gameMap.points_of_interest.hasOwnProperty(poi)) {
                poi = gameMap.points_of_interest[poi];
                defaultIconSize = [16, 16];
                switch(poi.type) {
                  case "waypoint":
                    iconUrl = 'https://render.guildwars2.com/file/32633AF8ADEA696A1EF56D3AE32D617B10D3AC57/157353.png';
                    defaultIconSize = [20, 20];
                    if(!poi.name.length) poi.name = 'Waypoint';
                  break;
                  case "vista":
                    iconUrl = 'https://render.guildwars2.com/file/A2C16AF497BA3A0903A0499FFBAF531477566F10/358415.png';
                    if(!poi.name.length) poi.name = 'Vista';
                  break;
                  case "landmark":
                    iconUrl = 'https://render.guildwars2.com/file/25B230711176AB5728E86F5FC5F0BFAE48B32F6E/97461.png';
                    if(!poi.name.length) poi.name = 'Point of Interest';
                  break;
                  case "unlock":
                    iconUrl = 'https://render.guildwars2.com/file/943538394A94A491C8632FBEF6203C2013443555/102478.png';
                    if(!poi.name.length) {
                      poi.name = 'Dungeon / Raid / Mount unlock';
                    } else {
                      if(poi.name.includes("Raid")) {
                        iconUrl = 'https://render.guildwars2.com/file/5866630DA52DCB5C423FB81ECF69FD071611E36B/1128644.png';
                      } else if(poi.name.includes("Fractals")) {
                        iconUrl = 'https://render.guildwars2.com/file/80F608A1E8112313595813033BDEAD3C05A43D01/514379.png';
                      }
                    }
                  break;
                  default:
                    iconUrl = false;
                }
                if(iconUrl) {
                  marker_temp= L.marker(this.unprojectCoords(poi.coord), {
                    title: poi.name,
                    riseOnHover: true,
                    riseOffset: 2500,
                    icon: L.icon({
                      iconUrl: iconUrl,
                      iconRetinaUrl: null,
                      shadowUrl: null,
                      shadowRetinaUrl: null,
                      iconSize: defaultIconSize,
                      iconAnchor: [defaultIconSize[0]/2, defaultIconSize[1]/2]
                    })
                  });
                  switch(poi.type) {
                    case "waypoint":
                      marker_temp.setZIndexOffset(1000);
                      marker_temp.addTo(this.overlays.waypoint);
                    break;
                    case "vista":
                      marker_temp.addTo(this.overlays.vista);
                    break;
                    case "landmark":
                      marker_temp.addTo(this.overlays.poi);
                    break;
                    case "unlock":
                      marker_temp.addTo(this.overlays.dungeon);
                    break;
                    default:
                  }
                }
                items_found++;
              }
            }
            for(poi in gameMap.tasks) {
              if(gameMap.tasks.hasOwnProperty(poi)) {
                poi = gameMap.tasks[poi];
                if(!poi.objective.length) poi.name = 'Waypoint';
                L.marker(this.unprojectCoords(poi.coord), {
                  title: poi.objective+' (Level '+poi.level+')',
                  riseOnHover: true,
                  riseOffset: 2500,
                  icon: L.icon({
                    iconUrl: 'https://render.guildwars2.com/file/B3DEEC72BBEF0C6FC6FEF835A0E275FCB1151BB7/102439.png',
                    iconRetinaUrl: null,
                    shadowUrl: null,
                    shadowRetinaUrl: null,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                  })
                }).addTo(this.overlays.task);
                items_found++;
              }
            }
            for(poi in gameMap.skill_challenges) {
              if(gameMap.skill_challenges.hasOwnProperty(poi)) {
                poi = gameMap.skill_challenges[poi];
                L.marker(this.unprojectCoords(poi.coord), {
                  title: 'Hero Point',
                  riseOnHover: true,
                  riseOffset: 2500,
                  icon: L.icon({
                    iconUrl: 'https://render.guildwars2.com/file/B4EC6BB3FDBC42557C3CAE0CAA9E57EBF9E462E3/156626.png',
                    iconRetinaUrl: null,
                    shadowUrl: null,
                    shadowRetinaUrl: null,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                  })
                }).addTo(this.overlays.heropoint);
                items_found++;
              }
            }
            for(poi in gameMap.adventures) {
              if(gameMap.adventures.hasOwnProperty(poi)) {
                poi = gameMap.adventures[poi];
                L.marker(this.unprojectCoords(poi.coord), {
                  title: 'Adventure',
                  riseOnHover: true,
                  riseOffset: 2500,
                  icon: L.icon({
                    iconUrl: 'https://render.guildwars2.com/file/94ED0C4A49295657095EF5D09CC8C4E6709E6FCA/961368.png',
                    iconRetinaUrl: null,
                    shadowUrl: null,
                    shadowRetinaUrl: null,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                  })
                }).addTo(this.overlays.adventures);
                items_found++;
              }
            }
            if(items_found && gameMap.points_of_interest.length) {
              L.rectangle(new L.LatLngBounds(this.unprojectCoords(gameMap.continent_rect[0]), this.unprojectCoords(gameMap.continent_rect[1])), {color: "#ff7800", weight: 2, fill: false}).addTo(this.overlays.maps);
              L.marker(this.unprojectCoords(gameMap.label_coord), {opacity: 0, riseOnHover: true, riseOffset: 2500}).bindTooltip(gameMap.name, {permanent: true, direction: 'center', className: "map-name", offset: [0, 0]}).addTo(this.overlays.maps);
            }
          }
        }
      }
    }
  }
  updateMapInfo() {
    $('#map-current-zoom > span').text(this.mapState.zoom);
    $('#map').attr("map-zoom", this.mapState.zoom);
  }
  saveMapState() {
    this.mapState = {
      position: this.map.getCenter(),
      zoom: this.map.getZoom(),
      overlays: {
        poi: true,
        vista: true,
        waypoint: true,
        heropoint: true,
        task: true,
        dungeon: true,
        adventures: true,
        maps: false
      }
    };
    for(let type in this.overlays) {
      if(this.overlays.hasOwnProperty(type)) {
        if(!this.map.hasLayer(this.overlays[type])) {
          this.mapState.overlays[type] = false;
        } else {
          this.mapState.overlays[type] = true;
        }
      }
    }
    try {
      LocalCache.set('mapState', this.mapState);
    } catch(error) {}
    this.updateMapInfo();
  }
  loadMapState() {
    return new Promise((resolve, reject) => {
      try {
        LocalCache.get('mapState').then(mapStateTemp => resolve(mapStateTemp));
      } catch(error) {}
      reject(null);
    });
  }
  componentDidMount() {
    this.loadMapState().then(onFulfilled => {
      this.mapState = onFulfilled;
    }, () => {
      this.mapState = {
        position: [128, 128],
        zoom: 1,
        overlays: {
          poi: true,
          vista: true,
          waypoint: true,
          heropoint: true,
          task: true,
          dungeon: true,
          adventures: true,
          maps: false
        }
      };
    }).finally(() => {
      try {
        this.map = L.map("map", {
          renderer: L.canvas(),
          preferCanvas: true,
          crs: L.CRS.Simple,
          zoomAnimation: false,
          fadeAnimation: false,
          markerZoomAnimation: false,
          zoom: this.mapState.zoom,
          center: this.mapState.position
        });
        L.tileLayer("./tiles/"+this.continent_id+"/1/{z}/{x}/{y}.jpg", {
          minZoom: 1,
          maxZoom: 7
        }).addTo(this.map);
        for(let type in this.overlays) {
          if(this.overlays.hasOwnProperty(type)) {
            if(this.mapState.overlays[type]===true) this.overlays[type].addTo(this.map);
          }
        }
        L.control.layers(null, {
          "Waypoints": this.overlays.waypoint,
          "Points of Interest": this.overlays.poi,
          "Vistas": this.overlays.vista,
          "Hero Points": this.overlays.heropoint,
          "Tasks / Hearts": this.overlays.task,
          "Dungeons / Raids / Mount unlocks": this.overlays.dungeon,
          "Adventures": this.overlays.adventures,
          "Maps": this.overlays.maps
        }, {
          collapsed: false
        }).addTo(this.map);
        AxiosLocalCache(process.env.REACT_APP_GW2_API_V2+"continents/"+this.continent_id, 2592000, this.setMapBoundaries);
        for(let floor of ["0", "49"]) {
          AxiosLocalCache(process.env.REACT_APP_GW2_API_V1+"map_floor.json?continent_id="+this.continent_id+"&floor="+floor, 2592000, this.setMapMarkers);
        }
        this.map.on('zoomend moveend overlayadd overlayremove', this.saveMapState);
        this.map.on('mouseover mousemove', (e) => {
          let tmp_latlng = this.projectCoords([e.latlng.lat, e.latlng.lng]);
          if(tmp_latlng.x>0 && tmp_latlng.x<=this.continent_dims[0] && tmp_latlng.y>0 && tmp_latlng.y<=this.continent_dims[1]) {
            $('#map-current-coords > span').text(tmp_latlng.x+' , '+tmp_latlng.y);
          } else {
            $('#map-current-coords > span').text('Out of map');
          }
        });
        this.map.on('mouseout', (e) => {
          $('#map-current-coords > span').text('Out of map');
        });
        L.Control.Mapinfo = L.Control.extend({
          onAdd: function(map) {
            var element = L.DomUtil.create('div', 'leaflet-control map-info-control');
            element.innerHTML = '<div class="map-info-control-item" id="map-current-coords">Mouse coordinates:&nbsp;<span>?</span></div><div class="map-info-control-item" id="map-current-zoom">Zoom:&nbsp;<span></span>/7</div>';
            return element;
          }
        });
        L.control.mapinfo = function(opts) {
          return new L.Control.Mapinfo(opts);
        }
        L.control.mapinfo({ position: 'bottomleft' }).addTo(this.map);
        this.updateMapInfo();
      } catch(error) {};
    });
  }
  render() {
    return (
      <div id="map"></div>
    );
  }
}

export default Map;