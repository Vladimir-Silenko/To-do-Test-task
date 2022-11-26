import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'

/**
 * инициализация приложения в firebase
 */
const app = initializeApp({
  apiKey: "AIzaSyCJjbI3uFDhgSQsEsi9Xhhwft9OWWJ2sZA",
  authDomain: "react-todo-wu.firebaseapp.com",
  projectId: "react-todo-wu",
  storageBucket: "react-todo-wu.appspot.com",
  messagingSenderId: "680093510803",
  appId: "1:680093510803:web:8a69393e0a721f728fb166",
  measurementId: "G-8LZW4EQE3S"
})

const db = getFirestore(app) //здесь ссылка на firestore
const ToDosCol = collection(db, 'ToDos') // здесь нужная нам коллекция
const storage = getStorage(app)//здесь ссылка на хранилище
export const Context = createContext(null) //создаем контекст, из которого потом будем доставать нужные константы
getDocs(ToDosCol).then((snapshot) => console.log(snapshot.docs))
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    db,
    ToDosCol,
    storage
  }}>

    <App />
  </Context.Provider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
