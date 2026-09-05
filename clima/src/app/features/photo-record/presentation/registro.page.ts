import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonNote, IonSelect,
  IonSelectOption, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/angular';
import { CondicionClimatica, RegistroFotografia } from '../domain/photo-record.models';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonCard,
    IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItem,
    IonLabel, IonNote, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar,
  ],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnDestroy {
  condicion: CondicionClimatica | '' = '';
  comentario = '';
  fotografia: string | null = null;
  registro: RegistroFotografia | null = null;

  seleccionarFotografia(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo || !archivo.type.startsWith('image/')) return;
    this.liberarFotografia();
    this.fotografia = URL.createObjectURL(archivo);
    this.registro = null;
    input.value = '';
  }

  guardarRegistro(): void {
    if (!this.fotografia || !this.condicion) return;
    this.registro = {
      fotografia: this.fotografia,
      condicion: this.condicion,
      comentario: this.comentario.trim(),
      fecha: new Date().toLocaleString(),
    };
  }

  ngOnDestroy(): void { this.liberarFotografia(); }

  private liberarFotografia(): void {
    if (this.fotografia) {
      URL.revokeObjectURL(this.fotografia);
      this.fotografia = null;
    }
  }
}
