import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoConnetionError } from './no-connetion-error';

describe('ErrorModalComponent', () => {
  let component: NoConnetionError;
  let fixture: ComponentFixture<NoConnetionError>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoConnetionError ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoConnetionError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
