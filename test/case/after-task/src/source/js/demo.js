(() => {
  const boxEl = document.getElementById('box')
  let padding = 0;
  setInterval(() => {
    boxEl.className = `box box--${padding++ % 4}`
  }, 1003)
})()