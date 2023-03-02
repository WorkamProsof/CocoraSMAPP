import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EjecutarListaChequeoPage } from './ejecutar-lista-chequeo.page';

describe('EjecutarListaChequeoPage', () => {
  let component: EjecutarListaChequeoPage;
  let fixture: ComponentFixture<EjecutarListaChequeoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjecutarListaChequeoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EjecutarListaChequeoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
