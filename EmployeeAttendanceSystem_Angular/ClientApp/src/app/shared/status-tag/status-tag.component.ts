import { Component, Input, computed, signal } from '@angular/core';

@Component({
  selector: 'app-status-tag',
  standalone: true,
  template: `<span class="status-tag" [class]="cssClass()">{{ label() }}</span>`
})
export class StatusTagComponent {
  private readonly statusValue = signal<string>('Not marked');

  @Input()
  set status(value: string | null | undefined) {
    this.statusValue.set(value && value.trim() ? value : 'Not marked');
  }

  readonly label = computed(() => this.statusValue());
  readonly cssClass = computed(() =>
    this.statusValue()
      .toLowerCase()
      .replace(/\s+/g, '-')
  );
}
