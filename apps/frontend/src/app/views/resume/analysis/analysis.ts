import { Component, inject, input } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { LucideCopy } from '@lucide/angular';
import { AnalyzeResumeResponse } from '../../../core';

@Component({
  selector: 'app-resume-analysis',
  templateUrl: './analysis.html',
  imports: [LucideCopy],
})
export class ResumeAnalysisComponent {
  private readonly _toast = inject(HotToastService);
  readonly analysis = input.required<AnalyzeResumeResponse>();

  copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this._toast.success('Copied to clipboard!');
      })
      .catch((err) => {
        this._toast.error('Failed to copy text: ', err);
      });
  }
}
