'use client'; // For client-side hooks
import { useState, useEffect } from 'react';

export default function Home() {
  const [group, setGroup] = useState([]);
  const [billAmount, setBillAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [splitWith, setSplitWith] = useState([]);
  const [summary, setSummary] = useState([]);
  const [personName, setPersonName] = useState(''); // Track "Enter Name" field

  useEffect(() => {
    const savedSummary = JSON.parse(localStorage.getItem('summary')) || [];
    setSummary(savedSummary);
  }, []);

  useEffect(() => {
    localStorage.setItem('summary', JSON.stringify(summary));
  }, [summary]);

  const handleAddPerson = () => {
    if (personName && !group.includes(personName)) {
      setGroup([...group, personName]);
      setPersonName(''); // Clear the "Enter Name" field after adding
    }
  };

  const handleDeletePerson = (person) => {
    // Remove person from the group and from "splitWith"
    const updatedGroup = group.filter((member) => member !== person);
    const updatedSplitWith = splitWith.filter((member) => member !== person);

    // If the deleted member was the payer, reset the payer
    if (payer === person) {
      setPayer('');
    }

    setGroup(updatedGroup);
    setSplitWith(updatedSplitWith);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (splitWith.length === 0) {
      alert('Please select at least one person to split the bill.');
      return;
    }

    const filteredSplitWith = splitWith.filter((person) => person !== payer);
    const splitAmount = billAmount / filteredSplitWith.length;

    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    const newSummary = filteredSplitWith.map(
      (person) => `${person} owes ${payer} $${splitAmount.toFixed(2)} (${formattedDate})`
    );

    setSummary([...summary, ...newSummary]);

    // Clear form fields after adding a bill
    setBillAmount('');
    setPayer('');
    setSplitWith([]); // Clear checkboxes
    setPersonName(''); // Clear "Enter Name" field
  };

  const handleDeleteBill = (index) => {
    const updatedSummary = summary.filter((_, i) => i !== index);
    setSummary(updatedSummary);
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-2 text-center">Bill Splitter</h1>
      <p className="text-center text-gray-600 font-medium">a Nick Sobhanian production</p>
      <p className="text-center text-gray-500 text-sm italic">IG: nick.sobhanian</p>

      {/* Step 1: Add People to Group */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">1. Add People to Group</h2>
        <input
          type="text"
          id="name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          className="border p-2 text-black bg-white rounded w-full mb-4"
          placeholder="Enter Name"
        />
        <button
          onClick={handleAddPerson}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Add Person
        </button>
      </div>

      {/* Step 2: Group Members */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">2. Group Members</h2>
        <ul className="list-disc pl-4">
          {group.length === 0 ? (
            <li>No members added yet.</li>
          ) : (
            group.map((member, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{member}</span>
                <button
                  onClick={() => handleDeletePerson(member)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Step 3: Add Bill */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">3. Add a Bill</h2>
        <form onSubmit={handleSubmit}>
          <label className="block font-semibold mb-2">Bill Amount:</label>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            className="border p-2 text-black bg-white rounded w-full mb-4"
          />
          <label className="block font-semibold mb-2">Payer:</label>
          <select
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            className="border p-2 rounded w-full mb-4 text-black bg-white"
          >
            <option value="" className="text-gray-500">
              Select Payer
            </option>
            {group.map((member) => (
              <option key={member} value={member} className="text-black">
                {member}
              </option>
            ))}
          </select>

          <label className="block font-semibold mb-2">Select who splits the bill:</label>
          <ul className="list-none mb-4">
            {group.map((member) =>
              member !== payer ? (
                <li key={member} className="mb-2">
                  <input
                    type="checkbox"
                    checked={splitWith.includes(member)}
                    onChange={(e) =>
                      setSplitWith(
                        e.target.checked ? [...splitWith, member] : splitWith.filter((person) => person !== member)
                      )
                    }
                  />
                  <span className="ml-2">{member}</span>
                </li>
              ) : null
            )}
          </ul>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
            Add Bill
          </button>
        </form>
      </div>

      {/* Step 4: Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">4. Summary</h2>
        <ul className="list-disc pl-4">
          {summary.length === 0 ? (
            <li>No bills added yet.</li>
          ) : (
            summary.map((line, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{line}</span>
                <button
                  onClick={() => handleDeleteBill(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
