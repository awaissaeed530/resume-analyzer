import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterModule, HeaderComponent],
})
export class App {}
