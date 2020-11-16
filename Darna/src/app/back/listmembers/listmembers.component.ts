import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';

import { FormGroup,FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {ListMemberService} from '../service/list-Member.service'
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
export class Member{
  _id;
  NomPrenom;
 Email;
 Tel;
 DateNaissance ;
 Job;
 photo
 }

@Component({
  selector: 'app-listmembers',
  templateUrl: './listmembers.component.html',
  styleUrls: ['./listmembers.component.css']
})
export class ListmembersComponent implements OnInit {
  members:Member[];
  closeResult: string;
  addForm : FormGroup ;
  updateForm : FormGroup ;
  submitted = false;
  currentMember :Member;
  public listMembers:any;
  modalRef: BsModalRef;

  constructor( private router: Router , private formBuilder: FormBuilder, private listMemberService: ListMemberService, private modalService: BsModalService ) { }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit(): void {
    this.getListMembers();

    this.addForm= this.formBuilder.group({
      NomPrenom:[null,Validators.required],
      Email:[null, [Validators.required, Validators.email]],
      Tel:[null,[Validators.required,Validators.pattern(/^[0-9]\d*$/),Validators.minLength(8)]],
      DateNaissance:[null,Validators.required],
      Job:[null,Validators.required],
      Adresse:[null,Validators.required],
      Password:[null,[Validators.required, Validators.minLength(6)]],
    },),
    this.updateForm= this.formBuilder.group({
      NomPrenom:[null,Validators.required],
      Email:[null, [Validators.required, Validators.email]],
      Tel:[null,[Validators.required,Validators.pattern(/^[0-9]\d*$/),Validators.minLength(8)]],
      DateNaissance:[null,Validators.required],
      Job:[null,Validators.required],
      // Adresse:[this.currentMember.Adresse,Validators.required],
    });
  }

  getListMembers(){
    this.listMemberService.getAllmembers().subscribe((res: any) => {
      this.members=res;
    }
      );
  }

get f() {
  return this.addForm.controls;
}
get f1() {
  return this.updateForm.controls;
}
DeleteMember(_id){
  Swal.fire({
    title: 'êtes-vous sûr?',
    text: 'Vous ne pourrez plus récuperer cela!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimez-le!',
    cancelButtonText:'Annuler'
  }).then((result) => {
    if (result.value) {
      this.listMemberService.deleteMember(_id).subscribe((res: any) => {
        this.members=res;
        this.ngOnInit();
      });
      Swal.fire(
        'Supprimé',
        'Ce Member a été supprimé avec succés',
        'success'
      );
    }
  });

}


AjouterMember() {
      const obj= this.addForm.value ;
      this.submitted = true;
      console.log("hello this is add form")
      console.log(obj);
      // stop here if form is invalid
      if (this.addForm.invalid) {
        return;
      }

      this.listMemberService.AddMember(obj).subscribe(res => {
           if (res["code"]==505){
            Swal.fire({
              icon: 'error',
              title: 'oops...',
              text: 'Cet email existe déja !'
            });
          }else{
            Swal.fire(
              'Membre ajouté avec succès!',
              '',
              'success'
            );

            // this.getListMembers();
            window.location.reload();

          }

    });



    }
getMemberByid(id){
      this.listMemberService.getMember(id).subscribe((res:Member) => {
        this.currentMember=res
        console.log("hello hehi get by id")

        console.log(this.currentMember)
        console.log(this.currentMember.DateNaissance)

        this.updateForm.setValue({NomPrenom:this.currentMember.NomPrenom, Email:this.currentMember.Email,Tel:this.currentMember.Tel,
          DateNaissance:this.currentMember.DateNaissance,Job:this.currentMember.Job
        })
      });
    }

    ModifierMember() {
      this.listMemberService.updateMember(this.currentMember).subscribe(
          response => {
            console.log(response);
            Swal.fire(
              'Ce Member a été modifié avec succés',
              'success'
            );          },
          error => {
            console.log(error);
          });
    }

}
