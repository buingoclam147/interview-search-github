import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTER } from '@core/constants';
import { AuthService } from '@core/services';
import { tap } from 'rxjs';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [CommonModule],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedirectComponent {
  private readonly redirect = toSignal(
    this.authSvc.postAccessToken$(this.route.snapshot.queryParams['code']).pipe(tap((_) => {
      this.router.navigate([`/${APP_ROUTER.HOME}`]);
    })))

  constructor(private readonly authSvc: AuthService, private readonly route: ActivatedRoute, private readonly router: Router) {
    this.redirect()
  }
}
