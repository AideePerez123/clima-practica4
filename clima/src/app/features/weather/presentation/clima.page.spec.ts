import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ClimaPage } from './clima.page';

describe('ClimaPage', () => {
  let component: ClimaPage;
  let fixture: ComponentFixture<ClimaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClimaPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ClimaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
});
