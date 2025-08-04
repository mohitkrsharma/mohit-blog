import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paragraph'
})
export class ParagraphPipe implements PipeTransform {

/*  transform(value: string): string {
    return value ? value.replace(/\n/g, '<br>') : '';
  }*/
  transform(value: string): string {
    return value ? value.replace(/\n/g, '<br>') : '';
  }

}
