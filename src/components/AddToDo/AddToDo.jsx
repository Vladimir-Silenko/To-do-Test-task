import { useState } from "react"
import { ActionBtn } from "../styled/ActionBtn"
import styled from "styled-components"
import { DateWithTime, TextArea } from "../styled/Inputs"
import { Header, Form } from "../styled/Divs"
import { useContext } from "react"
import { Context } from "../.."
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from 'firebase/storage'

const AddButton = styled(ActionBtn)`
margin-right:100px;
`
// форма добавления записи
export const AddToDo = () => {
    const [fileUpload, setFileUpload] = useState(null)
    const [value, setValue] = useState('')
    const [hValue, setHvalue] = useState('')
    const [timeValue, setTime] = useState('')
    const { db, storage } = useContext(Context)
    /**
     *  эта функция загружает файлы в хранилище
     */
    const uploadFile = () => {
        if (fileUpload == null) return // если в стейте пусто, выходим из функции
        const fileRef = ref(storage, `files/${fileUpload.name}`) //создаем ссылку на файл
        uploadBytes(fileRef, fileUpload).then(() => {
            console.log('uploaded') //загружаем файлы в хранилище, и в случае успеха выводим оповещение в консоль
        })
    };
    /**
     * отправляем запись в firestore
     */
    const addToDo = async () => {
        uploadFile()
        try {
            const docRef = await addDoc(collection(db, "ToDos"), {
                id: Math.random(),
                title: value,
                header: hValue,
                files: `https://firebasestorage.googleapis.com/v0/b/react-todo-wu.appspot.com/o/files%2F${fileUpload.name}?alt=media&token=c79f3f68-bebd-4b6d-b1ee-29f17711ee02`,
                stat: false,
                deadline: timeValue
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setValue('')
        setHvalue('')
    }

    return (
        <Form >
            <Header>
                Lets Go!!!!
            </Header>
            <TextArea
                style={{ gridArea: 'header' }}
                placeholder='Enter Title'
                type="text"
                value={hValue}
                onChange={(e) => setHvalue(e.target.value)} />
            <TextArea
                placeholder='Todo'
                value={value} onChange={(e) => setValue(e.target.value)} />
            <DateWithTime value={timeValue} onChange={(e) => setTime(e.target.value)} type="datetime-local" />
            <input type='file' onChange={(event) => { setFileUpload(event.target.files[0]) }} />
            <div
                style={{ gridArea: 'buttons' }}>
                <AddButton onClick={addToDo}>Add ToDo</AddButton>
            </div>
        </Form >
    )
}