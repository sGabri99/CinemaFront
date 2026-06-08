import {LongOmdbResponseApiDto} from './long-omdb-response-api-dto';

export interface ShortOmdbResponseApiDto {
  search:LongOmdbResponseApiDto[];
  totalResults:string;
  response:string;
}
