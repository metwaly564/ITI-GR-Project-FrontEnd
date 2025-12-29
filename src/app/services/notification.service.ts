import { Injectable, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastService } from './toast.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection | undefined;
  private toastService = inject(ToastService);
  private baseUrl = 'http://localhost:5062'; // Base URL from other services

  private notificationSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationSubject.asObservable();

  constructor() {
    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/notificationHub`, {
        accessTokenFactory: () => {
          const token = localStorage.getItem('token') || 
                        localStorage.getItem('userToken') || 
                        localStorage.getItem('Token');
          
          if (!token) return '';
          
          // Clean token if it starts/ends with quotes
          if (token.startsWith('"') && token.endsWith('"')) {
            return token.slice(1, -1);
          }
          return token;
        }
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connection started');
        this.addNotificationListener();
      })
      .catch((err) => console.log('Error while starting SignalR connection: ' + err));
  }

  private addNotificationListener(): void {
    this.hubConnection?.on('ReceiveNotification', (notification) => {
      console.log('Notification received:', notification);
      
      const currentNotifications = this.notificationSubject.value;
      this.notificationSubject.next([notification, ...currentNotifications]);

      this.toastService.info(notification.message || notification.title || 'New notification', {
          style: { 'background-color': '#3b82f6', 'color': 'white' }
      });
    });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR Connection stopped'))
        .catch(err => console.log('Error while stopping SignalR: ' + err));
    }
  }

  public getNotifications(): any[] {
    return this.notificationSubject.value;
  }
}
