export type CondicionClimatica = 'Soleado' | 'Nublado' | 'Lluvioso';

export interface RegistroFotografia {
  fotografia: string;
  condicion: CondicionClimatica;
  comentario: string;
  fecha: string;
}
