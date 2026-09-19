import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  ToastController,
} from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { WeatherService } from '../../weather/infrastructure/weather.service';
import { ClimaConsulta } from '../../weather/domain/clima.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  cargando = false;
  mostrarModal = false;
  climaActual: ClimaConsulta | null = null;

  constructor(
    public weatherService: WeatherService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async obtenerClimaGPS(): Promise<void> {
    this.cargando = true;
    try {
      const data = await firstValueFrom(this.weatherService.consultarClimaActual());
      this.climaActual = data;
      this.mostrarModal = true;
    } catch (err) {
      console.error(err);
      const toast = await this.toastCtrl.create({
        message: 'No se pudo obtener la ubicación GPS o consultar el clima. Revisa permisos o conectividad.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.cargando = false;
    }
  }

  async guardarYMostrarToast(): Promise<void> {
    if (this.climaActual) {
      this.weatherService.guardarRegistro(this.climaActual);
      this.cerrarModal();
      const toast = await this.toastCtrl.create({
        message: '¡Registro del clima guardado exitosamente!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.climaActual = null;
  }

  irARegistros(): void {
    this.router.navigate(['/registro']);
  }
}