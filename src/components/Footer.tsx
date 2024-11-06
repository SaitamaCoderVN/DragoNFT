import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='relative h-[7vw] flex flex-row justify-center items-center overflow-hidden w-full p-[2px] border-0 border-solid border-border-transparent rounded-[20px] bg-secondary-background'>
      <div className='absolute left-0 top-0 right-0 w-full h-[20px] rounded-none bg-primary'></div>
      <div className='absolute top-auto right-0 bottom-0 w-full h-[20px] rounded-none bg-primary'></div>
      <div className='absolute left-0 bottom-0 w-[4px] h-full rounded-none bg-primary'></div>
      <div className='absolute left-auto right-0 top-0 bottom-0 w-[4px] h-full rounded-none bg-primary'></div>
      <div className='relative z-[2] flex items-center justify-center overflow-hidden w-full h-full rounded-[20px] bg-secondary-background'>
        <div className='flex w-full h-full rounded-[20px] bg-secondary-background items-center justify-around'>
          <div className='w-[0.5vw] h-full flex'></div>
          <div className='text-[1.5vw] leading-[1.5vw] uppercase whitespace-nowrap text-primary font-pixel'>
            made by <Link href="https://www.linkedin.com/in/thanhdatnguyen-joitaro/" target="_blank" rel="noreferrer" className='text-[#f4f2f5] hover:text-[#d7cfdb]'>Thanh Dat</Link> 2024
          </div>
          <div className='flex w-[2px] h-full bg-primary'></div>
          <div className='text-[1.5vw] leading-[1.5vw] uppercase whitespace-nowrap text-primary font-pixel'>
            <Link href="https://www.linkedin.com/in/thanhdatnguyen-joitaro/" target="_blank" rel="noreferrer" className='hover:text-[#d7cfdb]'>facebook</Link>
          </div>
          <div className='flex w-[2px] h-full bg-primary'></div>
          <div className='text-[1.5vw] leading-[1.5vw] uppercase whitespace-nowrap text-primary font-pixel'>
            <Link href="https://www.linkedin.com/in/thanhdatnguyen-joitaro/" target="_blank" rel="noreferrer" className='hover:text-[#d7cfdb]'>discord</Link>
          </div>
          <div className='flex w-[2px] h-full bg-primary'></div>
          <div className='text-[1.5vw] leading-[1.5vw] uppercase whitespace-nowrap text-primary font-pixel'>
            <Link href="https://www.linkedin.com/in/thanhdatnguyen-joitaro/" target="_blank" rel="noreferrer" className='hover:text-[#d7cfdb]'>openguild</Link>
          </div>
          <div className='w-[0.5vw] h-full flex'></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer