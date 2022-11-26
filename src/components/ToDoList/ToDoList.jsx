
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
/**
 * 
 * @returns список записей 
 */
export const ToDoList = () => {
    const [TDs, setTDs] = useState([]) //стейт с данными с бэкэнда
    const { db } = useContext(Context) //достаем из контекста переменную с ссылкой на хранилище
    /**
     * эта функция запрашивает данныt из firestore, и кладёт их в стейт
     */
    const getData = async () => {
        const q = query(collection(db, 'ToDos')) // засовываем коллекцию в переменную

        const querySnapshot = await getDocs(q) //получаем копию массива данных из коллекции
        const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));
        setTDs(data)
    }
    useEffect(() => {//запрашиваем данные при изменении стейта
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
    /**
     * эта функция включает режим редактирования записи, 
     * присваивая её id в стейт edit  
     * @param {number} id 
     * @param {string} title 
     * @param {string} deadline 
     * @param {string} header 
     */
    function editToDo(id, title, deadline, header) {
        setEdit(id)
        setValue(title)
        setTime(deadline)
        setHvalue(header)
    }

    /**
     * эта функция удаляет запись
     */
    async function deleteToDo(item) {
        await deleteDoc(doc(db, "ToDos", item.id));
    }

    /**
     * эта функция меняет статус записи
     */
    async function done(item) { // changing status
        await updateDoc(doc(db, "ToDos", item.id), {
            stat: true
        })
    }

    return <Container>
        <AddToDo />
        {TDs.map(item => {
            return <ToDoItem {...item} key={item.id + 1}>
                {   //определяем что выводится на страницу, если edit равен/не равен 
                    edit == item.id ? <div>

                        <TextArea value={hValue} onChange={(e) => setHvalue(e.target.value)} /> {/**поле ввода заголовка*/}
                        <TextArea value={value} onChange={(e) => setValue(e.target.value)} /> {/**поле ввода основной информации */}
                        <DateWithTime value={timeValue} onChange={(e) => setTime(e.target.value)} type="datetime-local" /> {/**поле ввода времени*/}

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
                        <ActionBtn onClick={() => { deleteToDo(item) }}>Delete</ActionBtn> {/** кнопка удаления */}
                        <ActionBtn onClick={() => { done(item) }}>
                            {item.status ? 'Undone' : 'Done'}   {/** кнопка изменения статуса */}
                        </ActionBtn>
                        <ActionBtn onClick={() => { editToDo(item.id, item.title, item.deadline, item.header) }}>Edit</ActionBtn> {/** кнопка входа в режим редактирования */}
                    </BtnContainer>
                }

            </ToDoItem>
        })}
    </Container>
}