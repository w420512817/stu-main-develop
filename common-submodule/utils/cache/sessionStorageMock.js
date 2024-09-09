// 在上面的代码中，我们添加了一个名为 expires 的参数，用于指定 cookie 的过期时间。如果 expires 的值为 "session"，则将 cookie 的过期时间设置为会话结束；如果 expires 是一个数字，则将 cookie 的过期时间设置为指定的天数。注意，这里的天数是指从当前时间开始计算的天数。

// 在 setItem 方法中，我们根据传入的 expires 参数，来设置 cookie 的过期时间。如果 expires 的值为 "session"，则将 cookie 的过期时间设置为 0，即会话结束；如果 expires 是一个数字，则将 cookie 的过期时间设置为指定的天数。

export default {
  // 存储数据
  setItem: function (key, value, expires) {
    let cookieStr = key + '=' + JSON.stringify(value) + '; path=/';
    if (expires === 'session') {
      cookieStr += '; expires=0';
    } else if (expires) {
      const date = new Date();
      date.setTime(date.getTime() + 8 * 60 * 60 * 1000 + expires * 24 * 60 * 60 * 1000);
      cookieStr += '; expires=' + date.toGMTString();
    }
    document.cookie = cookieStr;
  },
  // 读取数据
  getItem: function (key) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0] === key) {
        return JSON.parse(decodeURIComponent(cookie[1]));
      }
    }
    return null;
  },
  // 删除数据
  removeItem: function (key) {
    document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  }
};
