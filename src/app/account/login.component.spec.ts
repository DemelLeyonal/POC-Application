import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from "./login.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule,RouterTestingModule,HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('[Username Check] - should throw error if username is left empty', () => {
    let username = component.form.controls['username'];
    expect(username.pristine).toBeTruthy();
    expect(username.valid).toBeFalsy();
    expect(username.errors['required']).toBeTruthy();
  });

  it('[Username Check] - should be valid if username is entered', () => {
    let username = component.form.controls['username'];
    username.setValue('testUsername');
    expect(username.errors).toBeNull();
  });

  it('[Password Check] - should throw error if password is left empty or password entered is less than 8 characters', () => {
    let pwd = component.form.controls['password'];
    expect(pwd.pristine).toBeTruthy();
    expect(pwd.valid).toBeFalsy();
    expect(pwd.errors['required']).toBeTruthy();
    pwd.setValue('xxxx');
    expect(pwd.errors['minlength']).toBeTruthy();
  });

  it('[Password Check] - should be valid if more than 7 characters password is entered', () => {
    let pwd = component.form.controls['password'];
    pwd.setValue('xxxxxxxx');
    expect(pwd.errors).toBeNull();
    expect(pwd.valid).toBeTruthy();
  });

  it('[Form Check] - should check form is valid or not if no values are entered', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('[Form Check] - should check form is valid or not if values are entered', () => {
    component.form.controls['username'].setValue('testUsername');
    component.form.controls['password'].setValue('xxxxxxxx');
    expect(component.form.valid).toBeTruthy();
  });

  // describe('method1', () => {
  //   it('should ...', () => {
  //     expect(component).toBeTruthy();
  //   });

  //   it.todo('should ...');
  // });
})