import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmergencyStations } from '../emergency-stations.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, EmergencyStationsService } from '../service/emergency-stations.service';
import { EmergencyStationsDeleteDialogComponent } from '../delete/emergency-stations-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import * as L from 'leaflet';

@Component({
  selector: 'jhi-emergency-stations',
  templateUrl: './emergency-stations.component.html',
  styleUrls: ['./emergency-stations.component.scss'],
})
export class EmergencyStationsComponent implements OnInit {
  emergencyStations?: IEmergencyStations[];
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
    protected emergencyStationsService: EmergencyStationsService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected parseLinks: ParseLinks,
    protected modalService: NgbModal
  ) {}

  reset(): void {
    this.page = 1;
    this.emergencyStations = [];
    this.load();
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: IEmergencyStations): number => this.emergencyStationsService.getEmergencyStationsIdentifier(item);

  ngOnInit(): void {
    this.map = L.map('map', {
      maxBounds: L.latLngBounds(L.latLng(49.78, -13.13), L.latLng(60.89, 2.87)),
      maxZoom: 18,
      minZoom: 6,
    }).setView([52.45, -1.93], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    const PoliceIcon = L.icon({
      iconUrl: '../../../content/images/Location_Marker_Police.png',
      shadowUrl: '../../../content/images/Location_Marker_Shadow.png',

      iconSize: [30, 45], // size of the icon
      shadowSize: [40, 20], // size of the shadow
      iconAnchor: [15, 45], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 20], // the same for the shadow
      popupAnchor: [0, -55], // point from which the popup should open relative to the iconAnchor
    });

    const HospitalIcon = L.icon({
      iconUrl: '../../../content/images/Location_Marker_Hospital.png',
      shadowUrl: '../../../content/images/Location_Marker_Shadow.png',

      iconSize: [30, 45], // size of the icon
      shadowSize: [40, 20], // size of the shadow
      iconAnchor: [15, 45], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 20], // the same for the shadow
      popupAnchor: [0, -55], // point from which the popup should open relative to the iconAnchor
    });

    const PharmacyIcon = L.icon({
      iconUrl: '../../../content/images/Location_Marker_Pharmacy.png',
      shadowUrl: '../../../content/images/Location_Marker_Shadow.png',

      iconSize: [30, 45], // size of the icon
      shadowSize: [40, 20], // size of the shadow
      iconAnchor: [15, 45], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 20], // the same for the shadow
      popupAnchor: [0, -55], // point from which the popup should open relative to the iconAnchor
    });

    const FireStationIcon = L.icon({
      iconUrl: '../../../content/images/Location_Marker_FireStation.png',
      shadowUrl: '../../../content/images/Location_Marker_Shadow.png',

      iconSize: [30, 45], // size of the icon
      shadowSize: [40, 20], // size of the shadow
      iconAnchor: [15, 45], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 20], // the same for the shadow
      popupAnchor: [0, -55], // point from which the popup should open relative to the iconAnchor
    });

    L.marker([52.429636, -1.949548], { icon: PoliceIcon }).addTo(this.map).bindPopup('Bournville Police Station <br>Police Station');

    L.marker([52.4463, -1.9307], { icon: PharmacyIcon }).addTo(this.map).bindPopup('Jhoots Pharmacy Bournbrook <br>Pharmacy');

    L.marker([52.4473, -1.92576], { icon: FireStationIcon }).addTo(this.map).bindPopup('Bournbrook Fire Station <br>Fire Station');

    L.marker([52.4514, -1.941], { icon: HospitalIcon }).addTo(this.map).bindPopup('Queen Elizabeth Hospital <br>Hospital').openPopup();

    this.load();
  }

  delete(emergencyStations: IEmergencyStations): void {
    const modalRef = this.modalService.open(EmergencyStationsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.emergencyStations = emergencyStations;
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
    this.emergencyStations = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IEmergencyStations[] | null): IEmergencyStations[] {
    const emergencyStationsNew = this.emergencyStations ?? [];
    if (data) {
      for (const d of data) {
        if (emergencyStationsNew.map(op => op.id).indexOf(d.id) === -1) {
          emergencyStationsNew.push(d);
        }
      }
    }
    return emergencyStationsNew;
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
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.emergencyStationsService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
