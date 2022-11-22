import { useState } from "react"
import { ActionBtn } from "../ActionBtn"
import styled from "styled-components"
import { DateWithTime, TextArea } from "../TextArea"

const Form = styled.div`
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
const Header = styled.div`
font-size:24px;
font-weight:500;
text-align: left;
grid-area:question;

`
const AddButton = styled(ActionBtn)`
margin-right:100px;
`
export const AddToDo = ({ toDo, setToDo }) => {
    const [value, setValue] = useState('')
    const [hValue, setHvalue] = useState('')
    const [timeValue, setTime] = useState('')
    const addToDo = () => {
        setToDo([
            ...toDo,
            {
                id: toDo.length + 1,
                title: value,
                header: hValue,
                status: false,
                deadline: timeValue
            },

        ])
        setValue('')
        setHvalue('')
        console.log(hValue)
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