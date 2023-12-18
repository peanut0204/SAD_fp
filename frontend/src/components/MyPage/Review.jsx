//import React from 'react'; // temp
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
import ReviewCard from './ReviewCard.jsx';
import { useParams } from 'react-router-dom';
import React, {useState, useEffect} from 'react';

function Review() {
  const { memberId } = useParams();

  // 需要後端的 @app.route('/api/reviews/<member_id>', methods=['GET'])
  
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try { // call API
        const response = await fetch(`http://127.0.0.1:5000/api/myAllReviews/${memberId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json(); // get result
        setReviews(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [memberId]);
  

  // 暫時先這樣搞
  /*
  const reviews = [
    { id: 125, book_name: '書名1', star: '1', comment: '評論', time: '2020-01-20'}, 
    { id: 325, book_name: '書名2', star: '5', comment: '評論', time: '2020'}, 
    { id: 425, book_name: '書名3', star: '星等', comment: '評論', time: '2020'}, 
  ];
  */
  return(
      <div style={content}>
         <h2 style={title}>評價記錄</h2>
         <div style={divLine}/>
         <div>
           <ReviewCard reviews={reviews} memberId={memberId} />
         </div>
         
      </div>
  );
}
export default Review;
