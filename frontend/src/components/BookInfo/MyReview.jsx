//import React from 'react'; // temp
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
import { useParams } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { brownTheme } from '../../css/MyPage.js';
import { Button } from '@mui/material';
import React, {useState, useEffect} from 'react';
import { TextField } from '@mui/material';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

function Review() {
  const { memberId, ISBN } = useParams();

  // 需要後端的 @app.route('/api/myReview/<member_id>/<ISBN>', methods=['GET'])
  
  const [review, setReview] = useState();
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/myReview/${memberId}/${ISBN}`) // call API
      .then(response => response.json()) // get result
      .then(data => setReview(data))
      .catch(error => console.error('Error fetching followings:', error));
  }, [memberId, ISBN]);
  
  // 暫時先這樣搞
  
  /*
  const review = {
    star: '1', comment: '評論', time: '2020-01-20',
  };*/
  
  
  const getStar = (numStar) => {
    return '⭐️'.repeat(numStar);
  };

  const handleDeleteReview = () => {
    // 向後端傳送 DELETE 請求刪除評論
    fetch(`http://127.0.0.1:5000/api/myReview/${memberId}/${ISBN}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Review deleted successfully.');
          // 重新載入？
          
          fetch(`http://127.0.0.1:5000/api/myReview/${memberId}/${ISBN}`)
            .then(response => response.json())
            .then(data => setReview(data))
            .catch(error => console.error('Error fetching updated review:', error));
          
        } else {
          console.error('Failed to delete review.');
        }
      })
      .catch(error => console.error('Error deleting review:', error));
  };

  const [editing, setEditing] = useState(false);
  const [editedRating, setEditedRating] = useState(false);
  const [editedComment, setEditedComment] = useState('');

  const handleEditReview = () => {
    setEditing(true);
    setEditedRating(review.star);
    setEditedComment(review.comment);
  };

  const handleConfirmEdit = () => {
    // 向後端傳送修改後的評論
    fetch(`http://127.0.0.1:5000/api/myReview/${memberId}/${ISBN}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating: editedRating, comment: editedComment }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Review updated successfully.');
          // 在成功修改後，重新發送 API 請求以獲取最新的評論數據
          
          fetch(`http://127.0.0.1:5000/api/myReview/${memberId}/${ISBN}`)
            .then(response => response.json())
            .then(data => setReview(data))
            .catch(error => console.error('Error fetching updated review:', error));
        } else {
          console.error('Failed to update review.');
        }
      })
      .catch(error => console.error('Error updating review:', error))
      .finally(() => {
        setEditing(false);
        setEditedComment('');
      });
  };

  const [newRating, setNewRating] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleAddReview = () => {
    // 向後端傳送新增評論的請求
    fetch(`http://127.0.0.1:5000/api/myReview/${memberId}/${ISBN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating: newRating, comment: newComment }),
    })
      .then((response) => response.json())
      .then((data) => {
        setReview(data);
        // 在新增評論成功後，重新發起 GET 請求以獲取最新的評論數據
        fetch(`http://127.0.0.1:5000/api/myReview/${memberId}/${ISBN}`)
          .then((response) => response.json())
          .then((data) => setReview(data))
          .catch((error) => console.error('Error fetching review:', error));
      })
      .catch((error) => console.error('Error adding review:', error));
  };
  

  return(
      <div style={content}>
         <h2 style={title}>我的評價</h2>
         <div style={divLine}/>
         <div style={{ textAlign: 'center' }}>
         <ThemeProvider theme={brownTheme}>
          
          {review ? ( // 如果評論存在
          <>
            {editing ? (
            <>
              <div>
                <Typography id="discrete-slider" gutterBottom>
                  編輯星等：({editedRating})
                </Typography>
                <Rating
                  name="simple-controlled"
                  value={editedRating}
                  onChange={e => setEditedRating(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  label="編輯評論"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={editedComment}
                  onChange={e => setEditedComment(e.target.value)}
                />
              </div>
              <div>
                <Button size="small" variant="contained" color="primary" onClick={handleConfirmEdit}>
                  確認
                </Button>
              </div>
            </>
          ) : (
            <>
              <b>評等｜</b> {getStar(review.star)} ({review.star}) <br />
              <b>評論｜</b> {review.comment} <br />
              <b>時間戳記｜</b> {review.time} <br />
              <Button size="small" variant="contained" onClick={handleEditReview} style={{margin: '0 5px'}}>
                修改評論
              </Button>
              <Button size="small" variant="contained" color="secondary" onClick={handleDeleteReview} style={{margin: '0 5px'}}>
                刪除評論
              </Button>
            </>
          )}
          </>
        ) : (
          // 如果評論不存在
          <>
            <p>目前還沒有評論</p><br />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '20%', margin: '0 10px' }}>
                <Typography id="discrete-slider" gutterBottom>
                  編輯星等：({newRating})
                </Typography>
                <Rating
                  name="simple-controlled"
                  value={newRating}
                  onChange={e => setNewRating(e.target.value)}
                />
              </div>
              <TextField
                label="評論"
                multiline
                rows={4}
                variant="outlined"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ margin: '0 10px' }}
              />
              <Button size="small" variant="contained" onClick={handleAddReview}>
                新增評論
              </Button>
            </div>
          </>
        )}
        
        </ThemeProvider>
         </div>
         
      </div>
  );
}
export default Review;
