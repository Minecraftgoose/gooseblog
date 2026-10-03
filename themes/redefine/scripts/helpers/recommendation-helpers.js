/*
 * Optimized by: EvanNotFound
 */

const articleLibrary = [];
const corpus = [];
let flag = null;

hexo.extend.filter.register("template_locals", function (localVariables) {
  const cfg = hexo.theme.config.articles.recommendation;
  if (!cfg.enable) {
    return localVariables;
  }
  if (!flag) {
    flag = 1;
    fetchData(localVariables.site.posts, cfg);
    fetchData(localVariables.site.pages, cfg);
    articleRecommendation(cfg);
  }
  return localVariables;
});

function fetchData(s, cfg) {
  s.each(function (p) {
    if (["post", "docs"].includes(p.layout)) {
      articleLibrary.push({
        path: p.path,
        title: p.title || p.seo_title || p.short_title,
        headimg: p.thumbnail || p.banner || p.cover || cfg.placeholder,
      });
      corpus.push(tokenize(p.raw));
    }
  });
}

function cleanData(data) {
  const symbolLists = [
    ",",
    ".",
    "?",
    "!",
    ":",
    ";",
    "、",
    "……",
    "~",
    "&",
    "@",
    "#",
    "，",
    "。",
    "？",
    "！",
    "：",
    "；",
    "·",
    "…",
    "～",
    "＆",
    "＠",
    "＃",
    "“",
    "”",
    "‘",
    "’",
    "〝",
    "〞",
    '"',
    "'",
    "＂",
    "＇",
    "´",
    "＇",
    "(",
    ")",
    "【",
    "】",
    "《",
    "》",
    "＜",
    "＞",
    "﹝",
    "﹞",
    "<",
    ">",
    "(",
    ")",
    "[",
    "]",
    "«",
    "»",
    "‹",
    "›",
    "〔",
    "〕",
    "〈",
    "〉",
    "{",
    "}",
    "［",
    "］",
    "「",
    "」",
    "｛",
    "｝",
    "〖",
    "〗",
    "『",
    "』",
    "︵",
    "︷",
    "︹",
    "︿",
    "︽",
    "﹁",
    "﹃",
    "︻",
    "︗",
    "/",
    "|",
    "\\",
    "︶",
    "︸",
    "︺",
    "﹀",
    "︾",
    "﹂",
    "﹄",
    "﹄",
    "︼",
    "︘",
    "／",
    "｜",
    "＼",
    "_",
    "¯",
    "＿",
    "￣",
    "﹏",
    "﹋",
    "﹍",
    "﹉",
    "﹎",
    "﹊",
    "`",
    "ˋ",
    "¦",
    "︴",
    "¡",
    "¿",
    "^",
    "ˇ",
    "­",
    "¨",
    "ˊ",
    " ",
    "　",
    "%",
    "*",
    "-",
    "+",
    "=",
    "￥",
    "$",
    "（",
    "）",
  ];
  data = data.replace(/\s/g, " ");
  data = data.replace(/\!\[(.*?)\]\(.*?\)/g, (_a, b) => {
    return b;
  });
  data = data.replace(
    /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g,
    " ",
  );
  for (const symbol of symbolLists) {
    data = data.replace(new RegExp("\\" + symbol, "g"), " ");
  }
  data = data.replace(/\d+/g, " ");
  data = data.replace(/\s/g, " ");
  return data;
}

/**
 * 分词。
 *
 * ⚠️ 原版是 `const jieba = require("nodejieba")` 写死在顶上：nodejieba 是原生模块，
 *    要 C++ 编译环境（python + make + g++），Windows / 新版 Node 上经常装不上，
 *    一旦 require 抛错，整个 hexo generate 直接崩，站点都发不出去 ——
 *    一个"锦上添花"的推荐功能不该有这种权限。
 *
 *    所以改成：能 require 到就用 jieba（分词更准），require 不到就退回内置的无词典
 *    分词（中文按字 + 相邻二字 bigram，英文按词），效果差一档但零依赖、永不失败。
 *    装了 nodejieba 想验证是否生效，构建日志里会打印用的是哪套。
 */
let jiebaModule; // undefined = 还没试过；false = 试过但没装
function getJieba() {
  if (jiebaModule !== undefined) return jiebaModule;
  try {
    jiebaModule = require("nodejieba");
  } catch (e) {
    jiebaModule = false;
    if (hexo && hexo.log) {
      hexo.log.warn(
        "[redefine] 未安装 nodejieba，推荐阅读改用内置分词（效果略差，不影响构建）。" +
          "想要更准的中文分词：npm i nodejieba（需 C++ 编译环境）。",
      );
    }
  }
  return jiebaModule;
}

/** jieba 缺席时的兜底分词：中文单字 + 相邻二字 bigram，英文/数字按词 */
function tokenizeFallback(data) {
  const CJK = /[\u4e00-\u9fff\u3400-\u4dbf]/;
  const out = [];
  for (const seg of String(data).split(/\s+/)) {
    if (!seg) continue;
    // 纯 ASCII 直接当整词
    if (!CJK.test(seg)) {
      if (seg.length > 1) out.push(seg.toLowerCase());
      continue;
    }
    const chars = Array.from(seg);
    for (let i = 0; i < chars.length; i++) {
      if (!CJK.test(chars[i])) continue;
      out.push(chars[i]);
      // bigram：相邻两个都是汉字才成词，跨过标点/英文不硬拼
      if (i + 1 < chars.length && CJK.test(chars[i + 1])) {
        out.push(chars[i] + chars[i + 1]);
      }
    }
    const latin = seg.match(/[A-Za-z]{2,}/g);
    if (latin) out.push(...latin.map((w) => w.toLowerCase()));
  }
  return out;
}

function tokenize(data) {
  const cleaned = cleanData(data);
  const jieba = getJieba();
  let words = jieba
    ? jieba.cut(cleaned, true)
    : tokenizeFallback(cleaned);
  words = words.filter((word) => word && word !== " " && !/^[0-9]*$/.test(word));
  // 空词表会让后面的词频计算变成 0/0 = NaN，整张相似度矩阵全废，
  // 塞个占位词保证分母不为零（这篇文章的推荐质量差，但不会连累别人）
  if (!words.length) words = ["\u2014"];
  return words;
}

function cosineSimilarity(vector1, vector2) {
  let numerator = 0;
  let sqrt1 = 0;
  let sqrt2 = 0;
  if (vector1.length == vector2.length) {
    for (let i = 0; i < vector1.length; i++) {
      numerator += vector1[i] * vector2[i];
      sqrt1 += vector1[i] * vector1[i];
      sqrt2 += vector2[i] * vector2[i];
    }
    return numerator / (Math.sqrt(sqrt1) * Math.sqrt(sqrt2));
  }
}

function createWordLibrary(allWords) {
  const wordLibrary = {};
  allWords.forEach((word) => {
    wordLibrary[word] = 0;
  });
  return wordLibrary;
}

function calculateWordFrequency(wordLibrary, wordsInArticle) {
  const wordOccurrenceLibrary = wordsInArticle.reduce(
    (wordCountObj, wordName) => {
      if (wordName in wordCountObj) {
        wordCountObj[wordName]++;
      }
      return wordCountObj;
    },
    JSON.parse(JSON.stringify(wordLibrary)),
  );

  const wordFrequency = JSON.parse(JSON.stringify(wordLibrary));
  for (const word of Object.keys(wordLibrary)) {
    wordFrequency[word] = wordOccurrenceLibrary[word] / wordsInArticle.length;
  }
  return wordFrequency;
}

function articleRecommendation(cfg) {
  const dataSet = {};
  const similaritySet = {};
  const recommendationSet = {};
  let allWordsInAllArticles = [];

  for (const wordList of corpus) {
    allWordsInAllArticles = [
      ...new Set(allWordsInAllArticles.concat(wordList)),
    ];
  }

  const wordLibrary = createWordLibrary(allWordsInAllArticles);
  const documentCountLibrary = JSON.parse(JSON.stringify(wordLibrary));

  for (let i = 0; i < corpus.length; i++) {
    const articlePath = articleLibrary[i].path;
    const wordsInArticle = corpus[i];

    const wordFrequency = calculateWordFrequency(wordLibrary, wordsInArticle);
    dataSet[articlePath] = { wordFrequency };

    for (const word of Object.keys(wordLibrary)) {
      if (wordFrequency[word]) {
        documentCountLibrary[word]++;
      }
    }
  }

  for (let i = 0; i < corpus.length; i++) {
    const articlePath = articleLibrary[i].path;
    dataSet[articlePath]["inverseDocumentFrequency"] = JSON.parse(
      JSON.stringify(wordLibrary),
    );
    dataSet[articlePath]["wordFrequency-inverseDocumentFrequency"] = JSON.parse(
      JSON.stringify(wordLibrary),
    );
    dataSet[articlePath]["wordFrequencyVector"] = [];
    for (const word of Object.keys(wordLibrary)) {
      const inverseDocumentFrequency = Math.log(
        corpus.length / (documentCountLibrary[word] + 1),
      );
      const wordFrequencyInverseDocumentFrequency =
        dataSet[articlePath]["wordFrequency"][word] * inverseDocumentFrequency;
      dataSet[articlePath]["wordFrequencyVector"].push(
        wordFrequencyInverseDocumentFrequency,
      );
    }
  }

  for (let i = 0; i < corpus.length; i++) {
    const articlePath1 = articleLibrary[i].path;
    similaritySet[articlePath1] = {};
    for (let j = 0; j < corpus.length; j++) {
      const articlePath2 = articleLibrary[j].path;
      similaritySet[articlePath1][articlePath2] = cosineSimilarity(
        dataSet[articlePath1]["wordFrequencyVector"],
        dataSet[articlePath2]["wordFrequencyVector"],
      );
    }
    for (let j = 0; j < corpus.length; j++) {
      recommendationSet[articlePath1] = Object.keys(
        similaritySet[articlePath1],
      ).sort(function (a, b) {
        return similaritySet[articlePath1][b] - similaritySet[articlePath1][a]; // Descending order
      });
    }
    const index = recommendationSet[articlePath1].indexOf(articlePath1);
    if (index > -1) {
      recommendationSet[articlePath1].splice(index, 1);
    }
    recommendationSet[articlePath1] = recommendationSet[articlePath1].slice(
      0,
      cfg.limit,
    );
    for (let j = 0; j < recommendationSet[articlePath1].length; j++) {
      const e = recommendationSet[articlePath1][j];
      recommendationSet[articlePath1][j] = articleLibrary.filter(
        (w) => w.path == e,
      )[0];
    }
  }
  hexo.locals.set("recommendationSet", function () {
    return recommendationSet;
  });
}

hexo.extend.helper.register("articleRecommendationGenerator", function (post) {
  if (!post) return "";
  const cfg = hexo.theme.config.articles.recommendation;
  if (!cfg.enable) {
    return "";
  }
  for (const dir of cfg.skip_dirs) {
    if (new RegExp("^" + dir, "g").test(post.path)) {
      return "";
    }
  }
  let recommendationSet = hexo.locals.get("recommendationSet");
  // 主题存进来的是一个惰性求值的函数（return recommendationSet），
  // 新版 hexo 的 Locals.get 会自动执行它，但老版本 / 其它调用路径未必。
  // 这里统一展开一次，免得拿到函数后 [post.path] 取不到东西、推荐整块空白。
  if (typeof recommendationSet === "function") recommendationSet = recommendationSet();
  // 没跑出结果（该页没进语料库 / 只有一篇文章 / 分词全空）时静默降级为"不显示推荐"，
  // 原版这里直接 for...of undefined 抛 TypeError，构建期整站崩掉。
  const recommendedArticles = (recommendationSet && recommendationSet[post.path]) || [];
  if (!recommendedArticles.length) return "";
  return userInterface(recommendedArticles, cfg);
});

function userInterface(recommendedArticles, cfg) {
  let html = "";
  let htmlMobile = "";
  for (const item of recommendedArticles) {
    html += itemInterface(item);
  }
  for (const itemMobile of recommendedArticles.slice(0, cfg.mobile_limit)) {
    htmlMobile += itemInterface(itemMobile);
  }
  return `
  <div class="recommended-article px-2 sm:px-6 md:px-8">
   <div class="recommended-desktop">
    <div class="recommended-article-header text-xl md:text-3xl font-bold mt-10">
     <i aria-hidden="true"></i><span>${cfg.title}</span>
    </div>
    <div class="recommended-article-group">${html}</div>
   </div>
   <div class="recommended-mobile">
   <div class="recommended-article-header text-xl md:text-3xl font-bold mt-10">
     <i aria-hidden="true"></i><span>${cfg.title}</span>
   </div>
   <div class="recommended-article-group">${htmlMobile}</div>
   </div>
  </div>`;
}

function itemInterface(item) {
  const url = hexo.extend.helper.get('url_for').call(hexo, item.path);
  return `<a class="recommended-article-item" href="${url}" title="${item.title}" rel="bookmark">
  <img src="${item.headimg}" alt="${item.title}" class="!max-w-none">
  <span class="title">${item.title}</span>
</a>`;
}
