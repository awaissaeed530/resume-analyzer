import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { finalize } from 'rxjs';
import { AnalyzeResumeResponse, ApiService } from '../../core';
import { ResumeAnalysisComponent } from './analysis/analysis';

@Component({
  selector: 'app-analyze-resume',
  templateUrl: './analyze.html',
  imports: [ReactiveFormsModule, ResumeAnalysisComponent],
})
export class AnalyzeResumeComponent {
  private readonly _apiService = inject(ApiService);
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  private readonly _toast = inject(HotToastService);

  readonly analysis = signal<AnalyzeResumeResponse | null>(null);
  readonly loading = signal(false);
  readonly isDragging = signal(false);

  readonly form = this._formBuilder.group({
    resume: this._formBuilder.control<File | null>(null),
    jobDescription: this._formBuilder.control<string>(''),
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const request = this.form.value;

    if (!request.resume) {
      this._toast.warning('Please select a resume file');
      return;
    }

    if (!request.jobDescription) {
      this._toast.warning('Please enter a job description');
      return;
    }

    this.loading.set(true);
    this._apiService
      .analyzeResume(request.resume, request.jobDescription)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (analysis) => {
          this.analysis.set(analysis);
        },
        error: (error) => {
          this._toast.error(error.error.message);
        },
      });
  }

  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.handleFile(element.files[0]);
    }
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.form.controls.resume.setValue(file);
    this.form.controls.resume.updateValueAndValidity();
  }

  clearFile(event: Event): void {
    event.stopPropagation();
    this.form.patchValue({ resume: null });
    this.form.get('resume')?.updateValueAndValidity();
  }
}
