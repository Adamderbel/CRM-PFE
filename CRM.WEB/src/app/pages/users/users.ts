import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserDto } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  users = signal<UserDto[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  searchQuery = signal('');
  roleFilter = signal('');
  pageSize = signal(10);
  currentPage = signal(1);
  pageOptions = [10, 20, 50];
  roleOptions = ['ADMIN', 'MANAGER', 'COMMERCIAL'];

  filteredUsers = computed(() => {
    let list = this.users();
    const q = this.searchQuery().toLowerCase();
    const role = this.roleFilter().toLowerCase();

    if (q) {
      list = list.filter((user) =>
        [user.userName, user.email, user.nom, user.prenom].some((value) =>
          (value || '').toLowerCase().includes(q)
        )
      );
    }

    if (role) {
      list = list.filter((user) => (user.roles || []).some((item) => item.toLowerCase().includes(role)));
    }

    return list;
  });

  pagedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredUsers().length / this.pageSize())));

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.loadUsers();
  }

  loadUsers() {
    console.log('[Users] Chargement des utilisateurs...');
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('[Users] Liste chargée:', users);
        this.users.set(
          users.map((user) => ({
            ...user,
            selectedRole: user.roles[0] ?? 'MANAGER',
          }))
        );
        this.isLoading.set(false);
        this.currentPage.set(1);
      },
      error: (err) => {
        console.error('[Users] Erreur de chargement:', err);
        this.errorMessage.set('Impossible de charger la liste des utilisateurs.');
        this.notificationService.error('Impossible de charger la liste des utilisateurs.');
        this.isLoading.set(false);
      },
    });
  }

  approve(user: UserDto) {
    console.log('[Users] Approbation de l\'utilisateur:', user.userName);
    this.isLoading.set(true);
    this.userService.updateUserStatus(user.id, { action: 'APPROVE' }).subscribe({
      next: () => {
        console.log('[Users] Utilisateur approuvé:', user.userName);
        this.successMessage.set(`Utilisateur ${user.userName} approuvé.`);
        this.notificationService.success(`Utilisateur ${user.userName} approuvé.`);
        this.loadUsers();
      },
      error: (error) => {
        console.error('[Users] Erreur d\'approbation:', error);
        this.errorMessage.set(this.getErrorMessage(error, 'Impossible d’approuver cet utilisateur.'));
        this.notificationService.error('Impossible d’approuver cet utilisateur.');
        this.isLoading.set(false);
      },
    });
  }

  reject(user: UserDto) {
    console.log('[Users] Rejet de l\'utilisateur:', user.userName);
    this.isLoading.set(true);
    this.userService.updateUserStatus(user.id, { action: 'REJECT' }).subscribe({
      next: () => {
        console.log('[Users] Utilisateur rejeté:', user.userName);
        this.successMessage.set(`Utilisateur ${user.userName} rejeté.`);
        this.notificationService.warning(`Utilisateur ${user.userName} rejeté.`);
        this.loadUsers();
      },
      error: (error) => {
        console.error('[Users] Erreur de rejet:', error);
        this.errorMessage.set(this.getErrorMessage(error, 'Impossible de rejeter cet utilisateur.'));
        this.notificationService.error('Impossible de rejeter cet utilisateur.');
        this.isLoading.set(false);
      },
    });
  }

  updateRole(user: UserDto) {
    if (!user.selectedRole) {
      console.warn('[Users] Tentative de mise à jour de rôle sans rôle sélectionné');
      this.errorMessage.set('Veuillez sélectionner un rôle.');
      return;
    }
    console.log('[Users] Mise à jour du rôle pour:', user.userName, 'Nouveau rôle:', user.selectedRole);
    this.isLoading.set(true);
    this.userService.updateUserRole(user.id, { role: user.selectedRole }).subscribe({
      next: () => {
        console.log('[Users] Rôle mis à jour avec succès');
        this.successMessage.set(`Rôle mis à jour pour ${user.userName}.`);
        this.notificationService.success(`Rôle mis à jour pour ${user.userName}.`);
        this.loadUsers();
      },
      error: (error) => {
        console.error('[Users] Erreur lors de la mise à jour du rôle:', error);
        this.errorMessage.set(this.getErrorMessage(error, 'Impossible de mettre à jour le rôle.'));
        this.notificationService.error('Impossible de mettre à jour le rôle.');
        this.isLoading.set(false);
      },
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  onRoleChange(value: string): void {
    this.roleFilter.set(value);
    this.currentPage.set(1);
  }

  onPageSizeChange(value: string): void {
    this.pageSize.set(Number(value));
    this.currentPage.set(1);
  }

  previousPage(): void {
    this.currentPage.update((page) => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.currentPage.update((page) => Math.min(this.totalPages(), page + 1));
  }

  private getErrorMessage(error: any, fallback: string): string {
    if (!error) {
      return fallback;
    }

    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      if (error.error.error) {
        return error.error.error;
      }
      if (error.error.message) {
        return error.error.message;
      }
    }

    return error.message ?? fallback;
  }
}
