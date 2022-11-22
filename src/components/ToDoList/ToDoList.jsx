
import dayjs from "dayjs"
import { useState } from "react"
import styled from "styled-components"
import { ActionBtn } from "../ActionBtn"
import { TextArea, DateWithTime } from "../TextArea"
const Time = styled.span`
color:${item => item.deadline < Date.now() ? 'red' : 'BLUE'};
`
const ToDoMain = styled.div`
padding:10px;
text-align:left;
max-width:250px;
`
const Container = styled.div`
width:100%;
display:flex;
flex-direction:column;
align-items:center;
padding-top:20px;
`
const ToDoItem = styled.div`
width: 400px;
height: 110px;
padding:5px;
background:${item => item.status ? 'rgb(188, 250, 185)' : 'lightgrey'};
margin: 5px;
border-radius:10px;
display: grid;
grid-template-rows: 1fr 1fr;
grid-template-columns: 3fr 1fr;
grid-template-areas:
'header  buttons'
'main  buttons'
;
`
const BtnContainer = styled.div`
    grid-area:buttons;
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    justify-content:space-around;
`
export const ToDoList = ({ toDo, setToDo }) => {
    const [edit, setEdit] = useState(null) // стейт режима редактирования
    const [value, setValue] = useState('') // стейт todo
    const [hValue, setHvalue] = useState('') //стейт заголовка todo
    const [timeValue, setTime] = useState('')// стейт времени выполнения

    const saveEdited = (id) => {// сохранение изменений в state
        let newTodo = [...toDo].map(item => {
            if (item.id == id) {
                item.title = value
                item.header = hValue
                item.deadline = +new Date(timeValue)
            }
            return item
        })
        setToDo(newTodo)
        setEdit(null)
    }

    const editToDo = (id, title, deadline, header) => { // редактирование todo
        setEdit(id)
        setValue(title)
        setTime(deadline)
        setHvalue(header)
    }
    const deleteToDo = (id) => {//удаление todo
        let newToDo = [...toDo].filter(item => item.id != id)
        setToDo(newToDo)
    }

    const done = (id) => { // changing status
        let newToDo = [...toDo].filter(item => {
            if (item.id == id) {
                item.status = !item.status
            }
            return item
        })
        setToDo(newToDo)
    }

    return <Container>
        {toDo.map(item => {
            return <ToDoItem {...item} key={item.id}>
                {
                    edit == item.id ? <div>

                        <TextArea value={hValue} onChange={(e) => setHvalue(e.target.value)} />
                        <TextArea value={value} onChange={(e) => setValue(e.target.value)} />
                        <DateWithTime value={timeValue} onChange={(e) => setTime(e.target.value)} type="datetime-local" />

                    </div>
                        : <ToDoMain>
                            <h3>{item.header}</h3>
                            {item.title}
                            <br />
                            {item.deadline < Date.now() ? <span style={{ color: 'red' }}>Outdated!!! </span> : ''}
                            <Time {...item}>{dayjs(item.deadline).format('MMM DD ddd hh mm')}</Time>
                        </ToDoMain>
                }
                {edit == item.id ?
                    <BtnContainer><ActionBtn onClick={() => saveEdited(item.id)}>Save</ActionBtn></BtnContainer>
                    : < BtnContainer >
                        <ActionBtn onClick={() => { deleteToDo(item.id) }}>Delete</ActionBtn>
                        <ActionBtn onClick={() => { done(item.id) }}>
                            {item.status ? 'Undone' : 'Done'}
                        </ActionBtn>
                        <ActionBtn onClick={() => { editToDo(item.id, item.title, item.deadline, item.header) }}>Edit</ActionBtn>
                    </BtnContainer>
                }

            </ToDoItem>
        })}
    </Container>
}