import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListacheckPage } from './listacheck.page';

describe('ListacheckPage', () => {
  let component: ListacheckPage;
  let fixture: ComponentFixture<ListacheckPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListacheckPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListacheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
