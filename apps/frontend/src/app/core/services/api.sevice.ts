import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyzeResumeResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // TODO: set in environment
  private readonly _baseUrl = 'http://localhost:3000/api';
  private readonly _http = inject(HttpClient);

  analyzeResume(
    resumeFile: File,
    jobDescription: string,
  ): Observable<AnalyzeResumeResponse> {
    const url = this._getUrl('resume/analyze');

    const formData = new FormData();

    formData.append('resumeFile', resumeFile, 'resumeFile');
    formData.append('jobDescription', jobDescription);

    return this._http.post<AnalyzeResumeResponse>(url, formData);
  }

  private _getUrl(path: string): string {
    return `${this._baseUrl}/${path}`;
  }
}
