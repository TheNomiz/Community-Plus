/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-shadow */
// eslint-disable-next-line spaced-comment
/// <reference types="bootstrap" />

/* eslint-disable no-console */
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, of, skip, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import supercluster, { AnyProps, ClusterFeature, PointFeature } from 'supercluster';
import 'leaflet.markercluster';
import { ICrimeAlert, NewCrimeAlert } from '../crime-alert.model';
import axios from 'axios';
import dayjs from 'dayjs/esm';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import getCrimeData, { EntityArrayResponseType, CrimeAlertService } from '../service/crime-alert.service';
import { CrimeAlertDeleteDialogComponent } from '../delete/crime-alert-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AccountService } from 'app/core/auth/account.service';
import { Map, TileLayer } from 'leaflet';
import { data, error } from 'cypress/types/jquery';
import Supercluster from 'supercluster';
import * as geojson from 'geojson';
import distance from '@turf/distance';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import bbox from '@turf/bbox';
import { CrimeTypes } from 'app/entities/enumerations/crime-types.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-crime-alert',
  templateUrl: './crime-alert.component.html',
})
export class CrimeAlertComponent implements OnInit {
  mapInitialized = false;

  showFilters = false;

  isListView = false;

  crimeAlerts?: ICrimeAlert[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  links: { [key: string]: number } = {
    last: 0,
  };

  filterDate: string | null = null;
  filterCrimeType: CrimeTypes | null = null;
  filterUser: string | null = null;
  crimeTypes = Object.values(CrimeTypes);

  page = 1;
  map!: L.Map;
  index = new Supercluster({
    radius: 50,
    maxZoom: 18,
    minZoom: 6,
    extent: 512,
    nodeSize: 64,
  });

  constructor(
    protected crimeAlertService: CrimeAlertService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected parseLinks: ParseLinks,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected dataUtils: DataUtils,
    private library: FaIconLibrary
  ) {
    library.addIconPacks(fas);
  }

  toggleView(isMapView: boolean): void {
    localStorage.setItem('isMapView', JSON.stringify(isMapView));
    window.location.reload();
  }

  reset(): void {
    this.page = 1;
    this.crimeAlerts = [];
    this.load();
  }
  getCrimeTypeDisplay(crimeType: CrimeTypes | null | undefined): string {
    switch (crimeType) {
      case CrimeTypes.ALLCRIME:
        return 'All crime';
      case CrimeTypes.ANTISOCIALBEHAVIOUR:
        return 'Anti-social behaviour';
      case CrimeTypes.BICYCLETHEFT:
        return 'Bicycle theft';
      case CrimeTypes.BURGLARY:
        return 'Burglary';
      case CrimeTypes.CRIMINALDAMAGEARSON:
        return 'Criminal damage and arson';
      case CrimeTypes.DRUGS:
        return 'Drugs';
      case CrimeTypes.OTHERTHEFT:
        return 'Other theft';
      case CrimeTypes.POSSESSIONOFWEAPONS:
        return 'Possession of weapons';
      case CrimeTypes.PUBLICORDER:
        return 'Public order';
      case CrimeTypes.ROBBERY:
        return 'Robbery';
      case CrimeTypes.SHOPLIFTING:
        return 'Shoplifting';
      case CrimeTypes.THEFTFROMTHEPERSON:
        return 'Theft from the person';
      case CrimeTypes.VEHICLECRIME:
        return 'Vehicle crime';
      case CrimeTypes.VIOLENCEANDSEXUALOFFENCES:
        return 'Violence and sexual offences';
      case CrimeTypes.OTHERCRIME:
        return 'Other crime';
      default:
        return '';
    }
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }
  getCrimeTypeClass(crimeType: CrimeTypes | null | undefined): string {
    switch (crimeType) {
      case CrimeTypes.ALLCRIME:
        return 'all-crime';
      case CrimeTypes.ANTISOCIALBEHAVIOUR:
        return 'anti-social-behaviour';
      case CrimeTypes.BICYCLETHEFT:
        return 'bicycle-theft';
      case CrimeTypes.BURGLARY:
        return 'burglary';
      case CrimeTypes.CRIMINALDAMAGEARSON:
        return 'criminal-damage-arson';
      case CrimeTypes.DRUGS:
        return 'drugs';
      case CrimeTypes.OTHERTHEFT:
        return 'other-theft';
      case CrimeTypes.POSSESSIONOFWEAPONS:
        return 'possession-of-weapons';
      case CrimeTypes.PUBLICORDER:
        return 'public-order';
      case CrimeTypes.ROBBERY:
        return 'robbery';
      case CrimeTypes.SHOPLIFTING:
        return 'shoplifting';
      case CrimeTypes.THEFTFROMTHEPERSON:
        return 'theft-from-the-person';
      case CrimeTypes.VEHICLECRIME:
        return 'vehicle-crime';
      case CrimeTypes.VIOLENCEANDSEXUALOFFENCES:
        return 'violence-and-sexual-offences';
      case CrimeTypes.OTHERCRIME:
        return 'other-crime';
      default:
        return '';
    }
  }

  trackId = (_index: number, item: ICrimeAlert): number => this.crimeAlertService.getCrimeAlertIdentifier(item);

  ngOnInit(): void {
    const isMapView = JSON.parse(localStorage.getItem('isMapView') ?? 'true');
    console.error(isMapView);
    console.error(this.isListView);
    this.isListView = isMapView;
    this.load();
  }

  initializeMapView(): void {
    if (!this.mapInitialized) {
      this.initializeMap();
      this.mapInitialized = true;
    }
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMap();
    }, 0);
  }

  initializeMap(): void {
    this.map = L.map('map', {
      maxBounds: L.latLngBounds(L.latLng(49.78, -13.13), L.latLng(60.89, 2.87)),
      maxZoom: 18,
      minZoom: 6,
    }).setView([51.4, 0.3], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(crimeAlert: ICrimeAlert): void {
    const modalRef = this.modalService.open(CrimeAlertDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.crimeAlert = crimeAlert;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }
  loadlist(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }
  createClusterIcon(cluster: any): L.DivIcon {
    const childCount = cluster.properties.point_count;
    const size = childCount < 10 ? 'small' : childCount < 100 ? 'medium' : 'large';
    const icon = L.divIcon({
      html: `<div style="position:relative; width:36.6px; height:55px;"><img style="width: 36.6px; height: 55px;" src="'../../../content/images/${size}-cluster-icon.png"/><span style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);color: white; font-weight: bold;font-size: 0.8em;">${childCount}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: L.point(36.6, 55),
      iconAnchor: [18.3, 55],
    });
    return icon;
  }

  updateClusters(): void {
    const zoomLevel = this.map.getZoom();
    const bounds = this.map.getBounds();
    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();
    let clusters;

    if (zoomLevel === 18) {
      clusters = this.index.getClusters([nw.lng, se.lat, se.lng, nw.lat], zoomLevel + 1);
    } else {
      clusters = this.index.getClusters([nw.lng, se.lat, se.lng, nw.lat], zoomLevel);
    }
    // Remove all markers from the map
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    // Loop through the clusters and add markers to the map
    clusters.forEach(cluster => {
      if (cluster.properties.cluster) {
        const popup = L.popup();
        const div = document.createElement('div');
        div.innerHTML = `
        <div>
          <p>There are ${cluster.properties.point_count} crimes in this area.</p>

        </div>
        `;

        /*
                  <button id="button-hi" onClick={() => { console.log("Button pressed")}}>Zoom in</button>
          <button id="button-yo">View details</button>
          <button id="button-whatups">Show radius</button>
        */
        const zoom = document.createElement('button');
        zoom.innerHTML = 'Zoom In';
        zoom.onclick = () => {
          this.map.flyTo([cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]], zoomLevel + 1);
        };
        div.appendChild(zoom);

        const details = document.createElement('button');
        details.innerHTML = 'More Details';
        const modal = document.getElementById('modal');
        const crimesList = document.getElementById('crimes-list');

        details.onclick = () => {
          if (crimesList != null && modal != null) {
            crimesList.innerHTML = '';

            const crimes = this.index.getLeaves(cluster.id as number, Infinity);

            for (let i = 0; i < crimes.length; i++) {
              const crime = crimes[i];
              const listItem = document.createElement('li');

              const summary = `
              <div class="summary">
                <p> <span class="summary-title">Title:</span> ${crime.properties.title}</p>
                <p><span class="summary-title">Crime Type:</span> ${this.getCrimeTypeDisplay(crime.properties.crimeType)}</p>
                <p><span class="summary-title">Date:</span> ${crime.properties.date}</p>
              </div>
            `;
              let selectedListItem: HTMLLIElement | null = null; // Keep track of the selected list item

              listItem.innerHTML = summary;
              listItem.addEventListener('click', () => {
                console.log('List item clicked!'); // Add this line
                const imageContainer = document.getElementById('image-container');
                if (imageContainer) {
                  imageContainer.innerHTML = '';
                  const img = document.createElement('img');
                  img.src = `data:${crime.properties.crimePhoto1ContentType};base64,${crime.properties.crimePhoto1}`;
                  img.classList.add('summary-image');
                  imageContainer.appendChild(img);
                }
                if (selectedListItem) {
                  selectedListItem.classList.remove('selected');
                }
                listItem.classList.add('selected');
                selectedListItem = listItem;
              });

              crimesList.appendChild(listItem);
              if (i === 0) {
                listItem.click();
              }
            }

            modal.style.display = 'block';
          }
        };
        if (modal != null) {
          const modalClose = modal.querySelector('.modal-close');
          if (modalClose != null) {
            modalClose.addEventListener('click', () => {
              modal.style.display = 'none';
            });

            modal.addEventListener('click', event => {
              if (event.target === modal) {
                modal.style.display = 'none';
              }
            });
          }
        }
        div.appendChild(details);

        const radius = document.createElement('button');
        radius.innerHTML = 'See Radius';
        radius.onclick = () => {
          const clusterCenter = [cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]];
          const points = this.index.getChildren(cluster.properties.cluster_id);
          let maxDistance = 0;
          let furthestPoint;

          points.forEach(point => {
            const pointCoordinates = [point.geometry.coordinates[1], point.geometry.coordinates[0]];
            const distanceToCluster = distance(clusterCenter, pointCoordinates, { units: 'meters' });

            if (distanceToCluster > maxDistance) {
              maxDistance = distanceToCluster;
              furthestPoint = pointCoordinates;
            }
          });

          //const child = this.index.getChildren(cluster.id as number);

          // Calculate the size of a pixel in meters at the given latitude and zoom level
          //const metersPerPixel = (156543.03392 * Math.cos((cluster.geometry.coordinates[1] * Math.PI) / 180)) / Math.pow(2, zoomLevel);

          // Convert the distance in pixels to meters
          //const distanceInMeters = 50 * metersPerPixel;

          const circleOptions = {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: maxDistance,
          };

          const circle = L.circle([cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]], circleOptions).addTo(this.map);
          radius.disabled = true;
        };

        div.appendChild(radius);

        /*
        popup.setContent(`
        <div>
          <p>There are ${cluster.properties.point_count} crimes in this area.</p>
          <button id="button-hi" onClick={() => { console.log("Button pressed")}}>Zoom in</button>
          <button id="button-yo">View details</button>
          <button id="button-whatups">Show radius</button>
        </div>
      `);
      */

        // This is a cluster
        const marker = L.marker([cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]], {
          icon: this.createClusterIcon(cluster),
        }).bindPopup(div);

        marker.addTo(this.map);
      } else {
        // This is a single marker

        let url = '';

        if (cluster.properties.crimeType === CrimeTypes.ANTISOCIALBEHAVIOUR) {
          url = `'../../../content/images/antisocial.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.CRIMINALDAMAGEARSON) {
          url = `'../../../content/images/arson.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.BICYCLETHEFT) {
          url = `'../../../content/images/bicycle.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.BURGLARY) {
          url = `'../../../content/images/burglary.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.DRUGS) {
          url = `'../../../content/images/other.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.OTHERCRIME) {
          url = `'../../../content/images/arson.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.THEFTFROMTHEPERSON) {
          url = `'../../../content/images/pickpocket.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.PUBLICORDER) {
          url = `'../../../content/images/publicorder.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.ROBBERY) {
          url = `'../../../content/images/robbery.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.SHOPLIFTING) {
          url = `'../../../content/images/shoplifting.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.VEHICLECRIME) {
          url = `'../../../content/images/weapons.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.POSSESSIONOFWEAPONS) {
          url = `'../../../content/images/arson.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.VIOLENCEANDSEXUALOFFENCES) {
          url = `'../../../content/images/assault.png`;
        } else if ((cluster.properties.crimeType as CrimeTypes) === CrimeTypes.OTHERTHEFT) {
          url = `'../../../content/images/theft.png`;
        } else {
          url = `'../../../content/images/allcrimes.png`;
        }

        const popup = L.popup();
        popup.setContent(`
        <div>
          <p> <span style="font-weight: bold;">Title:</span> ${cluster.properties.title}</p>
          <p><span style="font-weight: bold;">Description:</span> ${cluster.properties.description}</p>
          <p><span style="font-weight: bold;">Crime Type:</span> ${cluster.properties.crimeType}</p>
          <p><span style="font-weight: bold;">Date:</span> ${cluster.properties.date}</p>
          <p><span style="font-weight: bold;">Posted by:</span> ${cluster.properties.postedby?.login}</p>
          <button id="button-hi">Discussion</button>
          <button id="button-yo" onclick="window.location.href='https://communityplus.live/crime-alert/${cluster.properties.id}/view';">Open Report</button>
        </div>
      `);

        const marker = L.marker([cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]], {
          icon: L.icon({
            iconUrl: url,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        }).bindPopup(popup);

        marker.addTo(this.map);
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type

  load(): void {
    if (!this.isListView) {
      this.isLoading = true;
      this.crimeAlertService.query({ size: 100000 }).subscribe((res: EntityArrayResponseType) => {
        const filteredData = this.fillComponentAttributesFromResponseBody(res.body);
        const pointFeatures: PointFeature<ICrimeAlert>[] = filteredData
          .filter(alert => alert.lat && alert.lon) // filter out alerts with undefined or null coordinates
          .map(alert => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [alert.lon!, alert.lat!], // convert coordinates to valid Position array
            },
            properties: alert,
            CrimeTypes: alert,
          }));

        // Add markers for the filtered crime alerts

        this.index.load(pointFeatures);

        this.updateClusters();

        this.map.on('zoomend', () => {
          this.map.eachLayer(layer => {
            // Check if the layer is a circle
            if (layer instanceof L.Circle) {
              // Remove the circle from the map
              this.map.removeLayer(layer);
            }
          });
          this.updateClusters();
        });
        this.isLoading = false;

        this.map.on('moveend', () => {
          this.updateClusters();
        });

        // Loop through the clusters and add markers to the map
        //console.error(this.isLoading);
      });
    } else {
      //this.isLoading=false;
      this.loadFromBackendWithRouteInformations().subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
      //console.error(this.isLoading);
    }
    // Remove all markers from the map
  }
  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.crimeAlerts = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: ICrimeAlert[] | null): ICrimeAlert[] {
    const crimeAlertsNew = this.crimeAlerts ?? [];
    if (data) {
      for (const d of data) {
        if (crimeAlertsNew.map(op => op.id).indexOf(d.id) === -1) {
          crimeAlertsNew.push(d);
        }
      }
    }
    return crimeAlertsNew;
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.crimeAlertService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
