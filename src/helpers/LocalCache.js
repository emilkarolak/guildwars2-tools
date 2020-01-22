export default class LocalCache {
  static set = (itemName='', data=null) => {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.setItem(itemName, JSON.stringify(data));
        resolve(true);
      } catch(error) {
        reject(error);
      }
    })
  }
  static get = (itemName='') => {
    return new Promise((resolve, reject) => {
      try {
        let data = null;
        data = JSON.parse(window.localStorage.getItem(itemName));
        resolve(data);
      } catch(error) {
        reject(error);
      }
    })
  }
}