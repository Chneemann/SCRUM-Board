import { Component, forwardRef, Input } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
  ],
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() value: string = '';
  @Input() id: string = '';
  @Input() type: string = '';
  @Input() text: string = '';
  @Input() field: string = '';
  @Input() colorBg: string = '';
  @Input() colorBorder: string = '';
  @Input() disabled: boolean = false;
  @Input() allBoards: any[] = [];
  @Input() allUsers: any[] = [];
  @Input() currentBoardMembers: any[] = [];
  @Input() getAllBoardMembers: any[] = [];

  constructor(public dbService: DatabaseService) {}

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }

  isNotBoardMember(userId: number): boolean {
    return !this.currentBoardMembers.includes(userId);
  }

  displayMemberData(memberId: string, query: string) {
    let index = this.allUsers.findIndex((member) => member.id === memberId);
    if (index != -1) {
      return this.allUsers[index][query];
    }
  }
}
