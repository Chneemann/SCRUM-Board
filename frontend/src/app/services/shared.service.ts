import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  isUserEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailValue)) {
      return true;
    } else {
      return false;
    }
  }

  getAssignedUsers(allUsers: any[], allTasks: any[]): any[] {
    const assignedUserIds = new Set<number>();
    const assignedUsers: any[] = [];

    allUsers.forEach((user) => {
      allTasks.forEach((task) => {
        if (task.assigned.includes(user.id) && !assignedUserIds.has(user.id)) {
          assignedUsers.push(user);
          assignedUserIds.add(user.id);
        }
      });
    });

    return assignedUsers;
  }
}
