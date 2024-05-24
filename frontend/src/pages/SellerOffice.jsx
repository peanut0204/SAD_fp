import { Link, useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import sellerOfficeImg from '../images/sellerOffice.png';
import { HiOutlineSearch, HiViewGridAdd, HiDocumentText, HiOutlineChat } from "react-icons/hi";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HiMenu } from "react-icons/hi";
import Navbar from '../components/Navbar';

const theme = createTheme({
	palette: {
		primary: {
			main: '#F1C010', //yellow
		},
		secondary: {
			main: '#000000', //black
		},

	},
});

function SellerOffice() {
  const { memberId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => {
		setSidebarOpen(!sidebarOpen);
	}, [sidebarOpen]);
	const sidebarRef = useRef();

  useEffect(() => {
		function handleClickOutside(event) {
			if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
				toggleSidebar();
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [sidebarOpen, toggleSidebar]);
	
	
    return (

      <ThemeProvider theme={theme}>
        <div style={{ backgroundColor: theme.palette.primary.main, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '50px' }}>
            <button onClick={toggleSidebar} style={{ position: 'absolute', left: '10px' }}>
              <HiMenu size={30} />
            </button>
            {/* <h1 className="text-3xl font-bold mb-4" style={{ margin: '0 auto' }}>揪團 GO</h1> */}
          </div>
          {sidebarOpen && (
            <div ref={sidebarRef} id="navbar" style={{ position: 'fixed', left: 0, width: '200px', height: '100vh' }}>
              <Navbar memberId={memberId} />
            </div>
          )}
          
          <img src={sellerOfficeImg} alt="sellerOffice" style={{ marginTop: '20px' }} />
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '30px' }}>
            
            {/* <li><Link to="/">Login Page</Link></li> */}
            
            <Link to={`/SellerSearchGroup/${memberId}`}>
              <div style={{ backgroundColor: '#000', color: '#fff', width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                <HiOutlineSearch size={50}/>
                <span>搜尋社群</span>
              </div>
            </Link>
            <Link to={`/AddProduct/${memberId}`}>
              <div style={{ backgroundColor: '#000', color: '#fff', width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                <HiViewGridAdd size={50}/>
                <span>新增商品</span>
              </div>
            </Link>
            <Link to={`/MyOrder/${memberId}`}>
              <div style={{ backgroundColor: '#000', color: '#fff', width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                <HiDocumentText size={50} />
                <span>我的訂單</span>
              </div>
            </Link>
            <Link to={`/SellerChats/${memberId}`}>
              <div style={{ backgroundColor: '#000', color: '#fff', width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                <HiOutlineChat size={50} />
                <span>我的訊息</span>
              </div>
            </Link>
            {/* <li><Link to={`/MyPage/${memberId}`}>My Page</Link></li> */}
            {/* Add more navigation links as needed */}
          </ul>
        </div>
      </ThemeProvider>

      

              
      
    );
  }
  
export default SellerOffice;