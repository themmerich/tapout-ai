import { TestBed } from '@angular/core/testing';
import { PrimeNgTest } from './primeng-test';

describe('PrimeNgTest', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeNgTest],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PrimeNgTest);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a styled PrimeNG button', () => {
    const fixture = TestBed.createComponent(PrimeNgTest);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button.p-button');
    expect(button).toBeTruthy();
  });
});
