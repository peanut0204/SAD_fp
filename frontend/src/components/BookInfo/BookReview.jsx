//import React from 'react'; // temp
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
import BookReviewCard from './BookReviewCard.jsx';
import { useParams } from 'react-router-dom';
import React, {useState, useEffect} from 'react';

function Review() {
  const { memberId, ISBN } = useParams();

  // 需要後端的 @app.route('/api/bookReview/<member_id>/<ISBN>', methods=['GET'])
  
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try { // call API
        const response = await fetch(`http://127.0.0.1:5000/api/bookReview/${memberId}/${ISBN}`);
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
  }, [memberId, ISBN]);
  

  // 暫時先這樣搞 id 是 other member id
  /*
  const reviews = [
    { id: 125, nickname: '哈囉1', star: '1', comment: '評論', time: '2020-01-20'}, 
    { id: 325, nickname: '哈囉2', star: '5', comment: '評論', time: '2020'}, 
    { id: 425, nickname: '哈囉3', star: '星等', comment: '評論', time: '2020'}, 
  ];
*/
  return(
      <div style={content}>
         <h2 style={title}>其他人的評價</h2>
         <div style={divLine}/>
         <div>
           <BookReviewCard reviews={reviews} memberId = {memberId} />
         </div>
         
      </div>
  );
}
export default Review;
