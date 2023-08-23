export interface Consumo {
  id: number;
  codigo: string;
  cliente: string;
  vereda: string;
  sector: string;
  ruta: string;
  lecturaAnterior: string;
  lectura: string;
  fecha_ruta: string;
}

export interface Configuracion {
  api_uri: string;
  token: string;
}

export interface Busqueda {
  ruta: string;
}

