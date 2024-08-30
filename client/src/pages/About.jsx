import React from "react"

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font-general-sans font-semibold text-center mb-7">About Our Blog</h1>
          <div className="text-md font-quicksand min-h-[350px] text-gray-500 flex flex-col gap-6" >
            <p>
              Welcome to <span className="font-general-sans font-bold">TechCrux</span>, a full-stack project designed to deliver a seamless and dynamic blogging experience. Built with React and Redux Toolkit on the frontend, and powered by Node.js, Express, and MongoDB on the backend, this application provides robust functionality and a clean user interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About