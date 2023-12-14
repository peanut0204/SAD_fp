import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button'; // a prettier button


//查看想要新增的書
const NewBookRequests = ({ books, onConfirm }) => {
    const [selectedBooks, setSelectedBooks] = useState(
        books.map((book) => ({ ...book, selected: false }))
    );
    const [confirmedBooks, setConfirmedBooks] = useState([]);

    const handleSelection = (id) => {
        const updatedBooks = selectedBooks.map((book) =>
            book.id === id ? { ...book, selected: !book.selected } : book
        );
        setSelectedBooks(updatedBooks);
    };

    const handleConfirmation = () => {
        const confirmed = selectedBooks.filter((book) => book.selected);
        setConfirmedBooks(confirmed);
        onConfirm(confirmed);
    };

    return (
        <div>
            <h2>New Book Requests</h2>
            <ul>
                {selectedBooks.map((book) => (
                    <li key={book.id}>
                        <input
                            type="checkbox"
                            checked={book.selected}
                            onChange={() => handleSelection(book.id)}
                        />
                        書名:{book.name} - 作者:{book.author} - 出版商: {book.publisher} - 發行年分:
                        {book.pub_year} - 分類:{book.tag}
                    </li>
                ))}
            </ul>
            <Button variant="outlined" onClick={handleConfirmation}>
                Confirm Selection
            </Button>

            {/* Display confirmed selection */}
            {confirmedBooks.length > 0 && (
                <div>
                    <h3>Confirmed Selection</h3>
                    <ul>
                        {confirmedBooks.map((book) => (
                            <li key={book.id}>
                                {book.name} - {book.author}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

//存adimn想要新增書籍的資訊
const AddBookForm = ({ onAddBook }) => {
    const [bookInfo, setBookInfo] = useState({
        isbn: '',
        title: '',
        publication_year: '',
        publisher: '',
        author: ''
    });
    const [submittedData, setSubmittedData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        onAddBook(bookInfo);

        // 更新 submittedData 狀態: 檢查看看有沒有傳成功
        setSubmittedData(JSON.stringify(bookInfo, null, 2));
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '10px' }}>
                ISBN:
                <input
                    type="text"
                    name="isbn"
                    style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                    value={bookInfo.isbn}
                    onChange={handleChange}
                />
            </label>
            <label style={{ marginBottom: '10px' }}>
                書名:
                <input
                    type="text"
                    name="title"
                    style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                    value={bookInfo.title}
                    onChange={handleChange}
                />
            </label>
            <label style={{ marginBottom: '10px' }}>
                作者:
                <input
                    type="text"
                    name="author"
                    style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                    value={bookInfo.author}
                    onChange={handleChange}
                />
            </label>
            <label style={{ marginBottom: '10px' }}>
                出版年:
                <input
                    type="text"
                    name="publication_year"
                    style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                    value={bookInfo.publication_year}
                    onChange={handleChange}
                />
            </label>
            <label style={{ marginBottom: '10px' }}>
                出版商:
                <input
                    type="text"
                    name="publisher"
                    style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                    value={bookInfo.publisher}
                    onChange={handleChange}
                />
            </label>
            <Button variant="outlined" type="submit">
                Submit
            </Button>
            {/* 顯示提交的結果 */}
            <div id="submit-result" style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
                {submittedData && `Submitted Data: \n ${submittedData}`}
            </div>
        </form>
    );
}

//刪除評論
const ReviewsComponent = () => {
    const [reviews, setReviews] = useState([
        { id: 125, book_name: '書名1', star: '1', comment: '評論', time: '2020-01-20' },
        { id: 325, book_name: '書名2', star: '5', comment: '評論', time: '2020' },
        { id: 425, book_name: '書名3', star: '星等', comment: '評論', time: '2020' },
    ]);

    const [selectedIds, setSelectedIds] = useState([]);
    const [confirmedReviews, setConfirmedReviews] = useState([]);

    const toggleCheckbox = (id) => {
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter((selectedId) => selectedId !== id)
            : [...selectedIds, id];

        setSelectedIds(newSelectedIds);
    };

    const deleteComments = () => {
        const updatedReviews = reviews.filter((review) => !selectedIds.includes(review.id));
        setReviews(updatedReviews);
        setSelectedIds([]);
    };

    const handleConfirmation = () => {
        const confirmed = reviews.filter((review) => selectedIds.includes(review.id));
        setConfirmedReviews(confirmed);
    };

    return (
        <div>
            <button onClick={deleteComments}>刪除選中的評論</button>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(review.id)}
                            onChange={() => toggleCheckbox(review.id)}
                        />
                        用戶:{review.id} - 書名: {review.book_name} - 評分: {review.star} - 時間: {review.time} - 評論: {review.comment}
                    </li>
                ))}
            </ul>
            <Button variant="outlined" onClick={handleConfirmation}>
                Confirm Selection
            </Button>

            {/* Display confirmed selection */}
            {confirmedReviews.length > 0 && (
                <div>
                    <h3>Confirmed Selection</h3>
                    <ul>
                        {confirmedReviews.map((review) => (
                            <li key={review.id}>
                                用戶:{review.id} - 書名: {review.book_name} - 評分: {review.star} - 時間: {review.time} - 評論: {review.comment}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// AdminPage 中使用 ReviewsComponent 的部分，無需更改

//刪除某個特定的用戶

const UserDeletionComponent = ({ onDeleteUser }) => {
    const [userId, setUserId] = useState('');

    const handleDeleteUser = () => {
        onDeleteUser(userId);
        setUserId('');
    };

    return (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', padding: '20px', backgroundColor: 'white' }}>
            <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID to Delete"
                />
                <Button variant="outlined" onClick={handleDeleteUser}>
                    Delete User
                </Button>
            </div>
        </div>
    );
};


function AdminPage() {
    const { memberId } = useParams();
    const [showBookRequests, setShowBookRequests] = useState(false); // 控制书籍要求组件的显示与隐藏
    const [showAddBookForm, setShowAddBookForm] = useState(false); // 控制添加書籍的表单
    const [showReviews, setShowReviews] = useState(false); // 控制顯示評論組件
    const [showuser, setShowuser] = useState(false); // 控制顯示評論組件

    //假設這是後端傳來的資訊
    const books = [
        // 书籍数组
        { id: 125, name: '書名1', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤' },
        { id: 53, name: '書名2', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤' },
        // 其他书籍对象...
    ];

    //讓按鈕能縮放
    const handleShowRequests = () => {
        setShowBookRequests((prevState) => !prevState);
    };

    const handleAddBookForm = () => {
        setShowAddBookForm((prevState) => !prevState);
    };

    const handleShowReviews = () => {
        setShowReviews((prevState) => !prevState);
    };




    const handleDeleteUser = (userId) => {
        // 在這裡處理刪除用戶的邏輯，例如將其發送到後端
        console.log('Deleting user with ID:', userId);
    };


    const handleConfirmation = (confirmedBooks) => {
        console.log('Confirmed Books:', confirmedBooks);
        // Sending confirmed books to the backend
        /* Code for sending to the backend
    
        try {
          const response = await fetch('http://127.0.0.1:5000/api/favoriteBooks/${memberId}', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(confirmedBooks)
          });
    
          if (response.ok) {
              console.log('Selected books sent successfully!');
              // Handle successful sending to the backend
          } else {
              console.error('Failed to send selected books.');
              // Handle failed sending to the backend
          }
        } catch (error) {
            console.error('Error sending selected books:', error);
            // Handle error while sending the books
        }*/
    };

    // Handling submission of the new book to the backend
    const handleAddBookSubmit = async (bookData) => {

        // Sending book information to the backend
        /*try {
            const response = await fetch('/api/addBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });
    
            if (response.ok) {
                // Handle successful addition of the book
                console.log('Book added successfully!');
            } else {
                // Handle failed addition of the book
                console.error('Failed to add book.');
            }
        } catch (error) {
            console.error('Error adding book:', error);
        }*/
    };



    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
            <Link to={`/SearchBook/${memberId}`}>
                <Button variant="outlined" style={{ marginTop: '10px' }}>
                    Go to Search Book
                </Button>
            </Link>

            <Button variant="outlined" style={{ marginTop: '10px' }} onClick={handleShowRequests}>
                View New Book Requests
            </Button>

            {showBookRequests && <NewBookRequests books={books} onConfirm={handleConfirmation} />}

            <Button variant="outlined" style={{ marginTop: '10px' }} onClick={handleAddBookForm}>
                Add Book Form
            </Button>

            {showAddBookForm && <AddBookForm onAddBook={handleAddBookSubmit} />}

            <Button variant="outlined" style={{ marginTop: '10px' }} onClick={handleShowReviews}>
                Show Reviews
            </Button>

            {showReviews && <ReviewsComponent memberId={memberId} />}

            <UserDeletionComponent onDeleteUser={handleDeleteUser} />
          
        </div>
    );
}

export default AdminPage;