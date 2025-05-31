import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../shared/language-switcher/language-switcher.component';

interface MenuItem {
  translationKey: string;
  icon: string;
  link?: string;
  children?: any[];
  isExpanded?: boolean;
  isActive?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FontAwesomeModule, 
    TranslateModule,
    LanguageSwitcherComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showUserMenu = false;
  sidebarVisible = false;
  isMobileView = false;
  
  menuItems: MenuItem[] = [
    {
      translationKey: 'DASHBOARD.SERVICE_REQUESTS.TITLE',
      icon: 'tools',
      children: [
        { translationKey: 'DASHBOARD.SERVICE_REQUESTS.ALL_REQUESTS', link: '/dashboard/service-requests' },
        { translationKey: 'DASHBOARD.SERVICE_REQUESTS.SEARCH_BY_ID', link: '/dashboard/service-requests/search-by-id' },
        { translationKey: 'DASHBOARD.SERVICE_REQUESTS.SEARCH_BY_PHONE', link: '/dashboard/service-requests/search-by-phone' }
      ],
      isExpanded: false,
      isActive: false
    },
  ];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobileView = window.innerWidth < 992;
    if (!this.isMobileView) {
      this.sidebarVisible = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close user menu when clicking outside
    const userMenuEl = document.querySelector('.user-menu');
    if (userMenuEl && !userMenuEl.contains(event.target as Node) && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleSubmenu(item: MenuItem) {
    item.isExpanded = !item.isExpanded;
  }

  setActiveItem(item: MenuItem) {
    // Reset all items
    this.menuItems.forEach(menuItem => {
      menuItem.isActive = false;
      if (menuItem.children) {
        menuItem.children.forEach(child => {
          child.isActive = false;
        });
      }
    });
    
    // Set the clicked item as active
    item.isActive = true;
    
    // If on mobile, close the sidebar after selection
    if (this.isMobileView) {
      this.sidebarVisible = false;
    }
  }

  setActiveChild(parent: MenuItem, child: any) {
    // Reset all items
    this.menuItems.forEach(menuItem => {
      menuItem.isActive = false;
      if (menuItem.children) {
        menuItem.children.forEach(childItem => {
          childItem.isActive = false;
        });
      }
    });
    
    // Set the parent as active (for styling)
    parent.isActive = true;
    
    // Set the child as active
    child.isActive = true;
    
    // If on mobile, close the sidebar after selection
    if (this.isMobileView) {
      this.sidebarVisible = false;
    }
  }
}