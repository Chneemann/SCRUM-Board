import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskColorsService {
  constructor() {}

  colors = {
    yellowColor: '#ffffe0',
    yellowBorderColor: '#f5cc00',
    greenColor: '#dbffc2',
    greenBorderColor: '#59d600',
    blueColor: '#cce3ff',
    blueBorderColor: '#70b0ff',
    redColor: '#ffccd0',
    redBorderColor: '#ff858f',
    orangeColor: '#ffeac2',
    orangeBorderColor: '#faa200',
    purpleColor: '#eddbff',
    purpleBorderColor: '#c994ff',
    magentaColor: '#ffe0ff',
    magentaBorderColor: '#ff85ff',
    cyanColor: '#dbffff',
    cyanBorderColor: '#00d6d6',
  };

  findColor(color: string) {
    let colorName = color;
    let colorKey = colorName + 'Color';
    let borderColorKey = colorName + 'BorderColor';

    let colorValue = this.colors[colorKey as keyof typeof this.colors];
    let borderColorValue =
      this.colors[borderColorKey as keyof typeof this.colors];

    return {
      color: colorValue,
      borderColor: borderColorValue,
    };
  }
}
