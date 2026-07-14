const APP = {
  NAME: 'Agenda Impositiva',
  VERSION: '2.0.0',
  TZ: 'America/Argentina/Buenos_Aires',
  SHEET_ID_PROPERTY: '(ID_SHEET)',
  TELEGRAM_TOKEN_PROPERTY: '(TOKEN_TELEGRAM)',
  HOLIDAYS_URL: 'https://api.argentinadatos.com/v1/feriados',
  SESSION_HOURS_DEFAULT: 8,
  DEFAULT_NOTICE_HOUR: '08:00'
};

const SHEETS = {
  CLIENTES: 'Clientes',
  USUARIOS: 'Usuarios',
  IMPUESTOS: 'Impuestos',
  IMP_ASIGNADOS: 'Imp_Asignados',
  CALENDARIOS: 'Calendarios',
  VENCIMIENTOS: 'Vencimientos',
  COMENTARIOS: 'Comentarios',
  HISTORIAL: 'Historial',
  SESIONES: 'Sesiones',
  CONFIGURACION: 'Configuracion',
  NOTAS: 'Notas'
};

const HEADERS = {
  Clientes: ['ID_Cliente', 'Cliente', 'Cuit', 'TelegramId', 'Email', 'Activo', 'Fecha_Alta', 'Fecha_Modificacion'],
  Usuarios: ['ID_Usuario', 'Usuario', 'Nombre_Completo', 'Email', 'Password_Hash', 'Rol', 'Activo', 'Fecha_Alta', 'Ultimo_Acceso'],
  Impuestos: ['ID_Impuesto', 'Nombre_Impuesto', 'Activo'],
  Imp_Asignados: ['ID_Cliente', 'Impuesto', 'Observaciones'],
  Calendarios: ['Impuesto', 'Mes', 'Desde_Digito', 'Hasta_Digito', 'Dia_Vencimiento'],
  Vencimientos: ['ID_Vencimiento', 'ID_Cliente', 'Impuesto', 'Fecha_Vto', 'Estado', 'Proximo_Aviso', 'Comentario', 'Ultimo_Usuario', 'Fecha_Ultima_Modificacion'],
  Comentarios: ['ID_Comentario', 'ID_Vencimiento', 'Usuario', 'Fecha', 'Comentario'],
  Historial: ['ID_Historial', 'Fecha', 'Usuario', 'ID_Vencimiento', 'Accion_Campo', 'Valor_Anterior', 'Valor_Nuevo'],
  Sesiones: ['ID_Sesion', 'Usuario', 'Token', 'Fecha_Inicio', 'Fecha_Fin', 'Dispositivo', 'Activo'],
  Configuracion: ['Clave', 'Valor', 'Descripcion'],
  Notas: ['ID_Nota', 'Clave_Filtro', 'Detalle']
};

const ESTADOS = ['Pendiente', 'En Proceso', 'Para Control', 'Para Presentar', 'Presentado'];

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

