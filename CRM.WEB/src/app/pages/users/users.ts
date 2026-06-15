import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { CreateUserRequest, UpdateUserRequest, UserDto } from '../../core/models/user.model';

interface UserEditDraft extends UpdateUserRequest {
  id: string;
}

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
  showCreateModal = signal(false);
  isCreating = signal(false);
  editingUserId = signal<string | null>(null);
  editDraft = signal<UserEditDraft | null>(null);
  savingUserId = signal<string | null>(null);
  pageSize = signal(10);
  currentPage = signal(1);
  pageOptions = [10, 20, 50];
  roleOptions = ['ADMIN', 'MANAGER', 'COMMERCIAL'];
  newUser: CreateUserRequest = this.getEmptyUserForm();

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
          users.map((user) => {
            const roles = (user.roles || []).map((role) => this.normalizeRole(role)).filter(Boolean);
            return {
              ...user,
              roles,
              selectedRole: roles[0] ?? 'MANAGER',
            };
          })
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

  openCreateModal(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.newUser = this.getEmptyUserForm();
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    if (this.isCreating()) {
      return;
    }

    this.showCreateModal.set(false);
  }

  createUser(): void {
    if (!this.newUser.email || !this.newUser.userName || !this.newUser.password || !this.newUser.role) {
      this.errorMessage.set('Veuillez remplir email, nom utilisateur, mot de passe et role.');
      return;
    }

    this.isCreating.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.successMessage.set(`Utilisateur ${this.newUser.userName} cree avec le role ${this.newUser.role}.`);
        this.notificationService.success(`Utilisateur ${this.newUser.userName} cree.`);
        this.isCreating.set(false);
        this.showCreateModal.set(false);
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Impossible de creer cet utilisateur.'));
        this.notificationService.error('Impossible de creer cet utilisateur.');
        this.isCreating.set(false);
      },
    });
  }

  updateRole(user: UserDto) {
    this.startEditing(user);
  }

  startEditing(user: UserDto): void {
    if (this.savingUserId()) return;

    this.editingUserId.set(user.id);
    this.editDraft.set({
      id: user.id,
      userName: user.userName,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.selectedRole || user.roles[0] || 'COMMERCIAL',
    });
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelEditing(): void {
    if (this.savingUserId()) return;
    this.editingUserId.set(null);
    this.editDraft.set(null);
  }

  saveUser(user: UserDto): void {
    const draft = this.editDraft();
    if (!draft || draft.id !== user.id) {
      this.startEditing(user);
      return;
    }

    if (!draft.userName.trim() || !draft.email.trim() || !draft.role) {
      this.errorMessage.set('Email, nom utilisateur et rôle sont obligatoires.');
      return;
    }

    this.savingUserId.set(user.id);
    this.errorMessage.set('');
    this.userService.updateUser(user.id, {
      userName: draft.userName.trim(),
      email: draft.email.trim(),
      nom: draft.nom.trim(),
      prenom: draft.prenom.trim(),
      role: draft.role,
    }).subscribe({
      next: (updatedUser) => {
        const roles = (updatedUser.roles || []).map((role) => this.normalizeRole(role)).filter(Boolean);
        this.users.update((users) =>
          users.map((item) =>
            item.id === user.id
              ? { ...updatedUser, roles, selectedRole: roles[0] || draft.role }
              : item
          )
        );
        this.successMessage.set(`Utilisateur ${updatedUser.userName} mis à jour.`);
        this.notificationService.success(`Utilisateur ${updatedUser.userName} mis à jour.`);
        this.savingUserId.set(null);
        this.editingUserId.set(null);
        this.editDraft.set(null);
      },
      error: (error) => {
        const message = this.getErrorMessage(error, 'Impossible de mettre à jour cet utilisateur.');
        this.errorMessage.set(message);
        this.notificationService.error(message);
        this.savingUserId.set(null);
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

  private getEmptyUserForm(): CreateUserRequest {
    return {
      email: '',
      userName: '',
      nom: '',
      prenom: '',
      password: '',
      role: 'COMMERCIAL',
    };
  }

  private normalizeRole(role: string | null | undefined): string {
    const normalized = (role || '').trim().toUpperCase();
    return this.roleOptions.includes(normalized) ? normalized : '';
  }
}
