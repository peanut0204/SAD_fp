import { Link } from 'react-router-dom';
import '../css/Navbar.css';

function Navbar({memberId}) {
  return (
    <div class="sidebar">
      <ul>
        {/* <li><Link to="/">Login Page</Link></li> */}
        <li><Link to={`/SearchFood/${memberId}`}>首頁</Link></li>
        <li><Link to={`/Notifications/${memberId}`}>通知中心</Link></li>
        <li><Link to={`/MyGroup/${memberId}`}>我的團購群</Link></li>
        <li><Link to={`/BuildGroup/${memberId}`}>建立團購群</Link></li>
        <li><Link to={`/SellerOffice/${memberId}`}>賣家工作室</Link></li>
        {/* <li><Link to={`/MyPage/${memberId}`}>My Page</Link></li> */}
        {/* Add more navigation links as needed */}
      </ul>
    </div>
  );
}

export default Navbar;