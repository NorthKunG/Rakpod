import logo from '../adcmlogo.svg'
import phonelogo from '../mdi_telephone.svg'
import earthlogo from '../mdi_web.svg'
import psllogo from '../psllogo.svg'
import cmlogo from '../cmlogo.svg'
import rplogo from '../rplogo.svg'
import ieaotlogo from '../ieaotlogo.svg'
import blue from '../blue.svg'
import green from '../green.svg'
import red from '../red.svg'
import yellow from '../yellow.svg'
import purple from '../purple.svg'
import orange from '../orange.svg'
import faxlogo from '../faxlogo.svg'
import maillogo from '../maillogo.svg'

const Footer = () => {
  return (

    <footer className="bg-[#FFFFFF] min-h-[200px] p-[20px] space-y-[20px] shadow-md">

      {/* <h2 className="font-semibold ipad:text-[20px] iphoneSE:text-[16px]">
      บริษัท เอดีซี ไมโครซิสเต็มส์ จำกัด
    </h2>
    <div className="ipad:text-[18px] iphoneSE:text-[14px]  font-normal text-gray-500">
      <p>36/10 หมู่ที่ 10 ตำบลวัดจันทร์ อำเภอเมืองพิษณุโลก</p>
      <p>จังหวัด พิษณุโลก 65000</p>
    </div>
    <hr />
    <p className="font-medium ipad:text-[16px] iphoneSE:text-[12px]">
      Copyright © 2020 ADC MICROSYSTEMS COMPANY LIMITED
    </p> */}
      <div className='flex justify-center text-4xl '>
        <div className='text-[#7C0DEB]'>แต่ละสัญลักษณ์</div>
        <div>อยากบอกอะไรคุณ...?</div>

      </div>
      <div className="grid grid-cols-2 gap-4 justify-center">


        <div className='flex justify-end'>

          <div className="chat chat-start">
            <div className="chat-image avatar mt-10">
              <div className="w-10 rounded-full">
                <img src={blue} alt="blue" />
              </div>
            </div>
            <div className="chat-bubble bg-[#FFFFFF80]  drop-shadow-2xl w-auto">
              <div className='text-[#47B5FF]'>
                อากาศดีมาก
              </div>
              <div className='text-black'>
                อากาศดีมากแบบนี้ น่าจะออกไปเดินเล่น
                นอกบ้านนะคะ
              </div>
            </div>
          </div>




        </div>
        <div className='flex justify-start'>

          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={green} alt="green" />
              </div>
            </div>
            <div className="chat-bubble bg-[#FFFFFF80]  drop-shadow-2xl w-auto">
              <div className='text-[#81CD47]'>
                อากาศดี
              </div>
              <div className='text-black'>
                อากาศดี แจ่มใส สามารถทำกิจกรรมได้ค่ะ
              </div>
            </div>
          </div>




        </div>

      </div>
      <div className="grid grid-cols-3 gap-4 justify-center">


        <div className='flex justify-end'>

          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full mt-10">
                <img src={yellow} alt="yellow" />
              </div>
            </div>
            <div className="chat-bubble bg-[#FFFFFF80]  drop-shadow-2xl w-auto">
              <div className='text-[#EAD600]'>
                ปานกลาง
              </div>
              <div className='text-black'>
                อากาศยังปกติ สามารถทำกิจกรรมได้ค่ะ
              </div>
            </div>
          </div>




        </div>
        <div className='flex justify-center'>

          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={orange} alt="orange" />
              </div>
            </div>
            <div className="chat-bubble bg-[#FFFFFF80]  drop-shadow-2xl w-auto">
              <div className='text-[#FE841F]'>
                เริ่มมีผลต่อสุขภาพ
              </div>
              <div className='text-black'>
                ควรงดกิจกรรมกลางแจ้ง และสวมหน้ากากป้องกัน
              </div>
            </div>
          </div>




        </div>

        <div className='flex justify-start'>

          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full ">
                <img src={red} alt="red" />
              </div>
            </div>
            <div className="chat-bubble bg-[#FFFFFF80]  drop-shadow-2xl w-auto">
              <div className='text-[#E34545]'>
                มีผลต่อสุขภาพ
              </div>
              <div className='text-black'>
                หลีกเลี่ยงการทำกิจกรรมภายนอก และควรสวมใส่หน้ากาก N95
              </div>
            </div>
          </div>




        </div>

      </div>

      <hr />
      <div className="flex justify-around">

        <div className='w-40 h-40 flex items-center justify-center'>
          <img src={psllogo} alt="ADCMLOGO" className="w-auto h-auto" />
        </div>
        <div className='place-content-center'>
          <h2 className='text-[#7C0DEB] font-bold'>เทศบาลนครพิษณุโลก</h2>
          <h2>1299 ถ.บรมไตรโลกนารถ 2 ต.ในเมือง
            อ.เมือง จ.พิษณุโลก 65000</h2>

        </div>
        <div className='place-content-center'>
          <h2 className='text-[#7C0DEB] font-bold'>
            ติดต่อเรา
          </h2>
          <div className='flex gap-4'>
            <img src={phonelogo} alt="phone" />
            <h2>0-5598-3221-28</h2>
          </div>
          <div className='flex gap-4'>
            <img src={faxlogo} alt="web" />
            {/* <h2>www.adcmicrosystems.com</h2> */}
            <h2>0-5598-3332</h2>
            {/* <a className="link link-primary" 
            onClick={
              () => {
                window.open('http://www.adcm.co.th', '_blank')
              }
            }
            >www.adcm.co.th</a> */}
          </div>
        </div>
        <div className='place-content-center'>
        <div className='flex gap-4'>
            <img src={maillogo} alt="phone" />
            <h2>mayor@phsmun.go.th</h2>
          </div>
          <div className='flex gap-4'>
            <img src={earthlogo} alt="phone" />
            <h2>www.phsmun.go.th</h2>
          </div>
          {/* <h2>จาก...</h2>
          <h1 className='text-[#7C0DEB] text-4xl'>“ คนที่ห่วงปอดของคุณ ”</h1> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer