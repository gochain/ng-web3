import { TestBed } from '@angular/core/testing';

import { GochainNgWeb3Service } from './gochain-ng-web3.service';

describe('GochainNgWeb3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GochainNgWeb3Service = TestBed.get(GochainNgWeb3Service);
    expect(service).toBeTruthy();
  });
});
