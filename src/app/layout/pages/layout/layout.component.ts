import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, HeaderComponent, RouterModule
  ],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent { }
