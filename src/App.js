
import { useState } from 'react';
import './App.css';
import { AddToDo } from './components/AddToDo/AddToDo';
import { Header } from './components/Header/Header';
import { ToDoList } from './components/ToDoList/ToDoList';

function App() {
  const [ToDo, setToDo] = useState([
    {
      id: 1,
      title: 'firstToDo',
      header: '1',
      status: true,
      deadline: Date.now(),
    },
    {
      id: 2,
      title: 'secondToDo',
      header: '2',
      status: false,
      deadline: Date.now(),
    },
    {
      id: 3,
      title: 'thirdtToDo',
      header: '3',
      status: true,
      deadline: Date.now(),
    },
    {
      id: 4,
      title: 'fourthToDo',
      header: '4',
      status: false,
      deadline: Date.now(),
    },
  ])

  return (
    <div className="App">
      <Header />
      <AddToDo toDo={ToDo} setToDo={setToDo} />
      <ToDoList toDo={ToDo} setToDo={setToDo} />
    </div>
  );
}

export default App;
