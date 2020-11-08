import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserAuth, User } from '../../models/user';
import { toast } from 'materialize-css';
import { Store, Select } from "@ngxs/store";
import { AddUser } from "../../models/user.action";
import { UserState } from "../../models/user.state";

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  @Output('onUserChanged') onFormSubmit = new EventEmitter<UserAuth>();
  
  
  passwordValidator = (control: AbstractControl) : ValidationErrors => {
    if(!control.value)
      return null;

    if(!this.password)
      return null;
    return control.value === this.password.value ? null : ({'invalid': true});
  }

  compteForm : FormGroup = this.fb.group({
    mail : ['aymeric@mail.com', [Validators.required, this.emailValidator]],
    password: ['modepass', [Validators.required]],
  })

  constructor(private fb : FormBuilder,
     private httpClient: HttpClient,
     private store: Store) { }

  get mail() {return this.compteForm.get('mail');}
  get password() {return this.compteForm.get('password');}

  onSubmit() : void{
    
    let user : UserAuth = new UserAuth( this.mail.value, this.password.value);
    this.onFormSubmit.emit(user);

    let body = new URLSearchParams();
    body.set('login', this.mail.value);
    body.set('mdp', this.password.value);

    this.httpClient.post<any>("/api/user/login", body.toString(),
     { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
     .subscribe(data => data.success==true ? this.apiSuccess() 
     : toast({html: 'Erreur dans les identifiants!', classes: 'rounded'}));
  }


  apiSuccess(){
    toast({html: 'Connexion réussie!', classes: 'rounded'});
    this.addUser(Object.setPrototypeOf(new User("Aymeric","Haefflinger","aymeric@mail.com",""), User.prototype));
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
