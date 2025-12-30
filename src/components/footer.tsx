'use client'
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa6'
import { MdEmail, MdOpenInNew } from 'react-icons/md'
import localFont from "next/font/local";
import { Poppins } from 'next/font/google'
import '@/styles/components/footer.css'

const kyivType = localFont({
  src: '../assets/fonts/KyivTypeSans-VarGX.ttf'
})

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600']
})

export default function Footer() {
  return (
    <footer className={`footer ${poppins.className}`}>
      <section className='app-details'>
        <h2 className={`brand ${kyivType.className}`}>AsynQ</h2>
        <p className='about'>Content Creation AI Tool for Threads, Posts, For now ;)</p>
      </section>
      <section className='dev-details'>
        <h3 className='dev-name'>
          Developer: <span
            className='flex cursor-pointer select-none gap-2'
            onClick={() => open("https://www.linkedin.com/in/amr0khaled/", '_blank')}
          >
            Amr Khaled<MdOpenInNew className='text-background/60' size='16' />
          </span>
        </h3>
        <p className='about'>
          I'm someone that have brain that is not braining at urgent times :),
          I build this for to help increase productivity {'<'}3.
        </p>
      </section>
      <section className='contacts'>
        <ul className='icons-list'>
          <li className='icon-item'>
            <a
              href='https://www.linkedin.com/in/amr0khaled/'>
              <FaLinkedin className='icon' />
            </a>
          </li>
          <li className='icon-item'>
            <a
              target='_blank'
              href='https://github.com/amr0khaled'>
              <FaGithub className='icon' />
            </a>
          </li>
          <li className='icon-item'>
            <a
              target='_blank'
              href='mailto:amr0khaled0x@gmail.com'>
              <MdEmail className='icon' />
            </a>
          </li>
          <li className='icon-item'>
            <a
              target='_blank'
              href='https://wa.me/201012184613'>
              <FaWhatsapp className='icon' />
            </a>
          </li>
        </ul>
      </section>
      <span className='rights'>
        All Rights Reserved 2025 | Amr Khaled
      </span>
    </footer>
  )
}
