import Breadcrumbs from '../components/Breadcrumbs';
import contactHeroImage from '@/assets/images/contact-banner.png';
// import emailImage from '@/assets/images/email.jpg';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getCaptcha, sendContactMessage } from '@/services/contact';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import zhCNLocales from '@/data/phoneLocalesCN';
import '@/styles/phone-input.css';

// interface TeamMember {
//   name: string;
//   title: string;
//   phone: string;
//   email: string;
// }

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  whatsapp: string;
  message: string;
}

const ContactPage = () => {
  const { t, i18n } = useTranslation('contact');

  // 留言最大字数限制
  const MAX_MESSAGE_LEN = 800;

  // 区号下拉多语言：根据全局语言切换国家名称显示
  const isZh = useMemo(() => (i18n.language || '').toLowerCase().startsWith('zh'), [i18n.language]);
  const phoneLocalization = isZh ? zhCNLocales : undefined;

  // 获取团队成员数据
  // const teamMembers = t('team.members', {
  //   returnObjects: true,
  // }) as TeamMember[];

  // 表单状态管理
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    whatsapp: '',
    message: '',
  });

  // 手机号输入（带国家码组件）
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [whatsappValue, setWhatsappValue] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  // 验证码
  const [captchaImgUrl, setCaptchaImgUrl] = useState<string>('');
  const [captchaUUID, setCaptchaUUID] = useState<string>('');
  const [captchaAnswer, setCaptchaAnswer] = useState<string>('');
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [captchaError, setCaptchaError] = useState<string>('');
  const [captchaErrorCode, setCaptchaErrorCode] = useState<'expired' | 'failedRefreshed' | 'invalid' | ''>('');
  const [captchaExpireAt, setCaptchaExpireAt] = useState<number>(0);
  const [captchaRemain, setCaptchaRemain] = useState<number>(0);
  // 发送成功弹窗
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [modalRemain, setModalRemain] = useState<number>(3);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // 读取/写入本地缓存（UUID + 过期时间）
  const now = useMemo(() => Date.now(), []);

  const loadCaptcha = async (force = false) => {
    try {
      setCaptchaLoading(true);
      const cachedUUID = localStorage.getItem('captcha_uuid') || '';
      const expireAt = Number(localStorage.getItem('captcha_expire_at') || 0);
      const valid = !force && cachedUUID && expireAt && expireAt > Date.now();
      if (valid) {
        // 即使有缓存，也要取一次图片，以更新图像（避免浏览器缓存可加上时间戳）
      }
      const info = await getCaptcha();
      // 替换图片前，若旧 URL 为 blob: 则回收
      if (captchaImgUrl && captchaImgUrl.startsWith('blob:')) {
        try { URL.revokeObjectURL(captchaImgUrl); } catch {}
      }
      setCaptchaImgUrl(info.blobUrl);
      setCaptchaUUID(info.uuid);
      if (info.ttl) {
        localStorage.setItem('captcha_uuid', info.uuid);
        localStorage.setItem(
          'captcha_expire_at',
          String(Date.now() + info.ttl * 1000),
        );
        const nextExpire = Date.now() + info.ttl * 1000;
        setCaptchaExpireAt(nextExpire);
      }
      setCaptchaAnswer('');
      setCaptchaError('');
      setCaptchaErrorCode('');
    } catch (e) {
      console.error('load captcha failed', e);
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
    // 清理 blobUrl
    return () => {
      if (captchaImgUrl && captchaImgUrl.startsWith('blob:')) {
        try { URL.revokeObjectURL(captchaImgUrl); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 启动验证码剩余时间倒计时
  useEffect(() => {
    // 初始从本地读取一次
    const localExpire = Number(localStorage.getItem('captcha_expire_at') || 0);
    if (localExpire) setCaptchaExpireAt(localExpire);

    const timer = setInterval(() => {
      if (!captchaExpireAt) {
        setCaptchaRemain(0);
        return;
      }
      const left = Math.max(0, Math.floor((captchaExpireAt - Date.now()) / 1000));
      setCaptchaRemain(left);
      if (left === 0) {
        // 过期时标记错误码（不自动刷新，保持与流程图一致）
        setCaptchaErrorCode((prev) => prev || 'expired');
      }
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaExpireAt]);

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const nextValue = name === 'message' ? value.slice(0, MAX_MESSAGE_LEN) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (!captchaUUID || !captchaAnswer) {
        // 必须输入验证码
        throw new Error('captcha required');
      }

      // 简单前端校验：邮箱必填（Company/Phone/WhatsApp 可选）
      if (!formData.email) {
        throw new Error('required fields missing');
      }

      // 本地过期校验：过期则直接拦截并提示，刷新验证码
      const expireAt = Number(localStorage.getItem('captcha_expire_at') || 0);
      if (!expireAt || expireAt <= Date.now()) {
        setSubmitStatus('error');
        await loadCaptcha(true);
        setCaptchaError('');
        setCaptchaErrorCode('expired');
        setCaptchaAnswer('');
        return;
      }

      // 统一拼接为 E.164（确保有+前缀）
      const phoneE164 = phoneValue ? (phoneValue.startsWith('+') ? phoneValue : `+${phoneValue}`) : '';
      const whatsappE164 = whatsappValue ? (whatsappValue.startsWith('+') ? whatsappValue : `+${whatsappValue}`) : '';

      // 发送请求
      const res: any = await sendContactMessage(
        {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: phoneE164,
          whatsapp: whatsappE164,
          message: formData.message,
        },
        captchaUUID,
        captchaAnswer,
      );

      // 兼容多种后端返回：
      // 1) HTTP 400
      // 2) 业务码 code/status = 400（或字符串 '400'）
      // 3) success === false（常见业务失败）
      const httpStatus = res?.__status;
      const bizCodeRaw = res?.code ?? res?.status ?? res?.data?.code ?? res?.data?.status;
      const bizCodeNum = typeof bizCodeRaw === 'string' ? Number(bizCodeRaw) : bizCodeRaw;
      const bizSuccess = res?.success ?? res?.data?.success;
      const isCaptchaBizFail =
        bizSuccess === false || bizCodeNum === 400 || bizCodeNum === 601;
      if (httpStatus === 400 || isCaptchaBizFail) {
        // 验证码错误或业务失败（兼容 code/status=400/601、success=false）
        setSubmitStatus('error');
        const backendMsg = res?.message || res?.msg || res?.data?.message || '';
        await loadCaptcha(true);
        // 若后端明确返回 captcha 验证失败，则使用精确提示
        const lower = String(backendMsg).toLowerCase();
        const isKnownCaptchaFail = lower.includes('captcha verification failed');
        if (isKnownCaptchaFail) {
          setCaptchaError('');
          setCaptchaErrorCode('failedRefreshed');
        } else if (backendMsg) {
          setCaptchaError(String(backendMsg));
          setCaptchaErrorCode('');
        } else {
          setCaptchaError('');
          setCaptchaErrorCode('invalid');
        }
        setCaptchaAnswer('');
        return;
      }

      setSubmitStatus('success');
      // 显示自定义成功弹窗
      // 记录当前焦点以便关闭后还原
      try { prevFocusRef.current = document.activeElement as HTMLElement; } catch {}
      setModalRemain(3);
      setShowSuccessModal(true);
      // 重置表单
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        whatsapp: '',
        message: '',
      });
      setPhoneValue('');
      setWhatsappValue('');
      await loadCaptcha(true);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理 Modal 打开后的自动关闭 & ESC 关闭 & 焦点管理
  useEffect(() => {
    if (!showSuccessModal) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuccessModal(false);
      }
    };
    window.addEventListener('keydown', onKey);

    setModalRemain(3);
    const interval = setInterval(() => {
      setModalRemain((s) => Math.max(0, s - 1));
    }, 1000);
    const timeout = setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);

    return () => {
      window.removeEventListener('keydown', onKey);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showSuccessModal]);

  // 关闭 Modal 后还原焦点
  useEffect(() => {
    if (!showSuccessModal) {
      // 优先还原到提交按钮
      if (submitBtnRef.current) {
        try { submitBtnRef.current.focus(); } catch {}
        return;
      }
      // 次选：还原到之前的焦点元素
      if (prevFocusRef.current) {
        try { prevFocusRef.current.focus(); } catch {}
      }
    }
  }, [showSuccessModal]);

  return (
    <>
    <div className="flex flex-col">
      {/* 1. Hero 图片 */}
      <div
        className="mt-header  w-full bg-cover bg-center md:h-[320px]"
        style={{ backgroundImage: `url(${contactHeroImage})` }}
      ></div>
      <Breadcrumbs />

      {/* 2. 公司联系信息 */}
      {/* <section className="container max-w-6xl mx-auto pb-16 px-6 text-center">


        <h2 className="text-2xl font-semibold my-4 text-left">
          {t('companyInfo.title')}
        </h2>

        <div className="w-12 h-1 bg-blue-500 my-4"></div>

        <div className="flex flex-col md:flex-row justify-center items-center"> */}
      {/*/!* 左侧：公司地址 *!/*/}
      {/*<div className="text-gray-700 text-lg">*/}
      {/*  <p className="font-bold">{t('companyInfo.address.title')}</p>*/}
      {/*  <p>{t('companyInfo.address.line1')}</p>*/}
      {/*  <p>{t('companyInfo.address.line2')}</p>*/}
      {/*</div>*/}

      {/* 右侧：邮箱 */}
      {/* <div className="flex flex-col items-center mt-2 md:-mt-6">
            <a
              href={`mailto:${t('companyInfo.email')}`}
              className="flex flex-col items-center text-blue-500 hover:underline"
            >
              <img src={emailImage} alt="Email" className="w-36 h-24" />
              <span className="-mt-4 leading-none">{t('companyInfo.email')}</span>
            </a>
          </div>
        </div>
      </section> */}

      {/* 3. 联系表单 */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {t('form.title', '联系我们')}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {t(
                'form.subtitle',
                '有任何问题或需要了解更多信息？请填写下面的表单，我们会尽快回复您。',
              )}
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 第一行：姓名和邮箱 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('form.fields.name', '姓名')}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#204f3e]"
                    placeholder={t('form.placeholders.name', '请输入您的姓名')}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('form.fields.email', '邮箱')}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#204f3e]"
                    placeholder={t('form.placeholders.email', '请输入您的邮箱')}
                  />
                </div>
              </div>

              {/* 第二行：公司和电话 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('form.fields.company', '公司名称')}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#204f3e]"
                    placeholder={t(
                      'form.placeholders.company',
                      '请输入您的公司名称',
                    )}
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('form.fields.phone', '电话号码')}
                  </label>
                  <div className="w-full">
                    <PhoneInput
                      key={isZh ? 'phone-zh' : 'phone-en'}
                      country={'cn'}
                      value={phoneValue}
                      onChange={(val) => setPhoneValue(val || '')}
                      enableSearch
                      localization={phoneLocalization as any}
                      inputProps={{ id: 'phone', name: 'phone', placeholder: t('form.placeholders.phone', '请输入您的电话号码') as string }}
                      containerClass="w-full"
                      inputClass="!w-full !h-[48px] !text-base"
                    />
                  </div>
                </div>
                </div>
              {/* 第三行：WhatsApp */}
              <div>
                <label
                  htmlFor="whatsapp"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  WhatsApp
                </label>
                <div className="w-full">
                  <PhoneInput
                    key={isZh ? 'wa-zh' : 'wa-en'}
                    country={'cn'}
                    value={whatsappValue}
                    onChange={(val) => setWhatsappValue(val || '')}
                    enableSearch
                    localization={phoneLocalization as any}
                    inputProps={{ id: 'whatsapp', name: 'whatsapp', placeholder: '请输入 WhatsApp 号码' }}
                    containerClass="w-full"
                    inputClass="!w-full !h-[48px] !text-base"
                  />
                </div>
              </div>

              {/* 第四行：消息内容 */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t('form.fields.message', '消息内容')}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  maxLength={MAX_MESSAGE_LEN}
                  className="resize-vertical w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#204f3e]"
                  placeholder={t(
                    'form.placeholders.message',
                    '请详细描述您的需求或问题...',
                  )}
                />
                {/* 字数统计显示 */}
                <div className="mt-1 text-right text-xs">
                  <span
                    className={
                      formData.message.length >= MAX_MESSAGE_LEN
                        ? 'text-red-600'
                        : formData.message.length >= Math.floor(MAX_MESSAGE_LEN * 0.9)
                        ? 'text-yellow-600'
                        : 'text-gray-500'
                    }
                  >
                    {formData.message.length}/{MAX_MESSAGE_LEN}
                  </span>
                </div>
              </div>

              {/* 验证码 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-center">
                <div>
                  <label
                    htmlFor="captcha"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('form.fields.captcha', '验证码')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="captcha"
                    name="captcha"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#204f3e]"
                    placeholder={t('form.placeholders.captcha', '请输入图片中的字符')}
                  />
                  {(() => {
                    const errorText =
                      captchaErrorCode === 'failedRefreshed'
                        ? t('form.captchaFailedRefreshed', '验证码失败, 已刷新,请重新输入')
                        : captchaErrorCode === 'expired'
                        ? t('form.captchaExpired', '验证码已过期，请刷新验证码')
                        : captchaErrorCode === 'invalid'
                        ? t('form.captchaInvalid', '验证失败，请刷新验证码')
                        : captchaError;
                    return errorText ? (
                      <p className="mt-2 text-xs text-red-600">{errorText}</p>
                    ) : (
                      <p className="mt-2 text-xs text-gray-500">{t('form.captchaHint', '看不清？点击右侧图片刷新')}</p>
                    );
                  })()}
                </div>
                <div className="flex items-center justify-start md:justify-end">
                  <button
                    type="button"
                    onClick={() => loadCaptcha(true)}
                    className="rounded border border-gray-200 p-1 hover:shadow disabled:opacity-50"
                    disabled={captchaLoading}
                    aria-label="refresh-captcha"
                  >
                    {captchaImgUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={captchaImgUrl}
                        alt="captcha"
                        className="h-12 w-28 object-cover"
                      />
                    ) : (
                      <div className="h-12 w-28 flex items-center justify-center text-gray-400">
                        {t('form.loadingCaptcha', '加载中...')}
                      </div>
                    )}
                  </button>
                  {/* 倒计时显示：>10s 正常，<=10s 黄色，<=0 红色 */}
                  <div className="ml-3 text-xs">
                    <span
                      className={
                        captchaRemain <= 0
                          ? 'text-red-600'
                          : captchaRemain <= 10
                          ? 'text-yellow-600'
                          : 'text-gray-500'
                      }
                    >
                      {t('form.captchaTimeLeft', { s: captchaRemain, defaultValue: '剩余{{s}}秒' })}
                    </span>
                  </div>
                </div>
              </div>
      
           

              {/* 提交按钮 */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#204f3e] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#1a3f32] focus:ring-2 focus:ring-[#204f3e] focus:ring-offset-2 disabled:bg-gray-400"
                  ref={submitBtnRef}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t('form.submitting', '发送中...')}
                    </div>
                  ) : (
                    t('form.submit', '发送消息')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 4. 团队联系方式 - 暂时注释掉 */}
      {/* <section className="container max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          {t('team.title')}
        </h2>
        <p className="text-center text-gray-500 mb-12">
          {t('team.subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((person, index) => (
            <div key={index} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="font-bold text-lg">{person.name}</h3>
              <p className="text-gray-600">{person.title}</p>
              <p className="text-gray-500">
                {t('team.labels.phone')}:
                <a
                  href={`tel:${person.phone}`}
                  className="text-blue-500 hover:underline ml-1"
                >
                  {person.phone}
                </a>
              </p>
              <p className="text-gray-500">
                {t('team.labels.email')}:
                <a
                  href={`mailto:${person.email}`}
                  className="text-blue-500 hover:underline ml-1"
                >
                  {person.email}
                </a>
              </p>
            </div>
          ))}
        </div>
      </section> */}
    </div>
    {/* 成功提示 Modal */}
    {showSuccessModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-success-title"
      >
        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-start">
            <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 id="send-success-title" className="text-lg font-semibold text-gray-900">
                {t('form.sendSuccess', 'Send success')}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t('form.sendSuccessDesc', 'Your message has been sent successfully. We will get back to you soon.')}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {t('form.autoCloseIn', { s: modalRemain, defaultValue: '将在 {{s}} 秒后自动关闭' })}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="rounded-md bg-[#204f3e] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3f32] focus:outline-none focus:ring-2 focus:ring-[#204f3e] focus:ring-offset-2"
              autoFocus
            >
              {t('form.ok', 'OK')}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ContactPage;
