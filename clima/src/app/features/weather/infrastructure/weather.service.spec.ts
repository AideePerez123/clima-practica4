import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Observable, from, map, switchMap } from 'rxjs';
import { ClimaConsulta, RegistroClimatico } from '../domain/clima.models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private registrosSignal = signal<RegistroClimatico[]>([]);

  public registros = this.registrosSignal.asReadonly();

  constructor(private http: HttpClient) {}

  private traducirClima(code: number): string {
    const mapa: { [key: number]: string } = {
      0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado',
      3: 'Nublado', 45: 'Niebla', 51: 'Llovizna', 61: 'Lluvia',
      63: 'Lluvia moderada', 80: 'Chubascos', 95: 'Tormenta eléctrica'
    };
    return mapa[code] || 'Desconocido';
  }

  consultarClimaActual(): Observable<ClimaConsulta> {
    return from(Geolocation.getCurrentPosition({ enableHighAccuracy: true })).pipe(
      switchMap((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&timezone=auto`;

        return this.http.get<any>(url).pipe(
          map((datos) => ({
            latitud: lat,
            longitud: lon,
            condicion: this.traducirClima(datos.current.weather_code),
            temperatura: datos.current.temperature_2m,
            sensacion_termica: datos.current.apparent_temperature,
            humedad: datos.current.relative_humidity_2m,
            viento: datos.current.wind_speed_10m,
          }))
        );
      })
    );
  }

  guardarRegistro(consulta: ClimaConsulta): void {
    const nuevoRegistro: RegistroClimatico = {
      id: Date.now().toString(),
      fecha_hora: new Date().toLocaleString(),
      ...consulta,
    };
    this.registrosSignal.update((lista) => [nuevoRegistro, ...lista]);
  }

  actualizarFotografia(id: string, fotoDataUrl: string): void {
    this.registrosSignal.update((lista) =>
      lista.map((reg) => (reg.id === id ? { ...reg, fotografia: fotoDataUrl } : reg))
    );
  }
}