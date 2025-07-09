import { Component, OnInit } from '@angular/core';
import { ApiService, MutualFund } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-api-service-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-service-component.html',
  styleUrls: ['./api-service-component.css']
})
export class ApiServiceComponent implements OnInit {
  allMutualFunds: MutualFund[] = [];
  filteredMutualFunds: MutualFund[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  searchSuggestions: string[] = [];
  showSuggestions: boolean = false;
  pageSize: number = 50;
  currentPage: number = 1;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMutualFunds();
  }

  /**
   * Load all mutual funds from the API
   */
  loadMutualFunds(): void {
    this.isLoading = true;
    this.error = null;
    
    this.apiService.getMutualFunds().subscribe({
      next: (data) => {
        this.allMutualFunds = data;
        this.filteredMutualFunds = data;
        this.searchSuggestions = this.apiService.getSearchExamples(); // FIXED: No argument
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load mutual funds data. Please try again.';
        this.isLoading = false;
        console.error('Error loading mutual funds:', error);
      }
    });
  }

  /**
   * Handle search functionality - enhanced frontend filtering
   */
  onSearch(): void {
    const result = this.apiService.searchMutualFunds(
      this.searchTerm, 
      this.allMutualFunds
    );
    this.filteredMutualFunds = result.results;
    this.currentPage = 1; // Reset to first page
  }

  /**
   * Clear search and reset to show all funds
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredMutualFunds = this.allMutualFunds;
    this.showSuggestions = false;
    this.currentPage = 1; // Reset to first page
  }

  /**
   * Show search suggestions
   */
  showSearchSuggestions(): void {
    this.showSuggestions = true;
  }

  /**
   * Hide search suggestions
   */
  hideSearchSuggestions(): void {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  /**
   * Use a search suggestion
   */
  useSuggestion(suggestion: string): void {
    this.searchTerm = suggestion;
    this.showSuggestions = false;
    this.onSearch();
  }

  /**
   * Retry loading data
   */
  retry(): void {
    this.loadMutualFunds();
  }

  /**
   * Track by function for ngFor optimization
   */
  trackBySchemeCode(index: number, fund: MutualFund): string {
    return fund.schemeCode;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMutualFunds.length / this.pageSize);
  }

  get paginatedFunds(): MutualFund[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMutualFunds.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}