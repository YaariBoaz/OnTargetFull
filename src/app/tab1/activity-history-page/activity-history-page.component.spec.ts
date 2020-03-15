import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivityHistoryPageComponent } from './activity-history-page.component';

describe('ActivityHistoryPageComponent', () => {
  let component: ActivityHistoryPageComponent;
  let fixture: ComponentFixture<ActivityHistoryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityHistoryPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
