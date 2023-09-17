export interface ISearchRequest {
  q: string;
  page: number;
  per_page?: number;
  owner?: string;
  language?: string;
  created?: string;
  size?: number;
}

export interface ISearchRepositoriesRequest extends ISearchRequest { }

export interface ILanguageResponse {
  name: string;
  aliases: string[];
}

export interface ISearchResponse {
  total_count: number;
  incomplete_results?: boolean;
  items: any[];
}

export interface ISearchRepositoriesResponse extends ISearchResponse { }
