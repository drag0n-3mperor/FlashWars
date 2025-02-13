import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext'; // Ensure the correct path

const Profile = () => {
  const { user } = useAuth(); // Access user from AuthContext

  console.log("User data profile-",user);
  const topics = ['Math', 'Science', 'History', 'Literature', 'Art'];
  const flashcards = [
    {
      id: 1,
      image: 'https://via.placeholder.com/150',
      dateCreated: '2023-01-01',
      topic: 'Math',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/150',
      dateCreated: '2023-01-02',
      topic: 'Science',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/150',
      dateCreated: '2023-01-03',
      topic: 'History',
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/150',
      dateCreated: '2023-01-04',
      topic: 'Literature',
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/150',
      dateCreated: '2023-01-05',
      topic: 'Art',
    },
    {
      id: 6,
      image: 'https://via.placeholder.com/150',
      dateCreated: '2023-01-05',
      topic: 'Art',
    },
  ];

  const reviews = [
    { id: 1, userId: 'User  1', profileImage: 'https://via.placeholder.com/50', text: 'Great flashcards! Very helpful.' },
    { id: 2, userId: 'User  2', profileImage: 'https://via.placeholder.com/50', text: 'I learned a lot from these.' },
    { id: 3, userId: 'User  3', profileImage: 'https://via.placeholder.com/50', text: 'The topics are well organized.' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src={user?.avatar || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="rounded-full w-24 h-24 mr-4 border-2 border-black transition-transform duration-300 transform hover:scale-105"
          />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{user?.fullname || 'Username'}</h2>
            <div className="flex items-center">
              <span className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</span>
            </div>
          </div>
        </div>
        <button className="bg-gray-400 text-white px-2 py-1 rounded flex items-center transition-colors duration-300 hover:bg-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.121 4.379l5.5 5.5a1.5 1.5 0 010 2.121l-1.5 1.5a1.5 1.5 0 01-2.121 0l-5.5-5.5m-1.414-1.414l-5.5 5.5a1.5 1.5 0 000 2.121l1.5 1.5a1.5 1.5 0 002.121 0l5.5-5.5"
            />
          </svg>
          Edit Profile
        </button>
      </div>

      {/* Topics Section */}
      <div className="mb-6">
        <h3 className="text-3xl font-semibold mb-2 relative inline-block group">
          Topics:
          <span className="block h-1 bg-black scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
        </h3>
        <div className="flex flex-wrap space-x-4">
          {topics.slice(0, 8).map((topic, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-transform duration-200 ease-in-out transform hover:bg-black hover:text-white hover:scale-105"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Flashcard Collection Section */}
      <h3 className="text-3xl font-semibold mb-2 relative inline-block group">
        Flashcard Collections
        <span className="block h-1 bg-black scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {flashcards.map((card) => (
          <div
            key={card.id}
            className="border rounded-lg p-4 transition-transform duration-200 ease-in-out transform hover:scale-105"
          >
            <img src={card.image} alt="Flashcard" className="w-full h-32 object-cover rounded" />
            <h4 className="mt-2 font-semibold">{card.topic}</h4>
            <p className="text-gray-500">{card.dateCreated}</p>
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <h3 className="text-3xl font-semibold mb-2 relative inline-block group">
        Review
        <span className="block h-1 bg-black scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
      </h3>
      <div className="space-y-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex items-center border p-4 rounded-lg"
            style={{ backgroundColor: '#aaa', transition: 'background-color 0.3s, transform 0.3s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'black';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#aaa';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <img
              src={review.profileImage}
              alt="Reviewer"
              className="rounded-full w-12 h-12 mr-4"
            />
            <div className="flex flex-col">
              <div className="flex items-center">
                <h4 className="font-semibold text-white mr-2">{review.userId}</h4>
                <p className="text-white">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
