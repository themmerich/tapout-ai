import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-primeng-test',
  imports: [ButtonModule, CardModule, InputTextModule, TagModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <main class="flex min-h-dvh items-center justify-center p-6">
      <p-card header="PrimeNG Smoke Test" class="w-full max-w-xl">
        <div class="flex flex-col gap-6">
          <p class="text-surface-600 dark:text-surface-300">
            If the button below is fully styled and clicking it shows a toast,
            PrimeNG is wired up correctly.
          </p>

          <div class="flex flex-col gap-2">
            <label for="name" class="font-medium">Your name</label>
            <input
              pInputText
              id="name"
              #nameInput
              [value]="name()"
              (input)="name.set(nameInput.value)"
              placeholder="Type here…"
              class="w-full"
            />
            <span class="text-sm text-surface-500">Hello, {{ name() || 'stranger' }} 👋</span>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <p-button label="Show toast" icon="pi pi-check" (onClick)="greet()" />
            <p-button label="Secondary" severity="secondary" />
            <p-button label="Danger" severity="danger" [outlined]="true" />
            <p-tag [value]="'Clicks: ' + clicks()" severity="info" />
          </div>
        </div>
      </p-card>
    </main>
  `
})
export class PrimeNgTest {
  private readonly messages = inject(MessageService);

  protected readonly name = signal('');
  protected readonly clicks = signal(0);

  protected greet(): void {
    this.clicks.update((count) => count + 1);
    this.messages.add({
      severity: 'success',
      summary: 'PrimeNG works!',
      detail: `Hello ${this.name() || 'stranger'} — clicked ${this.clicks()} time(s).`
    });
  }
}
