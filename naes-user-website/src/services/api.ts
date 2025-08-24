/* Simple API wrapper using fetch with Vite base URL */
function getBaseUrl(): string {
  const w: any = (globalThis as any)?.window;
  const runtimeBase: string | undefined = w?.__API_BASE_URL;
  let lsBase: string | undefined;
  try {
    lsBase = w?.localStorage?.getItem?.('API_BASE_URL') || undefined;
  } catch {}
  const envBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  // 在开发环境强制走 Vite 代理，避免浏览器直连引发 CORS/证书问题
  if (import.meta.env.DEV) {
    return '/api';
  }
  const fallback = 'https://beta.natureessential.ltd/api';
  let base = (runtimeBase || lsBase || envBase || fallback) || '';
  base = base.replace(/\/$/, '');
  return base;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  // when expecting binary
  responseType?: 'json' | 'blob' | 'text';
  // internal: prevent infinite retry
  __noRetryHtmlAsApi?: boolean;
}

async function request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const { method = 'GET', headers = {}, body, responseType = 'json', __noRetryHtmlAsApi } = options;

  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': body instanceof FormData ? undefined as any : 'application/json',
      Accept: 'application/json, image/*, */*',
      ...headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'omit',
  };

  if (import.meta.env.DEV) {
    // 轻量日志，便于定位 BASE 与 URL
    // eslint-disable-next-line no-console
    console.debug('[api] base:', base, 'path:', path, 'url:', url);
  }

  let res = await fetch(url, init);

  // 某些情况下未命中代理会返回前端 index.html（content-type: text/html）
  const ct = res.headers.get('content-type') || '';
  const isHtml = ct.includes('text/html');
  if (import.meta.env.DEV && isHtml && !__noRetryHtmlAsApi && base !== '/api') {
    // 尝试用 /api 作为基准重试一次
    const retryUrl = `/api${path.startsWith('/') ? path : `/${path}`}`;
    // eslint-disable-next-line no-console
    console.warn('[api] got HTML response, retry via proxy:', retryUrl);
    try {
      res = await fetch(retryUrl, init);
    } catch (e) {
      // 保持原始错误抛出
    }
  }

  if (!res.ok && res.status !== 400) {
    // 400 用于验证码失败时由上层处理
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (responseType === 'blob') {
    const b = (await res.blob()) as any;
    (b as any).__headers = res.headers;
    (b as any).__status = res.status;
    return b as T;
  }
  if (responseType === 'text') {
    const t = (await res.text()) as any;
    const payload: any = t;
    (payload as any).__headers = res.headers;
    (payload as any).__status = res.status;
    return payload as T;
  }
  const data = (await res.json()) as T;
  // 附带返回 headers 以便读取 uuid 场景
  (data as any).__headers = res.headers;
  (data as any).__status = res.status;
  return data;
}

export const api = {
  get: <T = any>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: 'GET', headers }),
  post: <T = any>(path: string, body?: any, headers?: Record<string, string>) =>
    request<T>(path, { method: 'POST', body, headers }),
  raw: request,
};

export default api;
