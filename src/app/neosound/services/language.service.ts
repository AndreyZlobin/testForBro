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
  'Batch Id': 'Id de lote',
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
  'Number of calls by top 6 batches': `Número de llamadas por top 6 lotes`,
  'Processed calls': `Llamadas procesadas`,
  'Calls': `Llamadas`,
  'Total number of calls': `Número total de llamadas`,
  'Emotional calls': `Llamadas emocionales`,
  'Number of calls with the emotion level above a threshold': `Número de llamadas con el nivel de emoción por encima de un umbral`,
  'Silent calls': `Llamadas con demasiados silencio`,
  'Number of calls with the average pause longer than a threshold': `Número de llamadas con la pausa promedio más larga que un umbral`,
  'Performance by agent': "Rendimiento por agente",
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
  // 'Neutral': '',
  'Calls processed': 'Llamadas procesadas',
  'Batches uploaded': 'Lotes cargados',
  'API calls done': 'Llamadas hechas a la API',
  'Popular Words Sentiment': 'Emoción en palabras populares',


'To upload multiple the files please use any SFTP client application and the following credentials': `Para subir varios archivos, por favor use cualquier cliente SFTP
              Solicitud y las siguientes credenciales.`,
'Once connected, please open folder files, and create/upload the separate subfolders inside the folder "/files", e.g. "/files/batch_agent_X". Then upload the recordings inside the newly created subfolder.': `Una vez conectado, abra los archivos de la carpeta y cree / cargue subcarpetas separadas dentro de la carpeta ‘/ archivos", por ejemplo, "/ files / batch_agent_X". Luego sube las grabaciones dentro de la subcarpeta de nueva creación.`,
'Please, keep in mind, we support only the audio files in .wav and .mp3 formats at the moment. The files of any other formats will not be processed.': `Por favor, tenga en cuenta que solo admitimos los archivos de audio en .wav
                y formatos .mp3 en este momento. Los archivos de cualquier otro formato.
                no será procesado`,
'ATTENTION': 'ATENCIÓN',
'the files uploaded to the root of "/files" folder will not be processed. Make sure that they uploaded inside another subfolder, e.g. "/files/batch_agent_X". A batch name is required for successful processing. This way you will be able to filter on UI them as separate batches per agents.': `los archivos subidos a la raíz de
                La carpeta ‘/ files" no se procesará. Asegúrese de que
                cargado dentro de otra subcarpeta, por ejemplo, '/ files / batch_agent_X'.
                Se requiere un nombre de lote para un procesamiento exitoso. De esta manera usted
                será capaz de filtrarlos en la interfaz de usuario como lotes separados por
                agentes`,
'The files will start processing soon after uploading.': `Los archivos comenzarán a procesarse poco después de la carga.`,
'Once the files are processed they will appear on the UI and disappear from the files folder on SFTP.': `Una vez procesados los archivos, aparecerán en la interfaz de usuario y
                desaparecer de la carpeta de archivos en SFTP.`,
'To upload the files one by one,': `Para subir los archivos uno por uno,`,
'please use "Upload" link in the top menu. When a file is uploaded you will be redirected to the list of files. However, it will take a few minutes before the file is being processed and the data is available. The processing time depends on the audio file duration. To see the text, please go to file details by clicking the file name, then go the "Text" tab. For demo purposes, we suggest using files maximum of 4 minutes with human-friendly short file names.': `por favor use
                "Enlace" en el menú superior. Cuando un archivo es subido usted será
                Redirigido a la lista de archivos. Sin embargo, tomará unos pocos
                Minutos antes de que el archivo se esté procesando y los datos estén
                disponible. El tiempo de procesamiento depende de la duración del archivo de audio.
                Para ver el texto, vaya a los detalles del archivo haciendo clic en el archivo
                nombre, a continuación, vaya a la pestaña "Texto". Para fines de demostración, sugerimos utilizar
                archivos máximo de 4 minutos con nombres cortos de archivos amigables para el usuario.`,
  // dashboard end
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
  'Batch Id': 'Батч (агент)',
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
  'Neutral': 'Нейтрально',
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
  'Dashboard': 'Метрики',
  'Log': 'Журнал',
  'Number Of Calls': 'Кол-во звонков',
  'Most frequently used words': 'Наиболее часто используемые слова',

  // dashboard start
  'Welcome on board': "Добро пожаловать на борт",
  'How to upload files': `Как загружать файлы`,
  'Number of calls by top 6 batches': `Количество звонков по топ 6 агентам`,
  'Processed calls': `Обработанные звонки`,
  'Calls': 'Звонки',
  'Total number of calls': `Общее количество звонков`,
  'Emotional calls': `Эмоциональные звонки`,
  'Number of calls with the emotion level above a threshold': `Количество вызовов с уровнем эмоций выше порога`,
  'Silent calls': `Тихие звонки`,
  'Number of calls with the average pause longer than a threshold': `Количество вызовов со средней паузой, превышающей порог`,
  'Performance by agent': "Производительность по агенту",
  'Popular Words': "Популярные слова",
  'Popular Nouns': `Популярные существительные`,
  'Popular Adjectives': "Популярные прилагательные",
  'Popular Verbs': `Популярные глаголы`,
  'Popular Words 2': `Популярные слова 2`,
  'Common keywords': 'Общие ключевые слова',
  'Use your username and password.': 'Введите имя пользователя и пароль',

  'To upload multiple the files please use any SFTP client application and the following credentials': `Чтобы загрузить несколько файлов, пожалуйста, используйте любой SFTP-клиент
    приложение и следующие полномочия`,
'Once connected, please open folder files, and create/upload the separate subfolders inside the folder "/files", e.g. "/files/batch_agent_X". Then upload the recordings inside the newly created subfolder.': `После подключения, пожалуйста, откройте папку с файлами и создайте / загрузите
                  отдельные подпапки внутри папки «/ files», например
                  «/ Файлы / batch_agent_X». Затем загрузите записи внутри
                  недавно созданная подпапка.`,
  'Please, keep in mind, we support only the audio files in .wav and .mp3 formats at the moment. The files of any other formats will not be processed.': `Пожалуйста, имейте в виду, мы поддерживаем только аудио файлы в .wav
                  и форматы .mp3 на данный момент. Файлы любых других форматов
                  не будет обработан.`,
  'ATTENTION': 'ВНИМАНИЕ',
  'the files uploaded to the root of "/files" folder will not be processed. Make sure that they uploaded inside another subfolder, e.g. "/files/batch_agent_X". A batch name is required for successful processing. This way you will be able to filter on UI them as separate batches per agents.': `файлы загружены в корень
                 Папка «/ files» не будет обработана. Убедитесь, что они
                  загружены в другую подпапку, например, «/ Файлы / batch_agent_X».
                  Имя партии требуется для успешной обработки. Таким образом, вы
                  сможет фильтровать их по интерфейсу как отдельные
                  агенты.`,
  'The files will start processing soon after uploading.': `Файлы начнут обрабатываться вскоре после загрузки.`,
  'Once the files are processed they will appear on the UI and disappear from the files folder on SFTP.': `После обработки файлов они появятся в интерфейсе пользователя и
                  исчезнуть из папки с файлами на SFTP.`,
  'To upload the files one by one,': `Чтобы загрузить файлы по одному,`,
  'please use "Upload" link in the top menu. When a file is uploaded you will be redirected to the list of files. However, it will take a few minutes before the file is being processed and the data is available. The processing time depends on the audio file duration. To see the text, please go to file details by clicking the file name, then go the "Text" tab. For demo purposes, we suggest using files maximum of 4 minutes with human-friendly short file names.': `пожалуйста, используйте
                Ссылка «Загрузить» в верхнем меню. Когда файл загружен, вы будете
                перенаправлен в список файлов. Тем не менее, это займет несколько
                минут, прежде чем файл обрабатывается и данные
                имеется в наличии. Время обработки зависит от продолжительности аудио файла.
                Чтобы увидеть текст, пожалуйста, перейдите к деталям файла, нажав на файл
                имя, затем перейдите на вкладку «Текст». В демонстрационных целях мы предлагаем использовать
                максимум 4 минуты с понятными для человека короткими именами файлов.`,
    'Emotional': 'Эмоции',
    'Silence': 'Тишина',
    'Negative': 'Негатив',
    'Positive': 'Положительные',
    // 'Neutral': 'Нейтральные',
    'Calls processed': 'Обработано звонков',
    'Batches uploaded': 'Загружено агентов',
    'API calls done': 'Звонков через API',
    'Popular Words Sentiment': 'Популярные сочетания слов',
    // dashboard end

    'Stopwords': 'Стоп-слова',
    'Containing words': 'Содержащие слова',
    'Missing words': 'Недостающие слова',
    'Filter calls with stopwords': 'Показывать только звонки со стоп-словами',
    'Words': 'Слова',
    'Filter calls with missing words': 'Показывать только звонки с пропущенными словами',
    'Filter favorite calls': 'Показывать только любимые звонки',
    'Tags': 'Метки',
    'Close': 'Закрыть',
    'Save': 'Сохранить',
    'Add Tag': 'Добавить метку',
    'Compliance': 'Соответствие',
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
