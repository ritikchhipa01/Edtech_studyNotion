import React from 'react'
import CTAbutton from './CTAbutton'
import { FaArrowRight } from "react-icons/fa";
import {TypeAnimation} from "react-type-animation"

const Codeblock = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, codecolor, bgGradient, 
}) => {
  return (
    <>
    <div className={`${position} flex mx-20  my-20 justify-between gap-10 `}>

        <div className={`w-[50%] flex p-5 flex-col gap-8`}>
           {heading}
           
           <p className=' text-richblack-300 font-bold'>
           {subheading}
           </p>

           <div className='flex gap-7 mt-7'>
             <CTAbutton text={ctabtn1.text} color={ctabtn1.color} linkTo={ctabtn1.linkTo} arrow={ctabtn1.arrow}>
                <div  className='flex gap-7 items-center'>
                    {ctabtn1.text}
                    <FaArrowRight/>
                </div>
             </CTAbutton>
             <CTAbutton  text={ctabtn2.text}  color={ctabtn2.color} linkTo={ctabtn2.linkTo}>
                
             </CTAbutton>
            
           </div>
        </div>

        {/* section 2 text-animation */}
        <div className='w-[50%] flex h-fit py-4  bg-white/5  
         bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40 border border-gray-100
 '>
            <div className='text-center flex flex-col w-[10%] text-richblack-400 font-bold font-inter pr-2'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
                
            </div>
            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codecolor}  relative`}>
                 <div className='_gradient w-[250px] h-[100px] z-[-1]  absolute bg-[#ccf4f920] rounded-full backdrop-blur-lg shadow-xl'></div>
                <TypeAnimation className={`${codecolor}`}
                   sequence={[codeblock, 2000,""]}
                   repeat={Infinity}
                   cursor={true}
                   style={
                    {
                        whiteSpace:"pre-line",
                        display: 'block'
                    }
                   }
                   omitDeletionAnimation={true}
                />
            </div>
        </div>
    </div>
    </>
  )
}

export default Codeblock
