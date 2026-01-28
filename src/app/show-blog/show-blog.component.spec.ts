import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { ShowBlogComponent } from './show-blog.component';

describe('ShowBlogComponent', () => {
  let component: ShowBlogComponent;
  let fixture: ComponentFixture<ShowBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBlogComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideToastr(),
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ShowBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
