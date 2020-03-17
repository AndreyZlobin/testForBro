import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

const translationsSp = {
  'Error:': 'Error:',
  'Try': 'Pruebe',
  'Files': 'Ficheros',
  'File': 'Ficheros',
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
  'Reset': 'Reiniciar',
  'Export to CSV': 'Exportar a CSV',
  'Agent Id': 'Agente',
  'Batches': 'De lote',
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
  // 'Back': 'Atrás',
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
  'Upload Audio': 'Subir audio',
  'Upload Text': 'Subir texto',
  'Maximum file size': 'Tamaño máximo de archivo',
  'Agent name': 'Nombre del agente',
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
  'I agree that my data is used, saved and processed by the NeoSound Intelligence B.V for the utilization of my account.': 'Estoy de acuerdo con que mis datos sean utilizados, guardados y procesados por NeoSound Intelligence B.V para la utilización de mi cuenta.',
  'I agree that my data is used, saved and processed by the': 'Estoy de acuerdo con que mis datos sean utilizados, guardados y procesados por',
  'for the utilization of my account.': 'para la utilización de mi cuenta.',
  'SIGN UP': 'REGÍSTRESE',
  'Already have an account?': '¿Ya tiene una cuenta?',
  'Login': 'Inicie sesión',
  // 'All': 'Todos',
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
  'Wrong credentials': 'Credenciales incorrectas',
  'Batch': 'De lote',
  'Total number of cells': 'Número total de celdas',
  'Cells with pauses higher than threshold': 'Celdas con pausas superiores al umbral.',
  'FILES': 'ARCHIVOS',
  'DETAILS': 'DETALLES',
  'Min.': 'Min.',
  'Max.': 'Max.',
  'Avg.': 'promedio',
  'Med.': 'Medio',
  'Keywords': 'Palabras Clave',
  'Show only keywords': 'Mostrar solo palabras clave',
  'Apply': 'Aplicar',
  'Show only calls with keywords': 'Mostrar solo llamadas con palabras clave',
  'Missing keywords': 'Palabras clave que faltan',
  'Containing keywords': 'Que contienen palabras clave',
  'Call Duration, minutes': 'Duración de llamada, minutos',
  'Call duration, minutes': 'Duración de llamada, minutos',
  'Dashboard': 'Tablero',
  'Log': 'Registro',
  'Back': 'Volver',
  'Most frequently used words': 'Palabras más utilizadas',

  // dashboard start
  'Welcome on board': "Bienvenido a bordo",
  'How to upload files': `Como subir archivos`,
  'Number of calls by top 6 agents': `Número de llamadas por top 6 agentes`,
  'Processed calls': `Llamadas procesadas`,
  'Calls': `Llamadas`,
  'Total number of calls': `Número total de llamadas`,
  'Emotional calls': `Llamadas emocionales`,
  'Number of calls with the emotion level above a threshold': `Número de llamadas con el nivel de emoción por encima de un umbral`,
  'Silent calls': `Llamadas silenciosas`,
  'Number of calls with the average pause longer than a threshold': `Número de llamadas con la pausa promedio más larga que un umbral`,
  'Performance by agent, by %': "Rendimiento por agente",
  'Popular Words': "Palabras Populares",
  'Popular Nouns': `Nombres populares`,
  'Popular Adjectives': "Adjetivos populares",
  'Popular Verbs': `Verbos populares`,
  'Popular Words 2': `Palabras Populares 2`,
  'Common keywords': 'Palabras clave comunes',
  'Use your username and password.': 'Usa tu nombre de usuario y contraseña.',
  'Number Of Calls': 'Número de llamadas',
  'All': 'Todas',
  'Emotional': 'Emocional',
  'Silence': 'Silencio',
  'Negative': 'Negativo',
  'Positive': 'Positivo',
  'Calls processed': 'Llamadas procesadas',
  'Total agents': 'Agentes totales',
  'API calls done': 'Llamadas hechas a la API',
  'Popular Words Sentiment': 'Emoción en palabras populares',
  'Stopwords': 'Palabras prohibidas',
  'Missing': 'Faltan',
  'Containing words': 'Contiene palabras',
  'Missing words': 'Palabras que faltan',
  'Filter calls with stopwords': 'Mostrar solo llamadas con palabras de parada',
  'Words': 'Palabras',
  'Filter calls with missing words': 'Mostrar solo llamadas con palabras faltantes',
  'Filter favorite calls': 'Mostrar solo llamadas favoritas',
  'Tags': 'Etiquetas',
  'Close': 'Cerrar',
  'Save': 'Guardar',
  'Add Tag': 'Añadir etiqueta',
  'Compliance': 'Conformidad',
  'Hits vs. Stopwords': 'Palabras prohibidas por popularidad',
  'Hits vs. Word': 'Palabras por popularidad',
  'Total minutes by agents': 'Volumen de audio, por agente',
  'Calls by days': 'Tipos de llamadas diarias',
  'Totals by queries': 'Consultas',
  'Total minutes by days': 'Volumen de audio diario',
  'SFTP Upload': 'Subir archivos a SFTP',
  'All agents': 'Total',
  'Avg sentiments by agents': 'Sentimientos promedio, por agente',
  'Sentiment calls by top 6 agents': 'Llamadas de sentimiento por top 6 agentes',
  'n/a': 'n/a',
  'Avg sentiments by days': 'Sentimientos promedio por días',
  'Sentiment calls by days': 'Llamadas de sentimiento por días',
  'Assessment by Agents': 'Valoración por agentes',
  'Assessment': 'Valoración',
  'Sentiment trends and Agents': 'Tendencias de sentimiento y agentes',
  'Sentiment Sankey': 'Sentimientos Sankey',
  'Sentiment Category': 'Categoría de sentimiento',
  'Key Term': 'Término clave',
  'File Upload Instructions': 'Instrucciones para cargar archivos',
  'Silent': 'Silenciosas',
  'Topics': 'Temas',
  'emotional speech': 'discurso emocional',
  'calm speech': 'discurso tranquilo',
  'silence': 'silencio'

  // dashboard end
};


const translationsRu = {
  'Error:': 'Ошибка:',
  'Try': 'Попробовать',
  'Files': 'Файлы',
  'File': 'Файл',
  'API': 'API',
  'About': 'О Нас',
  'Logout': 'Выход',
  'Created with ♥ by': 'Сделано с ♥ ',
  'Loading...': 'Загрузка...',
  'Loading': 'Загрузка',
  'Date': 'Дата',
  'from': 'от',
  'to': 'до',
  'Anger': 'Агрессия',
  'anger': 'агрессия',
  'Filter': 'Фильтр',
  'Reset Filter': 'Сбросить фильтр',
  'Reset': 'Сбросить',
  'Export to CSV': 'Экспорт в CSV',
  'Agent Id': 'Агент',
  'Batches': 'Батчи (агенты)',
  'Name': 'Имя',
  'Uploaded': 'Загружено',
  'Duration': 'Длительность',
  'Emotion': 'Эмоция',
  'emotion': 'эмоция',
  'Beta': 'Бета',
  'File details': 'Подробности',
  'Refresh': 'Обновить',
  'Delete': 'Удалить',
  'Details': 'Подробности',
  'Back': 'Назад',
  'Fit into window': 'Вписать в окно',
  'Happiness': 'Счастье',
  'Sadness': 'Грусть',
  'Neutral': 'Нейтральность',
  'Dominant emotion detected': 'Доминирующая эмоция определена',
  'Male': 'Мужской',
  'Female': 'Женский',
  'Teen': 'Подросток',
  'Adult': 'Взрослый',
  'Senior': 'Пожилой',
  'Are you agree with the result?': 'Вы согласны с результатом?',
  'Yes': 'Да',
  'No': 'Нет',
  'Thank you for reply!': 'Спасибо за ответ!',
  'Check another record': 'Попробовать другую запись',
  'Anger level': 'Сила эмоций',
  'Make a trial record or upload a file': 'Сделайте пробную запись или загрузите файл',
  'Start': 'Начать',
  'Upload': 'Загрузка',
  'Record': 'Запись',
  'UPLOAD': 'ЗАГРУЗКА',
  'RECORD': 'ЗАПИСЬ',
  'Upload Audio': 'Загрузить аудио',
  'Upload Text': 'Загрузить текст',
  'Maximum file size': 'Максимальный размер файла',
  'Agent name': 'Имя агента',
  'Recording': 'Идет запись',
  'You can upload only one file a time': 'Возможно загрузить только 1 файл за раз',
  'Drop file here or click to browse': 'Перетащите файлы сюда или нажмите для выбора',
  'Discard': 'Отменить',
  'Attach': 'Добавить',
  'Play': 'Проиграть',
  'Change': 'Заменить',
  'Results': 'Результаты',
  'Sign in': 'Войти',
  'Username': 'Имя пользователя',
  'Password': 'Пароль',
  'Remember me': 'Запомнить меня',
  "Don't have an account?": 'Нет аккаунта?',
  'Sign Up': 'Зарегистрироваться',
  'First name': 'Имя',
  'Last name': 'Фамилия',
  'Email': 'Email',
  'Access Code': 'Код доступа',
  'I have read the terms and conditions and privacy policy and agree to them': 'Я прочитал(а) правила использования и согласен с ними',
  'I agree that my data is used, saved and processed by the NeoSound Intelligence B.V for the utilization of my account.': 'Я согласен(на) с тем, что мои данные используются, хранятся и обрабатываются NeoSound Intelligence B.V. для нужд моей учетной записи',
  'I agree that my data is used, saved and processed by the': 'Я согласен(на) с тем, что мои данные используются, хранятся и обрабатываются',
  'for the utilization of my account.': 'для нужд моей учетной записи',
  'SIGN UP': 'ЗАРЕГИСТРИРОВАТЬСЯ',
  'Already have an account?': 'Уже есть аккаунт?',
  'Login': 'Войти',
  'All': 'Все',
  'Terms of Use': 'Правила использования',
  'Selected files total count': 'Количество выбранных файлов',
  '0 Files': '0 Файлов',
  'Avg.Pause': 'Сред.Пауза',
  'Search': 'Поиск',
  'Music': 'Музыка',
  'Merged': 'Объединен.',
  'Probs test': 'Тест проблем',
  'Text': 'Текст',
  'See details': 'Детали',
  'here': 'тут',
  'Sad': 'Грусть',
  'Happy': 'Счастье',
  'Total files on page': 'Всего файлов на странице',
  'out of': 'из',
  'previous': 'пред.',
  'next': 'след.',
  'On-hold': 'В ожидании',
  'Wrong credentials': 'Неправильные учетные данные',
  'Batch': 'Батч (агент)',
  'Total number of cells': 'Общее количество записей',
  'Cells with pauses higher than threshold': 'Записи с паузами выше порога',
  'FILES': 'ФАЙЛЫ',
  'DETAILS': 'ПОДРОБНОСТИ',
  'Min.': 'Mин.',
  'Max.': 'Mакс.',
  'Avg.': 'Средн.',
  'Med.': 'Медиана',
  'Keywords': 'Ключевые слова',
  'Show only keywords': 'Показать только ключевые слова',
  'Apply': 'Применить',
  'Show only calls with keywords': 'Только звонки с ключ.словами',
  'Missing keywords': 'Не содержат ключ.слова',
  'Missing': 'Ключ.слова',
  'Containing keywords': 'Содержат ключ.слова',
  'Call Duration, minutes': 'Продолжительность звонка, минут',
  'Call duration, minutes': 'Продолжительность звонка, минут',
  'Dashboard': 'Панель управления',
  'Log': 'Журнал',
  'Number Of Calls': 'Кол-во звонков',
  'Most frequently used words': 'Наиболее часто используемые слова',

  // dashboard start
  'Welcome on board': "Добро пожаловать",
  'How to upload files': `Как загружать файлы`,
  'Number of calls by top 6 agents': `Количество звонков по топ 6 агентам`,
  'Processed calls': `Обработанные звонки`,
  'Calls': 'Звонки',
  'Total number of calls': `Общее количество звонков`,
  'Emotional calls': `Эмоциональные звонки`,
  'Number of calls with the emotion level above a threshold': `Количество вызовов с уровнем эмоций выше порога`,
  'Silent calls': `Тихие звонки`,
  'Number of calls with the average pause longer than a threshold': `Количество вызовов со средней паузой, превышающей порог`,
  'Performance by agent, by %': "Производительность по агенту",
  'Popular Words': "Популярные слова",
  'Popular Nouns': `Популярные существительные`,
  'Popular Adjectives': "Популярные прилагательные",
  'Popular Verbs': `Популярные глаголы`,
  'Popular Words 2': `Популярные слова 2`,
  'Common keywords': 'Общие ключевые слова',
  'Use your username and password.': 'Введите имя пользователя и пароль',
  'Emotional': 'Эмоции',
  'Silence': 'Тишина',
  'Negative': 'Негатив',
  'Positive': 'Позитив',
  'Calls processed': 'Обработано звонков',
  'Total agents': 'Всего агентов',
  'API calls done': 'Звонков через API',
  'Popular Words Sentiment': 'Популярные сочетания слов',
  'Stopwords': 'Стоп-слова',
  'Containing words': 'Содержащие слова',
  'Missing words': 'Недостающие слова',
  'Filter calls with stopwords': 'Показывать только звонки со стоп-словами',
  'Words': 'Слова',
  'Filter calls with missing words': 'Показывать только звонки с пропущенными словами',
  'Filter favorite calls': 'Только отмеченные',
  'Tags': 'Метки',
  'Close': 'Закрыть',
  'Save': 'Сохранить',
  'Add Tag': 'Добавить метку',
  'Compliance': 'Соответствие',
  'Hits vs. Stopwords': 'Стоп-слова по популярности',
  'Hits vs. Word': 'Слова по популярности',
  'Total minutes by agents': 'Объём аудио, по агентам',
  'Calls by days': 'Типы звонков загруженные по дням',
  'Totals by queries': 'Запросы',
  'Total minutes by days': 'Объём аудио, загруженное по дням',
  'SFTP Upload': 'Загрузка файлов на SFTP',
  'All agents': 'Все агенты',
  'Avg sentiments by agents': 'Среднее по сентиментам, по агентам',
  'Sentiment calls by top 6 agents': 'Сентиментальные звонки по топ 6 агентам',
  'n/a': 'н/о',
  'Avg sentiments by days': 'Среднее по сентиментам, по дням',
  'Sentiment calls by days': 'Сентиментальные звонки по дням',
  'Assessment by Agents': 'Оценка агентов',
  'Assessment': 'Оценка',
  'Sentiment trends and Agents': 'Тренды сентиментов и агенты',
  'Sentiment Sankey': 'Сентименты, sankey',
  'Sentiment Category': 'Дерево сентиментов',
  'Key Term': 'Дерево ключевых слов',
  'File Upload Instructions': 'Инструкции по загрузке файлов',
  'Silent': 'Тихие',
  'Topics': 'Топики',
  'emotional speech': 'эмоциональная речь',
  'calm speech': 'спокойная речь',
  'silence': 'тишина'

  // dashboard end
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
      return translationsSp[text] || text;
    }
    if (current === 'ru') {
      return translationsRu[text] || text;
    }
  }
}
