// import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

// // also import the "angular2-esri-loader" to be able to load JSAPI modules
// import { EsriLoaderService } from 'angular2-esri-loader';



// @Component({
//   selector: 'app-esri-map',
//   templateUrl: './esri-map.component.html',
//   styleUrls: ['./esri-map.component.css']
// })
// export class EsriMapComponent implements OnInit {

//   // for JSAPI 4.x you can use the "any for TS types
//   public mapView: __esri.MapView;
//   public pointGraphic: __esri.Graphic;
//   public markerSymbol: __esri.SimpleMarkerSymbol;
//   public graphicsLayer: __esri.GraphicsLayer;

//   // this is needed to be able to create the MapView at the DOM element in this component
//   @ViewChild('mapViewNode') private mapViewEl: ElementRef;

//   constructor(
//     private esriLoader: EsriLoaderService, element: ElementRef, renderer: Renderer2
//   ) {  renderer.setStyle(element.nativeElement, 'font-size', 'x-large'); }

//   public ngOnInit() {
//     this.initializeMap();
//     this.getCrashTweets();
//   }

//   public initializeMap() {
//   // only load the ArcGIS API for JavaScript when this component is loaded
//   return this.esriLoader.load({
//     // use a specific version of the JSAPI
//     url: 'https://js.arcgis.com/4.3/'
//   }).then(() => {
//     // load the needed Map and MapView modules from the JSAPI
//     this.esriLoader.loadModules([
//       'esri/Map',
//       'esri/views/MapView'
//     ]).then(([
//       Map,
//       MapView
//     ]: [ __esri.MapConstructor, __esri.MapViewConstructor]) => {
//       const mapProperties: __esri.MapProperties = {
//         basemap: 'gray-vector'
//       };

//       const map = new Map(mapProperties);

//       const mapViewProperties: __esri.MapViewProperties = {
//         // create the map view at the DOM element in this component
//         container: this.mapViewEl.nativeElement,
//         // supply additional options
//         center: [-78.65, 35.8],
//         zoom: 12,
//         map // property shorthand for object literal
//       };

//       this.mapView = new MapView(mapViewProperties);    
//     });
//   });

//   }

//   public getCrashTweets() {
//     // subscribe to behaviorSubject
//     this.mapView.goTo({
//       center: [-78.65, 35.8],
//       zoom: 17
//     });

//     this.esriLoader.require(['esri/Map', 'esri/layers/GraphicsLayer', 'esri/geometry/Point',
//     'esri/symbols/SimpleMarkerSymbol', 'esri/Graphic'],
//     (Map, GraphicsLayer, Point, SimpleMarkerSymbol, Graphic) => {
//       this.markerSymbol = new SimpleMarkerSymbol({
//         color: [226, 119, 40],
//         outline: { // autocasts as new SimpleLineSymbol()
//           color: [255, 255, 255],
//           width: 2
//         }
//       });
//       this.pointGraphic = new Graphic({
//         geometry: new Point({
//           longitude: -78.65,
//           latitude:  35.8
//         })
//       });

//       this.pointGraphic.symbol = this.markerSymbol;
//       this.mapView.graphics.removeAll();
//       this.mapView.graphics.add(this.pointGraphic);
//     });
//   }

// }


import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EsriLoaderService } from 'angular2-esri-loader';


@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  @ViewChild('map') mapEl: ElementRef;

  map: __esri.Map; // VS Code (and others) will now autocomplete on `this.map` like a boss.

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.map) {
      // map is already initialized
      return;
    }
    // get the required esri classes from the route
    const esriModules = this.route.snapshot.data['esriModules'];
    this._createMap(esriModules);
  }

  // create a map at the root dom node of this component
  _createMap([Map]) {
    this.map = new Map(this.mapEl.nativeElement, {
      center: [-118, 34.5],
      zoom: 8,
      basemap: 'dark-gray'
    });
  }
}