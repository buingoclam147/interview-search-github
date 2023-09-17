import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBySelect',
  standalone: true,
  pure: true,
})
export class FilterBySelectPipe implements PipeTransform {
  transform(array: string[], searchTerm: string): string[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return array;
    }
    searchTerm = searchTerm.toLowerCase();
    return array.filter(option =>
      option.toLowerCase().includes(searchTerm)
    );
  }

}
