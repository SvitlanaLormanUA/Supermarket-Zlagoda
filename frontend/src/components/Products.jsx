import React from 'react';
import SearchAndBack from './SearchAndBack';
import Fetch from '../FetchData';

function Products() {
  return (
    <div>
      <SearchAndBack /> 
      <Fetch />
    </div>
  );
}

export default Products;