
import dayjs from "dayjs"
import { useContext, useState } from "react"
import styled from "styled-components"
import { AddToDo } from "../AddToDo/AddToDo"
import { ActionBtn } from "../styled/ActionBtn"
import { ToDoItem, ToDoMain, Container, BtnContainer } from "../styled/Divs"
import { TextArea, DateWithTime, } from "../styled/Inputs"
import { collection, getDocs, doc, deleteDoc, query, updateDoc } from "firebase/firestore";
import { Context } from "../.."
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
    }, [TDs])
    const [edit, setEdit] = useState(null) // стейт режима редактирования
    const [value, setValue] = useState('') // стейт todo
    const [hValue, setHvalue] = useState('') //стейт заголовка todo
    const [timeValue, setTime] = useState('')// стейт времени выполнения


    async function saveEdited(item) {// сохранение изменений в state
        await updateDoc(doc(db, "ToDos", item.id), {
            title: value,
            header: hValue,
            deadline: +new Date(timeValue)
        })
        setEdit(null)
    }

    function editToDo(id, title, deadline, header) { // редактирование todo
        setEdit(id)
        setValue(title)
        setTime(deadline)
        setHvalue(header)
    }
    async function deleteToDo(item) {//удаление todo
        await deleteDoc(doc(db, "ToDos", item.id));
    }

    async function done(item) { // changing status
        await updateDoc(doc(db, "ToDos", item.id), {
            stat: true
        })
    }

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
                            <h3 style={{ gridArea: 'header', margin: '0' }}>{item.header}</h3>
                            <p style={{ gridArea: 'main', margin: '0' }}>{item.title}</p>
                            <br />
                            <div style={{ marginBottom: '10px' }}>
                                <object data={item.files} style={{ gridArea: 'files', width: '30px' }}></object>
                                <a style={{ gridArea: 'files', paddingLeft: '10px' }} href={item.files} target="_blank">show pinned files</a>
                            </div>

                            {item.deadline < Date.now() ? <span style={{ color: 'red' }}>Outdated!!! </span> : ''}
                            <Time  {...item}>{dayjs(item.deadline).format('MMM DD ddd hh mm')}</Time>
                        </ToDoMain>
                }
                {edit == item.id ?
                    <BtnContainer><ActionBtn onClick={() => saveEdited(item)}>Save</ActionBtn></BtnContainer>
                    : < BtnContainer >
                        <ActionBtn onClick={() => { deleteToDo(item) }}>Delete</ActionBtn>
                        <ActionBtn onClick={() => { done(item) }}>
                            {item.status ? 'Undone' : 'Done'}
                        </ActionBtn>
                        <ActionBtn onClick={() => { editToDo(item.id, item.title, item.deadline, item.header) }}>Edit</ActionBtn>
                    </BtnContainer>
                }

            </ToDoItem>
        })}
    </Container>
}