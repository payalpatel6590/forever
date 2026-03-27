import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext.jsx'
import Title from '../componants/Title'
import ProductItem from '../componants/ProductItem'

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);

  const related = useMemo(() => {
    if (!products.length) return [];
    let copy = products.slice();
    if (category) copy = copy.filter((item) => item.category === category);
    if (subCategory) copy = copy.filter((item) => item.subCategory === subCategory);
    return copy.slice(0, 5);
  }, [products, category, subCategory]);

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item) => (
          <ProductItem key={item._id} name={item.name} id={item._id} price={item.price} image={item.image} />
        ))}
      </div>
             
    </div>
  )
}

export default RelatedProducts
