import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-stories.component.html',
  styleUrls: ['./success-stories.component.css']
})
export class SuccessStoriesComponent {
  readonly stories = [
    {
      couple: 'Dr. Shweta & Dr. Aditya',
      caste: 'Brahmin Vivah • Delhi & Jaipur',
      date: 'Married on 18th Feb 2025',
      img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      story: 'We both are medical professionals with tight schedules. Vivah’s VIP relationship manager arranged our family video call, and our 34-Guna Kundli match gave our parents complete peace of mind. Truly grateful!',
      quote: '“Found our soulmate with family blessings!”'
    },
    {
      couple: 'Pooja & Rohan',
      caste: 'Agarwal Vivah • Lucknow & Mumbai',
      date: 'Married on 24th Nov 2024',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      story: 'What stood out for us was the strict photo privacy and verified biodatas. Rohan’s profile matched all my family’s lifestyle expectations. Today we are happily settled in Mumbai.',
      quote: '“The best matrimonial experience for traditional families.”'
    },
    {
      couple: 'Kavita & Vikramaditya',
      caste: 'Rajput Vivah • Chandigarh & Shimla',
      date: 'Married on 12th Jan 2025',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      story: 'Our noble Rajput traditions were respected at every step. From Gotra verification to astrological alignment, Vivah made finding each other effortless.',
      quote: '“A blessed union made through Vivah.”'
    }
  ];
}
