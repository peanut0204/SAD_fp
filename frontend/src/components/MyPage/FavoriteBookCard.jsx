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

// 每頁有 3 個，每 3 個排一列
export default function FavoriteBookCard({ memberId, books }) {
  const pageSize = 3; // 每頁顯示的卡片數量
  const [currentPage, setCurrentPage] = useState(0); // 當前頁碼

  // const defaultTheme = createTheme(); // default theme

  const handleClickPrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleClickNext = () => {
    setCurrentPage((prev) => Math.min(Math.ceil(books.length / pageSize) - 1, prev + 1));
  };

  // 根據當前頁碼和每頁顯示的卡片數量計算要顯示的動物
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleBooks = books.slice(startIndex, endIndex);
  const groups = visibleBooks.reduce((acc, curr, i) => {
    const groupIndex = Math.floor(i / 3); // 每一列有 1 個
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

              {group.map((book) => (
                <Card key={book.id}
                  sx={{
                    width: "100%", mx: '1%', my: '1%', borderRadius: '8px', //
                    ':hover': {
                      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
                      transition: "transform 0.15s ease-in-out",
                      transform: "scale3d(1.05, 1.05, 1)",
                    }
                  }}>
                  
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" color={primaryColor}>
                      {book.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>作者｜</b>{book.author}<br />
                      <b>出版商｜</b>{book.publisher}<br />
                      <b>出版年｜</b>{book.pub_year}<br />
                      <b>所屬標籤｜</b>{book.tag}<br />
                      <b>ISBN｜</b>{book.id}<br />
                    </Typography>
                  </CardContent>
                  <CardActions style={{ justifyContent: 'center', marginBottom: 10 }}>
                    <Link to={`/BookInfo/${memberId}/${book.id}`}>
                      <Button size="small" variant="contained">查看書籍</Button>
                    </Link>
                  </CardActions>
                </Card>
              ))}

            </div>
          ))
        ) : (
          <p>沒有符合搜尋條件之愛書</p>
        )}

        {/* 頁數 */}

        {groups.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <Button disabled={currentPage === 0} onClick={handleClickPrev}>
              上一頁
            </Button>
            <Typography variant="body1" style={{ margin: '10px 1rem' }}>
              頁數 {currentPage + 1} of {Math.ceil(books.length / pageSize)}
            </Typography>
            <Button
              disabled={currentPage === Math.ceil(books.length / pageSize) - 1}
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