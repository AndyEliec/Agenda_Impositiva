function login(usuario, password, dispositivo) {
  initDatabase();
  const user = getRows(SHEETS.USUARIOS).find(function(row) {
    return String(row.Usuario).toLowerCase() === String(usuario || '').toLowerCase() && row.Activo === 'SI';
  });
  
  if (!user || user.Password_Hash !== hashSha256(password || '')) {
    throw new Error('Usuario o contraseña incorrectos.');
  }

  const config = getConfigMap();
  const hours = Number(config.SESION_HORAS || APP.SESSION_HOURS_DEFAULT);
  const token = Utilities.getUuid();
  const fechaInicio = now();
  const fechaFin = addHours(fechaInicio, hours);

  appendRow(SHEETS.SESIONES, {
    ID_Sesion: makeId('SES'),
    Usuario: user.Usuario,
    Token: token,
    Fecha_Inicio: formatDate(fechaInicio),
    Fecha_Fin: formatDate(fechaFin),
    Dispositivo: dispositivo || 'Browser',
    Activo: 'SI'
  });
  
  updateRow(SHEETS.USUARIOS, user._row, { Ultimo_Acceso: formatDate(fechaInicio) });
  audit(user.Nombre_Completo || user.Usuario, '-', 'LOGIN', '-', 'Ingreso al sistema');

  return success({
    token: token,
    usuario: user.Usuario,
    nombre: user.Nombre_Completo,
    rol: user.Rol,
    vence: formatDate(fechaFin)
  });
}

function logout(token) {
  const session = findBy(SHEETS.SESIONES, 'Token', token);
  if (session) updateRow(SHEETS.SESIONES, session._row, { Activo: 'NO', Fecha_Fin: now() });
  return success({ message: 'Sesion cerrada' });
}

function requireSession(token) {
  if (!token) throw new Error('Sesion requerida.');
  const session = findBy(SHEETS.SESIONES, 'Token', token);
  if (!session || session.Activo !== 'SI') throw new Error('Sesion invalida.');
  if (parseDate(session.Fecha_Fin).getTime() < now().getTime()) {
    updateRow(SHEETS.SESIONES, session._row, { Activo: 'NO' });
    throw new Error('Sesion vencida.');
  }
  const user = findBy(SHEETS.USUARIOS, 'Usuario', session.Usuario);
  if (!user || user.Activo !== 'SI') throw new Error('Usuario inactivo.');
  return { usuario: user.Usuario, nombre: user.Nombre_Completo, rol: user.Rol, email: user.Email };
}

function requireRole(session, roles) {
  if (roles.indexOf(session.rol) === -1) throw new Error('Permiso insuficiente.');
}

