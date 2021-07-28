import React from 'react';
import { Link } from  'react-router-dom'
import styled from 'styled-components';
import *as FaIcons from 'react-icons/fa'
import *as AiIcons from 'react-icons/ai'

const Nav = styled.div`
background: #15171c;
height: 80px;
display:flex;
justify-content: flex-start;
align-items:center;
`;

const NavIcon = styled(Link)`
margin-left: 2rem;


`

 const SideBar = () => {
  return (
   <>
<Nav>nav</ Nav>
<NavIcon to='#'>
<FaIcons.FaBars />
</NavIcon>
   </>
  );
}

export default SideBar;
