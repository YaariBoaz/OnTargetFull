import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SightlistComponent } from './sightlist.component';

describe('SightlistComponent', () => {
  let component: SightlistComponent;
  let fixture: ComponentFixture<SightlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SightlistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SightlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
