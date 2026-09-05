export interface Pais {
  nombre: string;
  capital: string;
  latitud: number;
  longitud: number;
}

export interface ClimaAPIResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

export interface ClimaMostrar {
  pais: string;
  capital: string;
  condicion: string;
  temperatura: number;
  sensacion_termica: number;
  humedad: number;
  viento: number;
  fecha_hora: string;
}
