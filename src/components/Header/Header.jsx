import styled from "styled-components"
const HeaderBar = styled.div`
width:100%;
height:60px;
display:flex;
justify-content:space-between;
align-items:center;
background:rgb(166, 188, 254);
color:#fff;
margin:0;
`
export const Header = () => {
    return <HeaderBar>
        <h1 style={{ margin: 0 }}>ToDo List</h1>
    </HeaderBar>
}