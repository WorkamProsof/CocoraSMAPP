import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalimagenPage } from './modalimagen.page';

describe('ModalimagenPage', () => {
  let component: ModalimagenPage;
  let fixture: ComponentFixture<ModalimagenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalimagenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalimagenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
