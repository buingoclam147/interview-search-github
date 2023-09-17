import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FIELD_IN_DYNAMIC } from '@core/enums';
import { GithubService } from '@core/services';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMarks, NzSliderModule } from 'ng-zorro-antd/slider';
import { NzToolTipModule, NzTooltipBaseDirective } from 'ng-zorro-antd/tooltip';
import { tap } from 'rxjs';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    NzSelectModule,
    NzInputModule,
    NzPopoverModule,
    NzIconModule,
    ReactiveFormsModule,
    NzAutocompleteModule,
    NzButtonModule,
    NzToolTipModule,
    NzDropDownModule,
    NzEmptyModule,
    NzDatePickerModule,
    NzSliderModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  @ViewChild('tooltip', { static: false }) tooltip!: NzTooltipBaseDirective;
  form!: FormGroup;
  isAdvancedSearchVisible = false;
  listHistory = toSignal(this.githubSvc.historySearch$);
  listLanguage = toSignal(this.githubSvc.listLanguage$(), { initialValue: [] });
  isHistorySearchVisible = false;
  marks: NzMarks = {
    0: '0Kb',
    100: '100Mb',
  };
  defaltDate:Date = new Date('1/1/2020')
  fieldDynamic = FIELD_IN_DYNAMIC;

  constructor(
    private fb: FormBuilder,
    private githubSvc: GithubService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      q: null,
      owner: null,
    });
  }

  public valueChange$() {
    return this.form.valueChanges.pipe(
      tap((res) => {
        this.githubSvc.searchInListHistory(res.q || '');
      })
    );
  }

  public changeQ(event?: Event | string): void {
    if (event instanceof Event){
      event?.preventDefault();
      event?.stopPropagation();
      this.form.patchValue({ q: (event.target as HTMLInputElement).value });
    } 
    else this.form.patchValue({ q: event || this.form.value.q });
    this.githubSvc.setDataFilter({ ...this.form.value, page: 1 });
    this.githubSvc.setHistorySearch(this.form.value.q);
  }

  public addDynamicField(filed: FIELD_IN_DYNAMIC): void {
    this.tooltip.hide();
    this.tooltip.show();
    switch (filed) {
      case FIELD_IN_DYNAMIC.SIZE:
        this.form.addControl(filed, this.fb.control([0, 50], Validators.required));
        break;
      default:
        this.form.addControl(filed, this.fb.control('', Validators.required));
        break;
    }
  }

  public formatter(value: number): string {
    return `${value}Mb`;
  }

  public deleteFieldDynamic(filed: string) {
    this.form.removeControl(filed);
  }
}
