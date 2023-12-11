
import React, { useState } from 'react';

const NumberInputForm = ({ onSubmit }) => {
  const [numbers, setNumbers] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ numbers: numbers.split(',').map(Number) });
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Numbers (comma-separated):
        <input
          type="text"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </label>
      <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Generate DataFrame
      </button>
    </form>
  );
};

export default NumberInputForm;
