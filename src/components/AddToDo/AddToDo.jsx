import { useState } from "react"
import { ActionBtn } from "../styled/ActionBtn"
import styled from "styled-components"
import { DateWithTime, TextArea } from "../styled/Inputs"
import { Header, Form } from "../styled/Divs"
import { useContext } from "react"
import { Context } from "../.."
import { collection, addDoc } from "firebase/firestore";






const AddButton = styled(ActionBtn)`
margin-right:100px;
`
export const AddToDo = ({ toDo, setToDo }) => {
    const [value, setValue] = useState('')
    const [hValue, setHvalue] = useState('')
    const [timeValue, setTime] = useState('')
    const { db, ToDosCol } = useContext(Context)

    const addToDo = async () => {
        try {
            const docRef = await addDoc(collection(db, "ToDos"), {
                id: Math.random(),
                title: value,
                header: hValue,
                status: false,
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
            <div
                style={{ gridArea: 'buttons' }}>
                <AddButton onClick={addToDo}>Add ToDo</AddButton>
            </div>
        </Form >
    )
}