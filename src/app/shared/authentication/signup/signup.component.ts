import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

    @Output() back: EventEmitter<any>;
    registerForm: FormGroup;
    submitted = false;

    constructor(private router: Router, private formBuilder: FormBuilder, private storageService: StorageService) {
        this.back = new EventEmitter();
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get f() {
        return this.registerForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.storageService.setItem('profileData', this.registerForm.value);
        this.storageService.setItem('isLogedIn', true);
        this.router.navigateByUrl('home/tabs/tab3');
    }




    onBackPressed() {
        this.back.emit('');
    }
}
