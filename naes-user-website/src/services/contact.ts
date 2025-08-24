import api from './api';

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  whatsapp: string;
  message: string;
}

export interface CaptchaInfo {
  uuid: string;
  ttl?: number;
  blobUrl: string;
}

function readHeader(headers: Headers, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = headers.get(k);
    if (v) return v;
  }
  return undefined;
}

export async function getCaptcha(): Promise<CaptchaInfo> {
  try {
    // 优先尝试 JSON 格式（后端返回 base64 图片与 uuid）
    const json: any = await api.get('/captcha/code');
    const data = json?.data || json || {};
    // 可能的字段名适配
    const uuid: string =
      data.uuid || data.captchaUuid || data.captchaId || data.id || crypto.randomUUID();
    let image: string =
      data.captchaImage || data.image || data.base64 || data.captchaBase64 || '';
    // 若仅是纯 base64，则补齐 data URL 前缀
    if (image && !/^data:image\//.test(image)) {
      image = `data:image/png;base64,${image}`;
    }
    // 过期时间处理：支持 ttl（秒）或 expireAt（时间戳/ISO）
    let ttl: number | undefined = undefined;
    const ttlRaw = data.ttl ?? data.expiresIn ?? data.expire ?? data.expireIn;
    if (typeof ttlRaw === 'number') ttl = ttlRaw;
    const expireAt = data.expireAt || data.expiresAt;
    if (!ttl && expireAt) {
      const t = typeof expireAt === 'number' ? expireAt : Date.parse(expireAt);
      if (!Number.isNaN(t)) ttl = Math.max(0, Math.floor((t - Date.now()) / 1000));
    }
    if (image) {
      // 兼容 Contact.tsx 既有字段名，依然返回 blobUrl，但内容为 data URL
      return { uuid, ttl, blobUrl: image };
    }
    // 若 JSON 未带图片，降级为 blob 流
  } catch (e) {
    // ignore and fallback to blob
  }

  // 兜底：以 blob 方式获取
  const blob: any = await api.raw('/captcha/code', { responseType: 'blob' });
  const headers: Headers = blob.__headers as Headers;
  const uuid =
    readHeader(headers, ['x-captcha-uuid', 'captcha-uuid', 'uuid', 'x-uuid']) ||
    crypto.randomUUID();
  const ttlStr = readHeader(headers, ['x-captcha-ttl', 'captcha-ttl', 'ttl']);
  const ttl = ttlStr ? Number(ttlStr) : undefined;
  const blobUrl = URL.createObjectURL(blob as Blob);
  return { uuid, ttl, blobUrl };
}

export async function sendContactMessage(payload: ContactPayload, uuid: string, answer: string) {
  // 常见后端会要求在 body 中附上 uuid 与 answer
  const body = { ...payload, uuid, answer };
  const res: any = await api.post('/contact/message/send', body);
  return res;
}

