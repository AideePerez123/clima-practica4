import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList, IonSelect,
  IonSelectOption, IonSpinner, IonTitle, IonToolbar,
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../infrastructure/weather.service';
import { ClimaMostrar, Pais } from '../domain/clima.models';

@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonCard,
    IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItem,
    IonLabel, IonList, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar,
  ],
  templateUrl: './clima.page.html',
  styleUrls: ['./clima.page.scss'],
})
export class ClimaPage {
  paises: Pais[] = [
    { nombre: 'México', capital: 'Ciudad de México', latitud: 19.4326, longitud: -99.1332 },
    { nombre: 'Guatemala', capital: 'Ciudad de Guatemala', latitud: 14.6349, longitud: -90.5069 },
    { nombre: 'España', capital: 'Madrid', latitud: 40.4168, longitud: -3.7038 },
    { nombre: 'Argentina', capital: 'Buenos Aires', latitud: -34.6037, longitud: -58.3816 },
  ];
  paisSeleccionado: Pais = this.paises[0];
  cargando = false;
  clima: ClimaMostrar | null = null;

  constructor(private weatherService: WeatherService) {}

  consultarClima(): void {
    this.cargando = true;
    this.clima = null;
    this.weatherService.consultarClima(
      this.paisSeleccionado.nombre, this.paisSeleccionado.capital,
      this.paisSeleccionado.latitud, this.paisSeleccionado.longitud,
    ).subscribe({
      next: (data) => { this.clima = data; this.cargando = false; },
      error: (err) => {
        console.error(err);
        alert('Error al consultar el clima. Intenta de nuevo.');
        this.cargando = false;
      },
    });
  }
}
