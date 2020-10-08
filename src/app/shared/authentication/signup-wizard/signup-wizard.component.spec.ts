import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupWizardComponent } from './signup-wizard.component';

describe('SignupWizardComponent', () => {
  let component: SignupWizardComponent;
  let fixture: ComponentFixture<SignupWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupWizardComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
