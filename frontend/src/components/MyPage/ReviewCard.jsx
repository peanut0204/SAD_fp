import React, { useState } from 'react';
// style
import { brownTheme } from "../../css/MyPage.js";
// import { ThemeProvider, createTheme } from '@mui/material/styles'; // default theme
import { ThemeProvider } from '@mui/material/styles';
import { primaryColor } from '../../css/MyPage.js';
// mui components
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
// next.js compononts
//import Link from 'next/link';
import { Link } from 'react-router-dom';

// 每頁有 5 個，每 5 個排一列
export default function ReviewCard({ reviews, memberId }) {
  const pageSize = 1; // 每頁顯示的卡片數量
  const [currentPage, setCurrentPage] = useState(0); // 當前頁碼

  // const defaultTheme = createTheme(); // default theme

  const handleClickPrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleClickNext = () => {
    setCurrentPage((prev) => Math.min(Math.ceil(reviews.length / pageSize) - 1, prev + 1));
  };

  // 狗腳印
  const getStar = (numStar) => {
    return '⭐️'.repeat(numStar);
  };

  // 根據當前頁碼和每頁顯示的卡片數量計算要顯示的動物
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleReviews = reviews.slice(startIndex, endIndex);
  const groups = visibleReviews.reduce((acc, curr, i) => {
    const groupIndex = Math.floor(i / 1); // 每一列有 1 個
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(curr);

    return acc;
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <ThemeProvider theme={brownTheme}>
        {groups.length > 0 ? (
          groups.map((group, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>

              {group.map((review) => (
                <Card key={review.id}
                  sx={{
                    width: "100%", mx: '1%', my: '1%', borderRadius: '8px', // 調整橫向大小
                    ':hover': {
                      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
                      transition: "transform 0.15s ease-in-out",
                      transform: "scale3d(1.05, 1.05, 1)",
                    }
                  }}>
                  
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" color={primaryColor}>
                      {review.book_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>評等｜</b>{getStar(review.star)} ({review.star})<br />
                      <b>評論｜</b>{review.comment}<br />
                      <b>時間戳記｜</b>{review.time}<br />
                    </Typography>
                  </CardContent>
                  <CardActions style={{ justifyContent: 'center', marginBottom: 10 }}>
                    <Link to={`/BookInfo/${memberId}/${review.id}`} style={{ textDecoration: 'none' }}>
                      <Button size="small" variant="contained">修改/刪除我的書籍評論</Button>
                    </Link>
                    {/* 
                    <Link href={`/reviews/reviewsInfo?a_id=${review.id}`} style={{ textDecoration: 'none' }}>
                      <Button size="small" variant="contained">修改評論</Button>
                    </Link>
                    <Link href={`/reviews/reviewsInfo?a_id=${review.id}`} style={{ textDecoration: 'none' }}>
                      <Button size="small" variant="contained" color="secondary" >刪除評論</Button>
                    </Link>
                    */}
                  </CardActions>
                </Card>
              ))}

            </div>
          ))
        ) : (
          <p>沒有符合搜尋條件評論</p>
        )}

        {/* 頁數 */}

        {groups.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <Button disabled={currentPage === 0} onClick={handleClickPrev}>
              上一頁
            </Button>
            <Typography variant="body1" style={{ margin: '10px 1rem' }}>
              頁數 {currentPage + 1} of {Math.ceil(reviews.length / pageSize)}
            </Typography>
            <Button
              disabled={currentPage === Math.ceil(reviews.length / pageSize) - 1}
              onClick={handleClickNext}
            >
              下一頁
            </Button>
          </div>
        )}

      </ThemeProvider>
    </div>
  );
}