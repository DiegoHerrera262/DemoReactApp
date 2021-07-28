import React, { useState } from 'react';
import { Link } from  'react-router-dom'
import styled from 'styled-components';
import *as FaIcons from 'react-icons/fa'
import *as AiIcons from 'react-icons/ai'
import { sideBarData } from './SideBarData';
import SubMenu from './SubMenu';

const Nav = styled.div`
background: #15171c;
height: 80px;
display:flex;
justify-content: flex-start;
align-items:center;
`;

const NavIcon = styled(Link)`
margin-left: 2rem;
font-size:2rem;
height: 80px;
display:flex;
justify-content: flex-start;
align-items:center;
`;

 const SideBarNav = styled.nav`
 background: #15171c;
width:250px;
 height: 100vh;
 display: flex;
 justify-content: center;
 position: fixed;
 top: 0;
 left: ${({sidebar}) => (sidebar ? '0' : '-100vh')} ;
transition: 350ms;
z-index: 10;
 `;

 const SideBarWrap =styled.div`
 width:'100%';
 
 `;

const SideBar = () => {

const [sidebar, setSidebar]=useState(false)

const showSideBar = () => setSidebar(!sidebar)

  return (
   <>
<Nav>
<NavIcon to='#'>
<FaIcons.FaBars onClick={showSideBar} />
</NavIcon>
</ Nav>
<SideBarNav sidebar={sidebar}>
<SideBarWrap >
<NavIcon to='#'>
<AiIcons.AiOutlineClose onClick={showSideBar} />
</NavIcon>
{ sideBarData.map( (item, index) =>{
return <SubMenu item={item} key={index} />
} ) }
</SideBarWrap>
</SideBarNav>
   </>
  );
}

export default SideBar;
