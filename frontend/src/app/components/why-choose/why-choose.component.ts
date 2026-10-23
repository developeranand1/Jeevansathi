import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-choose',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-choose.component.html',
  styleUrls: ['./why-choose.component.css']
})
export class WhyChooseComponent {
  readonly openRegister = output<void>();

  readonly features = [
    {
      icon: 'bi-shield-check',
      title: '100% ID & Phone Verification',
      desc: 'Every registered profile is verified via Govt ID proof (Aadhaar/Passport) and personal telephone screening to ensure genuine intentions.'
    },
    {
      icon: 'bi-lock-fill',
      title: 'Total Photo & Contact Privacy',
      desc: 'Complete control over your visibility. Choose to blur photos or share contact numbers strictly upon mutual family consent.'
    },
    {
      icon: 'bi-stars',
      title: 'Authentic Vedic Kundli Milan',
      desc: 'Automated Ashtakoot 36-Guna calculation, Manglik dosha analysis, and certified astrological consultations.'
    },
    {
      icon: 'bi-person-heart',
      title: 'VIP Relationship Managers',
      desc: 'Experienced matrimony advisors personally curate biodatas, coordinate family introductions, and arrange meetings.'
    }
  ];

  readonly steps = [
    { num: '01', title: 'Free Registration', desc: 'Create your comprehensive biodata with horoscope and partner expectations.' },
    { num: '02', title: 'Discover & Connect', desc: 'Browse verified candidates and express interest in profiles you like.' },
    { num: '03', title: 'Kundli & Family Match', desc: 'Analyze Guna compatibility and connect directly with respected parents.' },
    { num: '04', title: 'Sacred Vivah', desc: 'Tie the eternal knot with mutual trust, blessings, and lifelong joy.' }
  ];
}
