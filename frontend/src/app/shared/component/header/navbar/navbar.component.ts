import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Output() closeNavbar = new EventEmitter<boolean>();
  @Output() openLink = new EventEmitter<string>();

  toggleNavbar(value: boolean) {
    this.closeNavbar.emit(value);
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  open(link: string) {
    this.openLink.emit(link);
    this.toggleNavbar(false);
  }
}
