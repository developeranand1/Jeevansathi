import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatrimonyService } from '../../services/matrimony.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private readonly router = inject(Router);
  readonly matrimonyService = inject(MatrimonyService);

  readonly openShortlistDrawer = output<void>();

  scrollToSection(id: string): void {
    if (this.router.url !== '/' && !this.router.url.startsWith('/#')) {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollElement(id), 150);
      });
    } else {
      this.scrollElement(id);
    }
  }

  private scrollElement(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
