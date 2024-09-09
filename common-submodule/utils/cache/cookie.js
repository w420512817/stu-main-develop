export default {
  // 读取 cookie
  get: function (name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  },
  // 设置 cookie
  set: function (name, value, expires, path, domain, secure) {
    const cookie = [];
    cookie.push(name + '=' + encodeURIComponent(value));
    if (expires instanceof Date) {
      cookie.push('expires=' + expires.toUTCString());
    }
    if (path) {
      cookie.push('path=' + path);
    }
    if (domain) {
      cookie.push('domain=' + domain);
    }
    if (secure) {
      cookie.push('secure');
    }
    document.cookie = cookie.join('; ');
  },
  // 删除 cookie
  remove: function (name, path, domain) {
    this.set(name, '', new Date(0), path, domain);
  }
};
