import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResultadoListaChequeoComponent } from './resultado-lista-chequeo.component';

describe('ResultadoListaChequeoComponent', () => {
  let component: ResultadoListaChequeoComponent;
  let fixture: ComponentFixture<ResultadoListaChequeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoListaChequeoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoListaChequeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
