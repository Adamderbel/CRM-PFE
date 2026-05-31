export interface Notification {
  id: string;
  userId: string;
  typeNotification?: string;
  titre?: string;
  message?: string;
  lu: boolean;
  dateCreation: string;
}
