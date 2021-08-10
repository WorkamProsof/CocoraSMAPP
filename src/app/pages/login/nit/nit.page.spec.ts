import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NITPage } from './nit.page';

describe('NITPage', () => {
  let component: NITPage;
  let fixture: ComponentFixture<NITPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NITPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NITPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
