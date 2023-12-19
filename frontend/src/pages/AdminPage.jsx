import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button'; // a prettier button
import React, { useState, useEffect } from 'react';


//查看想要新增的書
const NewBookRequests = ({ books, onConfirm }) => {
    const [confirmedBooks, setConfirmedBooks] = useState([]);
    const handleConfirmation = () => {
        const confirmed = books.filter((book) => book.selected);
        setConfirmedBooks(confirmed);
        onConfirm(confirmed);
    };

    return (
        <div>
            <h2>New Book Requests</h2>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        書名: {book.name} - 作者: {book.author} - 出版商: {book.publisher} - 發起用戶:
                        {book.Member_id} - ISBN: {book.isbn}
                    </li>
                ))}
            </ul>

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
        author: '',
        summary: '',
        tag: ''
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
            <label style={{ marginBottom: '10px' }}>
                摘要:
                <input
                    type="text"
                    name="summary"
                    style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                    value={bookInfo.summary}
                    onChange={handleChange}
                />
            </label>
            <label style={{ marginBottom: '10px' }}>
                標籤:
                <input
                    type="text"
                    name="tag"
                    style={{ border: '1px solid black', borderRadius: '4px', padding: '10px', width: '300px' }}
                    value={bookInfo.tag}
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
/*
const ReviewsComponent = () => {

    //沒有後端的測試
    //const [reviews, setReviews] = useState([
    //    { id: 125, isbn: 'ISBN', star: '1', comment: '評論', time: '2020' },
    //    { id: 325, isbn: 'ISBN', star: '5', comment: '評論', time: '2020' },
    //    { id: 425, isbn: 'ISBN', star: '星等', comment: '評論', time: '2020' },
    //]);

    //const [selectedIds, setSelectedIds] = useState([]);
    

    const [reviews, setReviews] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/reviews');
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                console.error('Failed to fetch reviews.');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const toggleCheckbox = (id) => {
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter((selectedId) => selectedId !== id)
            : [...selectedIds, id];

        setSelectedIds(newSelectedIds);
    };

    const deleteComments = async () => {
        try {
            const selectedReviews = reviews.filter((review) => selectedIds.includes(review.id));
            const reviewsToDelete = selectedReviews.map((review) => ({ id: review.id, isbn: review.isbn }));

            const updatedReviews = reviews.filter((review) => !selectedIds.includes(review.id));
            setReviews(updatedReviews);
            setSelectedIds([]);

            const response = await fetch(`http://127.0.0.1:5000/api/deleteComments`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewsToDelete)
            });

            if (response.ok) {
                console.log('Selected comments deleted successfully!');
            } else {
                console.error('Failed to delete selected comments.');
            }
        } catch (error) {
            console.error('Error deleting comments:', error);
        }
    };

    return (
        <div>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(review.id)}
                            onChange={() => toggleCheckbox(review.id)}
                        />
                        User: {review.id} - ISBN: {review.isbn} - Star: {review.star} - Time: {review.time} - Comment: {review.comment}
                    </li>
                ))}
            </ul>
            <Button variant="contained" onClick={deleteComments}>
                Delete Selected Comments
            </Button>
        </div>
    );



};
*/
const ReviewsComponent = () => {
    const [memberId, setMemberId] = useState('');
    const [reviews, setReviews] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        if (memberId !== '') {
            fetchReviews();
        }
    }, [memberId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/reviews/${memberId}`);
            if (response.ok) {
                const data = await response.json();
                const updatedReviews = data.map((review, index) => ({
                    ...review,
                    id: `review_${index}`, // 前端生成的唯一 id
                    checked: false
                }));
                setReviews(updatedReviews);
                setSelectedIds([]);
            } else {
                console.error('Failed to fetch reviews.');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleInputChange = (event) => {
        setMemberId(event.target.value);
    };

    const toggleCheckbox = (id) => {
        const updatedReviews = reviews.map(review => {
            if (review.id === id) {
                return { ...review, checked: !review.checked };
            }
            return review;
        });

        setReviews(updatedReviews);
        const updatedSelectedIds = updatedReviews.filter(review => review.checked).map(review => review.id);
        setSelectedIds(updatedSelectedIds);
    };

    const deleteComments = async () => {
        try {
            const selectedReviews = reviews.filter(review => review.checked);
            const reviewsToDelete = selectedReviews.map(review => ({ id: memberId,reviewId: review.id, isbn: review.isbn }));

            const updatedReviews = reviews.filter(review => !review.checked);
            setReviews(updatedReviews);

            const response = await fetch('http://127.0.0.1:5000/api/deleteComments', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewsToDelete)
            });

            if (response.ok) {
                console.log('Selected comments deleted successfully!');
            } else {
                console.error('Failed to delete selected comments.');
            }
        } catch (error) {
            console.error('Error deleting comments:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter Member ID"
                value={memberId}
                onChange={handleInputChange}
            />
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <input
                            type="checkbox"
                            checked={review.checked}
                            onChange={() => toggleCheckbox(review.id)}
                        />
                        User: {review.id} - ISBN: {review.isbn} - Star: {review.star} - Time: {review.time} - Comment: {review.comment}
                    </li>
                ))}
            </ul>
            <Button variant="outlined" style={{ marginTop: '10px' }} onClick={deleteComments}>
                Delete Selected Comments
            </Button>
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
        <div style={{ position: 'fixed', top: '20px', right: '20px', padding: '20px', backgroundColor: 'white', zIndex: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID to Block"
                    style={{ marginRight: '10px', padding: '8px' }}
                />
                <Button variant="outlined" onClick={handleDeleteUser}>
                    Block User
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

    //處理request 的書籍
    const [books, setBooks] = useState([]); // 儲存後端取得的書籍資訊
    const fetchBooksFromBackend = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/ShowBook'); // 假設這是你的後端 API 端點
            if (response.ok) {
                const data = await response.json();
                setBooks(data); // 將後端取得的書籍資訊存入狀態中
            } else {
                console.error('Failed to fetch books.');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        fetchBooksFromBackend(); // 在組件 mount 時取得書籍資訊
    }, []); // 空依賴表示只在組件 mount 時執行一次


    /*假設這是後端傳來的資訊
    const books = [
        // 书籍数组
        { id: 125, name: '書名1', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤' },
        { id: 53, name: '書名2', author: '作者名稱', publisher: '出版商名稱', pub_year: '2020', tag: '標籤' },
        // 其他书籍对象...
    ];*/


    //處理刪除用戶

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/deleteUser/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log(`User with ID ${userId} deleted successfully.`);
                // 可以在此處理用戶成功刪除的相應操作
            } else {
                console.error(`Failed to delete user with ID ${userId}.`);
                // 可以在此處理用戶刪除失敗的相應操作
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            // 可以在此處理刪除用戶的錯誤
        }
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
        try {
            const response = await fetch('http://127.0.0.1:5000/api/NewBookRequests', {
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
        }
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