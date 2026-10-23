import { Component, inject, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatrimonyService } from '../../services/matrimony.service';
import { MatrimonialProfile } from '../../models/profile.model';
import { ProfileCardComponent } from '../profile-card/profile-card.component';

@Component({
  selector: 'app-profile-explorer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProfileCardComponent],
  templateUrl: './profile-explorer.component.html',
  styleUrls: ['./profile-explorer.component.css']
})
export class ProfileExplorerComponent implements OnInit {
  readonly matrimonyService = inject(MatrimonyService);
  readonly openKundli = output<MatrimonialProfile>();

  // Filter Form using Angular Reactive Forms
  readonly filterForm = new FormGroup({
    gender: new FormControl<'all' | 'bride' | 'groom'>('all', { nonNullable: true }),
    caste: new FormControl<string>('all', { nonNullable: true }),
    professionCategory: new FormControl<string>('all', { nonNullable: true }),
    manglik: new FormControl<string>('all', { nonNullable: true }),
    motherTongue: new FormControl<string>('all', { nonNullable: true }),
    city: new FormControl<string>('all', { nonNullable: true }),
    searchKeyword: new FormControl<string>('', { nonNullable: true })
  });

  ngOnInit(): void {
    // Sync service filter with form
    const current = this.matrimonyService.filter();
    this.filterForm.patchValue({
      gender: current.gender,
      caste: current.caste,
      professionCategory: current.professionCategory,
      manglik: current.manglik,
      motherTongue: current.motherTongue,
      city: current.city,
      searchKeyword: current.searchKeyword
    }, { emitEvent: false });

    // Reactive subscription to form changes
    this.filterForm.valueChanges.subscribe(val => {
      this.matrimonyService.updateFilter({
        gender: val.gender,
        caste: val.caste,
        professionCategory: val.professionCategory,
        manglik: val.manglik,
        motherTongue: val.motherTongue,
        city: val.city,
        searchKeyword: val.searchKeyword || ''
      });
    });
  }

  setGenderTab(gender: 'all' | 'bride' | 'groom'): void {
    this.filterForm.patchValue({ gender });
  }

  resetAllFilters(): void {
    this.filterForm.reset({
      gender: 'all',
      caste: 'all',
      professionCategory: 'all',
      manglik: 'all',
      motherTongue: 'all',
      city: 'all',
      searchKeyword: ''
    });
    this.matrimonyService.resetFilters();
  }

  onProfileKundliClick(profile: MatrimonialProfile): void {
    this.openKundli.emit(profile);
  }
}
