import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SgcheckPage } from './sgcheck.page';

describe('SgcheckPage', () => {
  let component: SgcheckPage;
  let fixture: ComponentFixture<SgcheckPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SgcheckPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SgcheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
