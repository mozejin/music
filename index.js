(async () => {
  /**
   * 从网络获取歌词数据
   * @returns Promise
   */
  async function getLrc() {
    return await fetch('https://study.duyiedu.com/api/lyrics')
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }

  //获取dom元素
  const doms = {
    lrc: document.querySelector('.lrc'),
    audio: document.querySelector('audio'),
  };
  const size = {
    liHeight: 30,
    containerHeight: 420,
  };

  let lrcData;

  //初始化页面
  async function init() {
    const data = await getLrc();
    lrcData = data
      .split('\n')
      .filter((item) => item)
      .map((item) => {
        const parts = item.split(']');
        const timeParts = parts[0].replace('[', '').split(':');

        return {
          lyrics: parts[1],
          time: +timeParts[0] * 60 + +timeParts[1],
        };
      });
    console.log(lrcData);
    const li = lrcData
      .map((item) => {
        return `<li>${item.lyrics}</li>`;
      })
      .join('');
    doms.lrc.innerHTML = li;
  }

  await init();

  //交互
  doms.audio.addEventListener('timeupdate', function () {
    setStatus(this.currentTime);
  });

  /**
   * 根据播放时间设置歌词状态
   * @param {*} time
   */
  function setStatus(time) {
    time += 0.5;
    const active = document.querySelector('.active');
    //一开始是没有active的，所以地判断一下，有再去清除，不然会报错
    active && active.classList.remove('active');
    let index =
      lrcData.findIndex((item) => {
        return item.time > time;
      }) - 1;
    //一开始是-1不做处理
    if (index < 0) {
      return;
    }
    doms.lrc.children[index].classList.add('active');
    let top =
      size.liHeight * index + size.liHeight / 2 - size.containerHeight / 2;
    if (top < 0) {
      top = 0;
    }
    doms.lrc.style.transform = `translateY(${-top}px)`;
  }
})();
