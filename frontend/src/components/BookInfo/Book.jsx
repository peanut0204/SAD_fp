import React, {useState, useEffect} from 'react';
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
//import { useParams } from 'react-router-dom'; // temp
import { useParams } from 'react-router-dom';


function FavoriteBook() {
  const { memberId, ISBN } = useParams();

  // 需要後端的 @app.route('/api/bookInfo/<ISBN>', methods=['GET'])
  
  const [book, setBook] = useState({});
  
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/bookInfo/${ISBN}`) // call API
      .then(response => response.json()) // get result
      .then(data => setBook(data))
      .catch(error => console.error('Error fetching followings:', error));
  }, [ISBN]);

  return(
    <div style={content}>
      <h2 style={title}>{book.name}</h2>
      <div style={divLine}/>
      <div style={{ textAlign: 'center' }}>
        <p><b>作者名稱｜</b>{book.author}</p>
        <p><b>出版商名稱｜</b>{book.publisher}</p>
        <p><b>出版年｜</b>{book.pub_year}</p>
        <p><b>標籤｜</b>{book.tag}</p>
        <p><b>ISBN｜</b>{book.isbn}</p>
        <p><b>大綱｜</b>{book.summary}</p>
        
      </div>
    </div>
  );
}
export default FavoriteBook;
