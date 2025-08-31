import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function WalletSuccess() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('order_id');

  useEffect(() => {
    if (orderId) {
      axios.post(`https://bhavanaastro.onrender.com/api/payment/verify`, { orderId })
        .then(res => {
          alert(`Payment ${res.data.orderStatus}`);
        })
        .catch(err => console.error(err));
    }
  }, [orderId]);

  return <div>Processing your payment... Please wait.</div>;
}

export default WalletSuccess;
