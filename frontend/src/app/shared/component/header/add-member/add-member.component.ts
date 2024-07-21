import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
})
export class AddMemberComponent {
  @Output() closeAddMemberOverview = new EventEmitter<boolean>();

  addMemberOverviewClose() {
    this.closeAddMemberOverview.emit(false);
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}
