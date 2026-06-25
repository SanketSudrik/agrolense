import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { NAV_ITEMS, NavItem } from '../../shared/constants';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicTranslatePipe } from '../../shared/pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ...MATERIAL_IMPORTS, TranslateModule, DynamicTranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [];

  ngOnInit(): void {
    this.navItems = NAV_ITEMS;
  }
}
