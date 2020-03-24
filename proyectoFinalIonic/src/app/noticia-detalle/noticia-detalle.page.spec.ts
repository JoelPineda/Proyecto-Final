import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaDetallePage } from './noticia-detalle.page';

describe('NoticiaDetallePage', () => {
  let component: NoticiaDetallePage;
  let fixture: ComponentFixture<NoticiaDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiaDetallePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
