// Echo 仅在浏览器中使用 Publishable Key。
// 请勿把 sb_secret_... 或 service_role 密钥放进此文件。
window.ECHO_SUPABASE_CONFIG = {
  aiReviewEnabled: true, // Gemini credentials are stored only in the deployed echo-review function Secrets.
  supabaseUrl: "https://cxcegespnafezgckptgs.supabase.co",
  publishableKey: "sb_publishable_f86T_WfGmJMPolRNiDThCw_Dd5cAaKZ"
};
