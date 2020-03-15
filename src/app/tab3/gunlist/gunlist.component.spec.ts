import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GunlistComponent } from './gunlist.component';

describe('GunlistComponent', () => {
  let component: GunlistComponent;
  let fixture: ComponentFixture<GunlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GunlistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GunlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
