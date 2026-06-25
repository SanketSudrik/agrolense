import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  private bpSub!: Subscription;
  private toggleHandler = () => this.sidenav?.toggle();

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    // Watch for mobile breakpoint
    this.bpSub = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    // Listen for toggle-sidebar custom event from navbar
    document.addEventListener('toggle-sidebar', this.toggleHandler);
  }

  ngOnDestroy(): void {
    this.bpSub?.unsubscribe();
    document.removeEventListener('toggle-sidebar', this.toggleHandler);
  }
}
