(() => {
  "use strict";

  const TABLE = "echo_learning_profiles";
  const STATUS_TEXT = {
    local: "仅本地",
    offline: "等待联网",
    syncing: "同步中…",
    synced: "已同步",
    error: "同步异常"
  };

  let client = null;
  let app = null;
  let currentUser = null;
  let syncTimer = null;
  let syncPromise = null;
  let initialized = false;
  let authEpoch = 0;

  const clone = value => JSON.parse(JSON.stringify(value || {}));
  const config = () => window.ECHO_SUPABASE_CONFIG || {};
  const configured = () => {
    const { supabaseUrl, publishableKey } = config();
    return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(supabaseUrl || "")
      && /^sb_publishable_/.test(publishableKey || "");
  };

  function setStatus(status, detail = "") {
    const label = STATUS_TEXT[status] || status;
    document.querySelectorAll("[data-cloud-status]").forEach(node => {
      node.dataset.state = status;
      node.title = detail || label;
      const text = node.querySelector("[data-cloud-status-text]");
      if (text) text.textContent = label;
    });
    const dialogStatus = document.querySelector("#cloudStatusText");
    if (dialogStatus) dialogStatus.textContent = detail || label;
  }

  function renderAccount() {
    const signedOut = document.querySelector("#signedOutPanel");
    const signedIn = document.querySelector("#signedInPanel");
    const email = document.querySelector("#accountEmail");
    const buttons = document.querySelectorAll("[data-account-button]");
    const ready = configured() && Boolean(window.supabase?.createClient);

    if (signedOut) signedOut.hidden = Boolean(currentUser);
    if (signedIn) signedIn.hidden = !currentUser;
    if (email) email.textContent = currentUser?.email || "";
    buttons.forEach(button => {
      button.classList.toggle("signed-in", Boolean(currentUser));
      button.setAttribute("aria-label", currentUser ? `账号 ${currentUser.email}` : "登录并同步");
    });

    const setup = document.querySelector("#cloudSetupNote");
    if (setup) setup.hidden = ready;
    const form = document.querySelector("#authForm");
    if (form) form.hidden = !ready;
  }

  function mergeCountMap(remote = {}, local = {}) {
    const merged = { ...remote };
    Object.entries(local).forEach(([key, value]) => {
      merged[key] = Math.max(Number(merged[key]) || 0, Number(value) || 0);
    });
    return merged;
  }

  function mergeCustom(remote = [], local = []) {
    const unique = new Map();
    [...remote, ...local].forEach(item => {
      if (!item?.cn || !item?.en) return;
      unique.set(`${item.cn}|||${item.en}`, item);
    });
    return [...unique.values()];
  }

  function mergeMistakes(remote = {}, local = {}) {
    const merged = { ...remote };
    Object.entries(local).forEach(([key, item]) => {
      if (!merged[key] || Number(item?.count || 0) >= Number(merged[key]?.count || 0)) merged[key] = item;
    });
    return merged;
  }

  function mergeStates(localState = {}, remoteState = {}) {
    const local = clone(localState);
    const remote = clone(remoteState);
    const localTime = Date.parse(local.updatedAt || 0) || 0;
    const remoteTime = Date.parse(remote.updatedAt || 0) || 0;
    const localReset = Date.parse(local.resetAt || 0) || 0;
    const remoteReset = Date.parse(remote.resetAt || 0) || 0;
    if (localReset > remoteTime && localReset >= remoteReset) return { ...local, updatedAt: new Date().toISOString() };
    if (remoteReset > localTime && remoteReset > localReset) return { ...remote, updatedAt: new Date().toISOString() };
    const latest = localTime >= remoteTime ? local : remote;
    return {
      ...remote,
      ...local,
      custom: mergeCustom(remote.custom, local.custom),
      mistakes: mergeMistakes(remote.mistakes, local.mistakes),
      mastered: mergeCountMap(remote.mastered, local.mastered),
      activity: { ...(remote.activity || {}), ...(local.activity || {}) },
      dailyAnswers: mergeCountMap(remote.dailyAnswers, local.dailyAnswers),
      attempts: Math.max(Number(remote.attempts) || 0, Number(local.attempts) || 0),
      correct: Math.max(Number(remote.correct) || 0, Number(local.correct) || 0),
      lastIndex: Number(latest.lastIndex) || 0,
      updatedAt: new Date(Math.max(localTime, remoteTime, Date.now())).toISOString()
    };
  }

  async function pullAndMerge() {
    if (!client || !currentUser || !app) return null;
    const { data, error } = await client
      .from(TABLE)
      .select("state_json, revision, updated_at")
      .eq("user_id", currentUser.id)
      .maybeSingle();
    if (error) throw error;
    const local = app.getState();
    const merged = data ? mergeStates(local, data.state_json) : clone(local);
    app.replaceState(merged);
    return { merged, remote: data };
  }

  async function syncNow({ quiet = false } = {}) {
    if (!currentUser || !client || !app) return;
    if (!navigator.onLine) {
      setStatus("offline", "离线中，联网后会自动同步");
      return;
    }
    if (syncPromise) return syncPromise;

    syncPromise = (async () => {
      setStatus("syncing");
      try {
        const result = await pullAndMerge();
        if (!result) return;
        const { error } = await client.from(TABLE).upsert({
          user_id: currentUser.id,
          state_json: result.merged
        }, { onConflict: "user_id" });
        if (error) throw error;
        setStatus("synced", `已同步 · ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`);
        if (!quiet) app.toast("学习记录已同步到云端");
      } catch (error) {
        console.error("Echo cloud sync failed", error);
        setStatus("error", error.message || "同步失败，请稍后重试");
        if (!quiet) app.toast(`同步失败：${friendlyError(error)}`, 3200);
      } finally {
        syncPromise = null;
      }
    })();
    return syncPromise;
  }

  function scheduleSync() {
    if (!currentUser || !client) return;
    clearTimeout(syncTimer);
    setStatus(navigator.onLine ? "syncing" : "offline");
    syncTimer = setTimeout(() => syncNow({ quiet: true }), 900);
  }

  function friendlyError(error) {
    const message = String(error?.message || error || "未知错误");
    if (/invalid login credentials/i.test(message)) return "邮箱或密码不正确";
    if (/email not confirmed/i.test(message)) return "请先在邮箱中完成验证";
    if (/already registered|already been registered/i.test(message)) return "该邮箱已经注册";
    if (/failed to fetch|network/i.test(message)) return "网络连接不可用";
    if (/echo_learning_profiles/i.test(message)) return "请先在 Supabase SQL Editor 执行建表脚本";
    return message;
  }

  async function handleSession(session, epoch) {
    if (epoch !== authEpoch) return;
    const nextUser = session?.user || null;
    if (nextUser?.id === currentUser?.id) {
      renderAccount();
      return;
    }
    currentUser = nextUser;
    renderAccount();
    if (currentUser) {
      app.activateAccount(currentUser.id);
      setStatus(navigator.onLine ? "syncing" : "offline");
      await syncNow({ quiet: true });
    } else {
      app.activateAnonymous();
      setStatus("local", configured() ? "未登录 · 数据保存在本机" : "Supabase 尚未配置");
    }
  }

  async function signIn() {
    const email = document.querySelector("#authEmail")?.value.trim();
    const password = document.querySelector("#authPassword")?.value;
    if (!email || !password) return app.toast("请输入邮箱和密码");
    setStatus("syncing", "正在登录…");
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error", friendlyError(error));
      app.toast(friendlyError(error), 3000);
      return;
    }
    document.querySelector("#authForm")?.reset();
    app.toast("登录成功，正在合并学习记录");
  }

  async function signUp() {
    const email = document.querySelector("#authEmail")?.value.trim();
    const password = document.querySelector("#authPassword")?.value;
    if (!email || !password) return app.toast("请输入邮箱和密码");
    if (password.length < 6) return app.toast("密码至少需要 6 位");
    setStatus("syncing", "正在创建账号…");
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) {
      setStatus("error", friendlyError(error));
      app.toast(friendlyError(error), 3000);
      return;
    }
    document.querySelector("#authForm")?.reset();
    if (data.session) app.toast("账号创建成功，正在同步");
    else {
      setStatus("local", "验证邮件已发送");
      app.toast("注册成功，请到邮箱完成验证后登录", 4200);
    }
  }

  async function signOut() {
    clearTimeout(syncTimer);
    await syncNow({ quiet: true });
    const { error } = await client.auth.signOut();
    if (error) return app.toast(friendlyError(error), 3000);
    document.querySelector("#accountDialog")?.close();
    app.toast("已退出账号，本机数据仍然保留");
  }

  function bindUI() {
    document.querySelectorAll("[data-account-button]").forEach(button => {
      button.addEventListener("click", () => document.querySelector("#accountDialog")?.showModal());
    });
    document.querySelector("#signInBtn")?.addEventListener("click", signIn);
    document.querySelector("#signUpBtn")?.addEventListener("click", signUp);
    document.querySelector("#authForm")?.addEventListener("submit", event => { event.preventDefault(); signIn(); });
    document.querySelector("#signOutBtn")?.addEventListener("click", signOut);
    document.querySelector("#syncNowBtn")?.addEventListener("click", () => syncNow());
    window.addEventListener("online", () => currentUser ? syncNow({ quiet: true }) : setStatus("local"));
    window.addEventListener("offline", () => setStatus("offline", "离线中，所有练习仍可使用"));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && currentUser) syncNow({ quiet: true });
    });
  }

  async function init(appAdapter) {
    if (initialized) return;
    initialized = true;
    app = appAdapter;
    bindUI();
    renderAccount();

    if (!configured()) {
      setStatus("local", "缺少 SUPABASE_URL · 当前仅保存在本机");
      return;
    }
    if (!window.supabase?.createClient) {
      setStatus("error", "Supabase 客户端未载入，请检查网络");
      return;
    }

    const { supabaseUrl, publishableKey } = config();
    client = window.supabase.createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    const epoch = ++authEpoch;
    const { data, error } = await client.auth.getSession();
    if (error) setStatus("error", friendlyError(error));
    else await handleSession(data.session, epoch);

    client.auth.onAuthStateChange((_event, session) => {
      const nextEpoch = ++authEpoch;
      setTimeout(() => handleSession(session, nextEpoch), 0);
    });
  }

  window.EchoCloud = { init, scheduleSync, syncNow, mergeStates };
})();
