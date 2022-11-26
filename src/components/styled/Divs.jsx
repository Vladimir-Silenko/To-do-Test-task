import styled from "styled-components"
// For List

/**
 * карточка записи
 */
export const ToDoItem = styled.div` 
width: 400px;
max-height: 140px;
padding:5px;
background:${item => item.stat ? 'rgb(188, 250, 185)' : 'lightgrey'};
margin: 5px;
border-radius:10px;
display: grid;
grid-template-rows: 1fr 2fr 1fr;
grid-template-columns: 3fr 1fr;
grid-template-areas:
'header  buttons'
'main  main'
'files  files'
;
`
/**
 * область с основной информацией записи
 */
export const ToDoMain = styled.div`
padding:10px;
display:flex;
flex-direction: column;
text-align:left;
max-width:250px;
`
/**
 * контейнер для карточек
 */
export const Container = styled.div`
width:100%;
display:flex;
flex-direction:column;
align-items:center;
padding-top:20px;
`
/**
 * контейнер для кнопок
 */
export const BtnContainer = styled.div`
max-height:110px;
    grid-area:buttons;
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    justify-content:space-around;
`
// For AddToDo
/**
 * форма
 */
export const Form = styled.div`
background:lightgrey;
padding:10px;
width: 420px;
height: 110px;
border-radius:10px;
display:grid;
grid-template-areas:
'header question question'
'main buttons buttons'
;
grid-gap:10px;
margin:10px auto;
`

export const Header = styled.div`
font-size:24px;
font-weight:500;
text-align: left;
grid-area:question;

`