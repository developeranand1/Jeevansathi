import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrimonyService } from '../../services/matrimony.service';

@Component({
  selector: 'app-browse-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse-categories.component.html',
  styleUrls: ['./browse-categories.component.css']
})
export class BrowseCategoriesComponent {
  readonly matrimonyService = inject(MatrimonyService);

  readonly communities = [
    { name: 'Brahmin Vivah', caste: 'Brahmin', desc: 'Gaur, Saraswat, Kanyakubja, Iyer', icon: 'bi-flower1', count: '45,000+' },
    { name: 'Rajput Matrimony', caste: 'Rajput', desc: 'Rathore, Chauhan, Sisodia, Parmar', icon: 'bi-shield-shaded', count: '38,000+' },
    { name: 'Agarwal Vivah', caste: 'Agarwal', desc: 'Garg, Bansal, Mittal, Singhal, Goyal', icon: 'bi-cash-coin', count: '52,000+' },
    { name: 'Kayastha Matrimony', caste: 'Kayastha', desc: 'Srivastava, Saxena, Nigam, Mathur', icon: 'bi-book-half', count: '24,000+' },
    { name: 'Maheshwari Vivah', caste: 'Maheshwari', desc: 'Rathi, Birla, Daga, Toshniwal', icon: 'bi-gem', count: '19,000+' },
    { name: 'Maratha Matrimony', caste: 'Maratha', desc: '96 Kuli, Deshmukh, Patil, Jadhav', icon: 'bi-award-fill', count: '31,000+' },
    { name: 'Yadav Matrimony', caste: 'Yadav', desc: 'Ahir, Gwala, Yaduvanshi', icon: 'bi-brightness-high', count: '28,000+' },
    { name: 'Jain Matrimony', caste: 'Jain', desc: 'Shwetambar, Digambar, Oswal', icon: 'bi-sun-fill', count: '22,000+' }
  ];

  readonly professions = [
    { name: 'Software Architects & IT', key: 'it', icon: 'bi-laptop', salary: 'Avg. ₹25-60 LPA' },
    { name: 'Doctors (MBBS / MD / MS)', key: 'doctor', icon: 'bi-heart-pulse-fill', salary: 'Avg. ₹20-50 LPA' },
    { name: 'Civil Services (IAS / IPS)', key: 'civil', icon: 'bi-bank2', salary: 'Class-I Officers' },
    { name: 'Chartered Accountants', key: 'finance', icon: 'bi-graph-up-arrow', salary: 'Avg. ₹22-45 LPA' },
    { name: 'Entrepreneurs & Founders', key: 'business', icon: 'bi-briefcase-fill', salary: 'Promoters & CXOs' }
  ];

  readonly regions = [
    { city: 'Delhi NCR', tag: 'Delhi', count: '75,000+ Profiles', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=80' },
    { city: 'Mumbai', tag: 'Mumbai', count: '62,000+ Profiles', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=500&q=80' },
    { city: 'Bengaluru', tag: 'Bangalore', count: '48,000+ Profiles', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=500&q=80' },
    { city: 'Jaipur', tag: 'Jaipur', count: '35,000+ Profiles', img: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?auto=format&fit=crop&w=500&q=80' }
  ];

  selectCommunity(caste: string): void {
    this.matrimonyService.updateFilter({ caste });
    this.scrollToProfiles();
    this.matrimonyService.showToast(`Browsing ${caste} matrimony profiles...`, 'info');
  }

  selectProfession(key: string): void {
    this.matrimonyService.updateFilter({ professionCategory: key });
    this.scrollToProfiles();
    this.matrimonyService.showToast('Filtered by profession!', 'info');
  }

  selectRegion(city: string): void {
    this.matrimonyService.updateFilter({ city });
    this.scrollToProfiles();
    this.matrimonyService.showToast(`Showing matches in ${city}!`, 'info');
  }

  private scrollToProfiles(): void {
    const el = document.getElementById('profiles');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
