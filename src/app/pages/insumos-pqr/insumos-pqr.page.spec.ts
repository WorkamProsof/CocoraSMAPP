import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InsumosPqrPage } from './insumos-pqr.page';

describe('InsumosPqrPage', () => {
  let component: InsumosPqrPage;
  let fixture: ComponentFixture<InsumosPqrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumosPqrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InsumosPqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
