import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';


function AddBook() {
    const { memberId } = useParams();
    const [bookInfo, setBookInfo] = useState({
        title: '',
        author: '',
        publisher: '',
        isbn: ''
    });
    const [submittedBookInfo, setSubmittedBookInfo] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

 /*   //*測試
   
  const handleSubmit = (e) => {
      e.preventDefault();
      // 将用户输入的书籍信息保存在 submittedBookInfo 中
      setSubmittedBookInfo(bookInfo);
  };*/
  

    //將訊息傳送到後端
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 发送书籍信息到后端
            const response = await fetch('/api/addBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookInfo)
            });

            if (response.ok) {
                // 处理成功添加书籍的逻辑
                console.log('Book added successfully!');
            } else {
                // 处理添加书籍失败的逻辑
                console.error('Failed to add book.');
            }
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    return (
        <div>
            <Navbar memberId={memberId} />
            <h1 className="text-3xl font-bold mb-4">Add Book Page</h1>
            <h4 className="text-sm font-medium mb-2">您可以向管理員新增目前沒有在資料庫的書</h4>
            <form onSubmit={handleSubmit} >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'start' }}>
                    <label>
                        Title:
                        <input
                            type="text"
                            style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                            name="title"
                            value={bookInfo.title}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Author:
                        <input
                            type="text"
                            style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                            name="author"
                            value={bookInfo.author}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Publisher:
                        <input
                            type="text"
                            style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                            name="publisher"
                            value={bookInfo.publisher}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        ISBN (Optional):
                        <input
                            type="text"
                            style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                            name="isbn"
                            value={bookInfo.isbn}
                            onChange={handleChange}
                        />
                    </label>
                    <Button variant="outlined" type="submit">Add Book</Button>
                </div>

            </form>
            {/* 在页面上显示用户输入的书籍信息 */}
            {submittedBookInfo && (
                <div>
                    <h2>Submitted Book Information</h2>
                    <p>Title: {submittedBookInfo.title}</p>
                    <p>Author: {submittedBookInfo.author}</p>
                    <p>Publisher: {submittedBookInfo.publisher}</p>
                    <p>ISBN: {submittedBookInfo.isbn}</p>
                </div>
            )}
        </div>
    );
}

export default AddBook;