import { useState, useEffect } from 'react';
import axios from 'axios';

const PersonForm = ({addPersona, handleNameChange, handleNumberChange, newName, newNumber}) =>
{
  return(
    <div>
    <h3>Add Person</h3>
      <form onSubmit={addPersona}>
        <div>
          <span>Name</span>
          <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <span>Number</span>
          <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}

const Filter = ({searchName, handleSearchName}) => {
  return (
  <div>
    <h3>Filter Person</h3>
    <div>
      <span>Filter by name: </span>
      <input value={searchName} onChange={handleSearchName} />
    </div>
  </div>
  );
}

const List = ({ persons, handleDeleteChange }) => {
  return (
    <div>
      <ul>
        {persons.map((person) => (
          <li>
            <span key={person.id}>{person.name} - {person.number}</span>
            <button onClick={() => handleDeleteChange(person.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationVisible, setNotificationVisible] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  }

  const addPersona = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      const confirmed = window.confirm(`${newName} is already added to phonebook. Do you want to update the phone number?`);
      if (confirmed) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        axios.put(`http://localhost:3001/persons/${existingPerson.id}`, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => (person.id === existingPerson.id ? response.data : person)));
            setNotification(`Phone number for ${newName} updated successfully`);
            setNotificationVisible(true);
          })
          .catch(error => {
            console.error('Error updating phone number:', error);
          });
          setNewName('');
          setNewNumber('');
        return;
      } else {
        const newPerson = { name: newName, number: newNumber };
        axios.post('http://localhost:3001/persons', newPerson)
          .then(response => {
            setPersons([...persons, response.data]);
            setNotification(`Person "${newName}" successfully added`);
            setNotificationVisible(true);
          })
          .catch(error => {
            console.error('Error adding person:', error);
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      axios.post('http://localhost:3001/persons', newPerson)
        .then(response => {
          setPersons([...persons, response.data]);
          setNotification(`Person "${newName}" successfully added`);
          setNotificationVisible(true);
        })
        .catch(error => {
          console.error('Error adding person:', error);
        });
    }
    const newPerson = {
      name: newName,
      number: newNumber
    };
    setNewName('');
    setNewNumber('');
    setPersons(persons.concat(newPerson));
    setNotification(`Person "${newName}" successfully added`);
    setNotificationVisible(true);
  };

  const handleDeleteChange = (id) =>{
    const confirmed = window.confirm('Are you sure you want to delete this record?')
    if(confirmed) {
      axios.delete(`http://localhost:3001/persons/${id}`)
      .then(() => {
        setPersons(persons.filter(entry => entry.id !== id))
      })
      .catch (erro => {
        window.confirm('Error while deleting')
      })
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );

  useEffect(() => {
    if (notificationVisible) {
      const timer = setTimeout (() => {
        setNotificationVisible(false);
        setNotification(null);
      }, 3000)
      return () => clearTimeout(timer);
    }
  }, [notificationVisible]);

   return (
    <div>
      <h2>Phonebook</h2>
      {notificationVisible && (
        <div className="notification">
          {notification}
        </div>
      )}
      <PersonForm addPersona={addPersona}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <Filter searchName={searchName} handleSearchName={handleSearchName} />
      <h2>Numbers</h2>
      <List persons={filteredPersons} handleDeleteChange={handleDeleteChange} />
    </div>
  );
};

export default App