import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule  } from '@angular/forms';
import { User } from '../../models/user';
import { toast } from 'materialize-css';
import { HttpClient } from '@angular/common/http';
import { Store, Select } from "@ngxs/store";
import { AddUser } from "../../models/user.action";
import { UserState } from "../../models/user.state";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class registerComponent implements OnInit {

  @Output('onUserChanged') onFormSubmit = new EventEmitter<User>();
  
  
  passwordValidator = (control: AbstractControl) : ValidationErrors => {
    if(!control.value)
      return null;

    if(!this.password)
      return null;
    return control.value === this.password.value ? null : ({'invalid': true});
  }

  compteForm : FormGroup = this.fb.group({
    name : ['Aymeric', [Validators.required, this.noNumberValidator]],
    surname: ['Haefflinger', [Validators.required, this.noNumberValidator]],
    mail : ['monMail@mail.com', [Validators.required, this.emailValidator]],
    password: ['monMDP', [Validators.required]],
  })

  constructor(private fb : FormBuilder,
     private http: HttpClient,
     private store: Store) { }

  get name() {return this.compteForm.get('name'); }
  get surname() { return this.compteForm.get('surname');}
  get mail() {return this.compteForm.get('mail');}
  get password() {return this.compteForm.get('password');}

  onSubmit() : void{
    
    let body = new URLSearchParams();
    body.set('name', this.name.value);
    body.set('surname', this.surname.value);
    body.set('mail', this.mail.value);
    body.set('mdp', this.password.value);


    this.http.post<any>("/api/user/register", body.toString(),
     { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
     .subscribe(data => this.apiSuccess(data));
  }

  apiSuccess(data){
    toast({html: 'Connexion réussie!', classes: 'rounded'});
    this.addUser(Object.setPrototypeOf(data.user, User.prototype));
  }

  addUser(u: User) {
    this.store.dispatch(new AddUser(u)).subscribe();
  }

  ngOnInit() {
  }
  
  test(){
    console.log(this.compteForm.value);
  }
  // validators
  noNumberValidator(control: AbstractControl) : ValidationErrors{
    const reg : RegExp = /[0-9]/
    if(!control.value)
      return null;

    return !reg.test(control.value) ? null : ({'number': true});
  }

  emailValidator(control: AbstractControl) : ValidationErrors{
    const reg : RegExp = /[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+/
     
    if(!control.value)
      return null;

    return reg.test(control.value) ? null : ({'notAnEmailAddress': true});
  }
}
