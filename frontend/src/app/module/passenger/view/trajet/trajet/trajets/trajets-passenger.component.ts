import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';


import {TrajetPassengerService} from 'src/app/shared/service/passenger/trajet/TrajetPassenger.service';
import {TrajetDto} from 'src/app/shared/model/trajet/Trajet.model';
import {TrajetCriteria} from 'src/app/shared/criteria/trajet/TrajetCriteria.model';
import {DriverDto} from 'src/app/shared/model/driver/Driver.model';
import {DriverPassengerService} from 'src/app/shared/service/passenger/driver/DriverPassenger.service';
import {VilleDto} from 'src/app/shared/model/trajet/Ville.model';
import {VillePassengerService} from 'src/app/shared/service/passenger/trajet/VillePassenger.service';

@Component({
    selector: 'app-trajets-passenger',
    templateUrl: './trajets-passenger.component.html',
    styleUrls: ['./trajets-passenger.component.scss'],
})
export class TrajetsPassengerComponent implements OnInit {

    protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;

    private driverCurrent: DriverDto;



    constructor(private service: TrajetPassengerService, private driverService: DriverPassengerService, private villeService: VillePassengerService, @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    activeTab: 'upcoming' | 'history' = 'upcoming';
    upcomingTrips: TrajetDto[] = [];
    pastTrips: TrajetDto[] = [];

    ngOnInit(): void {
        // Charger les données
        this.service.findAllOptimizedDriver().subscribe(
            (data) => {
                this.items = data;
                this.categorizeTrips(); // Appel de la nouvelle méthode
            },
            (error) => {
                console.error('Erreur lors du chargement des trajets:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les trajets'
                });
            }
        );

      //  this.service.findAllOptimizedDriver().subscribe((data) => this.items = data);

        this.villeService.findAll().subscribe((data) => this.villeDeparts = data);
        this.villeService.findAll().subscribe((data) => this.villeDestinations = data);
        this.driverService.findAll().subscribe((data) => this.drivers = data);
        this.villeService.findAll().subscribe((data) => this.localisationSources = data);
        this.villeService.findAll().subscribe((data) => this.localisationDestinations = data);
    }


    createTrajet() {
            this.driverService.findCurrentDriver().subscribe(
                (driver) => {
                    if (driver != null) {
                        this.driverCurrent = driver;
                        console.log('Conducteur actuel:', driver);
                        if(this.driverCurrent.verified){
                            this.router.navigate(['/app/passenger/trajet/create']);
                        } else if(!this.driverCurrent.verified) {
                            console.log(this.driverCurrent.verified);
                            this.router.navigate(['/driver/verify']);
                        }
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Impossible de créer un trajet sans conducteur'
                        });
                    }
                },
                (error) => {
                    console.error('Erreur lors de la récupération du conducteur actuel:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de récupérer le conducteur actuel'
                    });
                }
            );

    }
    private categorizeTrips(): void {
        const now = new Date();

        // Trier les trajets à venir (par date croissante)
        this.upcomingTrips = this.items
            .filter(trajet => new Date(trajet.horaireDepart) > now)
            .sort((a, b) => new Date(a.horaireDepart).getTime() - new Date(b.horaireDepart).getTime());

        // Trier les trajets passés (par date décroissante)
        this.pastTrips = this.items
            .filter(trajet => new Date(trajet.horaireDepart) <= now)
            .sort((a, b) => new Date(b.horaireDepart).getTime() - new Date(a.horaireDepart).getTime());
    }

    editTrajet(trajet: TrajetDto) {
        this.service.item = {...trajet};
        this.service.editDialog = true;
    }

    deleteTrajet(trajet: TrajetDto) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer ce trajet?',
            accept: () => {
                this.service.delete(trajet).subscribe(
                    () => {
                        this.items = this.items.filter(item => item.id !== trajet.id);
                        this.categorizeTrips(); // Recatégoriser après suppression
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Trajet supprimé'
                        });
                    },
                    error => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Erreur lors de la suppression'
                        });
                    }
                );
            }
        });
    }


    public save(): void {
        this.submitted = true;
        this.validateForm();
        if (this.errorMessages.length === 0) {
            this.saveWithShowOption(false);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreurs',
                detail: 'Merci de corrigé les erreurs sur le formulaire'
            });
        }
    }

    public saveWithShowOption(showList: boolean) {
        this.service.save().subscribe(item => {
            if (item != null) {
                this.items.push({...item});
                this.createDialog = false;
                this.submitted = false;
                this.item = new TrajetDto();
            } else {
                this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Element existant'});
            }

        }, error => {
            console.log(error);
        });
    }


    public hideCreateDialog() {
        this.createDialog = false;
        this.setValidation(true);
    }


    public setValidation(value: boolean) {
    }


    public validateForm(): void {
        this.errorMessages = new Array<string>();
    }


    public async openCreateVilleDestination(villeDestination: string) {
        const isPermistted = await this.roleService.isPermitted('Ville', 'add');
        if (isPermistted) {
            this.villeDestination = new VilleDto();
            this.createVilleDestinationDialog = true;
        } else {
            this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }

    public async openCreateLocalisationDestination(localisationDestination: string) {
        const isPermistted = await this.roleService.isPermitted('Ville', 'add');
        if (isPermistted) {
            this.localisationDestination = new VilleDto();
            this.createLocalisationDestinationDialog = true;
        } else {
            this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }

    public async openCreateVilleDepart(villeDepart: string) {
        const isPermistted = await this.roleService.isPermitted('Ville', 'add');
        if (isPermistted) {
            this.villeDepart = new VilleDto();
            this.createVilleDepartDialog = true;
        } else {
            this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }

    public async openCreateLocalisationSource(localisationSource: string) {
        const isPermistted = await this.roleService.isPermitted('Ville', 'add');
        if (isPermistted) {
            this.localisationSource = new VilleDto();
            this.createLocalisationSourceDialog = true;
        } else {
            this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }

    get driver(): DriverDto {
        return this.driverService.item;
    }

    set driver(value: DriverDto) {
        this.driverService.item = value;
    }

    get drivers(): Array<DriverDto> {
        return this.driverService.items;
    }

    set drivers(value: Array<DriverDto>) {
        this.driverService.items = value;
    }

    get createDriverDialog(): boolean {
        return this.driverService.createDialog;
    }

    set createDriverDialog(value: boolean) {
        this.driverService.createDialog = value;
    }

    get villeDestination(): VilleDto {
        return this.villeService.item;
    }

    set villeDestination(value: VilleDto) {
        this.villeService.item = value;
    }

    get villeDestinations(): Array<VilleDto> {
        return this.villeService.items;
    }

    set villeDestinations(value: Array<VilleDto>) {
        this.villeService.items = value;
    }

    get createVilleDestinationDialog(): boolean {
        return this.villeService.createDialog;
    }

    set createVilleDestinationDialog(value: boolean) {
        this.villeService.createDialog = value;
    }

    get localisationDestination(): VilleDto {
        return this.villeService.item;
    }

    set localisationDestination(value: VilleDto) {
        this.villeService.item = value;
    }

    get localisationDestinations(): Array<VilleDto> {
        return this.villeService.items;
    }

    set localisationDestinations(value: Array<VilleDto>) {
        this.villeService.items = value;
    }

    get createLocalisationDestinationDialog(): boolean {
        return this.villeService.createDialog;
    }

    set createLocalisationDestinationDialog(value: boolean) {
        this.villeService.createDialog = value;
    }

    get villeDepart(): VilleDto {
        return this.villeService.item;
    }

    set villeDepart(value: VilleDto) {
        this.villeService.item = value;
    }

    get villeDeparts(): Array<VilleDto> {
        return this.villeService.items;
    }

    set villeDeparts(value: Array<VilleDto>) {
        this.villeService.items = value;
    }

    get createVilleDepartDialog(): boolean {
        return this.villeService.createDialog;
    }

    set createVilleDepartDialog(value: boolean) {
        this.villeService.createDialog = value;
    }

    get localisationSource(): VilleDto {
        return this.villeService.item;
    }

    set localisationSource(value: VilleDto) {
        this.villeService.item = value;
    }

    get localisationSources(): Array<VilleDto> {
        return this.villeService.items;
    }

    set localisationSources(value: Array<VilleDto>) {
        this.villeService.items = value;
    }

    get createLocalisationSourceDialog(): boolean {
        return this.villeService.createDialog;
    }

    set createLocalisationSourceDialog(value: boolean) {
        this.villeService.createDialog = value;
    }


    get items(): Array<TrajetDto> {
        return this.service.items;
    }

    set items(value: Array<TrajetDto>) {
        this.service.items = value;
    }

    get item(): TrajetDto {
        return this.service.item;
    }

    set item(value: TrajetDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): TrajetCriteria {
        return this.service.criteria;
    }

    set criteria(value: TrajetCriteria) {
        this.service.criteria = value;
    }

    get dateFormat() {
        return environment.dateFormatCreate;
    }

    get dateFormatColumn() {
        return environment.dateFormatCreate;
    }

    get submitted(): boolean {
        return this._submitted;
    }

    set submitted(value: boolean) {
        this._submitted = value;
    }

    get errorMessages(): string[] {
        if (this._errorMessages == null) {
            this._errorMessages = new Array<string>();
        }
        return this._errorMessages;
    }

    set errorMessages(value: string[]) {
        this._errorMessages = value;
    }

    get validate(): boolean {
        return this.service.validate;
    }

    set validate(value: boolean) {
        this.service.validate = value;
    }


    /*get activeTab(): number {
        return this._activeTab;
    }

    set activeTab(value: number) {
        this._activeTab = value;
    }*/

}
