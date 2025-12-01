import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RecommendationServ, SkinType, RecommendationRequest, RecommendationResponse, ProductRecommendation } from '../../../services/recommendation-serv';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recommendation.html',
  styleUrl: './recommendation.css'
})
export class RecommendationComponent {
  skinType = SkinType;
  analysisRequest: RecommendationRequest = {
    skinType: SkinType.Normal,
    concerns: [],
    symptoms: [],
    additionalNotes: ''
  };

  symptomsText: string = '';
  selectedConcerns = {
    acne: false,
    dryness: false,
    oiliness: false,
    redness: false,
    aging: false,
    darkSpots: false
  };

  analysisResults: RecommendationResponse | null = null;
  isLoading = false;

  constructor(
    private recommendationService: RecommendationServ,
    private router: Router
  ) {}

  onSubmit() {
    if (this.isLoading) return;

    // Convert selected concerns to array
    this.analysisRequest.concerns = Object.keys(this.selectedConcerns)
      .filter(key => this.selectedConcerns[key as keyof typeof this.selectedConcerns]);

    // Convert symptoms text to array
    this.analysisRequest.symptoms = this.symptomsText
      .split('\n')
      .filter(s => s.trim());

    this.isLoading = true;

    this.recommendationService.analyzeAndRecommend(this.analysisRequest).subscribe({
      next: (response) => {
        this.analysisResults = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Analysis failed:', error);
        alert('Analysis failed. Please try again.');
        this.isLoading = false;
      }
    });
  }

  getRoutineAdviceLines(): string[] {
    if (!this.analysisResults?.routineAdvice) return [];
    return this.analysisResults.routineAdvice.split('\n').filter(line => line.trim());
  }

  viewProduct(productId: number) {
    this.router.navigate(['/singleproduct', productId]);
  }

  getSkinTypeName(type: SkinType): string {
    const skinTypeNames: { [key: number]: string } = {
      1: 'Normal',
      2: 'Dry',
      3: 'Oily',
      4: 'Combination',
      5: 'Sensitive'
    };
    return skinTypeNames[type] || 'Normal';
  }
}

