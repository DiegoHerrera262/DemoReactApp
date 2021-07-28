import React from 'react';
import *as faIcons from 'react-icons/fa'
import *as AiIcons from 'react-icons/ai'
import *as IoIcons from 'react-icons/io'
import *as RiIcons from 'react-icons/ri'


export const sideBarData =[
    {
    title:'products',
    path: '/products',
    icon: <AiIcons.AiFillHome />,
    iconClose: <RiIcons.RiArrowDownSFill />, 
    iconOpened: <RiIcons.RiArrowUpSFill />,
subNav:[
    {
    title:'ver todos',
    path: '/products/vertodos',
    icon: <AiIcons.AiFillHome />,
    },
]

},

{
    title:'pedidos',
    path: '/pedidos',
    icon: <AiIcons.AiFillHome />,
    iconClose: <RiIcons.RiArrowDownSFill />, 
    iconOpened: <RiIcons.RiArrowUpSFill />,
subNav:[
    {
    title:'gestionar pedidos',
    path: '/pedidos/gestionar pedidos',
    icon: <AiIcons.AiFillHome />,
    },
]

},




]
