import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoNoticiasPage } from './listado-noticias.page';

describe('ListadoNoticiasPage', () => {
  let component: ListadoNoticiasPage;
  let fixture: ComponentFixture<ListadoNoticiasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoNoticiasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoNoticiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
