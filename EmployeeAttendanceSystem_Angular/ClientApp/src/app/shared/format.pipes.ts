import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fmtTime', standalone: true })
export class FmtTimePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

@Pipe({ name: 'fmtDate', standalone: true })
export class FmtDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

@Pipe({ name: 'fmtHours', standalone: true })
export class FmtHoursPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return value === null || value === undefined ? '—' : `${value.toFixed(2)} hrs`;
  }
}
