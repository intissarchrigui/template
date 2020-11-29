import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImageService } from 'src/app/front/services/image.service';
import { EventModel } from '../models/event';
import Swal from 'sweetalert2';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  modalRef: BsModalRef;
  events: EventModel[];
  minDate=null;
  maxDate = null ;
  photo;
  addFormEvent: FormGroup;
  updateFormEvent: FormGroup;
  filesToUpload: Array<File>;
  submitted = false;
  currentEvent: EventModel;
  DateBeginEvent;
  DateEndEvent;
  role: string;
  pm;
  etat = false;
  alreadyParti=false;
  userConnect:string;
  constructor(  
     private router: Router,
    private formBuilder: FormBuilder,
    private EventService: EventService,
    private modalService: BsModalService,
    private imageservice: ImageService,
    private SpinnerService: NgxSpinnerService) { }

    ngOnInit(): void {
      this.role = sessionStorage.getItem('role');
      this.userConnect=sessionStorage.getItem('UserConnect')
      this.getLisEvents();
      (this.addFormEvent = this.formBuilder.group({
        NameEvent: [null, Validators.required],
        Description: [null, [Validators.required]],
        NumberMember: [null,[Validators.required]],  
        lieu: [null, [Validators.required]],
        DateBeginEvent: [null, Validators.required],
        DateEndEvent: [null, Validators.required],
        DateBeginInsc: [null, [Validators.required]],
        DateEndInsc: [null, [Validators.required]]
      })),
      (this.updateFormEvent = this.formBuilder.group({
        NameEvent: [null, Validators.required],
        Description: [null, [Validators.required]],
        NumberMember: [null, [Validators.required]],
        lieu: [null, [Validators.required]],
        DateBeginEvent: [null, Validators.required],
        DateEndEvent: [null, Validators.required],
        DateBeginInsc: [null, [Validators.required]],
        DateEndInsc: [null, [Validators.required]]
      }))
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  recuperFile(file) {
    this.filesToUpload = file.target.files as Array<File>;
    this.photo = file.target.files[0].photo;
  }
 getLisEvents() {
    this.SpinnerService.show();
    this.EventService.getAllEvents().subscribe((res: any) => {
      console.log(res);
      this.events = res
      this.events.forEach(element => {
        this.DateBeginEvent = element.DateBeginEvent.substring(0, 10);
        element.DateBeginInsc.substring(0, 10);
        this.DateEndEvent = element.DateEndEvent.substring(0, 10);
        element.DateEndInsc.substring(0, 10);
      });
      this.SpinnerService.hide();
    });
  }

  get AddEventControls() {
    return this.addFormEvent.controls;
  }
  get UpdatEventControls() {
    return this.updateFormEvent.controls;
  }

  AjouterEvent() {
    this.minDate= {year: 1900, month: 1, day: 1};
    this.maxDate= {year: 2100, month: 1, day: 1};
    const data = {
      NameEvent: this.addFormEvent.value.NameEvent,
      Description: this.addFormEvent.value.Description,
      lieu: this.addFormEvent.value.lieu,
      DateBeginEvent: this.addFormEvent.value.DateBeginEvent,
      DateEndEvent: this.addFormEvent.value.DateEndEvent,
      NumberMember: this.addFormEvent.value.NumberMember,
      DateBeginInsc: this.addFormEvent.value.DateBeginInsc,
      DateEndInsc: this.addFormEvent.value.DateEndInsc,
      photo: this.filesToUpload[0].name,
    };
/*     this.minDate = this.DateBeginEvent;
    console.log(' this.minDate: ',  this.minDate);
    this.maxDate = this.DateEndEvent;
    console.log('this.maxDate : ', this.maxDate ); */
    this.submitted = true;

    // stop here if form is invalid
    if (this.addFormEvent.invalid) {
      return;
    }
    this.EventService.AddNewEvent(data).subscribe((res) => {
      this.imageservice
        .pushFileToStorage(this.filesToUpload[0])
        .subscribe((rest) => {
          console.log(rest);
            Swal.fire('Event ajouté avec succès!', '', 'success');
            this.getLisEvents();
            this.modalRef.hide();
          
        });
    });
  }
  getEventByid(id) {
    this.EventService.getEvent(id).subscribe((res: EventModel) => {
      this.currentEvent = res;
      this.currentEvent.NameEvent = res.NameEvent;
      this.currentEvent.Description = res.Description;
      this.currentEvent.lieu = res.lieu;
      this.currentEvent.DateBeginEvent = res.DateBeginEvent.substring(0, 10);
      this.currentEvent.DateEndEvent = res.DateEndEvent.substring(0, 10);
      this.currentEvent.NumberMember = res.NumberMember;
      this.currentEvent.DateBeginInsc = res.DateBeginInsc.substring(0, 10);
      this.currentEvent.DateEndInsc = res.DateEndInsc.substring(0, 10);
      this.updateFormEvent.setValue({
        NameEvent: this.currentEvent.NameEvent,
        Description: this.currentEvent.Description,
        lieu: this.currentEvent.lieu,
        DateBeginEvent: this.currentEvent.DateBeginEvent,
        DateEndEvent: this.currentEvent.DateEndEvent,
        NumberMember: this.currentEvent.NumberMember,
        DateBeginInsc: this.currentEvent.DateBeginInsc,
        DateEndInsc: this.currentEvent.DateEndInsc
      });
    });
  }
 
  participate(id){
      this.EventService.getEvent(id).subscribe((res: EventModel) => {
        let part= false
        this.currentEvent=res;
        this.userConnect = sessionStorage.getItem('UserConnect');
        console.log('this.userConnect: ', this.currentEvent);
        for(let i = 0; i < this.currentEvent.participants.length; i++){
          if(this.currentEvent.participants[i].emailP === this.userConnect){
            part=true;
            break
          }
        }
        if(part===false)
        {this.EventService.Participate(id,this.userConnect).subscribe((res) => {
          
    })
  Swal.fire(
            'participer',
            'Vous avez participé à cet événement avec succes',
            'success'
          );
          this.getLisEvents()
  }
    else{
      Swal.fire(
        'Deja participer',
        'Vous avez déja participé à cet éénement',
        'error'
      );
      this.getLisEvents()
    }
      })
      
    }


  DeleteEvent(_id) {
    Swal.fire({
      title: 'êtes-vous sûr?',
      text: 'Vous ne pourrez plus récuperer cela!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {
        this.EventService.deleteEvent(_id).subscribe((res: any) => {
          this.events = res;
          this.ngOnInit();
        });
        Swal.fire(
          'Supprimé',
          'Ce événement a été supprimé avec succés',
          'success'
        );
      }
    });
  }

  EditEvent() {
    this.EventService
      .updateEvent(this.currentEvent._id, this.updateFormEvent.value)
      .subscribe(
        (response) => {
          console.log(response);
          Swal.fire('Cet événement a été modifié avec succés', '', 'success');
          this.getLisEvents();
          this.modalRef.hide();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  Publish(id) {
    Swal.fire({
      title: 'êtes-vous sûr pour publier cette événement?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Publier-le!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {
        this.EventService.PublishEvent(id, 'oui').subscribe((res) => {
          console.log("test1", result.value)
          // this.selectedValue=null;
          this.ngOnInit();
        });

        Swal.fire('Publier', 'publier avec succés', 'success');
      }
    });
  }

  ChangeDateDebut(event){
    this.minDate = event;
  }
  ChangeDateFin(event){
    this.maxDate = event;
  }
  
}