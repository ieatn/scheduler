'use client'
import { useState } from 'react';
import Image from "next/image";

// Simulated database of events
const events = [
  { id: 1, person: 'Person A', activity: 'gym', time: '8pm' }
];

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserInput('');
    setMessage(`Your event has been added. We'll notify you if someone wants to join!`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowModal(true);
  };

  const handleConfirm = () => {
    console.log("User confirmed joining the gym session");
    setShowModal(false);
  };

  const handleDecline = () => {
    console.log("User declined joining the gym session");
    setShowModal(false);
  };

  const parseUserInput = (input) => {
    // This is a very basic parser. In a real app, you'd want something more robust.
    const words = input.toLowerCase().split(' ');
    return {
      activity: words[words.indexOf('to') + 1],
      time: words[words.indexOf('at') + 1]
    };
  };

  const findMatchingEvent = (userEvent) => {
    return events.find(event => 
      event.activity === userEvent.activity && event.time === userEvent.time
    );
  };

  const fillSampleText = () => {
    setUserInput('I am going to the gym at 8pm');
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
            <p className="mb-4">{`${events[0].person} is also planning on going to the gym at ${events[0].time}. Would you like to join?`}</p>
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
