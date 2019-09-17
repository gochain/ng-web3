import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GochainNgWeb3Component } from './gochain-ng-web3.component';

describe('GochainNgWeb3Component', () => {
  let component: GochainNgWeb3Component;
  let fixture: ComponentFixture<GochainNgWeb3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GochainNgWeb3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GochainNgWeb3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
