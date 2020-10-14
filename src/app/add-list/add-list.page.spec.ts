import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AddListPage } from './add-list.page';

describe('AddListPage', () => {
  let component: AddListPage;
  let fixture: ComponentFixture<AddListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddListPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AddListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
