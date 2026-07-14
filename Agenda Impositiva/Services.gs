// Modificada para tolerar ejecuciones automáticas de Triggers sin parámetros
function generarVencimientosMensuales(year, month, usuario) {
  let target;
  if (year && month) {
    target = { year: Number(year), month: Number(month) };
  } else {
    // Si corre por Trigger automático (ej: cada 25 de mes), calcula por defecto el mes siguiente (M+1)
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    target = { year: d.getFullYear(), month: d.getMonth() + 1 };
  }
  
  const mes = getMonthName(target.month);
  const clientes = getRows(SHEETS.CLIENTES).filter(function(row) { return row.Activo === 'SI'; });
  const asignados = getRows(SHEETS.IMP_ASIGNADOS);
  const reglas = getRows(SHEETS.CALENDARIOS).filter(function(row) { return String(row.Mes).toLowerCase() === mes; });
  const existentes = getRows(SHEETS.VENCIMIENTOS).reduce(function(acc, row) {
    acc[row.ID_Vencimiento] = true;
    return acc;
  }, {});
  const feriados = getHolidaySet(target.year);
  const horaAviso = getConfigMap().TELEGRAM_NOTIFICAR_HORA || APP.DEFAULT_NOTICE_HOUR;
  let creados = 0;
  let omitidos = 0;

  clientes.forEach(function(cliente) {
    const digito = getLastCuitDigit(cliente.Cuit);
    asignados.filter(function(asig) { return asig.ID_Cliente === cliente.ID_Cliente; }).forEach(function(asig) {
      const regla = reglas.find(function(r) {
        return r.Impuesto === asig.Impuesto && digito >= Number(r.Desde_Digito) && digito <= Number(r.Hasta_Digito);
      });
      if (!regla) return;
      const theoretical = new Date(target.year, target.month - 1, Number(regla.Dia_Vencimiento));
      const adjusted = nextBusinessDay(theoretical, feriados);
      const id = [target.year, String(target.month).padStart(2, '0'), cliente.ID_Cliente, normalizeText(asig.Impuesto), regla.Dia_Vencimiento].join('_');
      
      if (existentes[id]) {
        omitidos++;
        return;
      }
      
      appendRow(SHEETS.VENCIMIENTOS, {
        ID_Vencimiento: id,
        ID_Cliente: cliente.ID_Cliente,
        Impuesto: asig.Impuesto,
        Fecha_Vto: formatDate(adjusted, 'dd/MM/yyyy'), // Forzamos texto plano compatible con parseDate del front
        Estado: 'Pendiente',
        Proximo_Aviso: formatDate(buildNoticeDate(adjusted, horaAviso)),
        Comentario: asig.Observaciones || '',
        Ultimo_Usuario: usuario || 'Sistema',
        Fecha_Ultima_Modificacion: formatDate(now())
      });
      existentes[id] = true;
      creados++;
    });
  });

  audit(usuario || 'Sistema', '-', 'GENERAR_VENCIMIENTOS', '-', mes + ' ' + target.year + ': ' + creados);
  return success({ year: target.year, month: target.month, creados: creados, omitidos: omitidos });
}

function getHolidaySet(year) {
  const cache = CacheService.getScriptCache();
  const key = 'feriados_' + year;
  const cached = cache.get(key);
  if (cached) return JSON.parse(cached);
  try {
    const response = UrlFetchApp.fetch(APP.HOLIDAYS_URL + '/' + year, { muteHttpExceptions: true });
    if (response.getResponseCode() >= 400) return {};
    const data = JSON.parse(response.getContentText());
    const set = {};
    data.forEach(function(item) { set[item.fecha] = true; });
    cache.put(key, JSON.stringify(set), 21600);
    return set;
  } catch (err) {
    return {};
  }
}

function nextBusinessDay(date, holidays) {
  let d = dateOnly(date);
  while (isWeekend(d) || holidays[toIsoDate(d)]) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return d;
}

function buildNoticeDate(date, hourText) {
  const parts = String(hourText || APP.DEFAULT_NOTICE_HOUR).split(':');
  const d = dateOnly(date);
  d.setHours(Number(parts[0] || 8), Number(parts[1] || 0), 0, 0);
  return d;
}


// El Vigilante: Mutea alertas automáticas en fines de semana o feriados nacionales de la API
function revisarYNotificarVencimientos() {
  const hoy = dateOnly(now());
  
  // Si es fin de semana o feriado nacional de la API, pausamos las alertas
  if (isWeekend(hoy) || getHolidaySet(hoy.getFullYear())[toIsoDate(hoy)]) {
    return success({ paused: true, motivo: 'Dia no habil. Alertas en pausa.' });
  }
  
  const fechaHoyString = formatDate(hoy, 'dd/MM/yyyy');
  const horaActualTime = now().getTime();

  // FILTRO SEGURO: Solo procesa vencimientos del día de hoy que sigan Pendientes
  const vencimientos = getRows(SHEETS.VENCIMIENTOS).filter(function(row) {
    const aviso = parseDate(row.Proximo_Aviso);
    
    // Verificamos que la fecha límite del impuesto coincida estrictamente con el día de hoy
    const esDeHoy = String(row.Fecha_Vto).split(' ')[0] === fechaHoyString;
    
    return row.Estado === 'Pendiente' && esDeHoy && aviso && aviso.getTime() <= horaActualTime;
  });
  
  const clientesById = getRows(SHEETS.CLIENTES).reduce(function(acc, row) { acc[row.ID_Cliente] = row; return acc; }, {});
  let enviados = 0;

  vencimientos.forEach(function(vto) {
    const cliente = clientesById[vto.ID_Cliente];
    if (!cliente || !cliente.TelegramId) return;
    
    // Enviamos el mensaje al chat de Telegram
    sendTelegramTask(cliente.TelegramId, cliente.Cliente, vto);
    
    // Reprogramamos el aviso sumándole 3 horas para evitar spam si sigue pendiente
    updateRow(CONFIG.SHEETS.VENCIMIENTOS, vto._row, { 
      Proximo_Aviso: formatDate(addHours(now(), 3)) 
    });
    enviados++;
  });
  
  return success({ enviados: enviados });
}

function getDashboardData(year, month) {
  const target = getTargetMonth(year, month);
  const start = new Date(target.year, target.month - 1, 1);
  const end = new Date(target.year, target.month, 0, 23, 59, 59);
  
  // Usamos tu objeto global SHEETS directo
  const clientesRows = getRows(SHEETS.CLIENTES);
  const clientesActivosMap = {};
  const clientesNombresMap = {};
  
  clientesRows.forEach(function(row) {
    clientesNombresMap[row.ID_Cliente] = row.Cliente;
    clientesActivosMap[row.ID_Cliente] = (row.Activo === 'SI');
  });

  const vencimientos = getRows(SHEETS.VENCIMIENTOS).filter(function(row) {
    const fecha = parseDate(row.Fecha_Vto);
    const estaActivo = clientesActivosMap[row.ID_Cliente] === true;
    return fecha && fecha >= start && fecha <= end && estaActivo;
  });

  const byEstado = ESTADOS.reduce(function(acc, estado) { acc[estado] = 0; return acc; }, {});
  vencimientos.forEach(function(row) { byEstado[row.Estado] = (byEstado[row.Estado] || 0) + 1; });
  const total = vencimientos.length;

  return success({
    total: total,
    presentados: byEstado.Presentado || 0,
    progreso: total ? Math.round(((byEstado.Presentado || 0) / total) * 100) : 0,
    byEstado: byEstado,
    proximos: vencimientos.sort(function(a, b) { return parseDate(a.Fecha_Vto) - parseDate(b.Fecha_Vto); }).map(function(row) {
      const item = serializeRow(row);
      item.Cliente = clientesNombresMap[row.ID_Cliente] || row.ID_Cliente;
      return item;
    })
  });
}

function getCalendarData(year, month) {
  const target = getTargetMonth(year, month);
  const start = new Date(target.year, target.month - 1, 1);
  const end = new Date(target.year, target.month, 0, 23, 59, 59);
  
  const clientesRows = getRows(SHEETS.CLIENTES);
  const clientesActivosMap = {};
  const clientesNombresMap = {};
  
  clientesRows.forEach(function(row) {
    clientesNombresMap[row.ID_Cliente] = row.Cliente;
    clientesActivosMap[row.ID_Cliente] = (row.Activo === 'SI');
  });
  
  const vencimientos = getRows(SHEETS.VENCIMIENTOS).filter(function(row) {
    const fecha = parseDate(row.Fecha_Vto);
    const estaActivo = clientesActivosMap[row.ID_Cliente] === true;
    return fecha && fecha >= start && fecha <= end && estaActivo;
  }).map(function(row) {
    const item = serializeRow(row);
    item.Cliente = clientesNombresMap[row.ID_Cliente] || row.ID_Cliente;
    item.Fecha_ISO = toIsoDate(parseDate(row.Fecha_Vto));
    return item;
  });

  const feriadosSet = getHolidaySet(target.year);
  const listaFeriados = Object.keys(feriadosSet);

  return success({ 
    year: target.year, 
    month: target.month, 
    vencimientos: vencimientos,
    feriados: listaFeriados 
  });
}

function updateVencimiento(idVencimiento, patch, usuario) {
  const row = findBy(SHEETS.VENCIMIENTOS, 'ID_Vencimiento', idVencimiento);
  if (!row) throw new Error('Vencimiento no encontrado.');
  const allowed = ['Estado', 'Proximo_Aviso', 'Comentario'];
  const payload = { Ultimo_Usuario: usuario, Fecha_Ultima_Modificacion: now() };
  allowed.forEach(function(key) { if (patch[key] !== undefined) payload[key] = patch[key]; });
  updateRow(SHEETS.VENCIMIENTOS, row._row, payload);
  Object.keys(payload).forEach(function(key) {
    if (allowed.indexOf(key) !== -1 && String(row[key]) !== String(payload[key])) audit(usuario, idVencimiento, key, row[key], payload[key]);
  });
  return success({ vencimiento: serializeRow(Object.assign({}, row, payload)) });
}

function addComentario(idVencimiento, usuario, comentario) {
  if (!comentario) throw new Error('Comentario requerido.');
  appendRow(SHEETS.COMENTARIOS, {
    ID_Comentario: makeId('COM'),
    ID_Vencimiento: idVencimiento,
    Usuario: usuario,
    Fecha: now(),
    Comentario: comentario
  });
  updateVencimiento(idVencimiento, { Comentario: comentario }, usuario);
  return success({ message: 'Comentario agregado' });
}

