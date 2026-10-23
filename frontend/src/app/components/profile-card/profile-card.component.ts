import { Component, input, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrimonialProfile } from '../../models/profile.model';
import { MatrimonyService } from '../../services/matrimony.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {
  readonly profile = input.required<MatrimonialProfile>();
  readonly openKundliWithProfile = output<MatrimonialProfile>();

  readonly matrimonyService = inject(MatrimonyService);

  onShortlist(event: MouseEvent): void {
    event.stopPropagation();
    this.matrimonyService.toggleShortlist(this.profile().id);
  }

  onSendInterest(event: MouseEvent): void {
    event.stopPropagation();
    this.matrimonyService.sendInterest(this.profile().id);
  }

  onViewDetails(): void {
    this.matrimonyService.openProfile(this.profile());
  }

  onCheckKundli(event: MouseEvent): void {
    event.stopPropagation();
    this.openKundliWithProfile.emit(this.profile());
  }
}
