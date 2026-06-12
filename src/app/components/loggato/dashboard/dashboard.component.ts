import {Component, OnInit} from '@angular/core';

import {AuthService} from "../../../services/auth.service";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";

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


  userRole = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  this.userRole = this.authService.getRuolo();
  }

}