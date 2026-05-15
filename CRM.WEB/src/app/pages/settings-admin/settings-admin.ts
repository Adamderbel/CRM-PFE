import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type SettingsTab = 'profil' | 'securite' | 'preferences';

@Component({
  selector: 'app-settings-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-admin.html',
  styleUrl: './settings-admin.css',
})
export class SettingsAdmin {
  activeTab = signal<SettingsTab>('profil');

  // Static profile data
  profile = {
    nom: 'Rmth',
    prenom: 'Alex',
    email: 'alex.rmth@crm-hub.com',
    telephone: '+212 6 12 34 56 78',
    role: 'Administrateur',
    departement: 'Direction Générale',
    initials: 'AR',
  };

  // Theme selection
  selectedTheme = signal<'clair' | 'sombre' | 'systeme'>('clair');

  // Language selection
  selectedLanguage = signal<string>('fr');

  // Notification toggles
  notifEmail = signal(true);
  notifPush = signal(false);
  notifRecap = signal(true);

  // Password strength
  passwordStrength = signal(0);

  setTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  setTheme(theme: 'clair' | 'sombre' | 'systeme'): void {
    this.selectedTheme.set(theme);
  }

  toggleNotif(type: 'email' | 'push' | 'recap'): void {
    if (type === 'email') this.notifEmail.set(!this.notifEmail());
    if (type === 'push') this.notifPush.set(!this.notifPush());
    if (type === 'recap') this.notifRecap.set(!this.notifRecap());
  }
}
