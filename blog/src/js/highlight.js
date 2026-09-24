/**
 * GooseBlog — 代码高亮（Prism 驱动）
 *
 * 背景：Prism 自带的自动高亮只在页面初次加载时跑一次，而本站是 SPA，
 * 文章正文是异步 fetch 之后才插进 DOM 的，所以 Prism 永远高亮不到它。
 * 另外原先靠 bootcdn + autoloader 运行时去拉语言包，CDN 一 403 就全站没有高亮。
 *
 * 现在改成：
 *   1. Prism 自托管在 /vendor/prism/（core 已内置 markup/css/clike/javascript）
 *   2. 这里统一在内容渲染完成后触发高亮，并等 Prism 脚本就绪（避免竞态）
 *   3. 再挂一个 MutationObserver 兜底，漏掉的地方也能补上
 */

const READY_TIMEOUT = 8000;   // 等 Prism 脚本就绪的最长时间
const DEBOUNCE = 120;         // MutationObserver 防抖

/**
 * 历史数据兼容：旧版手写 Markdown 解析器把语言名当成了代码第一行，
 * 例如 ```js 会渲染成 <pre><code>js\n真正的代码…</code></pre>。
 * 这里识别出来当作语言，并把这一行从代码里删掉。
 */
const HEAD_LANG_RE = new RegExp(
  '^(?:js|javascript|jsx|ts|typescript|tsx|python|py|bash|sh|shell|zsh|json|jsonc|' +
  'html|xml|svg|css|scss|less|go|golang|sql|yaml|yml|toml|ini|conf|diff|patch|' +
  'rust|rs|java|kt|kotlin|c|h|cpp|c\\+\\+|cc|cs|csharp|php|markdown|md|nginx|' +
  'dockerfile|makefile|regex|http)\\s*(?:\\r?\\n|$)', 'i'
);

/** 语言别名 → Prism 注册名 */
const LANG_ALIAS = {
  js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
  ts: 'typescript', tsx: 'typescript',
  py: 'python', python3: 'python',
  sh: 'bash', shell: 'bash', zsh: 'bash', console: 'bash',
  golang: 'go',
  rs: 'rust',
  yml: 'yaml',
  md: 'markdown',
  'c++': 'cpp', cc: 'cpp', 'c#': 'csharp', cs: 'csharp',
  h: 'c',
  html: 'markup', xml: 'markup', svg: 'markup',
  jsonc: 'json',
  kt: 'kotlin',
  patch: 'diff',
  conf: 'ini',
};

/** 已注册的 Prism 语言数量缓存（用于判断脚本是否加载完） */
function prismReady() {
  return !!(window.Prism && typeof window.Prism.highlightElement === 'function');
}

/** 等 Prism 就绪再执行；超时就放弃，不至于死等 */
function whenPrismReady(cb) {
  if (prismReady()) { cb(); return; }
  const t0 = Date.now();
  (function poll() {
    if (prismReady()) { cb(); return; }
    if (Date.now() - t0 > READY_TIMEOUT) return;
    setTimeout(poll, 50);
  })();
}

/** 从 class 里取语言：支持 language-xxx / lang-xxx / highlight-xxx */
function langFromClass(code) {
  const cls = code.className || '';
  if (!/lang(?:uage)?-/i.test(cls)) return '';
  const m = cls.match(/lang(?:uage)?-([\w#+-]+)/i);
  return m ? m[1].toLowerCase() : '';
}

/** 兜底：对完全没标语言的代码块做保守推断，判断不了就返回空（不强猜） */
function guessLang(text) {
  const t = text.trim();
  if (!t) return '';
  if (/^<\?php/.test(t)) return 'php';
  if (/^#!.*\b(bash|sh|zsh)\b/.test(t)) return 'bash';
  if (/^#!.*\bpython/.test(t)) return 'python';
  if (/^#!.*\bnode\b/.test(t)) return 'javascript';
  if (/^\s*package\s+main\b/m.test(t) && /\bfunc\s/.test(t)) return 'go';
  if (/^\s*<\?(xml|html)/i.test(t) || /<\/html>\s*$/i.test(t) || /^\s*<!DOCTYPE\s+html/i.test(t)) return 'markup';
  if (/^[{[]/.test(t) && /[}\]]\s*$/.test(t) && /"\w+"\s*:/.test(t)) return 'json';
  if (/^\s*(FROM|RUN|ENTRYPOINT|CMD|WORKDIR)\s/m.test(t) && /^\s*(FROM)\s/m.test(t)) return 'docker';
  return '';
}

/** 规范化一个 <code>：确定语言、清掉历史脏首行，返回 Prism 语言名（空串=不高亮） */
function normalizeCode(code) {
  // 历史脏数据：第一行是语言名
  let raw = code.textContent || '';
  const head = raw.match(HEAD_LANG_RE);
  let forced = '';
  if (head) {
    forced = head[0].trim().toLowerCase();
    // 只有当前没有语言 class 时才吃掉首行，避免误删正常代码
    if (!langFromClass(code)) {
      code.textContent = raw.slice(head[0].length).replace(/^\s*\n/, '');
    }
  }

  let lang = langFromClass(code) || forced || guessLang(code.textContent || '');
  if (!lang) return '';
  lang = LANG_ALIAS[lang] || lang;

  // 统一写成 language-xxx，Prism 认这个
  const cls = (code.className || '')
    .split(/\s+/)
    .filter(c => c && !/^lang(?:uage)?-/i.test(c))
    .join(' ');
  code.className = (cls ? cls + ' ' : '') + 'language-' + lang;
  return lang;
}

/**
 * 高亮某个容器内的所有代码块。重复调用安全（已处理的会跳过）。
 * @param {ParentNode} root 默认整个 #root
 */
export function highlightCode(root) {
  const scope = root || document.getElementById('root') || document;
  if (!scope || !scope.querySelectorAll) return;

  whenPrismReady(function() {
    const Prism = window.Prism;
    const codes = scope.querySelectorAll('pre > code');
    codes.forEach(function(code) {
      if (code.dataset.prismDone === '1') return;
      code.dataset.prismDone = '1';
      // 已经被 Prism 处理过的（含 .token）不要再高亮一次，否则 token 会嵌套成乱码
      if (code.querySelector('.token')) return;

      const lang = normalizeCode(code);
      if (!lang) return;
      if (!Prism.languages || !Prism.languages[lang]) {
        // 语言包没加载：退化为纯文本，至少不要炸
        code.dataset.prismLang = lang;
        return;
      }
      try {
        Prism.highlightElement(code);
        // 语言包加载后补高亮用：标记一下真实语言
        code.dataset.prismLang = lang;
      } catch (e) {
        /* 高亮失败不影响正文显示 */
      }
    });
  });
}

/**
 * 全局兜底：DOM 里出现新的 <pre> 就补一次高亮。
 * 即便某个页面忘了手动调用 highlightCode，也不会漏。
 */
export function initCodeHighlight() {
  if (window.__highlightInit) return;
  window.__highlightInit = true;

  let timer = null;
  const schedule = function() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() { timer = null; highlightCode(document); }, DEBOUNCE);
  };

  const rootEl = document.getElementById('root') || document.body;
  if (window.MutationObserver && rootEl) {
    const mo = new MutationObserver(schedule);
    mo.observe(rootEl, { childList: true, subtree: true });
  }

  // 首屏 + 语言包全部到位后各来一次
  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  schedule();
}

// 作为普通 <script type="module"> 引入时自动初始化，并暴露给非模块脚本使用
initCodeHighlight();
window.GooseHighlight = { highlightCode, initCodeHighlight };
