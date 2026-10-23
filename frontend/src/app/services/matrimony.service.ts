import { Injectable, signal, computed } from '@angular/core';
import { MatrimonialProfile, SearchFilter, KundliInput, KundliResult } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class MatrimonyService {
  // Master Profile Database
  private readonly initialProfiles: MatrimonialProfile[] = [
    {
      id: 'VIV-8821',
      name: 'Priyanka Sharma',
      gender: 'bride',
      age: 26,
      height: `5' 4" (163 cm)`,
      religion: 'Hindu',
      caste: 'Brahmin - Gaur',
      gotra: 'Shandilya',
      motherTongue: 'Hindi',
      city: 'Delhi NCR',
      state: 'Delhi',
      country: 'India',
      education: 'B.Tech (CSE) + MBA (Finance)',
      profession: 'Senior Product Manager',
      professionCategory: 'it',
      company: 'Amazon India',
      income: '₹28 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Mesh (Aries)',
      nakshatra: 'Ashwini',
      gunaScore: 32,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      about: 'Warm-hearted, ambitious professional who balances cultural Indian traditions with modern perspectives. Enjoys classical Kathak, traveling, and family get-togethers.',
      familyBackground: {
        father: 'Chief Engineer (Retd. CPWD)',
        mother: 'Senior School Principal',
        siblings: '1 Younger Brother (Software Engineer at Microsoft)',
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        familyOrigin: 'Jaipur, Rajasthan'
      },
      partnerPreferences: {
        ageRange: '27 - 31 Yrs',
        heightRange: `5' 8" and above`,
        education: 'B.Tech / MBA / Masters from reputed institute',
        preferredCities: 'Delhi NCR, Bangalore, Mumbai'
      }
    },
    {
      id: 'VIV-9402',
      name: 'Aditya Rajput',
      gender: 'groom',
      age: 29,
      height: `5' 11" (180 cm)`,
      religion: 'Hindu',
      caste: 'Rajput - Rathore',
      gotra: 'Kashyap',
      motherTongue: 'Hindi',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      education: 'B.Tech (IIT Roorkee)',
      profession: 'Co-Founder & VP Engineering',
      professionCategory: 'business',
      company: 'Logistics SaaS (Funded)',
      income: '₹55 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Vrishabha (Taurus)',
      nakshatra: 'Rohini',
      gunaScore: 34,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      about: 'Grounded, tech entrepreneur from a noble heritage family. Passionate about innovation, fitness, and giving back to society. Looking for a supportive partner for life journey.',
      familyBackground: {
        father: 'Class-I Officer (Rajasthan Govt.)',
        mother: 'Homemaker (Noble Royal Heritage)',
        siblings: '1 Elder Sister (Married, Architect in London)',
        familyType: 'Joint',
        familyValues: 'Traditional',
        familyOrigin: 'Jodhpur, Rajasthan'
      },
      partnerPreferences: {
        ageRange: '24 - 28 Yrs',
        heightRange: `5' 3" - 5' 8"`,
        education: 'Post Graduate / Professional Degree',
        preferredCities: 'Jaipur, Delhi NCR, Mumbai'
      }
    },
    {
      id: 'VIV-7319',
      name: 'Dr. Ananya Singhal',
      gender: 'bride',
      age: 28,
      height: `5' 5" (165 cm)`,
      religion: 'Hindu',
      caste: 'Agarwal - Garg',
      gotra: 'Garg',
      motherTongue: 'Hindi',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      country: 'India',
      education: 'MBBS, MD (Dermatology)',
      profession: 'Consultant Dermatologist',
      professionCategory: 'doctor',
      company: 'Apollo Hospitals & Private Clinic',
      income: '₹35 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Kanya (Virgo)',
      nakshatra: 'Hasta',
      gunaScore: 31,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      about: 'Compassionate doctor dedicated to healthcare and patient wellness. Believes in mutual respect, laughter, and lifelong learning. Family oriented with strong values.',
      familyBackground: {
        father: 'Renowned Industrialist (Textile Mills)',
        mother: 'Doctor (MD Paediatrics)',
        siblings: '1 Younger Brother (Pursuing MS in US)',
        familyType: 'Joint',
        familyValues: 'Moderate',
        familyOrigin: 'Kanpur / Lucknow'
      },
      partnerPreferences: {
        ageRange: '28 - 32 Yrs',
        heightRange: `5' 7" and above`,
        education: 'Doctor (MD/MS) or CA / Civil Services / Tech Leader',
        preferredCities: 'Lucknow, Delhi NCR, Mumbai'
      }
    },
    {
      id: 'VIV-8115',
      name: 'Rohan Deshmukh',
      gender: 'groom',
      age: 30,
      height: `6' 0" (183 cm)`,
      religion: 'Hindu',
      caste: 'Maratha - 96 Kuli',
      gotra: 'Atri',
      motherTongue: 'Marathi',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      education: 'MS in Computer Science (Carnegie Mellon)',
      profession: 'Staff AI Engineer',
      professionCategory: 'it',
      company: 'NVIDIA',
      income: '₹62 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Anshik Manglik',
      rashi: 'Mithun (Gemini)',
      nakshatra: 'Ardra',
      gunaScore: 29,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      about: 'Passionate AI technologist with deep roots in Maharashtra culture. Love hiking in Sahyadri, playing badminton, and cooking Maharashtrian delicacies.',
      familyBackground: {
        father: 'Civil Judge (High Court)',
        mother: 'Professor of Marathi Literature',
        siblings: '1 Younger Sister (CA, Pune)',
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        familyOrigin: 'Pune / Satara'
      },
      partnerPreferences: {
        ageRange: '25 - 29 Yrs',
        heightRange: `5' 4" - 5' 9"`,
        education: 'Graduate / Post Graduate in Tech, Medicine, or Arts',
        preferredCities: 'Pune, Mumbai, Bangalore'
      }
    },
    {
      id: 'VIV-6540',
      name: 'Rhea Srivastava',
      gender: 'bride',
      age: 27,
      height: `5' 6" (168 cm)`,
      religion: 'Hindu',
      caste: 'Kayastha - Saxena',
      gotra: 'Kashyap',
      motherTongue: 'Hindi',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      education: 'B.A. LL.B (Hons) - NLU Delhi',
      profession: 'Corporate Lawyer',
      professionCategory: 'other',
      company: 'Shardul Amarchand Mangaldas',
      income: '₹32 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Tula (Libra)',
      nakshatra: 'Chitra',
      gunaScore: 33,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      about: 'Sharp, articulate legal advisor who appreciates literature, classical music, and fine dining. Looking for an intellectually stimulating, emotionally mature partner.',
      familyBackground: {
        father: 'Senior Advocate (Supreme Court of India)',
        mother: 'Author & Philanthropist',
        siblings: 'Only Child',
        familyType: 'Nuclear',
        familyValues: 'Liberal',
        familyOrigin: 'Prayagraj / Delhi'
      },
      partnerPreferences: {
        ageRange: '28 - 32 Yrs',
        heightRange: `5' 8" and above`,
        education: 'Lawyer, Civil Servant, Banker or CXO',
        preferredCities: 'Mumbai, Delhi NCR, London'
      }
    },
    {
      id: 'VIV-5432',
      name: 'Vikramaditya Chauhan',
      gender: 'groom',
      age: 31,
      height: `5' 10" (178 cm)`,
      religion: 'Hindu',
      caste: 'Rajput - Chauhan',
      gotra: 'Vatsa',
      motherTongue: 'Hindi',
      city: 'Chandigarh',
      state: 'Punjab',
      country: 'India',
      education: 'B.A. (Hons), Civil Services (IAS)',
      profession: 'Assistant Secretary / IAS Officer',
      professionCategory: 'civil',
      company: 'Government of India',
      income: '₹22 LPA + Govt Perks',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Simha (Leo)',
      nakshatra: 'Magha',
      gunaScore: 35,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      about: 'Committed administrative officer serving the nation with integrity. Values humility, social responsibility, and warm family bonds. Enjoys equestrian sports and reading.',
      familyBackground: {
        father: 'Lt. General (Retd., Indian Army)',
        mother: 'President of Army Wives Welfare Org',
        siblings: '1 Elder Brother (Major in Indian Army)',
        familyType: 'Nuclear',
        familyValues: 'Traditional',
        familyOrigin: 'Shimla / Chandigarh'
      },
      partnerPreferences: {
        ageRange: '25 - 29 Yrs',
        heightRange: `5' 3" - 5' 8"`,
        education: 'Civil Services, Doctor, Academician, or Corporate Professional',
        preferredCities: 'Delhi NCR, Chandigarh, Jaipur'
      }
    },
    {
      id: 'VIV-7910',
      name: 'Meera Maheshwari',
      gender: 'bride',
      age: 25,
      height: `5' 3" (160 cm)`,
      religion: 'Hindu',
      caste: 'Maheshwari - Rathi',
      gotra: 'Kausika',
      motherTongue: 'Hindi',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      education: 'Chartered Accountant (AIR 14)',
      profession: 'Senior M&A Advisory Specialist',
      professionCategory: 'finance',
      company: 'Deloitte India',
      income: '₹26 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Dhanu (Sagittarius)',
      nakshatra: 'Moola',
      gunaScore: 30,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      about: 'Ambitious CA with cheerful personality, deeply rooted in Marwari culinary & cultural traditions. Passionate about entrepreneurship and painting.',
      familyBackground: {
        father: 'Chairman (Chemical Exports Group)',
        mother: 'Homemaker (Marwari Heritage)',
        siblings: '2 Brothers (Involved in Family Enterprise)',
        familyType: 'Joint',
        familyValues: 'Traditional',
        familyOrigin: 'Bikaner, Rajasthan'
      },
      partnerPreferences: {
        ageRange: '26 - 30 Yrs',
        heightRange: `5' 7" and above`,
        education: 'CA, MBA, or Business Family Successor',
        preferredCities: 'Ahmedabad, Mumbai, Delhi, Jaipur'
      }
    },
    {
      id: 'VIV-8344',
      name: 'Siddharth Iyer',
      gender: 'groom',
      age: 28,
      height: `5' 9" (175 cm)`,
      religion: 'Hindu',
      caste: 'Brahmin - Vadama',
      gotra: 'Bharadwaj',
      motherTongue: 'Tamil',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      education: 'B.Tech (IIT Madras) + M.S. (Stanford)',
      profession: 'Lead Cloud Architect',
      professionCategory: 'it',
      company: 'Google Bangalore',
      income: '₹48 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Kumbha (Aquarius)',
      nakshatra: 'Shatabhisha',
      gunaScore: 31,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      about: 'Tech enthusiast who loves Carnatic instrumental violin, trail marathons, and filter coffee. Seeking a progressive partner with a zest for life and good conversation.',
      familyBackground: {
        father: 'Director (ISRO Satellite Centre - Retd.)',
        mother: 'Carnatic Vocalist & Teacher',
        siblings: '1 Elder Sister (Data Scientist, Zurich)',
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        familyOrigin: 'Chennai / Bengaluru'
      },
      partnerPreferences: {
        ageRange: '24 - 28 Yrs',
        heightRange: `5' 2" - 5' 7"`,
        education: 'BE / B.Tech / Masters / Medical',
        preferredCities: 'Bengaluru, Chennai, Hyderabad, USA'
      }
    },
    {
      id: 'VIV-4829',
      name: 'Tanvi Agarwal',
      gender: 'bride',
      age: 26,
      height: `5' 4" (163 cm)`,
      religion: 'Hindu',
      caste: 'Agarwal - Bansal',
      gotra: 'Bansal',
      motherTongue: 'Hindi',
      city: 'Delhi NCR',
      state: 'Haryana',
      country: 'India',
      education: 'B.Des (NIFT Delhi) + Masters in Luxury Fashion',
      profession: 'Creative Director & Label Founder',
      professionCategory: 'business',
      company: 'Heritage Ethnic Couture Studio',
      income: '₹30 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Meena (Pisces)',
      nakshatra: 'Revati',
      gunaScore: 33,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      about: 'Creative, cheerful, and elegant entrepreneur passionate about Indian handlooms, sustainable couture, and architecture. Believes life is best lived with gratitude.',
      familyBackground: {
        father: 'Promoter & MD (Steel Rolling Mills)',
        mother: 'Interior Stylist',
        siblings: '1 Elder Brother (Married, Director in business)',
        familyType: 'Joint',
        familyValues: 'Moderate',
        familyOrigin: 'Hisar / Gurugram'
      },
      partnerPreferences: {
        ageRange: '27 - 31 Yrs',
        heightRange: `5' 8" and above`,
        education: 'Industrialist, Business Owner, or Corporate VP',
        preferredCities: 'Delhi NCR, Mumbai, Chandigarh'
      }
    },
    {
      id: 'VIV-6019',
      name: 'Dr. Kunal Mishra',
      gender: 'groom',
      age: 31,
      height: `5' 11" (180 cm)`,
      religion: 'Hindu',
      caste: 'Brahmin - Kanyakubja',
      gotra: 'Upamanyu',
      motherTongue: 'Hindi',
      city: 'Delhi NCR',
      state: 'Delhi',
      country: 'India',
      education: 'MBBS, MS (Orthopaedics - AIIMS Delhi)',
      profession: 'Orthopaedic Surgeon',
      professionCategory: 'doctor',
      company: 'Medanta - The Medicity',
      income: '₹42 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Vrishchika (Scorpio)',
      nakshatra: 'Anuradha',
      gunaScore: 32,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      about: 'Dedicated surgeon with a calm disposition. Values discipline, spiritual grounding, and traveling. Enjoys squash, Indian classical flute, and family celebrations.',
      familyBackground: {
        father: 'Vice Chancellor of State Central University',
        mother: 'Dean & Head of Dept. (Botany)',
        siblings: '1 Younger Sister (IRS Officer, Mumbai)',
        familyType: 'Nuclear',
        familyValues: 'Traditional',
        familyOrigin: 'Varanasi, UP'
      },
      partnerPreferences: {
        ageRange: '25 - 29 Yrs',
        heightRange: `5' 4" - 5' 9"`,
        education: 'Doctor (MD/MS/BDS) or Allied Healthcare / Academician',
        preferredCities: 'Delhi NCR, Lucknow, Varanasi'
      }
    },
    {
      id: 'VIV-3912',
      name: 'Aishwarya Yadav',
      gender: 'bride',
      age: 27,
      height: `5' 5" (165 cm)`,
      religion: 'Hindu',
      caste: 'Yadav - Ahir',
      gotra: 'Kashi',
      motherTongue: 'Hindi',
      city: 'Gurugram',
      state: 'Haryana',
      country: 'India',
      education: 'B.Tech + M.Tech (Computer Science)',
      profession: 'Data Science Lead',
      professionCategory: 'it',
      company: 'Microsoft India',
      income: '₹34 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Mithun (Gemini)',
      nakshatra: 'Punarvasu',
      gunaScore: 30,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
      about: 'Modern thinking, cultured girl passionate about machine learning, badminton, and landscape photography. Seeking an ambitious and caring life companion.',
      familyBackground: {
        father: 'Director (State Transport Board - Retd.)',
        mother: 'Government College Lecturer',
        siblings: '1 Brother (Senior Analyst at PwC)',
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        familyOrigin: 'Rewari / Gurugram'
      },
      partnerPreferences: {
        ageRange: '28 - 32 Yrs',
        heightRange: `5' 8" and above`,
        education: 'Tech Engineer / MBA / Civil Services',
        preferredCities: 'Delhi NCR, Bengaluru, Hyderabad'
      }
    },
    {
      id: 'VIV-9233',
      name: 'Harshvardhan Jain',
      gender: 'groom',
      age: 29,
      height: `5' 10" (178 cm)`,
      religion: 'Jain',
      caste: 'Jain - Shwetambar',
      gotra: 'Gautam',
      motherTongue: 'Hindi',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      education: 'B.Com + MBA (Finance - SPJIMR Mumbai)',
      profession: 'Director - Wealth Management & Family Office',
      professionCategory: 'finance',
      company: 'Jain Capital Advisory',
      income: '₹40 LPA',
      maritalStatus: 'Never Married',
      manglik: 'Non-Manglik',
      rashi: 'Kanya (Virgo)',
      nakshatra: 'Chitra',
      gunaScore: 34,
      verified: true,
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      about: 'Strict vegetarian, observant Jain who balances ancient spiritual principles with modern business leadership. Enjoys cricket, heritage walks, and philanthropy.',
      familyBackground: {
        father: 'Industrialist & Philanthropist (Pharma Formulations)',
        mother: 'Trustee of Jain Educational Charities',
        siblings: '1 Brother (Managing Director)',
        familyType: 'Joint',
        familyValues: 'Traditional',
        familyOrigin: 'Indore / Ujjain'
      },
      partnerPreferences: {
        ageRange: '24 - 28 Yrs',
        heightRange: `5' 3" - 5' 8"`,
        education: 'Well-educated, cultured Jain / Hindu girl',
        preferredCities: 'Indore, Mumbai, Ahmedabad, Delhi'
      }
    }
  ];

  // Reactive State Signals
  readonly profiles = signal<MatrimonialProfile[]>(this.initialProfiles);
  readonly shortlistedIds = signal<Set<string>>(new Set(['VIV-8821', 'VIV-9402']));
  readonly interestsSentIds = signal<Set<string>>(new Set(['VIV-7319']));
  readonly selectedProfile = signal<MatrimonialProfile | null>(null);
  readonly toasts = signal<{ id: number; message: string; type: string }[]>([]);

  // Search filter signal
  readonly filter = signal<SearchFilter>({
    gender: 'all',
    caste: 'all',
    motherTongue: 'all',
    city: 'all',
    professionCategory: 'all',
    manglik: 'all',
    minAge: 21,
    maxAge: 35,
    searchKeyword: ''
  });

  // Computed filtered list
  readonly filteredProfiles = computed(() => {
    const list = this.profiles();
    const f = this.filter();
    const shortSet = this.shortlistedIds();
    const interestSet = this.interestsSentIds();

    return list
      .map(p => ({
        ...p,
        isShortlisted: shortSet.has(p.id),
        isInterestSent: interestSet.has(p.id)
      }))
      .filter(p => {
        // Gender match
        if (f.gender !== 'all' && p.gender !== f.gender) return false;

        // Caste filter
        if (f.caste !== 'all' && !p.caste.toLowerCase().includes(f.caste.toLowerCase())) return false;

        // Mother tongue
        if (f.motherTongue !== 'all' && p.motherTongue.toLowerCase() !== f.motherTongue.toLowerCase()) return false;

        // City
        if (f.city !== 'all' && !p.city.toLowerCase().includes(f.city.toLowerCase())) return false;

        // Profession
        if (f.professionCategory !== 'all' && p.professionCategory !== f.professionCategory) return false;

        // Manglik
        if (f.manglik !== 'all' && p.manglik !== f.manglik) return false;

        // Age bounds
        if (p.age < f.minAge || p.age > f.maxAge) return false;

        // Keyword search
        if (f.searchKeyword.trim()) {
          const q = f.searchKeyword.toLowerCase().trim();
          const matchStr = `${p.name} ${p.id} ${p.caste} ${p.city} ${p.profession} ${p.education} ${p.gotra}`.toLowerCase();
          if (!matchStr.includes(q)) return false;
        }

        return true;
      });
  });

  // Computed counts
  readonly totalMatchesCount = computed(() => this.filteredProfiles().length);
  readonly shortlistedProfiles = computed(() => {
    const set = this.shortlistedIds();
    return this.profiles().filter(p => set.has(p.id));
  });

  // Shortlist action
  toggleShortlist(id: string): void {
    const current = new Set(this.shortlistedIds());
    const profile = this.profiles().find(p => p.id === id);
    if (current.has(id)) {
      current.delete(id);
      this.shortlistedIds.set(current);
      this.showToast(`Removed ${profile?.name || 'profile'} from your shortlist`, 'info');
    } else {
      current.add(id);
      this.shortlistedIds.set(current);
      this.showToast(`✨ ${profile?.name || 'Profile'} added to your Shortlisted Matches!`, 'success');
    }
  }

  // Send Interest action
  sendInterest(id: string): void {
    const current = new Set(this.interestsSentIds());
    const profile = this.profiles().find(p => p.id === id);
    if (!current.has(id)) {
      current.add(id);
      this.interestsSentIds.set(current);
      this.showToast(`💌 Interest Expressed! An auspicious invitation sent to ${profile?.name}.`, 'success');
    } else {
      this.showToast(`You have already expressed interest in ${profile?.name}.`, 'info');
    }
  }

  // Set individual filters
  updateFilter(partial: Partial<SearchFilter>): void {
    this.filter.update(current => ({ ...current, ...partial }));
  }

  resetFilters(): void {
    this.filter.set({
      gender: 'all',
      caste: 'all',
      motherTongue: 'all',
      city: 'all',
      professionCategory: 'all',
      manglik: 'all',
      minAge: 21,
      maxAge: 35,
      searchKeyword: ''
    });
    this.showToast('Filters reset to default view.', 'info');
  }

  // Profile Modal State
  openProfile(profile: MatrimonialProfile): void {
    this.selectedProfile.set(profile);
  }

  closeProfile(): void {
    this.selectedProfile.set(null);
  }

  // Toast System
  showToast(message: string, type: string = 'success'): void {
    const id = Date.now() + Math.random();
    this.toasts.update(list => [...list, { id, message, type }]);
    setTimeout(() => {
      this.removeToast(id);
    }, 4000);
  }

  removeToast(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  // Kundli Matching Engine
  calculateKundliMilan(input: KundliInput): KundliResult {
    // Ashtakoot Guna Milan simulation based on authentic Vedic Milan weights (Total 36 Gunas)
    const varnaScore = Math.floor(Math.random() * 2); // 0 or 1
    const vashyaScore = 1 + Math.floor(Math.random() * 2); // 1 or 2
    const taraScore = 1.5 + Math.floor(Math.random() * 2) * 1.5; // 1.5 or 3
    const yoniScore = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4
    const grahaScore = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
    const ganaScore = 4 + Math.floor(Math.random() * 3); // 4, 5, or 6
    const bhakootScore = 5 + Math.floor(Math.random() * 3); // 5, 6, or 7
    const nadiScore = 6 + Math.floor(Math.random() * 3); // 6, 7, or 8

    const total = varnaScore + vashyaScore + taraScore + yoniScore + grahaScore + ganaScore + bhakootScore + nadiScore;
    const roundedTotal = Math.min(36, Math.max(18, Math.round(total)));

    let level: 'Excellent' | 'Good' | 'Average' | 'Needs Consultation' = 'Good';
    let recommendation = '';

    if (roundedTotal >= 28) {
      level = 'Excellent';
      recommendation = 'Outstanding Kundli Match (36-Guna Alignment). Highly auspicious union with strong mental harmony, family prosperity, and longevity.';
    } else if (roundedTotal >= 21) {
      level = 'Good';
      recommendation = 'Favorable Kundli Match. Auspicious planetary alignment for mutual affection, marital stability, and family happiness.';
    } else if (roundedTotal >= 18) {
      level = 'Average';
      recommendation = 'Moderate Match. Compatibility is acceptable. Simple remedial measures recommended before marriage.';
    } else {
      level = 'Needs Consultation';
      recommendation = 'Consultation Recommended. Bhakoot or Nadi dosha present; consult a certified astrologer.';
    }

    return {
      boyName: input.boyName || 'Var (Groom)',
      girlName: input.girlName || 'Vadhu (Bride)',
      totalGunas: roundedTotal,
      maxGunas: 36,
      compatibilityLevel: level,
      manglikStatus: 'Dosha Rahit (No Major Manglik Dosha)',
      breakdown: {
        varna: { name: 'Varna (Spiritual Compatibility)', score: varnaScore, max: 1, desc: 'Ego and spiritual harmony' },
        vashya: { name: 'Vashya (Mutual Attraction & Control)', score: vashyaScore, max: 2, desc: 'Power dynamics & affection' },
        tara: { name: 'Tara (Destiny & Longevity)', score: taraScore, max: 3, desc: 'Health and destiny sync' },
        yoni: { name: 'Yoni (Physical & Emotional Harmony)', score: yoniScore, max: 4, desc: 'Temperament and intimacy' },
        grahaMaitri: { name: 'Graha Maitri (Psychological Bond)', score: grahaScore, max: 5, desc: 'Friendship & mental sync' },
        gana: { name: 'Gana (Temperamental Nature)', score: ganaScore, max: 6, desc: 'Deva, Manushya, Rakshasa match' },
        bhakoot: { name: 'Bhakoot (Family Prosperity & Love)', score: bhakootScore, max: 7, desc: 'Financial health & joy' },
        nadi: { name: 'Nadi (Genetic & Progeny Sync)', score: nadiScore, max: 8, desc: 'Health & offspring compatibility' }
      },
      recommendation
    };
  }
}
