import { TestBed } from '@angular/core/testing';

import { TheproductServ } from './theproduct-serv';

describe('TheproductServ', () => {
  let service: TheproductServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheproductServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
