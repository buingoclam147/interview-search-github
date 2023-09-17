import { Pipe, PipeTransform } from '@angular/core';
const typeFile = '.png?size=40'
@Pipe({
  name: 'imgGithubFormat',
  standalone: true,
  pure: true
})
export class ImgGithubFormatPipe implements PipeTransform {
  transform(value: string): string {
    const cleanString = value?.substring(0, value.lastIndexOf('/'))
    const patch = cleanString + typeFile
    return patch || '';
  }

}
