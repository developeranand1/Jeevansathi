import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatrimonyService } from './services/matrimony.service';
import { ApiService } from './services/api.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileDetailModalComponent } from './components/profile-detail-modal/profile-detail-modal.component';
import { ShortlistDrawerComponent } from './components/shortlist-drawer/shortlist-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ProfileDetailModalComponent,
    ShortlistDrawerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Jeevansathi Marriage');
  readonly matrimonyService = inject(MatrimonyService);
  readonly apiService = inject(ApiService);

  readonly showShortlistDrawer = signal<boolean>(false);

  dismissToast(id: number): void {
    this.matrimonyService.removeToast(id);
  }
}
