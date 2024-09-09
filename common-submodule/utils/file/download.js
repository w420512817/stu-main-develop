import { openWindow } from '..';
import { dataURLtoBlob, urlToBase64 } from './base64Conver';

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url, filename, mime, bom) {
  urlToBase64(url).then(base64 => {
    downloadByBase64(base64, filename, mime, bom);
  });
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf, filename, mime, bom) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data, filename, mime, bom) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }
}

/**
 * @param {blob} data
 * @param {Sting} fileName
 */
export const download_jsfk = (data, fileName) => {
  if (!data) return;

  let url = window.URL.createObjectURL(new Blob([data]));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

/**
 * Download file according to file address
 * @param {*} Url
 */
export function downloadByA({ url, filename }) {
  const eleLink = document.createElement('a');
  eleLink.href = url;
  eleLink.setAttribute('download', filename);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({ url, target = '_blank', fileName }) {
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1;

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!');
    return false;
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a');
    link.href = url;
    link.target = target;

    if (link.download !== undefined) {
      link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length);
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download';
  }

  openWindow(url, { target });
  return true;
}
/**
 * Download file by type:  xls,xlsx,doc,docx, pdf
 * @param {blob} data
 * @param {Sting} name
 */
export const downloadFile = (obj, name, suffix) => {
  const DOWNLOAD_TYPE_MAP = {
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pdf: 'application/pdf'
  };
  if (!DOWNLOAD_TYPE_MAP[suffix]) {
    throw new Error('请传入文件下载的格式后缀，eg：xls，xlsx，doc，docx，pdf');
  }
  const blob = new Blob([obj], {
    type: DOWNLOAD_TYPE_MAP[suffix]
  });
  const fileName = `${name}.${suffix}`;
  let link = document.createElement('a');
  document.body.appendChild(link);
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href); // 销毁url对象
};
