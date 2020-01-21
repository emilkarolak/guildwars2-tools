import React from 'react';

export default ({data}) => (
  data?Object.keys(data).map((key)=><tr key={key}><th>{key}</th><td>{data[key]}</td></tr>):""
)