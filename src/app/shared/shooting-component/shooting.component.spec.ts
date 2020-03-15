import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShootingComponent } from './shooting.component';

describe('SessionModalComponent', () => {
  let component: ShootingComponent;
  let fixture: ComponentFixture<ShootingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShootingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShootingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
