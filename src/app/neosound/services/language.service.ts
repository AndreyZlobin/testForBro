import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

const translations = {
  'Error:': 'Error:',
  'Try': 'Pruebe',
  'Files': 'Ficheros',
  'API': 'API',
  'About': 'Acerca de',
  'Logout': 'Desconectar',
  'Created with ♥ by': 'Creado con ♥ por',
  'Loading...': 'Cargando...',
  'Loading': 'Cargando',
  'Date': 'Fecha',
  'from': 'desde',
  'to': 'hasta',
  'Anger': 'Enfado',
  'anger': 'enfado',
  'Filter': 'Filtro',
  'Reset Filter': 'Reiniciar filtro',
  'Export to CSV': 'Exportar a CSV',
  'Batch Id': 'Id de lote',
  'Name': 'Nombre',
  'Uploaded': 'Cargado',
  'Duration': 'Duración',
  'Emotion': 'Emoción',
  'emotion': 'emoción',
  'Beta': 'Beta',
  'File details': 'Detalles de fichero',
  'Refresh': 'Refrescar',
  'Delete': 'Borrar',
  'Details': 'Detalles',
  'Back': 'Atrás',
  'Fit into window': 'Ajustar a la ventana',
  'Happiness': 'Alegría',
  'Sadness': 'Tristeza',
  'Neutral': 'Neutro',
  'Dominant emotion detected': 'Emoción dominante detectada',
  'Male': 'Masculino',
  'Female': 'Femenino',
  'Teen': 'Adolescente',
  'Adult': 'Adulto',
  'Senior': 'Anciano',
  'Are you agree with the result?': '¿Está de acuerdo con el resultado?',
  'Yes': 'Sí',
  'No': 'No',
  'Thank you for reply!': '¡Gracias por su respuesta!',
  'Check another record': 'Comprobar otra grabación',
  'Anger level': 'Nivel de enfado',
  'Make a trial record or upload a file': 'Haga una prueba, grabe o cargue un fichero',
  'Start': 'Comenzar',
  'Upload': 'Cargar',
  'Record': 'Grabar',
  'UPLOAD': 'Cargar',
  'RECORD': 'Grabar',
  'Recording': 'Grabando',
  'You can upload only one file a time': 'Los ficheros se cargan de uno en uno',
  'Drop file here or click to browse': 'Suelte el fichero aquí o haga clic para abrir el explorador',
  'Discard': 'Descartar',
  'Attach': 'Añadir',
  'Play': 'Reproducir',
  'Change': 'Cambiar',
  'Results': 'Resultados',
  'Sign in': 'Conéctese',
  'Username': 'Nombre de usuario',
  'Password': 'Contraseña',
  'Remember me': 'Recuérdeme',
  "Don't have an account?": '¿No tiene una cuenta?',
  'Sign Up': 'Regístrese',
  'First name': 'Nombre',
  'Last name': 'Apellido',
  'Email': 'Correo electrónico',
  'Access Code': 'Código de acceso',
  'I have read the terms and conditions and privacy policy and agree to them': 'He leído los términos y condiciones, así como la política de privacidad y estoy de acuerdo',
  'I agree that my data is used, saved and processed by the NeoSound OU for the utilization of my account.': 'Estoy de acuerdo con que mis datos sean utilizados, guardados y procesados por NeoSound OU para la utilización de mi cuenta.',
  'SIGN UP': 'REGÍSTRESE',
  'Already have an account?': '¿Ya tiene una cuenta?',
  'Login': 'Inicie sesión',
  'All': 'Todos',
  'Terms of Use': 'Términos de Uso',
  'Selected files total count': 'Cantidad total de archivos seleccionados',
  '0 Files': '0 archivos',
  'Avg.Pause': 'Pausa media',
  'Search': 'Buscar',
  'Music': 'Música',
  'Merged': 'Fusionado',
  'Probs test': 'Problemas test',
  'Text': 'Texto',
  'See details': 'Ver detalles',
  'here': 'aquí',
  'Sad': 'Triste',
  'Happy': 'Feliz',
  'Total files on page': 'Total de archivos en la página',
  'out of': 'de',
  'previous': 'anterior',
  'next': 'siguiente',
  'On-hold': 'En espera',
};

@Injectable()
export class LanguageService {

  constructor(
  ) { }

  checkLanguage(ln) {
    const lang = localStorage.getItem('lang');
    return lang && (lang === ln) || !lang && ln === 'en';
  }

  getLanguage() {
    const lang = localStorage.getItem('lang');
    return lang || !lang && 'en';
  }

  static t(text) {
    const lang = localStorage.getItem('lang');
    const current =  lang || !lang && 'en';

    if (current === 'en') {
      return text;
    }
    if (current === 'sp') {
      return translations[text] || text;
    }
  }
}
