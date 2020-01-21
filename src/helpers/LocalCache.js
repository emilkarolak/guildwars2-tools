export default class LocalCache {
  static set = (itemName='', data=null) => {
    try {
      window.localStorage.setItem(itemName, JSON.stringify(data));
      return true;
    } catch(error) {
      throw error;
    }
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