import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CambioClavePage } from './cambioclave.page';

describe('CambioClavePage', () => {
  let component: CambioClavePage;
  let fixture: ComponentFixture<CambioClavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioClavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CambioClavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
