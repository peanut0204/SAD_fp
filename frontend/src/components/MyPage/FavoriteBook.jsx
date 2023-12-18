import React, {useState, useEffect} from 'react';
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
import FavoriteBookCard from './FavoriteBookCard.jsx';
//import { useParams } from 'react-router-dom'; // temp
import { useParams } from 'react-router-dom';

function FavoriteBook() {
  const { memberId } = useParams();

  // 需要後端的 @app.route('/api/favoriteBooks/<member_id>', methods=['GET'])
  const [books, setBooks] = useState([]);
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/favoriteBooks/${memberId}`) // call API
      .then(response => response.json()) // get result
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching followings:', error));
  }, [memberId]); 

  // 另外一種寫法
  /*
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try { // call API
        const response = await fetch(`http://127.0.0.1:5000/api/favoriteBooks/${memberId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json(); // get result
        setBooks(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [memberId]);
*/
  
  // 沒後端的話，暫時先這樣搞
  /*
  const books = [
      { id: 125, name: '書名1', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤'}, 
      { id: 53, name: '書名2', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤'}, 
      { id: 521, name: '書名3', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤'}, 
      { id: 5321, name: '書名4', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤'}, 
      { id: 51, name: '書名5', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤'}, 
      { id: 215, name: '書名6', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤'}, 
  ];
*/
  return(
    <div style={content}>
      <h2 style={title}>喜愛書籍</h2>
      <div style={divLine}/>
      <div>
        <FavoriteBookCard books={books} memberId={memberId} />
      </div>
    </div>
  );
}
export default FavoriteBook;
