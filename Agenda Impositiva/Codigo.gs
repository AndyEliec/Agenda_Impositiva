/******************************************************************
 * COMENTARIOS & VENCIMIENTOS EXTENDED CONTROLLER
 ******************************************************************/

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(APP.NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  return handleTelegramWebhook(e);
}

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}

// --- API DE AUTENTICACIÓN & SESIONES ---
function apiLogin(usuario, password, dispositivo) { return login(usuario, password, dispositivo); }
function apiLogout(token) { return logout(token); }
function apiBootstrap(token) {
  const session = requireSession(token);
  return { 
    ok: true, 
    app: APP.NAME, 
    version: APP.VERSION, 
    usuario: session, 
    estados: ESTADOS, 
    config: getConfigMap() };
}

// --- API GESTIÓN OPERATIVA (DASHBOARD & CALENDARIO) ---
function apiDashboard(token, year, month) {
  requireSession(token);
  return getDashboardData(Number(year), Number(month));
}

function apiCalendar(token, year, month) {
  requireSession(token);
  return getCalendarData(Number(year), Number(month));
}

function apiUpdateVencimiento(token, idVencimiento, patch) {
  const session = requireSession(token);
  return updateVencimiento(idVencimiento, patch, session.nombre || session.usuario);
}

// --- API MAESTRO DE CLIENTES (CON EDICIÓN DE ESTADO) ---
function apiListClientes(token) {
  requireSession(token);
  return listClientes();
}

function apiSaveCliente(token, cliente) {
  const session = requireSession(token);
  return saveCliente(cliente, session.nombre || session.usuario);
}

function apiCambiarEstadoCliente(token, idCliente, nuevoEstado) {
  const session = requireSession(token);
  const row = findBy(SHEETS.CLIENTES, 'ID_Cliente', idCliente);
  if (!row) throw new Error('Cliente no encontrado.');
  updateRow(SHEETS.CLIENTES, row._row, { Activo: nuevoEstado, Fecha_Modificacion: now() });
  audit(session.nombre || session.usuario, idCliente, 'CLIENTE_ACTIVO', row.Activo, nuevoEstado);
  return success();
}

// --- API MAESTRO DE IMPUESTOS & ASIGNACIONES ---
function apiListImpuestos(token) {
  requireSession(token);
  return listImpuestos();
}

function apiSaveImpuesto(token, impuesto) {
  const session = requireSession(token);
  requireRole(session, ['ADMIN', 'SUPERVISOR']);
  
  const nombreImpuesto = String(impuesto.Nombre_Impuesto || '').trim();
  const activo = impuesto.Activo || 'SI';

  if (!nombreImpuesto) {
    throw new Error('El nombre del impuesto es un campo obligatorio.');
  }

  // 1. Buscamos si es una edición de un impuesto existente
  let row = impuesto.ID_Impuesto ? findBy(SHEETS.IMPUESTOS, 'ID_Impuesto', impuesto.ID_Impuesto) : null;
  
  let idFinal;
  let anteriorNombre = '-';
  
  if (row) {
    // Si ya existe, conservamos su ID original correlativo
    idFinal = row.ID_Impuesto;
    anteriorNombre = row.Nombre_Impuesto;
    
    const payloadEdit = {
      ID_Impuesto: idFinal,
      Nombre_Impuesto: nombreImpuesto,
      Activo: activo
    };
    updateRow(SHEETS.IMPUESTOS, row._row, payloadEdit);
    audit(session.nombre || session.usuario, idFinal, 'IMPUESTO_EDIT', anteriorNombre, nombreImpuesto);
  } else {
    // 2. GENERACIÓN CORRELATIVA AUTOMÁTICA PARA NUEVOS ALTAS
    const filasExistentes = getRows(SHEETS.IMPUESTOS);
    
    // Contamos cuántos registros reales tenemos para calcular el próximo número secuencial
    const proximoNumero = filasExistentes.length + 1; 
    
    // Armamos el patrón "IMP" seguido del número rellenado con ceros a 5 dígitos (ej: IMP00019)
    idFinal = 'IMP' + String(proximoNumero).padStart(6, '0');
    
    const payloadNew = {
      ID_Impuesto: idFinal,
      Nombre_Impuesto: nombreImpuesto,
      Activo: activo
    };
    appendRow(SHEETS.IMPUESTOS, payloadNew);
    audit(session.nombre || session.usuario, idFinal, 'IMPUESTO_NEW', '-', nombreImpuesto);
  }

  return success({ impuesto: { ID_Impuesto: idFinal, Nombre_Impuesto: nombreImpuesto, Activo: activo } });
}

function apiListCalendarios(token) {
  requireSession(token);
  return getRows(SHEETS.CALENDARIOS).map(serializeRow);
}

function apiSaveCalendario(token, regla) {
  requireSession(token);
  appendRow(SHEETS.CALENDARIOS, {
    Impuesto: regla.Impuesto,
    Mes: String(regla.Mes).toLowerCase(),
    Desde_Digito: Number(regla.Desde_Digito),
    Hasta_Digito: Number(regla.Hasta_Digito),
    Dia_Vencimiento: Number(regla.Dia_Vencimiento)
  });
  return success();
}

function apiListImpuestosAsignados(token) {
  requireSession(token);
  return getRows(SHEETS.IMP_ASIGNADOS).map(serializeRow);
}

function apiSaveAsignacion(token, asig) {
  requireSession(token);
  
  const idCliente = String(asig.ID_Cliente || '').trim();
  const impuestoNombre = String(asig.Impuesto || '').trim();
  const notas = String(asig.Observaciones || '').trim();

  if (!idCliente || !impuestoNombre) {
    throw new Error('El Cliente y el Impuesto son campos obligatorios.');
  }

  // VALIDACIÓN DE DUPLICADOS: Evita duplicar el mismo impuesto para el mismo legajo
  const filasExistentes = getRows(SHEETS.IMP_ASIGNADOS);
  const yaAsignado = filasExistentes.some(function(row) {
    return String(row.ID_Cliente).trim() === idCliente && 
           String(row.Impuesto).trim() === impuestoNombre;
  });

  if (yaAsignado) {
    throw new Error('⚠️ Este impuesto ya se encuentra vinculado a este contribuyente.');
  }

  // Insertamos la fila respetando estrictamente el formato de 3 columnas de Config.gs
  appendRow(SHEETS.IMP_ASIGNADOS, {
    ID_Cliente: idCliente,
    Impuesto: impuestoNombre,
    Observaciones: notes || '-'
  });

  return success({ message: 'Vínculo tributario guardado con éxito' });
}


// --- API CONTROL DE USUARIOS (ALTA, CONTRASEÑA, BAJA) ---
function apiListUsuarios(token) {
  requireSession(token);
  return listUsuarios();
}

function apiCreateUsuario(token, datos) {
  const session = requireSession(token);
  requireRole(session, ['ADMIN']);
  
  if (findBy(SHEETS.USUARIOS, 'Usuario', datos.usuario)) throw new Error('El usuario ya existe.');
  
  appendRow(SHEETS.USUARIOS, {
    ID_Usuario: makeId('USR'),
    Usuario: datos.usuario.trim(),
    Nombre_Completo: datos.nombre.trim(),
    Email: datos.email.trim(),
    Password_Hash: hashSha256(datos.password),
    Rol: datos.rol,
    Activo: 'SI',
    Fecha_Alta: now(),
    Ultimo_Acceso: '-'
  });
  return success();
}

function apiModificarPasswordUsuario(token, idUsuario, nuevaPassword) {
  const session = requireSession(token);
  requireRole(session, ['ADMIN']);
  const row = findBy(SHEETS.USUARIOS, 'ID_Usuario', idUsuario);
  if (!row) throw new Error('Usuario no encontrado.');
  
  updateRow(SHEETS.USUARIOS, row._row, { Password_Hash: hashSha256(nuevaPassword) });
  audit(session.nombre || session.usuario, '-', 'USER_CHG_PASS', row.Usuario, 'Clave actualizada');
  return success();
}

function apiCambiarEstadoUsuario(token, idUsuario, nuevoEstado) {
  const session = requireSession(token);
  requireRole(session, ['ADMIN']);
  const row = findBy(SHEETS.USUARIOS, 'ID_Usuario', idUsuario);
  if (!row) throw new Error('Usuario no encontrado.');
  
  updateRow(SHEETS.USUARIOS, row._row, { Activo: nuevoEstado });
  audit(session.nombre || session.usuario, '-', 'USER_STATUS', row.Usuario, nuevoEstado);
  return success();
}

// --- ENLACES ADICIONALES DE AUTOMATIZACIÓN ---
function apiGenerarVencimientos(token, year, month) {
  const session = requireSession(token);
  requireRole(session, ['ADMIN', 'SUPERVISOR']);
  return generarVencimientosMensuales(Number(year), Number(month), session.nombre || session.usuario);
}

function apiEliminarAsignacion(token, idCliente, impuesto) {
  const session = requireSession(token);
  requireRole(session, ['ADMIN', 'SUPERVISOR']); // Resguardo de seguridad por roles

  const sheet = getSheet(SHEETS.IMP_ASIGNADOS);
  const values = sheet.getDataRange().getValues();
  
  // Recorremos de abajo hacia arriba para evitar problemas con los índices al eliminar filas
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][0]).trim() === String(idCliente).trim() && 
        String(values[i][1]).trim() === String(impuesto).trim()) {
      sheet.deleteRow(i + 1); // Sumamos 1 porque Sheets es base 1 y el array es base 0
      audit(session.nombre || session.usuario, idCliente, 'ASIGNACION_DEL', impuesto, 'Vínculo eliminado');
      return success({ message: 'Asignación eliminada correctamente.' });
    }
  }
  
  throw new Error('No se encontró la asignación especificada para eliminar.');
}
