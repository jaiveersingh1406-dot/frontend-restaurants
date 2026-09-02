import { useEffect, useState } from "react";

function ProgressBar(){

const [scroll,setScroll]=useState(0);

useEffect(()=>{

const handleScroll=()=>{

const total=document.documentElement.scrollHeight-window.innerHeight;

const current=(window.scrollY/total)*100;

setScroll(current);

};

window.addEventListener("scroll",handleScroll);

return()=>window.removeEventListener("scroll",handleScroll);

},[]);

return(

<div

className="progress-bar-top"

style={{width:`${scroll}%`}}

/>

);

}

export default ProgressBar;