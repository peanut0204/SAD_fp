import React, {useState, useEffect} from 'react';
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
//import { useParams } from 'react-router-dom'; // temp
import { useParams } from 'react-router-dom';


function BookRating() {
  const { memberId, ISBN } = useParams();

  const [avgStar, setAvgStar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 呼叫API
        const response = await fetch(`http://127.0.0.1:5000/api/avg_rating/${ISBN}`);
        const data = await response.json();

        // get avgStar
        setAvgStar(data.avgStar);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [ISBN]);

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
      <h1 style={title}>平均評等</h1>
      <div style={divLine}/>
      <div style={{ textAlign: 'center' }}>
        {avgStar !== 0 ? (
          <div>
            <p style={title}>{getStarRating(avgStar)}</p>
            <p>({avgStar})</p>
          </div>
        ) : (
          <div>
            <p style={title}>{getStarRating(avgStar)}</p>
            <p>沒有任何評價 ({avgStar})</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default BookRating;
