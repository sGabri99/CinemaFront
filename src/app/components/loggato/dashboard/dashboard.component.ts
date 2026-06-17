import {Component, OnInit, ViewChild} from '@angular/core';

import {AuthService} from "../../../services/auth.service";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatNavList,
    MatSidenav,
    MatSidenavContent,
    RouterOutlet,
    CommonModule,
    MatSidenavContainer,
    RouterLink,
    MatListItem,
    RouterLinkActive,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  @ViewChild(MatSidenavContent) sidenavContent!: MatSidenavContent;

  userRole = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRuolo();

    // Reset dello scroll della Sidenav ad ogni cambio rotta riuscito
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.sidenavContent) {
        this.sidenavContent.scrollTo({ top: 0 });
      }
    });
  }

}