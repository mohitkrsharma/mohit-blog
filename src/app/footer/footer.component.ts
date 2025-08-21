import {Component, OnInit} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-footer',
  imports: [
    MatTooltip
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{
  constructor() {
  }

  ngOnInit(): void {
  }

  openSocialMedia(platform: string): void {
    const urls: { [key: string]: string } = {
      facebook: 'https://www.facebook.com/mohit.sharma.921',
      twitter: 'https://www.x.com/MohitSharma_PMY',
      instagram: 'https://www.instagram.com/mohitsharma_mp',
      linkedin: 'https://www.linkedin.com/in/mohitkumarsharma1/'
    };

    const url = urls[platform as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
    }
  }
}
