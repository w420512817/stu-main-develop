const Print = function (dom, options) {
  if (!(this instanceof Print)) return new Print(dom, options);

  this.options = this.extend(
    {
      noPrint: '.no-print'
    },
    options
  );

  if (typeof dom === 'string') {
    this.dom = document.querySelector(dom);
  } else {
    this.isDOM(dom);
    this.dom = this.isDOM(dom) ? dom : dom.$el;
  }

  this.init();
};
Print.prototype = {
  init: function () {
    let content = this.getStyle() + this.getHtml();
    this.dropImg();
    this.writeIframe(content);
  },
  extend: function (obj, obj2) {
    for (let k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  },

  getStyle: function () {
    let str = '',
      styles = document.querySelectorAll('style,link');
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }

    str += '<style>' + (this.options.noPrint ? this.options.noPrint : '.no-print') + '{display:none;}</style>';
    str += '<style>html,body,div{height: auto!important;margin:0;padding:0}</style>';
    return str;
  },
  dropImg: function () {
    // 清除已经有的img
    let isNeedRemove = document.querySelectorAll('.isNeedRemove');
    isNeedRemove.forEach(item => {
      item.parentNode.removeChild(item);
    });
  },
  getHtml: function () {
    let inputs = this.dom.querySelectorAll('input');
    let textareas = this.dom.querySelectorAll('textarea');
    let selects = this.dom.querySelectorAll('select');
    let canvass = this.dom.querySelectorAll('canvas');
    let svgs = this.dom.querySelectorAll('svg');
    for (let k = 0; k < inputs.length; k++) {
      if (inputs[k].type == 'checkbox' || inputs[k].type == 'radio') {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute('checked', 'checked');
        } else {
          inputs[k].removeAttribute('checked');
        }
      } else if (inputs[k].type == 'text') {
        inputs[k].setAttribute('value', inputs[k].value);
      } else {
        inputs[k].setAttribute('value', inputs[k].value);
      }
    }

    for (let k2 = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type == 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value;
      }
    }

    for (let k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type == 'select-one') {
        let child = selects[k3].children;
        for (let i in child) {
          if (child[i].tagName == 'OPTION') {
            if (child[i].selected == true) {
              child[i].setAttribute('selected', 'selected');
            } else {
              child[i].removeAttribute('selected');
            }
          }
        }
      }
    }
    for (let k6 = 0; k6 < svgs.length; k6++) {
      let svgstr = svgs[k6].parentNode.innerHTML;
      let img = document.createElement('img');
      img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgstr))));
      img.className = 'isNeedRemove';
      svgs[k6].style.display = 'none';
      svgs[k6].parentNode.insertBefore(img, svgs[k6].nextElementSibling);
    }
    // canvass echars图表转为图片
    for (let k4 = 0; k4 < canvass.length; k4++) {
      let imageURL = canvass[k4].toDataURL('image/png');
      let img = document.createElement('img');
      img.src = imageURL;
      img.setAttribute('style', 'max-width: 100%;');
      img.className = 'isNeedRemove';
      canvass[k4].style.display = 'none';
      canvass[k4].parentNode.insertBefore(img, canvass[k4].nextElementSibling);
    }
    return this.dom.outerHTML;
  },

  writeIframe: function (content) {
    let w,
      doc,
      iframe = document.createElement('iframe'),
      f = document.body.appendChild(iframe);
    iframe.id = 'myIframe';
    // iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";
    iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;');
    w = f.contentWindow || f.contentDocument;
    doc = f.contentDocument || f.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
    let _this = this;
    iframe.onload = function () {
      _this.toPrint(w);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 100);
    };
  },

  toPrint: function (frameWindow) {
    try {
      setTimeout(function () {
        frameWindow.focus();
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print();
          }
        } catch (e) {
          frameWindow.print();
        }
        frameWindow.close();
      }, 10);
    } catch (err) {
      console.log('err', err);
    }
  },
  isDOM:
    typeof HTMLElement === 'object'
      ? function (obj) {
          return obj instanceof HTMLElement;
        }
      : function (obj) {
          return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        }
};
export default Print;
