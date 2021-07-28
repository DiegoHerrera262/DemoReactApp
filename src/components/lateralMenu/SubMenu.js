import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import styled from 'styled-components';


 const SideBarLink = styled(Link)`
 display: flex;
 color: #e1e9fc;
 justify-content: space-between;
 align-items: center;
 padding: 20px;
 list-style: none;
 height: 60px;
 text-decoration:none;
 font-size: 18px;

 &:hover{
     background:#252831;
     border-left: 4px solid  white;
     cursor: pointer;
 }

 `;

const SideBarLabel = styled.span`
margin-left:16px;
`

const SubMenu = ({item}) => {

const [subnav,setSubNav] = useState(false) 

const showSubnav = () => setSubNav(!subnav)

  return (
    <>
    <SideBarLink to={item.path} onClick={item.subNav &&
         showSubnav}>
<div>
    {item.icon}
    <SideBarLabel>{item.title}</SideBarLabel>
</div>
<div>
    {item.subNav && subnav
     ? item.iconOpened
      : item.subNav 
      ? item.iconClosed 
      : null }
</div>
      </SideBarLink>
    </>
  );
}

export default SubMenu;
