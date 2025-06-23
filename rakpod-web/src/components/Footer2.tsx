import logo from '../adcmlogo.svg'
import phonelogo from '../mdi_telephone.svg'
import earthlogo from '../mdi_web.svg'
import psllogo from '../psllogo.svg'
import blue from '../blue.svg'
import green from '../green.svg'
import red from '../red.svg'
import yellow from '../yellow.svg'
import orange from '../orange.svg'

const Footer = () => {
  return (
    <footer className="bg-[#FFFFFF] min-h-[200px] p-[20px] space-y-[20px] shadow-md ">
      <div className='flex justify-center text-4xl'>
        <div>หน่วยงานที่</div>
        <div className='text-[#00CC99]'>ดูแลปอด</div>
      </div>
      <hr />

      <div className='flex justify-center align-bottom'>
        <img src={psllogo} alt="PSLLOGO" className="w-24 sm:w-auto" />
      </div>
      <hr className="my-4 sm:my-8" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className='text-center sm:text-left'>
          <img src={logo} alt="ADCMLOGO" className="w-24 sm:w-auto mx-auto" />
        </div>
        <div className='text-center sm:text-left mt-[10%]'>
          <h2 className='text-[#00CC99]'>บริษัท เอดีซี ไมโครซิสเต็มส์ จำกัด</h2>
          <h2>36/10 หมู่ที่ 10 ตำบลวัดจันทร์ อำเภอเมืองพิษณุโลก
            จังหวัด พิษณุโลก 65000</h2>
        </div>
        <div className='text-center sm:text-left mt-[10%]'>
          <h2 className='text-[#00CC99]'>
            ติดต่อเรา
          </h2>
          <div className='flex gap-4'>
            <img src={phonelogo} alt="phone" className="w-6 h-6" />
            <h2>เบอร์โทร 098 835 2461 (คุณมะปราง)</h2>
          </div>
          <div className='flex gap-4'>
            <img src={earthlogo} alt="web" className="w-6 h-6" />
            <h2>adcm.co.th</h2>
          </div>
        </div>
        <div className='text-center sm:text-left mt-[10%]'>
          <h2>จาก...</h2>
          <h1 className='text-[#00CC99] text-4xl'>“ คนที่ห่วงปอดของคุณ ”</h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
