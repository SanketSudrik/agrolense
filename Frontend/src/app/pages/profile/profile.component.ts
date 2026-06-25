import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    TranslateModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <div mat-card-avatar class="profile-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <mat-card-title>{{ 'NAV.PROFILE' | translate }}</mat-card-title>
          <mat-card-subtitle>Manage your account settings</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="fullName">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" readonly>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Role</mat-label>
                <input matInput formControlName="role" readonly>
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || !profileForm.dirty">
                Save Changes
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container { display: flex; justify-content: center; padding: 40px 20px; }
    .profile-card { width: 100%; max-width: 500px; padding: 20px; }
    .profile-avatar { display: flex; align-items: center; justify-content: center; background: #eee; border-radius: 50%; }
    .profile-avatar mat-icon { font-size: 40px; width: 40px; height: 40px; }
    .form-row { margin-bottom: 15px; }
    mat-form-field { width: 100%; }
    .actions { margin-top: 20px; text-align: right; }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.profileForm.patchValue({
        fullName: user.name,
        email: user.email,
        role: user.role
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      console.log('Saving profile...', this.profileForm.value);
      // Implement update logic
    }
  }
}
