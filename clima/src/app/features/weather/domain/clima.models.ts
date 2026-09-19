export interface ClimaConsulta {
  latitud: number;
  longitud: number;
  temperatura: number;
  sensacion_termica: number;
  humedad: number;
  viento: number;
  condicion: string;
}

export interface RegistroClimatico {
  id: string;
  fecha_hora: string;
  latitud: number;
  longitud: number;
  temperatura: number;
  sensacion_termica: number;
  humedad: number;
  viento: number;
  condicion: string;
  fotografia?: string;
}

export interface Pais {
  nombre: string;
  capital: string;
  latitud: number;
  longitud: number;
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

export interface ClimaAPIResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    apparent_temperature: number;
    weather_code: number;
    time: string;
  };
}