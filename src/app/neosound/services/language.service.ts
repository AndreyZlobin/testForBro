import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

const translationsSp = {
  'Error:': 'Error:',
  'Try': 'Pruebe',
  'Files': 'Ficheros',
  'File': 'Ficher',
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
  'Upload Audio': 'Cargar audio',
  'Upload Text': 'Cargar texto',
  'Maximum file size': 'Tamaño máximo del archivo',
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

  // file list
  'Selected files total count': 'Cantidad total de archivos seleccionados',
  '0 Files': '0 archivos',
  'Avg.Pause': 'Pausa media',
  'Tot.Pause, minutes': 'Pausa total (minutos)',
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
  'Missing compliance words': 'Faltan palabras de cumplimiento',
  'Show only keywords': 'Mostrar solo palabras clave',
  'Apply': 'Aplicar',
  'Show only calls with keywords': 'Mostrar solo llamadas con palabras clave',
  'Missing keywords': 'Palabras clave que faltan',
  'Containing keywords': 'Que contienen palabras clave',
  'Everywhere': 'En todos',
  'Agent': 'Agente',
  'Customer': 'Cliente',
  'Log': 'Registro',
  'Back': 'Volver',
  'Sort': 'Ordenar',
  'Sentiment trend': 'Tendencia del sentimiento',
  'Average emotion': 'Emoción media',
  'Comments': 'Comentarios',
  'Pauses': 'Pausas',
  'Edit tags': 'Editar etiquetas',
  'Select trend': 'Seleccionar tendencia',
  'No trend': 'Sin tendencia',
  'Agent: A..Z': 'Agente: A..Z',
  'Agent: Z..A': 'Agente: Z..A',
  'Date and time: Newly Uploaded': 'Fecha y hora: recién subido',
  'Avg. Pause: Short to Long': 'Media Pausa: corta a larga',
  'Tot. Pause: Long to Short': 'Pausa total: larga a corta',
  'Stopwords: Max to Min': 'Palabras clave: máx a mín',
  'Compliance: Low to High': 'Cumplimiento: bajo a alto',
  'Compliance: High to Low': 'Cumplimiento: alto a bajo',
  'Emotion: High to Low': 'Emoción: alto a bajo',

  // file result
  'Back to List': 'Volver a la lista',

  // dashboard start
  'Call Duration, minutes': 'Duración de llamada, minutos',
  'Call duration, minutes': 'Duración de llamada, minutos',
  'Dashboard': 'Tablero',
  'Most frequently used words': 'Palabras más utilizadas',
  'Welcome on board': "Bienvenido a bordo",
  'How to upload files': `Como subir archivos`,
  'Number of calls by top 6 agents': `Número de llamadas por top 6 agentes`,
  'Processed calls': `Llamadas procesadas`,
  'Calls': `Llamadas`,
  'Total number of calls': `Número total de llamadas`,
  'Emotional calls, %': `Llamadas emocionales (%)`,
  'Number of calls with the emotion level above a threshold': `Número de llamadas con el nivel de emoción por encima de un umbral`,
  'Silent calls, %': `Llamadas con silencios (%)`,
  'Number of calls with the average pause longer than a threshold': `Número de llamadas con la pausa promedio más larga que un umbral`,
  'Performance by agent, by %': "Rendimiento por agente, por porcentaje",
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
  'With stop words': 'Con palabras de parada',
  'Without compliance words': 'Sin palabras de cumplimiento',
  'Words': 'Palabras',
  'Favorite calls': 'Llamadas favoritas',
  'Tags': 'Etiquetas',
  'Close': 'Cerrar',
  'Save': 'Guardar',
  'Add Tag': 'Añadir etiqueta',
  'Compliance': 'Conformidad',
  'Hits vs. Stopwords': 'Palabras prohibidas por popularidad',
  'Hits vs. Word': 'Palabras por popularidad',
  'Total minutes by agents': 'Total de minutos por agente',
  'Calls by days': 'Llamadas por día',
  'Totals by queries': 'Total por consultas',
  'Total minutes by days': 'Total minutos por día',
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
  'emotional speech': 'conversación emocional',
  'calm speech': 'conversación tranquila',
  'silence': 'silencio',

  // config pop-up
  'Dashboard config': 'Configuración del tablero',
  'Texts': 'Textos',
  'Date range': 'Rango de fechas',
  // dashboard end

  // company settings
  'Setup Keywords': 'Configuración de palabras clave',
  'Setup Sensitive Data': 'Configuración de datos sensibles',
  'Setup Checklist': 'Configuración de lista de verificación',
  'Compliance words': 'Palabras de conformidad',
  'Sentiment words': 'Palabras de sentimiento',
  'Settings': 'Configuración',
  'Names dictionary': 'Diccionario de nombres',
  'Enable reduction Dictionary names': 'Permitir reducción de nombres de diccionario',
  'stopword': 'palabra de prohibida',
  'stopwords': 'palabras prohibidas',
  'Input stopwords separated by comma or add stopwords by uploading CSV':
    'Introduzca las palabras prohibidas separadas por comas o añádalas cargando un fichero CSV',
  'Total stopwords': 'Total palabras prohibidas',
  'compliance word': 'palabra de conformidad',
  'compliance words': 'palabras de conformidad',
  'Input compliance words separated by comma or add compliance words by uploading CSV':
    'Introduzca las palabras de conformidad separadas por comas o añádalas cargando un fichero CSV',
  'Total compliance words': 'Total palabras de conformidad',
  'sentiment word': 'palabra de sentimiento',
  'sentiment words': 'palabras de sentimiento',
  'Input sentiment words separated by comma or ad compliance words by uploading CSV':
    'Introduzca las palabras de sentimiento separadas por comas o añádalas cargando un fichero CSV',
  'Total sentiment words': 'Total palabras de sentimiento',
  'name': 'nombre',
  'names': 'nombres',
  'Input names separated by comma or add names by uploading CSV':
    'Introduzca los nombres separados por coma o añádalos cargando un fichero CSV',
  'Total names words': 'Total nombres',

  // company settings, keywords component
  'Download as CSV': 'Descargar como CSV',
  'Import as CSV': 'Importar como CSV',
  'just': 'recién',
  'removed': 'quitadas',
  'added': 'añadidas',
  'Re-indexing is working now. Started: ': 'La reindexación está funcionando ahora. Empezado: ',
  'Redaction is working now. Started: ': 'La redacción está funcionando ahora. Empezado: ',
  'Relaunch files processing': 'Relanzar procesado de archivos',
  'Remove All': 'Quitar Todas',
  'Please confirm, all ': 'Confirme que todos ',
  ' will be eliminated from the company settings.': ' serán eliminados de la configuración de la compañía.',
  'You will not be able to perform the next re-indexing until this request is completed. Please click Confirm to proceed or Cancel to review the settings.':
    'No podrá realizar la próxima reindexación hasta que se complete esta solicitud. Haga clic en Confirmar para continuar o en Cancelar para revisar la configuración.',
  'This action involves audio data redaction. Depending on the volume of the stored audio data, this operation can take up to a few days.You will not be able to perform the next redaction until this request is completed. Please click Confirm to proceed or Cancel to review the settings.':
    'Esta acción implica la redacción de datos de audio. Dependiendo del volumen de los datos de audio almacenados, esta operación puede demorar algunos días. No podrá realizar la próxima redacción hasta que se complete esta solicitud. Haga clic en Confirmar para continuar o en Cancelar para revisar la configuración.',
  'Confirm': 'Confirmar',
  'Cancel': 'Cancelar',
  'Just ': 'Recién ',
  'This updated set of ': 'Este conjunto actualizado de ',
  ' will be applied automatically to all new uploaded calls': ' se aplicará automáticamente a todas las nuevas llamadas cargadas',
  'Saved': 'Salvado',
  'You have unsaved ': 'Tiene ',
  '. If you leave, your changes will be lost.': ' sin guardar. Si sale perderá los cambios.',

  // company settings, check-list component
  'Check-list': 'Lista de verificación',

  // text files list
  'Text files': 'Archivos de texto'
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

  // file list
  'Selected files total count': 'Количество выбранных файлов',
  '0 Files': '0 Файлов',
  'Avg.Pause': 'Сред.Пауза',
  'Tot.Pause, minutes': 'Общая длина пауз, в минутах',
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
  'Missing compliance words': 'Пропущены обязательные слова',
  'Show only keywords': 'Показать только ключевые слова',
  'Apply': 'Применить',
  'Show only calls with keywords': 'Только звонки с ключ.словами',
  'Missing keywords': 'Не содержат ключ.слова',
  'Missing': 'Ключ.слова',
  'Containing keywords': 'Содержат ключ.слова',
  'Everywhere': 'Вcюду',
  'Agent': 'Оператор',
  'Customer': 'Клиент',
  'Log': 'Журнал',
  'Sort': 'Сортировка',
  'Sentiment trend': 'Тренд сентиментов',
  'Average emotion': 'Уровень эмоций',
  'Comments': 'Комментарии',
  'Pauses': 'Паузы',
  'Edit tags': 'Изменить метки',
  'Select trend': 'Выбрать тренд',
  'No trend': 'Без тренда',
  'Agent: A..Z': 'Агент: А..Я',
  'Agent: Z..A': 'Агент: Я..А',
  'Date and time: Newly Uploaded': 'Время загрузки: Новые сверху',
  'Avg. Pause: Short to Long': 'Средняя пауза: мин - макс',
  'Tot. Pause: Long to Short': 'Общая пауза: макс - мин',
  'Stopwords: Max to Min': 'Кол-во стоп-слов: макс - мин',
  'Compliance: Low to High': 'Соответствие: мин - макс',
  'Compliance: High to Low': 'Соответствие: макс - мин',
  'Emotion: High to Low': 'Эмоции: макс - мин',

  // file result
  'Back to List': 'Обратно к списку файлов',

  // dashboard start
  'Call Duration, minutes': 'Продолжительность звонка, минут',
  'Call duration, minutes': 'Продолжительность звонка, минут',
  'Dashboard': 'Панель управления',
  'Number Of Calls': 'Кол-во звонков',
  'Most frequently used words': 'Наиболее часто используемые слова',
  'Welcome on board': "Добро пожаловать",
  'How to upload files': `Как загружать файлы`,
  'Number of calls by top 6 agents': `Количество звонков по топ 6 агентам`,
  'Processed calls': `Обработанные звонки`,
  'Calls': 'Звонки',
  'Total number of calls': `Общее количество звонков`,
  'Emotional calls, %': `Эмоциональные звонки, %`,
  'Number of calls with the emotion level above a threshold': `Количество вызовов с уровнем эмоций выше порога`,
  'Silent calls, %': `Тихие звонки, %`,
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
  'With stop words': 'Со стоп-словами',
  'Without compliance words': 'Без пропущенных слов',
  'Words': 'Слова',
  'Favorite calls': 'Только отмеченные',
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
  'silence': 'тишина',

  // config pop-up
  'Dashboard config': 'Конфигурация панели управления',
  'Texts': 'Текста',
  'Date range': 'Диапазон дат',
  // dashboard end

  // company settings
  'Setup Keywords': 'Настройка стоп-слов',
  'Setup Sensitive Data': 'Настройка конфиденциальных данных',
  'Setup Checklist': 'Настройка чек листа',
  'Compliance words': 'Обязательные слова',
  'Sentiment words': 'Слова Сентиментов',
  'Settings': 'Настройка',
  'Names dictionary': 'Словарь имен',
  'Enable reduction Dictionary names': 'Включить скрытие имен из словаря',
  'stopword': 'стоп-слово',
  'stopwords': 'стоп-слова',
  'Input stopwords separated by comma or add stopwords by uploading CSV':
    'Введите стоп-слова, разделенные запятой, или загрузите CSV файл со стоп-словами',
  'Total stopwords': 'Количество стоп-слов',
  'compliance word': 'обязательное слово',
  'compliance words': 'обязательные слова',
  'Input compliance words separated by comma or add compliance words by uploading CSV':
    'Введите обязательные слова, разделенные запятой, или загрузите CSV файл с обязательными словами',
  'Total compliance words': 'Количество обязательных слов',
  'sentiment word': 'сентимент-слово',
  'sentiment words': 'слова сентиментов',
  'Input sentiment words separated by comma or add compliance words by uploading CSV':
    'Введите слова сентиментов, разделенные запятой, или загрузите CSV файл со словами сентиментов',
  'Total sentiment words': 'Количество слов сентиментов',
  'name': 'имя',
  'names': 'имена',
  'Input names separated by comma or add names by uploading CSV':
    'Введите имена, разделенные запятой, или загрузите CSV файл с именами',
  'Total names words': 'Количество имен',

  // company settings, keywords component
  'Download as CSV': 'Скачать в CSV',
  'Import as CSV': 'Загрузить CSV',
  'just': 'Просто',
  'removed': 'удалены',
  'added': 'добавлены',
  'Re-indexing is working now. Started: ': 'Процесс индексации запущен. Время начала: ',
  'Redaction is working now. Started: ': 'Процесс сокрытия имен запущен. Время начала: ',
  'Relaunch files processing': 'Перезапустить обработку файлов',
  'Remove All': 'Удалить Все',
  'Please confirm, all ': 'Пожалуйста подтвердите, все ',
  ' will be eliminated from the company settings.': ' будут удалены из настроек компании.',
  'You will not be able to perform the next re-indexing until this request is completed. Please click Confirm to proceed or Cancel to review the settings.':
    'Вы не можете выполнить переиндексацию, пока текущий запрос не будет выполнен. Нажмите Подтвердить, чтобы продолжить, или Отмена, чтобы просмотреть настройки.',
  'This action involves audio data redaction. Depending on the volume of the stored audio data, this operation can take up to a few days.You will not be able to perform the next redaction until this request is completed. Please click Confirm to proceed or Cancel to review the settings.':
    'Это действие включает редактирование аудиоданных. В зависимости от объема хранимых аудиоданных эта операция может занять до нескольких дней. Вы не сможете выполнить следующее редактирование, пока этот запрос не будет выполнен. Пожалуйста, нажмите Подтвердить, чтобы продолжить, или Отмена, чтобы просмотреть настройки.',
  'Confirm': 'Подтвердить',
  'Cancel': 'Отмена',
  'Just ': 'Просто ',
  'This updated set of ': 'Обновленный набор ',
  ' will be applied automatically to all new uploaded calls': ' будет применен ко всем новым загруженным звонкам',
  'Saved': 'Сохранено',
  'You have unsaved ': 'Вы не сохранили ',
  '. If you leave, your changes will be lost.': ' . Если вы покинете страницу, то изменения будут потеряны.',

  // company settings, check-list component
  'Check-list': 'Чек лист',

  // text files list
  'Text files': 'Текстовые файлы'
};


const translationsPt = {
  'Error:': 'Erro:',
  'Try': 'Tentar',
  'Files': 'Arquivos',
  'File': 'Arquivo',
  'API': 'API',
  'About': 'Sobre',
  'Logout': 'Sair',
  'Created with ♥ by': 'Criado com ♥ por',
  'Loading...': 'Carregando...',
  'Loading': 'Carregando',
  'Date': 'Encontro',
  'from': 'desde',
  'to': 'para',
  'Anger': 'Raiva',
  'anger': 'raiva',
  'Filter': 'Filtro',
  'Reset Filter': 'Redefinir filtro',
  'Reset': 'Redefinir',
  'Export to CSV': 'Exportar para CSV',
  'Agent Id': 'Agente',
  'Batches': 'Lotes',
  'Name': 'Nome',
  'Uploaded': 'Carregado',
  'Duration': 'Duração',
  'Emotion': 'Emoção',
  'emotion': 'emoção',
  'Beta': 'Beta',
  'File details': 'Detalhes do arquivo',
  'Refresh': 'Refrescar',
  'Delete': 'Apagar',
  'Details': 'Detalhes',
  // 'Back': 'Costas',
  'Fit into window': 'Ajustar na janela',
  'Happiness': 'Alegria',
  'Sadness': 'Tristeza',
  'Neutral': 'Neutro',
  'Dominant emotion detected': 'Emoção dominante detectada',
  'Male': 'Masculino',
  'Female': 'Fêmea',
  'Teen': 'Adolescente',
  'Adult': 'Adulto',
  'Senior': 'Senior',
  'Are you agree with the result?': 'Você concorda com o resultado?',
  'Yes': 'Sim',
  'No': 'Não',
  'Thank you for reply!': 'Obrigado pela resposta!',
  'Check another record': 'Verifique outro registro',
  'Anger level': 'Nível de raiva',
  'Make a trial record or upload a file': 'Faça um registro de avaliação ou faça upload de um arquivo',
  'Start': 'Começar',
  'Upload': 'Envio',
  'Record': 'Gravar',
  'UPLOAD': 'Envio',
  'RECORD': 'Gravar',
  'Upload Audio': 'Carregar áudio',
  'Upload Text': 'Carregar texto',
  'Maximum file size': 'Tamanho máximo do arquivo',
  'Agent name': 'Nome do agente',
  'Recording': 'Gravação',
  'You can upload only one file a time': 'Você pode enviar apenas um arquivo por vez',
  'Drop file here or click to browse': 'Solte o arquivo aqui ou clique para navegar',
  'Discard': 'Descartar',
  'Attach': 'Anexar',
  'Play': 'Toque',
  'Change': 'Mudança',
  'Results': 'Resultados',
  'Sign in': 'Conectar',
  'Username': 'Nome do usuário',
  'Password': 'Senha',
  'Remember me': 'Lembre de mim',
  "Don't have an account?": 'Não possui uma conta?',
  'Sign Up': 'Inscrever-se',
  'First name': 'Primeiro nome',
  'Last name': 'Último nome',
  'Email': 'O email',
  'Access Code': 'Código de acesso',
  'I have read the terms and conditions and privacy policy and agree to them': 'Li os termos e condições e a política de privacidade e concordo com eles',
  'I agree that my data is used, saved and processed by the NeoSound Intelligence B.V for the utilization of my account.': 'Concordo que meus dados são usados, salvos e processados pelo NeoSound Intelligence B.V para utilização da minha conta.',
  'I agree that my data is used, saved and processed by the': 'Concordo que meus dados sejam usados, salvos e processados pelo',
  'for the utilization of my account.': 'pela utilização da minha conta.',
  'SIGN UP': 'INSCREVER-SE',
  'Already have an account?': 'Já tem uma conta?',
  'Login': 'Conecte-se',
  // 'All': 'Todos',
  'Terms of Use': 'Termos de uso',

  // file list
  'Selected files total count': 'Contagem total de arquivos selecionados',
  '0 Files': '0 arquivos',
  'Avg.Pause': 'Pausa média',
  'Tot.Pause, minutes': 'Intervalo total (minutos)',
  'Search': 'Procurar',
  'Music': 'Música',
  'Merged': 'Fundido',
  'Probs test': 'Teste de Probs',
  'Text': 'Texto',
  'See details': 'Veja detalhes',
  'here': 'aqui',
  'Sad': 'Triste',
  'Happy': 'Feliz',
  'Total files on page': 'Total de arquivos na página',
  'out of': 'fora de',
  'previous': 'anterior',
  'next': 'próximo',
  'On-hold': 'Em espera',
  'Wrong credentials': 'Credenciais erradas',
  'Batch': 'Lote',
  'Total number of cells': 'Número total de células',
  'Cells with pauses higher than threshold': 'Células com pausas acima do limite',
  'FILES': 'ARQUIVOS',
  'DETAILS': 'DETALHES',
  'Min.': 'Mín.',
  'Max.': 'Máx.',
  'Avg.': 'Média',
  'Med.': 'Médio',
  'Keywords': 'Palavras-chave',
  'Missing compliance words': 'Faltam palavras de conformidade',
  'Show only keywords': 'Mostrar apenas palavras-chave',
  'Apply': 'Aplique',
  'Show only calls with keywords': 'Mostrar apenas chamadas com palavras-chave',
  'Missing keywords': 'Palavras-chave ausentes',
  'Containing keywords': 'Contendo palavras-chave',
  'Everywhere': 'Em todos',
  'Agent': 'Agente',
  'Customer': 'Cliente',
  'Log': 'Registro',
  'Back': 'Costas',
  'Sort': 'Ordenar',
  'Sentiment trend': 'Tendência de sentimentos',
  'Average emotion': 'Emoção média',
  'Comments': 'Comentários',
  'Pauses': 'Pausas',
  'Edit tags': 'Editar etiquetas',
  'Select trend': 'Selecionar tendência',
  'No trend': 'Nenhuma tendência',
  'Agent: A..Z': 'Agente: A..Z',
  'Agent: Z..A': 'Agente: Z..A',
  'Date and time: Newly Uploaded': 'Data e hora: recém-carregado',
  'Avg. Pause: Short to Long': 'Meia pausa: curta a longa',
  'Tot. Pause: Long to Short': 'Pausa completa: longa a curta',
  'Stopwords: Max to Min': 'Palavras-chave: max to min',
  'Compliance: Low to High': 'Conformidade: baixo para alto',
  'Compliance: High to Low': 'Conformidade: alto para baixo',
  'Emotion: High to Low': 'Emoção: alta para baixa',

  // file result
  'Back to List': 'De volta à lista',

  // dashboard start
  'Call Duration, minutes': 'Duração da chamada, minutos',
  'Call duration, minutes': 'Duração da chamada, minutos',
  'Dashboard': 'Conselho',
  'Most frequently used words': 'Palavras usadas com mais frequência',
  'Welcome on board': 'Bem-vindo a bordo',
  'How to upload files': `Como fazer upload de arquivos`,
  'Number of calls by top 6 agents': `Número de chamadas pelos 6 principais agentes`,
  'Processed calls': `Chamadas processadas`,
  'Calls': `Chamadas`,
  'Total number of calls': `Número total de chamadas`,
  'Emotional calls, %': `Chamadas emocionais, %`,
  'Number of calls with the emotion level above a threshold': `Número de chamadas com o nível de emoção acima de um limite`,
  'Silent calls, %': `Chamadas silenciosas, %`,
  'Number of calls with the average pause longer than a threshold': `Número de chamadas com uma pausa média maior que um limite`,
  'Performance by agent, by %': 'Rendimento por agente',
  'Popular Words': 'Palavras Populares',
  'Popular Nouns': 'Substantivos Populares',
  'Popular Adjectives': 'Adjetivos populares',
  'Popular Verbs': 'Verbos Populares',
  'Popular Words 2': 'Verbos Populares 2',
  'Common keywords': 'Palavras-chave comuns',
  'Use your username and password.': 'Use seu nome de usuário e senha.',
  'Number Of Calls': 'Número de chamadas',
  'All': 'Todos',
  'Emotional': 'Emocional',
  'Silence': 'Silêncio',
  'Negative': 'Negativo',
  'Positive': 'Positivo',
  'Calls processed': 'Chamadas processadas',
  'Total agents': 'Total de agentes',
  'API calls done': 'Chamadas de API feitas',
  'Popular Words Sentiment': 'Palavras populares Sentimento',
  'Stopwords': 'Palavras-chave',
  'Missing': 'Ausência de',
  'With stop words': 'Com palavras de parada',
  'Without compliance words': 'Sem palavras de conformidade',
  'Words': 'Palavras',
  'Favorite calls': 'Chamadas favoritas',
  'Tags': 'Etiquetas',
  'Close': 'Fechar',
  'Save': 'Salvar',
  'Add Tag': 'Adicionar etiqueta',
  'Compliance': 'Conformidade',
  'Hits vs. Stopwords': 'Repeticiones de palabras prohibidas',
  'Hits vs. Word': 'Palavras por popularidade',
  'Total minutes by agents': 'Total de minutos por agente',
  'Calls by days': 'Chamadas por dia',
  'Totals by queries': 'Total para consultas',
  'Total minutes by days': 'Total de minutos por dia',
  'SFTP Upload': 'Carregar arquivos para SFTP',
  'All agents': 'Total',
  'Avg sentiments by agents': 'Média de sentimentos, por agente',
  'Sentiment calls by top 6 agents': 'Chamadas de sentimentos pelos 6 principais agentes',
  'n/a': 'n/a',
  'Avg sentiments by days': 'Média de sentimentos por dia',
  'Sentiment calls by days': 'Sentir chamadas por dias',
  'Assessment by Agents': 'Avaliação por Agentes',
  'Assessment': 'Avaliação',
  'Sentiment trends and Agents': 'Tendências de sentimentos e agentes',
  'Sentiment Sankey': 'Sentimento Sankey',
  'Sentiment Category': 'Categoria de sentimentos',
  'Key Term': 'Termo-chave',
  'File Upload Instructions': 'Instruções para Upload de Arquivos',
  'Silent': 'Silencioso',
  'Topics': 'Tópicos',
  'emotional speech': 'conversa emocional',
  'calm speech': 'conversa tranquila',
  'silence': 'silêncio',

  // config pop-up
  'Dashboard config': 'Configuração do painel',
  'Texts': 'Textos',
  'Date range': 'Período',
  // dashboard end

  // company settings
  'Setup Keywords': 'Configurações de palavras-chave',
  'Setup Sensitive Data': 'Configurações de dados confidenciais',
  'Setup Checklist': 'Configurações da lista de verificação',
  'Compliance words': 'Palavras de conformidade',
  'Sentiment words': 'Palavras de sentimento',
  'Settings': 'Configuração',
  'Names dictionary': 'Dicionário de nomes',
  'Enable reduction Dictionary names': 'Permitir redução de nomes de dicionário',
  'stopword': 'palavra proibida',
  'stopwords': 'palavras proibidas',
  'Input stopwords separated by comma or add stopwords by uploading CSV':
    'Digite as palavras proibidas separadas por vírgulas ou adicione-as carregando um arquivo CSV',
  'Total stopwords': 'Total de palavras proibidas',
  'compliance word': 'palavra de conformidade',
  'compliance words': 'palavras de conformidade',
  'Input compliance words separated by comma or add compliance words by uploading CSV':
    'Digite as palavras de conformidade separadas por vírgulas ou adicione-as carregando um arquivo CSV',
  'Total compliance words': 'Total de palavras de conformidade',
  'sentiment word': 'sentindo a palavra',
  'sentiment words': 'sentindo palavras',
  'Input sentiment words separated by comma or add compliance words by uploading CSV':
    'Digite as palavras de sentimento separadas por vírgulas ou adicione-as carregando um arquivo CSV',
  'Total sentiment words': 'Total de palavras de sentimento',
  'name': 'nome',
  'names': 'nomes',
  'Input names separated by comma or add names by uploading CSV':
    'Digite os nomes separados por vírgulas ou adicione-os carregando um arquivo CSV',
  'Total names words': 'Total de nomes',

  // company settings, keywords component
  'Download as CSV': 'Transferir como CSV',
  'Import as CSV': 'Importar como CSV',
  'just': 'apenas',
  'removed': 'quitadas',
  'added': 'adicionado',
  'Re-indexing is working now. Started: ': 'A re-indexação está funcionando agora. Iniciado:',
  'Redaction is working now. Started: ': 'A redação está trabalhando agora. Iniciado:',
  'Relaunch files processing': 'Repita o processamento do arquivo',
  'Remove All': 'Remover tudo',
  'Please confirm, all ': 'Confirme se todos ',
  ' will be eliminated from the company settings.': ' eles serão removidos das configurações da empresa.',
  'You will not be able to perform the next re-indexing until this request is completed. Please click Confirm to proceed or Cancel to review the settings.':
    'Você não poderá executar a próxima reindexação até que esta solicitação seja concluída. Clique em Confirmar para continuar ou Cancelar para revisar as configurações.',
  'This action involves audio data redaction. Depending on the volume of the stored audio data, this operation can take up to a few days.You will not be able to perform the next redaction until this request is completed. Please click Confirm to proceed or Cancel to review the settings.':
    'Esta ação envolve a gravação de dados de áudio. Dependendo do volume dos dados de áudio armazenados, esta operação pode demorar alguns dias. Você não poderá fazer a próxima edição até que este aplicativo seja concluído. Clique em Confirmar para continuar ou Cancelar para revisar as configurações.',
  'Confirm': 'Confirme',
  'Cancel': 'Cancelar',
  'Just ': 'Apenas ',
  'This updated set of ': 'Este conjunto atualizado de ',
  ' will be applied automatically to all new uploaded calls': ' ele será aplicado automaticamente a todas as novas chamadas carregadas',
  'Saved': 'Bran',
  'You have unsaved ': 'Tenha ',
  '. If you leave, your changes will be lost.': ' sem salvar. Se você sair, perderá as alterações.',

  // company settings, check-list component
  'Check-list': 'Lista de verificação',

  // text files list
  'Text files': 'Arquivos de texto'
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
    if (current === 'pt') {
      return translationsPt[text] || text;
    }
  }
}
