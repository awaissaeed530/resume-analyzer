import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
})
export class HeaderComponent {
  isDarkMode = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    const darkActive =
      savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    this.isDarkMode.set(darkActive);

    effect(() => {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((prev) => !prev);
  }
}
