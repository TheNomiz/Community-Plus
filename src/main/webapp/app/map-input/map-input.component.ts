import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-input',
  templateUrl: './map-input.component.html',
  styleUrls: ['./map-input.component.scss'],
})
export class MapInputComponent implements OnInit {
  private map!: L.Map;
  private marker!: L.Marker;

  @Output() coordinatesChanged = new EventEmitter<{ lat: number; lon: number }>();

  constructor() {}

  ngOnInit(): void {
    L.Icon.Default.mergeOptions({
      iconUrl: '../../../content/images/small-cluster-icon.png',
      iconSize: L.point(36.6, 55),
      iconAnchor: [18.3, 55],
    });
    this.map = L.map('map2').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  onKeyUp(event: KeyboardEvent): void {
    const query = (event.target as HTMLInputElement).value;
    if (query.length > 2) {
      this.searchAddress(query);
    }
  }

  searchAddress(query: string): void {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=gb`)
      .then(response => response.json())
      .then(results => {
        if (results && results.length > 0) {
          const lat = results[0].lat;
          const lon = results[0].lon;
          this.map.setView([lat, lon], 15);
          this.setMarker(lat, lon);
        }
      });
  }

  setMarker(lat: number, lon: number): void {
    if (this.marker) {
      this.marker.remove();
    }
    this.marker = L.marker([lat, lon]).addTo(this.map);
    this.coordinatesChanged.emit({ lat, lon });
  }
}
