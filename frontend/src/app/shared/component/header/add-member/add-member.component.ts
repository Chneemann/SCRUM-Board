import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatabaseService } from '../../../../services/database.service';
import { InitialsPipe } from '../../../../pipes/initials.pipe';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [InitialsPipe],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
})
export class AddMemberComponent {
  @Input() allBoards: any[] = [];
  @Input() allUsers: any[] = [];
  @Input() allTasks: any[] = [];
  @Input() displayBoardData!: (query: string) => any;
  @Output() closeAddMemberOverview = new EventEmitter<boolean>();

  constructor(
    private dbService: DatabaseService,
    public sharedService: SharedService
  ) {}

  addMemberOverviewClose() {
    this.closeAddMemberOverview.emit(false);
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}
