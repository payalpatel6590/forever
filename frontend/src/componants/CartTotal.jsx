import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext.jsx'
import Title from '../componants/Title'

const CartTotal = ({ discount = 0 }) => {

  const { currancy, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subTotal = getCartAmount();

  return (
    <div>
      <div className='w-full'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>
      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>SubTotal</p>
          <p>{currancy}{subTotal}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currancy}{delivery_fee}</p>
        </div>
        {discount > 0 && (
          <div className='flex justify-between text-green-600'>
            <p>Discount</p>
            <p>-{currancy}{discount}</p>
          </div>
        )}
        <hr />
        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currancy}{subTotal === 0 ? 0 : Math.max(0, subTotal + delivery_fee - discount)}</b>
        </div>
      </div>
    </div>
  )
}

export default CartTotal;
