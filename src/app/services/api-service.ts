import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MutualFund {
  schemeCode: string;
  schemeName: string;
  // Add other properties as needed based on the API response
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'https://api.mfapi.in/mf';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all mutual funds data from the API
   * @returns Observable<MutualFund[]>
   */
  getMutualFunds(): Observable<MutualFund[]> {
    return this.http.get<MutualFund[]>(this.apiUrl);
  }

  /**
   * Search mutual funds using regex patterns
   * @param searchTerm - The search term/pattern to filter by
   * @param funds - Array of mutual funds to search through
   * @returns Filtered array of mutual funds with search results
   */
  searchMutualFunds(
    searchTerm: string,
    funds: MutualFund[]
  ): { results: MutualFund[]; isRegexValid: boolean; error?: string } {
    if (!searchTerm || searchTerm.trim() === '') {
      return { results: funds, isRegexValid: true };
    }

    const term = searchTerm.trim();
    let regex: RegExp;

    try {
      // Try to create regex pattern - if it fails, fall back to simple string search
      regex = new RegExp(term, 'i'); // 'i' flag for case-insensitive
    } catch (error) {
      // If regex is invalid, escape special characters and create simple pattern
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(escapedTerm, 'i');
    }

    try {
      const results = funds.filter(fund => {
        // Test against scheme name and scheme code
        return regex.test(fund.schemeName) || regex.test(fund.schemeCode);
      });

      return { results, isRegexValid: true };
    } catch (error) {
      return {
        results: [],
        isRegexValid: false,
        error: 'Invalid search pattern. Please check your regex syntax.'
      };
    }
  }

  /**
   * Get search suggestions and examples
   * @returns Array of search pattern examples
   */
  getSearchExamples(): string[] {
    return [
      'equity',
      '^ICICI.*',
      'growth',
      'sip|systematic',
      'debt|bond',
      'large.*cap',
      'dividend.*fund',
      'tax.*saving',
      'liquid.*fund',
      'midcap|smallcap'
    ];
  }
}