import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrimonyService } from '../../services/matrimony.service';
import { MatrimonialProfile } from '../../models/profile.model';

@Component({
  selector: 'app-shortlist-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shortlist-drawer.component.html',
  styleUrls: ['./shortlist-drawer.component.css']
})
export class ShortlistDrawerComponent {
  readonly close = output<void>();
  readonly matrimonyService = inject(MatrimonyService);

  onRemove(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.matrimonyService.toggleShortlist(id);
  }

  onView(p: MatrimonialProfile): void {
    this.matrimonyService.openProfile(p);
  }

  onConnect(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.matrimonyService.sendInterest(id);
  }
}
