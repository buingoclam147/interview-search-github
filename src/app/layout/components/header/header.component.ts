import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IAccessTokenResponse } from '@core/models';
import { AuthService } from '@core/services';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { switchMap } from 'rxjs';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { AccessTokenService } from './../../../core/services/cache/access-token.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NgOptimizedImage,
    NzRadioModule,
    ReactiveFormsModule,
    FormsModule,
    SearchComponent,
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  public readonly user = toSignal(
    this.accessTokenSvc.accessToken$.pipe(switchMap((res: IAccessTokenResponse) => this.authSvc.getUserData$(res.accessToken)))
  );
  constructor(
    private readonly authSvc: AuthService,
    private readonly accessTokenSvc: AccessTokenService
  ) { }

  public logout(): void {
    this.authSvc.logout();
  }
}
