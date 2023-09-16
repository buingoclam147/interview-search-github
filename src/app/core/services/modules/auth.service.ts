import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_ROUTER, GITHUB_API_URL, GITHUB_URL } from '@core/constants';
import { IAccessTokenResponse, IGithubUser } from '@core/models';
import { isEmpty } from 'lodash-es';
import { Observable, of, switchMap, tap } from 'rxjs';
import { AccessTokenService } from '../cache';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly redirectUri!: string
  private readonly githubApiUrl = GITHUB_API_URL;
  constructor(
    private http: HttpClient,
    private accessTokenSvc: AccessTokenService,
    @Inject('ClientID') private readonly clientId: string,
    @Inject('ClientSecrets') private readonly clientSecrets: string,
    @Inject('BASE_URL') private readonly baseUrl: string,
    @Inject('BackendUrl') private readonly backendUrl: string,
  ) {
    this.redirectUri = `${this.baseUrl}${APP_ROUTER.REDIRECT}`;
  }

  public login(): void {
    const authUrl = `${GITHUB_URL}/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
    window.location.href = authUrl;
  }

  public postAccessToken$(code: string): Observable<IAccessTokenResponse> {
    const params = {
      client_id: this.clientId,
      client_secret: this.clientSecrets,
      code,
      redirect_uri: this.redirectUri
    }
    return this.http.post<IAccessTokenResponse>(`${this.backendUrl}/AccessToken`, params).pipe(tap((res: IAccessTokenResponse) => {
      if (!isEmpty(res)) {
        this.accessTokenSvc.setAccessToken(res.accessToken)
      }
    }),
      switchMap((res: IAccessTokenResponse) => !isEmpty(res) ? of(res) : this.accessTokenSvc.accessToken$),
    );
  }

  public getUserData$(accessToken?: string): Observable<IGithubUser> {
    const headers = new HttpHeaders({
      'Authorization': `token ${accessToken}`
    });
    return this.http.get<IGithubUser>(`${this.githubApiUrl}/user`, { headers });
  }

  public logout(): void {
    this.accessTokenSvc.setAccessToken('');
    localStorage.clear();
    window.location.href = this.baseUrl;
  }
}
