import React from 'react';
import Row from './Row';

export default ({data}) => (
  <>
    {data?
    <>
        <h3>Account Info</h3>
        <table className="mt-2" cellPadding="10">
            <tbody><Row data={data} /></tbody>
        </table>
    </>
    :""}
  </>
)