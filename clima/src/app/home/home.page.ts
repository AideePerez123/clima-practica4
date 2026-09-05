import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}

  irAClima() {
    this.router.navigate(['/clima']);
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}