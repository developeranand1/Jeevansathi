export interface MatrimonialProfile {
  id: string;
  name: string;
  gender: 'bride' | 'groom';
  age: number;
  height: string;
  religion: string;
  caste: string;
  gotra: string;
  motherTongue: string;
  city: string;
  state: string;
  country: string;
  education: string;
  profession: string;
  professionCategory: 'it' | 'doctor' | 'civil' | 'finance' | 'business' | 'other';
  company: string;
  income: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed';
  manglik: 'Non-Manglik' | 'Manglik' | 'Anshik Manglik';
  rashi: string;
  nakshatra: string;
  gunaScore: number; // Ashtakoot match out of 36
  verified: boolean;
  photoUrl: string;
  about: string;
  familyBackground: {
    father: string;
    mother: string;
    siblings: string;
    familyType: 'Nuclear' | 'Joint';
    familyValues: 'Traditional' | 'Moderate' | 'Liberal';
    familyOrigin: string;
  };
  partnerPreferences: {
    ageRange: string;
    heightRange: string;
    education: string;
    preferredCities: string;
  };
  isShortlisted?: boolean;
  isInterestSent?: boolean;
}

export interface SearchFilter {
  gender: 'all' | 'bride' | 'groom';
  caste: string;
  motherTongue: string;
  city: string;
  professionCategory: string;
  manglik: string;
  minAge: number;
  maxAge: number;
  searchKeyword: string;
}

export interface KundliInput {
  boyName: string;
  boyRashi: string;
  boyNakshatra: string;
  girlName: string;
  girlRashi: string;
  girlNakshatra: string;
}

export interface KundliResult {
  boyName: string;
  girlName: string;
  totalGunas: number;
  maxGunas: number;
  compatibilityLevel: 'Excellent' | 'Good' | 'Average' | 'Needs Consultation';
  manglikStatus: string;
  breakdown: {
    varna: { name: string; score: number; max: number; desc: string };
    vashya: { name: string; score: number; max: number; desc: string };
    tara: { name: string; score: number; max: number; desc: string };
    yoni: { name: string; score: number; max: number; desc: string };
    grahaMaitri: { name: string; score: number; max: number; desc: string };
    gana: { name: string; score: number; max: number; desc: string };
    bhakoot: { name: string; score: number; max: number; desc: string };
    nadi: { name: string; score: number; max: number; desc: string };
  };
  recommendation: string;
}
