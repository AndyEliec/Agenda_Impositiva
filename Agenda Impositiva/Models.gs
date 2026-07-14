function getSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty(APP.SHEET_ID_PROPERTY);
  if (id) return SpreadsheetApp.openById(id);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error('Configure SPREADSHEET_ID en Propiedades del script o vincule el proyecto a un Sheet.');
}

function getSheet(name) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('No existe la hoja ' + name);
  return sheet;
}

function getRows(name) {
  const sheet = getSheet(name);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).filter(function(row) {
    return row.some(function(cell) { return cell !== ''; });
  }).map(function(row, index) {
    const obj = { _row: index + 2 };
    headers.forEach(function(header, i) { obj[header] = row[i]; });
    return obj;
  });
}

function appendRow(name, obj) {
  const sheet = getSheet(name);
  const headers = getHeaders(name);
  sheet.appendRow(headers.map(function(header) { return obj[header] === undefined ? '' : obj[header]; }));
}

function updateRow(name, rowNumber, obj) {
  const sheet = getSheet(name);
  const headers = getHeaders(name);
  const current = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  const next = headers.map(function(header, i) {
    return obj[header] === undefined ? current[i] : obj[header];
  });
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([next]);
}

function getHeaders(name) {
  const headers = getSheet(name).getRange(1, 1, 1, getSheet(name).getLastColumn()).getValues()[0];
  return headers.filter(String);
}

function findBy(name, key, value) {
  return getRows(name).find(function(row) { return String(row[key]) === String(value); });
}

function initDatabase() {
  const ss = getSpreadsheet();
  Object.keys(HEADERS).forEach(function(name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    const headers = HEADERS[name];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  });
  seedConfig();
  return success({ message: 'Base inicializada', sheets: Object.keys(HEADERS) });
}

function seedConfig() {
  const existing = getRows(SHEETS.CONFIGURACION).map(function(row) { return row.Clave; });
  const defaults = [
    { Clave: 'SESION_HORAS', Valor: String(APP.SESSION_HOURS_DEFAULT), Descripcion: 'Duracion maxima de la sesion web en horas.' },
    { Clave: 'TELEGRAM_NOTIFICAR_HORA', Valor: APP.DEFAULT_NOTICE_HOUR, Descripcion: 'Hora inicial de avisos para vencimientos.' }
  ];
  defaults.forEach(function(row) {
    if (existing.indexOf(row.Clave) === -1) appendRow(SHEETS.CONFIGURACION, row);
  });
}

function getConfigMap() {
  return getRows(SHEETS.CONFIGURACION).reduce(function(acc, row) {
    acc[row.Clave] = row.Valor;
    return acc;
  }, {});
}

function registrarUsuarioPorPrimeraVez(usuario, password, nombre, email) {
  initDatabase();
  const user = usuario || 'admin';
  if (findBy(SHEETS.USUARIOS, 'Usuario', user)) throw new Error('El usuario ya existe: ' + user);
  appendRow(SHEETS.USUARIOS, {
    ID_Usuario: makeId('USR'),
    Usuario: user,
    Nombre_Completo: nombre || 'Administrador',
    Email: email || '',
    Password_Hash: hashSha256(password || '(contraseña)'),
    Rol: 'ADMIN',
    Activo: 'SI',
    Fecha_Alta: now(),
    Ultimo_Acceso: '-'
  });
  return success({ usuario: user, passwordInicial: password ? undefined : 'admin123' });
}

function listClientes() {
  return getRows(SHEETS.CLIENTES).map(serializeRow);
}

function saveCliente(cliente, usuario) {
  const row = cliente.ID_Cliente ? findBy(SHEETS.CLIENTES, 'ID_Cliente', cliente.ID_Cliente) : null;
  const payload = {
    ID_Cliente: cliente.ID_Cliente || makeId('CLI'),
    Cliente: cliente.Cliente || '',
    Cuit: String(cliente.Cuit || '').replace(/\D/g, ''),
    TelegramId: cliente.TelegramId || '',
    Email: cliente.Email || '',
    Activo: cliente.Activo || 'SI',
    Fecha_Alta: row ? row.Fecha_Alta : now(),
    Fecha_Modificacion: now()
  };
  if (row) updateRow(SHEETS.CLIENTES, row._row, payload); else appendRow(SHEETS.CLIENTES, payload);
  audit(usuario, payload.ID_Cliente, row ? 'CLIENTE_EDIT' : 'CLIENTE_NEW', '-', payload.Cliente);
  return success({ cliente: serializeRow(payload) });
}

function listImpuestos() {
  return getRows(SHEETS.IMPUESTOS).map(serializeRow);
}

function saveImpuesto(impuesto, usuario) {
  const row = impuesto.ID_Impuesto ? findBy(SHEETS.IMPUESTOS, 'ID_Impuesto', impuesto.ID_Impuesto) : null;
  const payload = {
    ID_Impuesto: impuesto.ID_Impuesto || makeId('IMP'),
    Nombre_Impuesto: impuesto.Nombre_Impuesto || '',
    Activo: impuesto.Activo || 'SI'
  };
  if (row) updateRow(SHEETS.IMPUESTOS, row._row, payload); else appendRow(SHEETS.IMPUESTOS, payload);
  audit(usuario, payload.ID_Impuesto, row ? 'IMPUESTO_EDIT' : 'IMPUESTO_NEW', '-', payload.Nombre_Impuesto);
  return success({ impuesto: payload });
}

function listUsuarios() {
  return getRows(SHEETS.USUARIOS).map(function(row) {
    const item = serializeRow(row);
    delete item.Password_Hash;
    return item;
  });
}

function serializeRow(row) {
  const copy = {};
  Object.keys(row).forEach(function(key) {
    if (key === '_row') return;
    copy[key] = row[key] instanceof Date ? formatDate(row[key]) : row[key];
  });
  return copy;
}

function audit(usuario, idVencimiento, campo, anterior, nuevo) {
  appendRow(SHEETS.HISTORIAL, {
    ID_Historial: makeId('HIS'),
    Fecha: now(),
    Usuario: usuario || '-',
    ID_Vencimiento: idVencimiento || '-',
    Accion_Campo: campo,
    Valor_Anterior: anterior === undefined ? '-' : anterior,
    Valor_Nuevo: nuevo === undefined ? '-' : nuevo
  });
}

