import { Component, input } from '@angular/core';
import { AnalyzeResumeResponse } from '../../../core';

@Component({
  selector: 'app-resume-analysis',
  templateUrl: './analysis.html',
})
export class ResumeAnalysisComponent {
  readonly analysis = input.required<AnalyzeResumeResponse>();
}
