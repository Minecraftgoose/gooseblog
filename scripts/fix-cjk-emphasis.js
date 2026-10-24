/**
 * GooseBlog —— 中文加粗修复（before_post_render 过滤器）
 *
 * 修什么：
 *   中文里写 `**世人皆慕牡丹国色，皆盼阳光普照。**然而……`
 *   渲染出来星号原样印在页面上，加粗完全没生效。
 *
 * 为什么（这段是重点，别当成"markdown 的 bug"草草改掉）：
 *   CommonMark 对 `**` 能否"闭合"有一套 flank 判定，其中一条是：
 *     右分隔符的前一个字符如果是**标点**，那么它后面必须也是标点
 *     或空白，否则这个 `**` 不算闭合。
 *   而 `。`（U+3002）、`、`、`！` 这些全角标点在 Unicode 里属于 Po 类，
 *   是货真价实的标点；紧跟着的却是"然""既"这类汉字（Lo 类，非标点）。
 *   两个条件都不满足 → `。**` 不是 right-flanking → 加粗不成立，
 *   星号被当成普通文字原样输出。
 *
 *   同理，`**不要直接把 SVG 扔给对话型 AI **`（闭口前多了个空格）
 *   也是非法的：右分隔符前面是空白，压根不算 right-flanking。
 *
 *   这不是 hexo 或 marked 的锅，是 CommonMark 规范本身对 CJK 不友好。
 *   GitHub、Obsidian、Typora 上同样的写法也大概率不生效 —— 只是它们
 *   有的做了容错，marked 严格照规范来，就暴露了。
 *
 * 怎么办：
 *   把"卡在闭合星号前面"的标点和空白挪到星号外面：
 *     `**世人皆慕牡丹国色，皆盼阳光普照。**`  →  `**…阳光普照** 。`
 *     `**不要直接把 SVG 扔给对话型 AI **`     →  `**…对话型 AI** `
 *   语义和视觉效果不变（加粗范围少一个句号，肉眼几乎无差），
 *   但闭合星号前面变成了汉字，right-flanking 成立，加粗生效。
 *
 * ⚠️ 只改正文，绝不能动代码：
 *    围栏代码块 ``` 和行内代码 ` 里出现 `**…。**` 是在讲 markdown 语法
 *    本身（本站 how-to-write-markdown 那篇就是），必须原样保留。
 *    所以先把这两类区域挖出来占位，改完再填回去。
 */

// 全角标点（CJK 常用的收尾标点，U+3002 等都属于 Unicode Po 类）
var CJK_PUNCT = '。，、；：！？）】》」』］｝…·';

// 判断"后一个字符"用的标点集合：全角 + 半角。
// 只需覆盖常见书写符号即可，漏判的后果顶多是"该修的没修"，不会改坏。
var ALL_PUNCT = CJK_PUNCT + '.,;:!?)]>}\'"`~@#$%^&*-_+=/\\|';

// 闭合星号前面卡着的"非法尾巴"：一段全角标点，或一段空白，或两者组合
var BAD_TAIL = '[' + CJK_PUNCT + ']*[ \\t]*';

var RE = new RegExp('(\\*\\*[^\\*\\n]*?)(' + BAD_TAIL + ')(\\*\\*)', 'g');

function isPunct(ch) {
  return ch !== '' && ALL_PUNCT.indexOf(ch) !== -1;
}

function isSpace(ch) {
  return ch === '' || /[\s]/.test(ch);
}

/** 把围栏代码块和行内代码挖成占位符，返回 {text, slots} */
function maskCode(src) {
  var slots = [];
  var out = src
    // 围栏代码块（含 ``` 和 ~~~，语言标记一并吃下）
    .replace(/(^|\n)([ \t]*)(```|~~~)[\s\S]*?\n\2\3[^\n]*/g, function (m) {
      slots.push(m);
      return '\u0000CODE' + (slots.length - 1) + '\u0000';
    })
    // 行内代码：反引号串（长度取与开头相同的连续反引号）
    .replace(/(`+)([\s\S]*?)\1/g, function (m) {
      if (!m.replace(/`/g, '').trim()) return m; // 空 `` 原样放过
      slots.push(m);
      return '\u0000CODE' + (slots.length - 1) + '\u0000';
    });
  return { text: out, slots: slots };
}

function unmaskCode(text, slots) {
  return text.replace(/\u0000CODE(\d+)\u0000/g, function (m, i) {
    return slots[Number(i)];
  });
}

function fixStrong(src) {
  return src.replace(RE, function (all, body, tail, close, offset) {
    // 尾巴是空的说明闭口本来就合法，别动
    if (!tail) return all;
    // 正文整体就是标点/空白（比如 `**。**`），改了会更怪，放过
    if (!body.slice(2).trim()) return all;

    var next = src.charAt(offset + all.length);
    var hasPunct = new RegExp('[' + CJK_PUNCT + ']').test(tail);

    // ⚠️ 标点尾巴不是一律都要修 —— 关键看闭口后面接的是什么。
    //    CommonMark 的 right-flanking 有第二个分支：
    //      "前面是标点"时，只要**后面是空白或标点**，照样算闭合。
    //    所以 `**Q：加载不出数据？**` 这种独占一行 / 后面跟空格的写法
    //    本来就渲染正常，动它只会把问号踢出加粗范围，白白改变观感。
    //    只有"后面紧跟汉字/字母"才是真的闭合不了，这才是要修的。
    if (hasPunct && (isSpace(next) || isPunct(next))) return all;

    // 纯空白尾巴（闭口前多了空格）则一律是坏的：
    // "前面是空白"直接否决 right-flanking，跟后面接什么无关。
    return body + close + tail;
  });
}

hexo.extend.filter.register('before_post_render', function (data) {
  if (!data || typeof data.content !== 'string') return data;

  // front-matter 里的 description / excerpt 不走 markdown 渲染流程，
  // 改它没意义还可能搞坏摘要，只处理 content
  var masked = maskCode(data.content);
  data.content = unmaskCode(fixStrong(masked.text), masked.slots);

  return data;
});
