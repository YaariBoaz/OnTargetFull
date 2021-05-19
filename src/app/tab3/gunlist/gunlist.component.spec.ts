import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GunlistComponent } from './gunlist.component';

describe('GunlistComponent', () => {
  let component: GunlistComponent;
  let fixture: ComponentFixture<GunlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GunlistComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GunlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
