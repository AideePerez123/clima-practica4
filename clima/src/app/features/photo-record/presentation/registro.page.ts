import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  IonCheckbox,
  ToastController,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { WeatherService } from '../../weather/infrastructure/weather.service';
import { RegistroClimatico } from '../../weather/domain/clima.models';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar,
    IonCheckbox,
  ],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  guardarEnGaleria = false;

  constructor(
    public weatherService: WeatherService,
    private toastCtrl: ToastController
  ) {}

  async tomarFotografia(registro: RegistroClimatico): Promise<void> {
    try {
      const permission = await Camera.requestPermissions();
      if (permission.camera !== 'granted' && permission.photos !== 'granted') {
        const toast = await this.toastCtrl.create({
          message: 'Se requieren permisos de cámara para tomar una fotografía.',
          duration: 2500,
          color: 'warning',
        });
        await toast.present();
        return;
      }

      const imagen = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: this.guardarEnGaleria,
      });

      if (imagen.dataUrl) {
        this.weatherService.actualizarFotografia(registro.id, imagen.dataUrl);

        const mensaje = this.guardarEnGaleria
          ? 'Fotografía capturada y guardada en la Galería.'
          : 'Fotografía adjuntada al registro exitosamente.';

        const toast = await this.toastCtrl.create({
          message: mensaje,
          duration: 2500,
          color: 'success',
        });
        await toast.present();
      }
    } catch (error) {
      console.log('Captura cancelada o no disponible:', error);
      const toast = await this.toastCtrl.create({
        message: 'No se pudo acceder a la cámara.',
        duration: 2500,
        color: 'danger',
      });
      await toast.present();
    }
  }
}