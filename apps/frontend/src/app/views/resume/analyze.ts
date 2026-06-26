import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AnalyzeResumeResponse, ApiService } from '../../core';
import { finalize, tap } from 'rxjs';
import { ResumeAnalysisComponent } from './analysis/analysis';

@Component({
  selector: 'app-analyze-resume',
  templateUrl: './analyze.html',
  imports: [ReactiveFormsModule, ResumeAnalysisComponent],
})
export class AnalyzeResumeComponent {
  private readonly _apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly analysis = signal<AnalyzeResumeResponse | null>(null);
  readonly loading = signal(false);

  readonly form = this.formBuilder.group({
    resume: this.formBuilder.control<File | null>(null),
    jobDescription: this.formBuilder.control<string>(''),
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const request = this.form.value;

    if (!request.resume || !request.jobDescription) {
      return;
    }

    this._apiService
      .analyzeResume(request.resume, request.jobDescription)
      .pipe(
        tap(() => this.loading.set(true)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (analysis) => {
          this.analysis.set(analysis);
        },
      });
  }

  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;

    if (element.files && element.files.length > 0) {
      const file = element.files[0];

      this.form.controls.resume.setValue(file);
      this.form.controls.resume.updateValueAndValidity();
    }
  }
}
