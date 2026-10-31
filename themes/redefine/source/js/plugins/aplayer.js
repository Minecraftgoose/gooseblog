(function() {
  const audioList = [];
  const isFixed = theme.plugins.aplayer.type === "fixed";
  const isMini = theme.plugins.aplayer.type === "mini";

  for (const audio of theme.plugins.aplayer.audios) {
    const audioObj = {
      name: audio.name,
      artist: audio.artist,
      url: audio.url,
      cover: audio.cover,
      lrc: audio.lrc,
      theme: audio.theme,
    };
    audioList.push(audioObj);
  }

  if (isMini) {
    new APlayer({
      container: document.getElementById("aplayer"),
      mini: true,
      audio: audioList,
    });
  } else if (isFixed) {
    const player = new APlayer({
      container: document.getElementById("aplayer"),
      fixed: true,
      lrcType: 3,
      audio: audioList,
    });
    // 原版这里无条件 click() 强制展开歌词面板。当前歌单没人配 lrc，
    // 展开后只会撑出一块 90px 高的空白歌词条（.aplayer-withlrc 会加高容器）。
    // 改成"只有列表里真有歌词才展开"：以后给某首歌补上 lrc 会自动恢复，
    // 不用再回来改代码。querySelector 可能为 null，也一并判掉。
    const hasLrc = audioList.some(function (a) { return !!a.lrc; });
    if (hasLrc) {
      const lrcBtn = document.querySelector(".aplayer-icon-lrc");
      if (lrcBtn) lrcBtn.click();
    }
  }
})();