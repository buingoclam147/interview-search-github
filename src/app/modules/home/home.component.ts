import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ISearchRepositoriesResponse } from '@core/models';
import { GithubService } from '@core/services';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { tap } from 'rxjs';
import { ImgGithubFormatPipe } from 'src/app/shared/pipes/img-github-format.pipe';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ImgGithubFormatPipe,
    NgOptimizedImage,
    NzSpinModule,
    NzIconModule,
    NzEmptyModule
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  @ViewChild('clSCroll') clSCroll!: ElementRef;
  readonly listData = signal<ISearchRepositoriesResponse['items']>([]);
  readonly listDataFetch_ = toSignal(
    this.githubSvc.listDataCurrent$.pipe(
      tap((res: ISearchRepositoriesResponse) => {
        if (res?.items) this.listData.set(res.items);
        else this.listData.set([]);
      })
    )
  );
  isLoading = toSignal(this.githubSvc.isLoading$, { initialValue: false });
  constructor(private readonly githubSvc: GithubService) { }

  public navigateUrl(url: string): void {// Mở liên kết trong tab mới
    window.open(url, '_blank');
  }

  public onScroll(): void {
    const container = this.clSCroll.nativeElement;
    const maxScroll = container.scrollHeight - container.clientHeight;
    const currentScroll = container.scrollTop;
    if ((currentScroll >= (maxScroll - 300)) && !this.isLoading())
      this.githubSvc.nextPage();
  }
}

