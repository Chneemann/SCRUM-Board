import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true,
})
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
}
