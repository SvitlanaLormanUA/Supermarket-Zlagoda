import React from 'react';
import BackButton from './BackButton';
import Fetch from '../FetchData';

function Products() {
  return (
    <div>
      <BackButton /> 
      <Fetch />
    </div>
  );
}

export default Products;