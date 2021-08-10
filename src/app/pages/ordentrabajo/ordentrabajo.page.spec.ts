import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdentrabajoPage } from './ordentrabajo.page';

describe('OrdentrabajoPage', () => {
  let component: OrdentrabajoPage;
  let fixture: ComponentFixture<OrdentrabajoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdentrabajoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdentrabajoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
