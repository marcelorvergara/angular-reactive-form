import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  genders = ['male', 'female'];
  signupForm: FormGroup
  forbiddenUsernames = ['Chris', 'Anna']

  get hobbyControls() {
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      // Nested form group
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email],this.forbiddenEmails),
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    })
    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // )
    this.signupForm.statusChanges.subscribe(
      (state) => console.log(state)
    )
    this.signupForm.setValue({
      'userData' : {
        'username' : 'Max',
        'email': 'test@max.com'
      },
      'gender' : 'male',
      'hobbies': []
    })
    this.signupForm.patchValue({
      'userData' : {
        'username' : 'Anna',
      }
    })
  }

  onSubmit() {
    console.log(this.signupForm)
    this.signupForm.reset()
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    // Logic of the control
    // 'this' will no refer ts class. Use .bind(this) to pass the ts reference
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true}
    }
    // Should return null if the control is ok
    return null
  }

  forbiddenEmails(controle: FormControl) : Promise<any> |Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        console.log(controle.value)
        if(controle.value === 'test@test.com'){
          resolve({'emailIsForbidden': true})
        } else {
          resolve(null)
        }
      },1500)
    })
    return promise
  }
}
