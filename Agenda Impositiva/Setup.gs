function instalarTriggers() {
  ScriptApp.newTrigger('revisarYNotificarVencimientos')
    .timeBased()
    .everyHours(1)
    .create();

  ScriptApp.newTrigger('generarVencimientosMensuales')
    .timeBased()
    .onMonthDay(25)
    .atHour(7)
    .create();

  return success({ message: 'Triggers instalados' });
}
