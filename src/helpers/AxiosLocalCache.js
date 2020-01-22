import axios from 'axios';
import LocalCache from './LocalCache';

export function AxiosLocalCache(getUrl=false, ttl=0, callback=false) {
  if(getUrl) {
    let cache = null;
    LocalCache.get(getUrl).then(response => {
      cache = response;
      if(cache) if(cache.ttl) if(new Date(cache.ttl) < new Date()) cache = null;
      if(cache && callback) callback(cache);
    }).catch(error => console.log(error))
    if(!cache) {
      axios({
        method: "GET",
        url: getUrl,
        responseType: "json"
      }).then(response => {
        if(response.data) {
          if(ttl>0) {
            var t = new Date();
            t.setSeconds(t.getSeconds() + ttl);
            response.data.ttl = t;
          } else {
            response.data.ttl = false;
          }
          LocalCache.set(getUrl, response.data).catch(error => console.log(error))
          if(callback) callback(response.data);
        }
      });
    }
  }
}