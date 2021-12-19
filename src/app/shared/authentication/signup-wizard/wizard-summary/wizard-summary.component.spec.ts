import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WizardSummaryComponent } from './wizard-summary.component';

describe('WizardSummaryComponent', () => {
  let component: WizardSummaryComponent;
  let fixture: ComponentFixture<WizardSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardSummaryComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(WizardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
