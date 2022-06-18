import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LingoComponent } from './lingo.component';

describe('LingoComponent', () => {
  let component: LingoComponent;
  let fixture: ComponentFixture<LingoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LingoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
