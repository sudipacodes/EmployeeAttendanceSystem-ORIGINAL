import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast" [class.show]="toast.state().visible" [class.error]="toast.state().kind === 'error'"
         [class.success]="toast.state().kind === 'success'">
      {{ toast.state().message }}
    </div>
  `
})
export class ToastComponent {
  protected toast = inject(ToastService);
}
