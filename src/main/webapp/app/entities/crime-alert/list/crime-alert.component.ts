/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-shadow */

/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, of, skip, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import supercluster, { AnyProps, PointFeature } from 'supercluster';
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

import bbox from '@turf/bbox';
import { CrimeTypes } from 'app/entities/enumerations/crime-types.model';

@Component({
  selector: 'jhi-crime-alert',
  templateUrl: './crime-alert.component.html',
})
export class CrimeAlertComponent implements OnInit {
  crimeAlerts?: ICrimeAlert[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  links: { [key: string]: number } = {
    last: 0,
  };
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
    protected accountService: AccountService
  ) {}

  reset(): void {
    this.page = 1;
    this.crimeAlerts = [];
    this.load();
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: ICrimeAlert): number => this.crimeAlertService.getCrimeAlertIdentifier(item);

  ngOnInit(): void {
    this.load();
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
        // This is a cluster
        const marker = L.marker([cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]], {
          icon: this.createClusterIcon(cluster),
        }).bindPopup(`There are ${cluster.properties.point_count} crimes in this area.`);

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

        console.error(cluster.properties.crimeType);

        const marker = L.marker([cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]], {
          icon: L.icon({
            iconUrl: url,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        }).bindPopup('This is a single marker.');

        marker.addTo(this.map);
      }
    });
  }

  load(): void {
    /*
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
    */

    this.map = L.map('map', {
      maxBounds: L.latLngBounds(L.latLng(49.78, -13.13), L.latLng(60.89, 2.87)),
      maxZoom: 18,
      minZoom: 6,
    }).setView([51.4, 0.3], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);

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
          CrimeTypes: alert.crimeType,
        }));

      // Add markers for the filtered crime alerts

      this.index.load(pointFeatures);

      this.updateClusters();

      this.map.on('zoomend', () => {
        this.updateClusters();
      });

      this.map.on('moveend', () => {
        this.updateClusters();
      });

      // Loop through the clusters and add markers to the map
    });
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
