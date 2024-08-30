import { Button } from "flowbite-react"

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-purple-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center"
    > 
      <div className=" flex-1 flex gap-3 h-full justify-center max-sm:items-center flex-col">
        <h2 className="text-2xl">The Ultimate Guide to Becoming a JavaScript Wizard Overnight!</h2>
        <p className="text-gray-700 dark:text-gray-400 ">Checkout these resources with 100 JavaScript Projects</p>
        <Button
          gradientDuoTone={'purpleToPink'}
          className="rounded-sm rounded-tl-lg rounded-br-lg max-sm:w-[200px] my-2"
        >
          Learn More
        </Button>
      </div>
      <div className="p-7 flex-1 ">
        <img src="/JavaScript-logo.webp" alt="" />
      </div>
    </div>
  )
}

export default CallToAction