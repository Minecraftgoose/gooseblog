const fs = require('fs');
const path = require('path');

const FILES = [
  { src: '_headers', dest: '_headers' },
  { src: '_redirects', dest: '_redirects' }
];

hexo.extend.generator.register('goose-extra-assets', function () {
  const out = [];
  for (const item of FILES) {
    const abs = path.join(hexo.source_dir, item.src);
    if (!fs.existsSync(abs)) continue;
    out.push({
      path: item.dest,
      data: fs.readFileSync(abs)
    });
  }
  return out;
});
