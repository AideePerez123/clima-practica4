import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClimaAPIResponse, ClimaMostrar } from '../domain/clima.models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}

  private traducirClima(code: number): string {
    const mapa: { [key: number]: string } = {
      0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado',
      3: 'Nublado', 45: 'Niebla', 51: 'Llovizna', 61: 'Lluvia',
      63: 'Lluvia moderada', 80: 'Chubascos', 95: 'Tormenta eléctrica'
    };
    return mapa[code] || 'Desconocido';
  }

  consultarClima(pais: string, capital: string, lat: number, lon: number): Observable<ClimaMostrar> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&timezone=auto`;

    return new Observable((observer) => {
      this.http.get<ClimaAPIResponse>(url).subscribe({
        next: (datos) => {
          observer.next({
            pais,
            capital,
            condicion: this.traducirClima(datos.current.weather_code),
            temperatura: datos.current.temperature_2m,
            sensacion_termica: datos.current.apparent_temperature,
            humedad: datos.current.relative_humidity_2m,
            viento: datos.current.wind_speed_10m,
            fecha_hora: new Date(datos.current.time).toLocaleString(),
          });
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }
}
