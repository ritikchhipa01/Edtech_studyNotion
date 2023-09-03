import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

const CTAbutton = ({text,color,linkTo,arrow}) => {
  return (
    <>
     <Link to={linkTo}>
      <button className={`text-center text-[13px] ${color?" bg-[#FFd60A] text-black" :" bg-richblack-800 text-white"} px-6 py-3 rounded-md font-bold hover:scale-95 transition-all duration-200 flex justify-center gap-2 items-center`}>
         {text}
         {arrow ? <FaArrowRight/>:""}
      </button>
      </Link>
    </>
  )
}

export default CTAbutton
