import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivityHistoryComponent } from './activity-history.component';

describe('ActivityHistoryComponent', () => {
  let component: ActivityHistoryComponent;
  let fixture: ComponentFixture<ActivityHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityHistoryComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
