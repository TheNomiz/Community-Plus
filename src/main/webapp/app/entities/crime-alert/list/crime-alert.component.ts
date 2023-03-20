/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, skip, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
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

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });

    this.map = L.map('map', {
      maxBounds: L.latLngBounds(L.latLng(49.78, -13.13), L.latLng(60.89, 2.87)),
      maxZoom: 12,
      minZoom: 6,
    }).setView([51.505, -0.09], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('move', () => {
      const center = this.map.getCenter();
      const bounds = this.map.getBounds();
      const radius = bounds.getNorthWest().distanceTo(bounds.getSouthEast()) / 2;

      this.crimeAlertService.query({ size: 100000 }).subscribe((res: EntityArrayResponseType) => {
        const dataFromBody = this.fillComponentAttributesFromResponseBody(res.body);
        const filteredData = dataFromBody.filter(crimeAlert => {
          if (crimeAlert.lat === null || crimeAlert.lat === undefined || crimeAlert.lon === null || crimeAlert.lon === undefined) {
            return false;
          }
          const latlng = L.latLng(crimeAlert.lat, crimeAlert.lon);
          return latlng.distanceTo(center) <= radius;
        });

        // Remove all markers from the map
        this.map.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            this.map.removeLayer(layer);
          }
        });

        // Add markers for the filtered crime alerts
        for (const crimeAlert of filteredData) {
          if (crimeAlert.lat !== null && crimeAlert.lat !== undefined) {
            //lat = crimeAlert.lat;
          } else {
            continue;
          }
          if (crimeAlert.lon !== null && crimeAlert.lon !== undefined) {
            //lon = crimeAlert.lon;
          } else {
            continue;
            // handle the case when latitude is null or undefined
          }
          L.marker([crimeAlert.lat, crimeAlert.lon]).addTo(this.map);
        }
      });
    });
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
