import { Link, useParams } from 'react-router-dom';


function SellerOffice() {
  const { memberId } = useParams();
	
	
    return (
      <div style={{ backgroundColor: 'saddlebrown'}}>
        <ul>
        {/* <li><Link to="/">Login Page</Link></li> */}
        <li><Link to={`/SellerSearchGroup/${memberId}`}>搜尋社群</Link></li>
        <li><Link to={`/AddProduct/${memberId}`}>新增團購商品</Link></li>
        <li><Link to={`/MyOrder/${memberId}`}>我的訂單</Link></li>
        <li><Link to={`/SellerChats/${memberId}`}>我的訊息</Link></li>
        
        {/* <li><Link to={`/MyPage/${memberId}`}>My Page</Link></li> */}
        {/* Add more navigation links as needed */}
      </ul>

              
      </div>
    );
  }
  
export default SellerOffice;