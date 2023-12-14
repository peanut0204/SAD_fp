import React, {useState, useEffect} from 'react';
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
//import { useParams } from 'react-router-dom'; // temp
import { useParams } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


function FavoriteBook() {
  const { memberId, ISBN } = useParams();

  // 需要後端的 @app.route('/api/bookInfo/<ISBN>', methods=['GET'])
  
  const [book, setBook] = useState({
    isbn: 125, name: '測試範例書名', avgStar: '3.2', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤', summary: '這是一個大綱啦', 
});
  
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/bookInfo/${ISBN}`) // call API
      .then(response => response.json()) // get result
      .then(data => setBook(data))
      .catch(error => console.error('Error fetching followings:', error));
  }, [ISBN]);

  
  // 沒後端的話，暫時先這樣搞
  /*
  const book = {
      isbn: 125, name: '書名', avgStar: '3.2', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤', summary: '這是一個大綱啦', 
  };
  */

  const getStarRating = (avgStar) => {
    const integerPart = Math.floor(avgStar);
    const decimalPart = avgStar - integerPart;
    let stars = '';
    for (let i = 0; i < integerPart; i++) { // 根據整數部分顯示星星
      stars += '🌕';
    }
    if (decimalPart > 0 && decimalPart <= 0.3) { // 根據小數部分顯示星星
      stars += '🌘';
    } else if (decimalPart > 0.3 && decimalPart <= 0.7) {
      stars += '🌗';
    } else if (decimalPart > 0.7) {
      stars += '🌖';
    }
    const remainingStars = Math.max(5 - Math.ceil(avgStar), 0); // 顯示剩餘的星星  
    for (let i = 0; i < remainingStars; i++) {
      stars += '🌑';
    }
    return stars;
  };

  return(
    <div style={content}>
      <h2 style={title}>{book.name}</h2>
      <h1 style={title}> check Member_id = {memberId}, ISBN = {ISBN} </h1>
      <div style={divLine}/>
      <div style={{ textAlign: 'center' }}>
        <h2 style={title}>評等｜{getStarRating(book.avgStar)} ({book.avgStar})</h2>
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
