import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IAccessTokenResponse } from '@core/models';
import { AccessTokenService, AuthService } from '@core/services';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NgOptimizedImage,
    NzRadioModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './layout.component.html',
  styles: [],
})
export class LayoutComponent implements OnInit {
  public readonly user = toSignal(
    this.accessTokenSvc.accessToken$.pipe(switchMap((res: IAccessTokenResponse) => this.authSvc.getUserData$(res.accessToken)))
  );
  constructor(
    private readonly authSvc: AuthService,
    private readonly accessTokenSvc: AccessTokenService
  ) { }
  ngOnInit(): void { }

  public logout(): void {
    this.authSvc.logout();
  }
}
