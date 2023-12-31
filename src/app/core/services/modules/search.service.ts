import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GITHUB_API_URL, LIST_REPOSITORIES, SEARCH_DEFAULT } from "@core/constants";
import { LOCAL_STORAGE } from "@core/enums";
import { ILanguageResponse, ISearchRepositoriesRequest, ISearchRepositoriesResponse } from "@core/models";
import { loading, mbToB } from "@core/utils";
import { format } from "date-fns";
import { BehaviorSubject, Observable, combineLatest, filter, map, of, pairwise, switchMap } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly apiUrl = GITHUB_API_URL;
  public readonly _dataFilter$ = new BehaviorSubject<ISearchRepositoriesRequest>(SEARCH_DEFAULT);
  public readonly dataFilter$ = this._dataFilter$.asObservable().pipe(pairwise());
  private readonly _historySearch$ = new BehaviorSubject<string[]>([]);
  private readonly _valueSearch$ = new BehaviorSubject<string>('');
  private readonly _listAllData$ = new BehaviorSubject<ISearchRepositoriesResponse>(LIST_REPOSITORIES);
  public readonly listDataCurrent$ = this.logicGetListData$();
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this._isLoading$.asObservable();
  constructor(private http: HttpClient) {
    this.initHistorySearch();
  }

  public listLanguage$(): Observable<ILanguageResponse[]> {
    return this.http.get<ILanguageResponse[]>(`${this.apiUrl}/languages`)
  }

  public search$(type: string, query: ISearchRepositoriesRequest): Observable<ISearchRepositoriesResponse> {
    const req = `q=${query.q}${query.owner ? '+owner%3A' + query.owner : ''}${query.language ? '+language%3A' + query.language : ''}${query.size ? '+size%3A' + mbToB(query.size[0])+'..'+ mbToB(query.size[1]) : ''}${query.created ? '+created%3A%3E' + format(new Date(query.created), 'yyyy-MM-dd') : ''}&page=${query.page}`
    return this.http.get<ISearchRepositoriesResponse>(`${this.apiUrl}/search/${type}?${req}`).pipe(loading(this._isLoading$));
  }

  public setDataFilter(data: ISearchRepositoriesRequest): void {
    this._dataFilter$.next({ ...data });
  }

  public nextPage(): void {
    this._dataFilter$.next({ ...this._dataFilter$.value, page: this._dataFilter$.value.page + 1 });
  }

  public get historySearch$(): Observable<string[]> {
    return this._historySearch$.asObservable();
  }

  public setHistorySearch(data: string): void {
    if (data) {
      const index = localStorage.getItem(LOCAL_STORAGE.HISTORY_SEARCH) ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.HISTORY_SEARCH) as string).findIndex((item: string) => item === data) : -1;
      const listHistorySearch = localStorage.getItem(LOCAL_STORAGE.HISTORY_SEARCH) ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.HISTORY_SEARCH) as string) : [];
      if (index > -1) {
        listHistorySearch.splice(index, 1);
      }
      localStorage.setItem(LOCAL_STORAGE.HISTORY_SEARCH, JSON.stringify([data, ...listHistorySearch]));
      this._historySearch$.next([data, ...listHistorySearch]);
    }
  }

  public searchInListHistory(data: string): void {
    const listHistorySearch: string[] = localStorage.getItem(LOCAL_STORAGE.HISTORY_SEARCH) ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.HISTORY_SEARCH) as string) : [];
    if (data === '' || data === null) {
      this._valueSearch$.next('');
      this._historySearch$.next(listHistorySearch);
    }
    else {
      this._valueSearch$.next(data);
      this._historySearch$.next(listHistorySearch.filter(option => option.toLowerCase().includes(data.toLowerCase())));
    }
  }

  private initHistorySearch(): void {
    const historySearch = localStorage.getItem(LOCAL_STORAGE.HISTORY_SEARCH);
    if (historySearch) this._historySearch$.next(JSON.parse(historySearch));
  }

  private logicGetListData$(): Observable<ISearchRepositoriesResponse> {
    return this.dataFilter$
      .pipe(
        filter(([_, currentValue]: ISearchRepositoriesRequest[]) => currentValue.q !== ''),
        switchMap(([previousValue, currentValue]: ISearchRepositoriesRequest[]) => {
          const combine$ = combineLatest({ list: this.search$('repositories', { ...currentValue }), filter: of([previousValue.page, currentValue.page]) });
          return combine$
        }),
        map((res: {
          list: ISearchRepositoriesResponse;
          filter: (number | undefined)[];
        }) => {
          const filter = res.filter;
          if (filter[0] && filter[1] && filter[0] < filter[1]) {
            this._listAllData$.next({ ...res.list, items: [...this._listAllData$.value.items, ...res.list.items] })
          }
          else {
            this._listAllData$.next(res.list);
          }
          return this._listAllData$.value;
        })
      );
  }
}
