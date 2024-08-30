import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitterX } from 'react-icons/bs'
import Icon from './Icon'


const FooterComp = () => {
  return (
    <Footer container className='border border-t-8 border-violet-500'>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1 max-sm:gap-5 ">
          {/* LOGO */}
          <div className="mt-5">
          <Link to='/' className='  flex items-center whitespace-nowrap text-lg  sm:text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  text-transparent bg-clip-text'>
            <h1 >Tech</h1>
            <Icon height={'h-4 sm:h-5'} />
            <h1>rux</h1>
          </Link>
            
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-6">

            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>
                  Dashboard
                </Footer.Link>
                <Footer.Link href='#'>
                  Dhruv Verma
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Follow us' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>
                  Github
                </Footer.Link>
                <Footer.Link href='#'>
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href='#'>
                  Terms & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

          </div>
        </div>

        {/* DIVIDER */}
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between ">
          <Footer.Copyright href="#" by="Dhruv Verma" year={new Date().getFullYear()} />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='#' icon={BsFacebook} />
            <Footer.Icon href='#' icon={BsInstagram} />
            <Footer.Icon href='#' icon={BsTwitterX} />
            <Footer.Icon href='#' icon={BsGithub} />
            <Footer.Icon href='#' icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterComp