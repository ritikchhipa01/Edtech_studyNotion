import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import HighLightedText from "../components/core/HomePage/HighLightedText";
import CTAbutton from "../components/core/HomePage/CTAbutton";
import Banner from "../assets/Images/banner.mp4";
import Codeblock from "../components/core/HomePage/Codeblock";
const Home = () => {
  return (
    <>
      {/* section 1 */}
      <section className="relative mx-auto flex flex-col w-11/12 items-center justify-between text-white max-w-maxContent">
        <Link to={"/signup"}>
          <div className="group mx-auto mt-16 p-1 rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-full">
            <div className="flex flex-row items-center gap-3  rounded-full max-w-maxContent px-8 py-[5px] group-hover:bg-richblack-900">
              <p>Become a instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-4xl font-semibold text-center mt-6">
          Empower Your Future With
          <HighLightedText text={"Coding Skills"} />
        </div>

        <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300 max-w-maxContent ">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex gap-2 mt-8 ">
          <CTAbutton text={"Learn More"} color={true} linkTo={"/signup"} />
          <CTAbutton text={"Book a Demo"} color={false} linkTo={"/login"} />
        </div>

        <div className={"shadow-blue-200 mx-3 my-12 "}>
          <video muted autoPlay loop>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>
      </section>

      {/* section 2 */}

      <div>
        <Codeblock
          position={"lg:flex-row"}
          heading={
            <div className=" text-4xl font-semibold text-white">
              Unlock your
              <HighLightedText text={" coding potential "} />
              with our online courses.
            </div>
          }
          subheading={
            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
          }
          ctabtn1={{
            text: "Try is yourself",
            linkTo: "/signup",
            color: true,
            arrow: true,
          }}
          ctabtn2={{
            text: "Learn More",
            linkTo: "/signup",
            color: false,
          }}
          codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
          codecolor={"text-yellow-200"}
        />
      </div>

      <div>
        <Codeblock
          position={" lg:flex-row-reverse"}
          heading={
            <div className=" text-4xl font-semibold text-white">
              Start
              <HighLightedText text={" coding in seconds "} />
            </div>
          }
          subheading={
            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
          }
          ctabtn1={{
            text: "Continue Lesson",
            linkTo: "/signup",
            color: true,
            arrow: true,
          }}
          ctabtn2={{
            text: "Learn More",
            linkTo: "/signup",
            color: false,
          }}
          codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
          codecolor={"text-yellow-300"}
        />
      </div>

      {/* section 3 */}
      <div className=" bg-pure-greys-5 text-richblue-700">
        <div className="homepage_bg h-[310px]">
          <div className=" w-11/12 max-w-maxContent h-[100%] flex flex-col items-center gap-5 mx-auto">
            {/* <div className="h-[150px]"></div> */}
            <div className="flex gap-10 justify-center item-center mt-5 text-white">
              <CTAbutton
                text={"Explore full catalog"}
                color={true}
                linkTo={"/signup"}
                arrow={true}
              />
              <CTAbutton text={"Learn More"} color={false} linkTo={"/signup"} />
            </div>
          </div>
        </div>

        <div className="flex max-w-maxContent mx-auto flex-col justify-between items-center ">
          <div>
            <div className="w-[50%]  text-4xl font-bold">
              Get the skills you need for a
              <HighLightedText text="job that is in demand." />
            </div>
            <div className="">
              <p>
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </p>
              <CTAbutton text={"Learn More"} color={true} linkTo={"/signup"} />
            </div>
          </div>
          <div>  
          </div>
        </div>
      </div>

      {/* footer 1 */}
    </>
  );
};

export default Home;
