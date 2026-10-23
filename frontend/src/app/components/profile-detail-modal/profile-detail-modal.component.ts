import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrimonyService } from '../../services/matrimony.service';

@Component({
  selector: 'app-profile-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-detail-modal.component.html',
  styleUrls: ['./profile-detail-modal.component.css']
})
export class ProfileDetailModalComponent {
  readonly matrimonyService = inject(MatrimonyService);

  onClose(): void {
    this.matrimonyService.closeProfile();
  }

  onShortlist(id: string): void {
    this.matrimonyService.toggleShortlist(id);
  }

  onSendInterest(id: string): void {
    this.matrimonyService.sendInterest(id);
  }

  onRequestContact(name: string): void {
    this.matrimonyService.showToast(
      `📞 Contact request sent to ${name}’s family! You will receive an SMS once accepted.`,
      'success'
    );
  }

  printBiodata(): void {
    window.print();
  }
}
