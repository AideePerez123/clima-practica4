import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Observable, from, map, switchMap, timeout, catchError, throwError } from 'rxjs';
import { ClimaAPIResponse, ClimaConsulta, ClimaMostrar, RegistroClimatico } from '../domain/clima.models';

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

  private async obtenerCoordenadas(): Promise<{ latitude: number; longitude: number }> {
    try {
      const permission = await Geolocation.requestPermissions();
      const granted = permission.location === 'granted' || permission.coarseLocation === 'granted';

      if (!granted && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        return await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });
      }

      if (!granted) {
        throw new Error('No se concedieron permisos de ubicación.');
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        return await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
            (geoError) => reject(geoError),
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });
      }

      throw error;
    }
  }

  consultarClimaActual(): Observable<ClimaConsulta> {
    return from(this.obtenerCoordenadas()).pipe(
      timeout(15000),
      switchMap((coords) => {
        const lat = coords.latitude;
        const lon = coords.longitude;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&timezone=auto`;

        return this.http.get<ClimaAPIResponse>(url).pipe(
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
      }),
      catchError((err) => {
        console.error('Error al obtener geolocalización o clima:', err);
        return throwError(() => new Error('No se pudo obtener la ubicación GPS o consultar el clima. Revisa permisos o conectividad.'));
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