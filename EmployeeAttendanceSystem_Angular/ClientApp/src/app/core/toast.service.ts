import { Injectable, signal } from '@angular/core';

export interface ToastState {
  message: string;
  kind: 'default' | 'success' | 'error';
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly state = signal<ToastState>({ message: '', kind: 'default', visible: false });
  private hideTimer?: ReturnType<typeof setTimeout>;

  show(message: string, kind: ToastState['kind'] = 'default'): void {
    clearTimeout(this.hideTimer);
    this.state.set({ message, kind, visible: true });
    this.hideTimer = setTimeout(() => {
      this.state.update((s) => ({ ...s, visible: false }));
    }, 3200);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }
}
