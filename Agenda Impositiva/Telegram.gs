function getTelegramToken() {
  const token = PropertiesService.getScriptProperties().getProperty("TELEGRAM_BOT_TOKEN");
  if (!token) throw new Error('Configure TELEGRAM_BOT_TOKEN en Propiedades del script.');
  return token;
}

function telegramApi(method, payload) {
  const url = 'https://api.telegram.org/bot' + getTelegramToken() + '/' + method;
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload || {}),
    muteHttpExceptions: true
  });
  const body = response.getContentText();
  if (response.getResponseCode() >= 400) throw new Error('Telegram error: ' + body);
  return JSON.parse(body);
}

function sendTelegramTask(chatId, cliente, vencimiento) {
  const text = [
    '<b>Vencimiento pendiente</b>',
    'Cliente: ' + escapeHtml(cliente),
    'Impuesto: ' + escapeHtml(vencimiento.Impuesto),
    'Fecha: ' + formatDate(vencimiento.Fecha_Vto, 'dd/MM/yyyy'),
    'Estado: ' + escapeHtml(vencimiento.Estado),
    vencimiento.Comentario ? 'Nota: ' + escapeHtml(vencimiento.Comentario) : ''
  ].filter(Boolean).join('\n');
  return telegramApi('sendMessage', {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        { text: 'Hecho', callback_data: 'done|' + vencimiento.ID_Vencimiento },
        { text: 'Posponer 2h', callback_data: 'snooze|' + vencimiento.ID_Vencimiento }
      ]]
    }
  });
}

function handleTelegramWebhook(e) {
  try {
    const update = JSON.parse(e.postData.contents || '{}');
    if (update.callback_query) processTelegramCallback(update.callback_query);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function processTelegramCallback(callback) {
  const parts = String(callback.data || '').split('|');
  const action = parts[0];
  const id = parts[1];
  if (!id) return;
  if (action === 'done') {
    updateVencimiento(id, { Estado: 'Presentado' }, 'Telegram');
    answerTelegramCallback(callback.id, 'Marcado como presentado');
    editTelegramMessage(callback, 'Presentado');
    return;
  }
  if (action === 'snooze') {
    updateVencimiento(id, { Proximo_Aviso: addHours(now(), 2) }, 'Telegram');
    answerTelegramCallback(callback.id, 'Pospuesto 2 hora');
    editTelegramMessage(callback, 'Pospuesto 2 hora');
  }
}

function answerTelegramCallback(callbackId, text) {
  return telegramApi('answerCallbackQuery', { callback_query_id: callbackId, text: text || 'OK' });
}

function editTelegramMessage(callback, statusText) {
  const msg = callback.message;
  if (!msg) return;
  const base = String(msg.text || '').replace(/\n\n.*/, '');
  return telegramApi('editMessageText', {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    text: base + '\n\nOK - ' + statusText,
    parse_mode: 'HTML'
  });
}

function setTelegramWebhook(webAppUrl) {
  return telegramApi('setWebhook', { url: webAppUrl });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}



// Ejecutá esta función presionando "Ejecutar" en el panel superior una sola vez
function activarConexionTelegramEStudio() {
  // Obtenemos la URL de publicación de tu Web App
  const webAppUrl = ScriptApp.getService().getUrl();
  if (!webAppUrl) {
    throw new Error("Primero tenés que implementar el script como Aplicación Web para tener la URL.");
  }
  
  // Registramos la URL en los servidores mundiales de Telegram
  const resultado = setTelegramWebhook(webAppUrl);
  Logger.log("Resultado del enlace con Telegram: " + JSON.stringify(resultado));
  return resultado;
}



