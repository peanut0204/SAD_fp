import { Link } from 'react-router-dom';
import '../css/Navbar.css';

function Navbar({memberId}) {
  return (
    <div class="topnav">
      <ul>
        <li><Link to="/">Login Page</Link></li>
        <li><Link to={`/SearchBook/${memberId}`}>Search Book</Link></li>
        <li><Link to={`/AddBook/${memberId}`}>Add Book</Link></li>
        <li><Link to={`/MyPage/${memberId}`}>My Page</Link></li>
        {/* Add more navigation links as needed */}
      </ul>
    </div>
  );
}

export default Navbar;