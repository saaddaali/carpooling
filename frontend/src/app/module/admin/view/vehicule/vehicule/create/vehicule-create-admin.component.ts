import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {VehiculeAdminService} from 'src/app/shared/service/admin/vehicule/VehiculeAdmin.service';
import {VehiculeDto} from 'src/app/shared/model/vehicule/Vehicule.model';
import {VehiculeCriteria} from 'src/app/shared/criteria/vehicule/VehiculeCriteria.model';
import {DriverDto} from 'src/app/shared/model/driver/Driver.model';
import {DriverAdminService} from 'src/app/shared/service/admin/driver/DriverAdmin.service';
@Component({
  selector: 'app-vehicule-create-admin',
  templateUrl: './vehicule-create-admin.component.html'
})
export class VehiculeCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;




	constructor(private service: VehiculeAdminService , private driverService: DriverAdminService, @Inject(PLATFORM_ID) private platformId? ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.driverService.findAll().subscribe((data) => this.drivers = data);
    }



    public save(): void {
        this.submitted = true;
        this.validateForm();
        if (this.errorMessages.length === 0) {
            this.saveWithShowOption(false);
        } else {
            this.messageService.add({severity: 'error',summary: 'Erreurs',detail: 'Merci de corrigé les erreurs sur le formulaire'});
        }
    }

    public saveWithShowOption(showList: boolean) {
        this.service.save().subscribe(item => {
            if (item != null) {
                this.items.push({...item});
                this.createDialog = false;
                this.submitted = false;
                this.item = new VehiculeDto();
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





    public  setValidation(value: boolean){
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
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
        this.driverService.createDialog= value;
    }






    get items(): Array<VehiculeDto> {
        return this.service.items;
    }

    set items(value: Array<VehiculeDto>) {
        this.service.items = value;
    }

    get item(): VehiculeDto {
        return this.service.item;
    }

    set item(value: VehiculeDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): VehiculeCriteria {
        return this.service.criteria;
    }

    set criteria(value: VehiculeCriteria) {
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


    get activeTab(): number {
        return this._activeTab;
    }

    set activeTab(value: number) {
        this._activeTab = value;
    }

}
