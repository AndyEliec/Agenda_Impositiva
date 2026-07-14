function now() {
  return new Date();
}

function formatDate(date, pattern) {
  if (!date) return '';
  return Utilities.formatDate(new Date(date), APP.TZ, pattern || 'dd/MM/yyyy HH:mm');
}

function toIsoDate(date) {
  return Utilities.formatDate(new Date(date), APP.TZ, 'yyyy-MM-dd');
}

function dateOnly(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseDate(value) {
  if (value instanceof Date) return value;
  if (!value) return null;
  const text = String(value).trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), Number(iso[4] || 0), Number(iso[5] || 0));
  const ar = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (ar) return new Date(Number(ar[3]), Number(ar[2]) - 1, Number(ar[1]), Number(ar[4] || 0), Number(ar[5] || 0));
  const parsed = new Date(text);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function addHours(date, hours) {
  return new Date(new Date(date).getTime() + Number(hours) * 60 * 60 * 1000);
}

function hashSha256(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8);
  return bytes.map(function(byte) {
    const v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
}

function makeId(prefix) {
  return prefix + Utilities.getUuid().replace(/-/g, '').slice(0, 10).toUpperCase();
}

function getLastCuitDigit(cuit) {
  const digits = String(cuit || '').replace(/\D/g, '');
  if (!digits) throw new Error('CUIT invalido');
  return Number(digits.slice(-1));
}

function success(data) {
  return Object.assign({ ok: true }, data || {});
}

function fail(message) {
  return { ok: false, error: message };
}

function getTargetMonth(year, month) {
  if (year && month) return { year: year, month: month };
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function getMonthName(month) {
  return MESES[Number(month) - 1];
}

function isWeekend(date) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
}

function groupBy(items, key) {
  return items.reduce(function(acc, item) {
    const value = item[key] || '-';
    if (!acc[value]) acc[value] = [];
    acc[value].push(item);
    return acc;
  }, {});
}

