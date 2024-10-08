'use client'
import { useState } from 'react';
import axios from 'axios'; // Add this import

// Simulated database of events
const events = [
  { id: 1, person: 'Person A', activity: 'gym', time: '8:00pm' }
];

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [serverResponse, setServerResponse] = useState(null); // New state for server response

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserInput('');
    
    // Call the Flask server
    try {
        const response = await axios.post('http://localhost:5000/schedule', { 
            user: 'User', // Replace with actual user identifier
            plan: userInput // Send the user input as the plan
        });
        console.log(response.data); // Log the response from the server
        setServerResponse(response.data); // Store the server response
        setShowModal(true); // Show the modal after receiving response
    } catch (error) {
        console.error("Error calling the Flask server:", error);
    }

    setMessage(`Your event has been added. We'll notify you if someone wants to join!`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleConfirm = () => {
    console.log("User confirmed joining the gym session");
    setShowModal(false);
  };

  const handleDecline = () => {
    console.log("User declined joining the gym session");
    setShowModal(false);
  };

  const fillSampleText = () => {
    setUserInput('I am going to the gym at 8:00pm');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Event Matcher</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your plans and time (e.g., 'I am going to the gym at 8pm')"
          className="border p-2 mr-2 w-full md:w-96 h-14 text-xl"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
      <button 
        onClick={fillSampleText} 
        className="bg-gray-300 text-gray-700 p-2 rounded mb-4"
      >
        Fill Sample Text
      </button>
      {message && <p className="text-green-600">{message}</p>}
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Join Gym Session?</h2>
            {serverResponse && serverResponse.similar_plans.length > 0 ? (
              <p className="mb-4">{`${serverResponse.similar_plans[0][0]} is also planning on going to the gym at ${serverResponse.similar_plans[0][2]}. Would you like to join?`}</p>
            ) : (
              <p className="mb-4">No similar plans found. Would you like to proceed?</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleDecline}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Decline
              </button>
              <button
                onClick={handleConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
