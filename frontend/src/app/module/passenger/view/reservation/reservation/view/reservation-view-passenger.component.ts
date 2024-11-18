import {Component, OnInit} from '@angular/core';


import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {AbstractService} from 'src/app/zynerator/service/AbstractService';
import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';
import {ConfirmationService, MessageService,MenuItem} from 'primeng/api';
import {FileTempDto} from 'src/app/zynerator/dto/FileTempDto.model';


import {ReservationPassengerService} from 'src/app/shared/service/passenger/reservation/ReservationPassenger.service';
import {ReservationDto} from 'src/app/shared/model/reservation/Reservation.model';
import {ReservationCriteria} from 'src/app/shared/criteria/reservation/ReservationCriteria.model';

import {DriverDto} from 'src/app/shared/model/driver/Driver.model';
import {DriverPassengerService} from 'src/app/shared/service/passenger/driver/DriverPassenger.service';
import {PassengerDto} from 'src/app/shared/model/passenger/Passenger.model';
import {PassengerPassengerService} from 'src/app/shared/service/passenger/passenger/PassengerPassenger.service';
import {CarteBancaireDto} from 'src/app/shared/model/paiement/CarteBancaire.model';
import {CarteBancairePassengerService} from 'src/app/shared/service/passenger/paiement/CarteBancairePassenger.service';
import {ConversationDto} from 'src/app/shared/model/message/Conversation.model';
import {ConversationPassengerService} from 'src/app/shared/service/passenger/message/ConversationPassenger.service';
import {TrajetDto} from 'src/app/shared/model/trajet/Trajet.model';
import {TrajetPassengerService} from 'src/app/shared/service/passenger/trajet/TrajetPassenger.service';
@Component({
  selector: 'app-reservation-view-passenger',
  templateUrl: './reservation-view-passenger.component.html'
})
export class ReservationViewPassengerComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;



    constructor(private service: ReservationPassengerService, private driverService: DriverPassengerService, private passengerService: PassengerPassengerService, private carteBancaireService: CarteBancairePassengerService, private conversationService: ConversationPassengerService, private trajetService: TrajetPassengerService){
		this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
	}

    ngOnInit(): void {
    }


    get carteBancaire(): CarteBancaireDto {
        return this.carteBancaireService.item;
    }
    set carteBancaire(value: CarteBancaireDto) {
        this.carteBancaireService.item = value;
    }
    get carteBancaires(): Array<CarteBancaireDto> {
        return this.carteBancaireService.items;
    }
    set carteBancaires(value: Array<CarteBancaireDto>) {
        this.carteBancaireService.items = value;
    }
    get conversation(): ConversationDto {
        return this.conversationService.item;
    }
    set conversation(value: ConversationDto) {
        this.conversationService.item = value;
    }
    get conversations(): Array<ConversationDto> {
        return this.conversationService.items;
    }
    set conversations(value: Array<ConversationDto>) {
        this.conversationService.items = value;
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
    get passenger(): PassengerDto {
        return this.passengerService.item;
    }
    set passenger(value: PassengerDto) {
        this.passengerService.item = value;
    }
    get passengers(): Array<PassengerDto> {
        return this.passengerService.items;
    }
    set passengers(value: Array<PassengerDto>) {
        this.passengerService.items = value;
    }
    get trajet(): TrajetDto {
        return this.trajetService.item;
    }
    set trajet(value: TrajetDto) {
        this.trajetService.item = value;
    }
    get trajets(): Array<TrajetDto> {
        return this.trajetService.items;
    }
    set trajets(value: Array<TrajetDto>) {
        this.trajetService.items = value;
    }

    public hideViewDialog() {
        this.viewDialog = false;
    }

    get items(): Array<ReservationDto> {
        return this.service.items;
    }

    set items(value: Array<ReservationDto>) {
        this.service.items = value;
    }

    get item(): ReservationDto {
        return this.service.item;
    }

    set item(value: ReservationDto) {
        this.service.item = value;
    }

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): ReservationCriteria {
        return this.service.criteria;
    }

    set criteria(value: ReservationCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }


}
