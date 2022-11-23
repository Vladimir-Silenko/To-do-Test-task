
import dayjs from "dayjs"
import { useContext, useState } from "react"
import styled from "styled-components"
import { AddToDo } from "../AddToDo/AddToDo"
import { ActionBtn } from "../styled/ActionBtn"
import { ToDoItem, ToDoMain, Container, BtnContainer } from "../styled/Divs"
import { TextArea, DateWithTime, } from "../styled/Inputs"
import { collection, getDocs, doc, deleteDoc, query } from "firebase/firestore";
import { Context } from "../.."
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect } from "react"

const Time = styled.span`
color:${item => item.deadline < Date.now() ? 'red' : 'BLUE'};
`

export const ToDoList = ({ toDo, setToDo }) => {
    const [TDs, setTDs] = useState([])
    const { db } = useContext(Context)
    const getData = async () => {
        const q = query(collection(db, 'ToDos'))

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));
        setTDs(data)
    }
    useEffect(() => {
        getData()
    },)
    // let [loading] = useCollectionData(
    //     collection(db, 'ToDos')
    // )
    const [edit, setEdit] = useState(null) // стейт режима редактирования
    const [value, setValue] = useState('') // стейт todo
    const [hValue, setHvalue] = useState('') //стейт заголовка todo
    const [timeValue, setTime] = useState('')// стейт времени выполнения


    function saveEdited(id) {// сохранение изменений в state
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

    function editToDo(id, title, deadline, header) { // редактирование todo
        setEdit(id)
        setValue(title)
        setTime(deadline)
        setHvalue(header)
    }
    async function deleteToDo(item) {//удаление todo
        // let newToDo = [...toDo].filter(item => item.id != id)
        // setToDo(newToDo)
        await deleteDoc(doc(db, "ToDos", item.id));
    }

    async function done(id) { // changing status
        TDs = await TDs.map(item => {
            if (item.id == id) {
                item.status = !item.status
            }
            return item
        })
    }

    // if (loading) return <div>wait..</div>
    return <Container>
        <AddToDo toDo={toDo} setToDo={setToDo} />
        {TDs.map(item => {
            return <ToDoItem {...item} key={item.id + 1}>
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
                        <ActionBtn onClick={() => { deleteToDo(item) }}>Delete</ActionBtn>
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