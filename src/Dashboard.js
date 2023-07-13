import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchId]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://dummy.restapiexample.com/api/v1/employees');
      console.log("response23232", response)
      setEmployees(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const filterEmployees = () => {
    if (searchId.trim() === '') {
      setFilteredEmployees([]);
    } else {
      const filtered = employees.filter((employee) =>
        employee.id.toString().includes(searchId.trim())
      );
      setFilteredEmployees(filtered);
    }
    setIsSearchClicked(false); // Reset the search click status
  };

  const handleSearch = () => {
    filterEmployees();
    setIsSearchClicked(true);
  };

  const handleCardClick = (employee) => {
    if (selectedCards.includes(employee.id)) {
      // If already selected, remove from selectedCards
      setSelectedCards((prevSelected) =>
        prevSelected.filter((id) => id !== employee.id)
      );
    } else {
      // If not selected, add to selectedCards
      setSelectedCards((prevSelected) => [...prevSelected, employee.id]);
    }
  };

  const handleDeleteSelected = () => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => !selectedCards.includes(employee.id))
    );
    setSelectedCards([]); // Clear selectedCards after deletion
  };

  const handleDelete = (employeeId) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== employeeId)
    );
  };

  const handleEdit = (employeeId) => {
    const newName = prompt('Enter new name'); // Prompt for new name
    if (newName) {
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId ? { ...employee, employee_name: newName } : employee
        )
      );
    }
  };

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <div className="top-section">
        <div className="input-box">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by ID"
          />
          <button disabled={isLoading} onClick={handleSearch}>
            {isLoading ? 'Loading...' : 'Search'}
          </button>
        </div>
        <div className="button-container">
          <button
            disabled={selectedCards.length === 0 }
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>
        </div>
      </div>
      <div className="card-grid">
        {isSearchClicked && filteredEmployees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          (isSearchClicked ? filteredEmployees : employees).map((employee) => (
            <div
              key={employee.id}
              className={`card ${selectedCards.includes(employee.id) ? 'selected' : ''}`}
              onClick={() => handleCardClick(employee)}
            >
              <h2>{employee.employee_name}</h2>
              <p>ID: {employee.id}</p>
              <p>Salary: {employee.employee_salary}</p>
              <p>Age: {employee.employee_age}</p>
              <div className="button-container">
                <button
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(employee.id);
                  }}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button onClick={() => handleEdit(employee.id)}>Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;