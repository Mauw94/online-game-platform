import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseGameComponent } from './base-game.component';

describe('BaseGameComponent', () => {
  let component: BaseGameComponent;
  let fixture: ComponentFixture<BaseGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
