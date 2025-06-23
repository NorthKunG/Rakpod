import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";
import { DeviceNew } from "../../models/new_devices.model";
import "./NewCardDeviceDetails.css";
import blue from '../../blue.svg'
import green from '../../green.svg'
import red from '../../red.svg'
import yellow from '../../yellow.svg'
import purple from '../../purple.svg'
import orange from '../../orange.svg'
import { da } from "date-fns/locale";

const NewCardDeviceDetails: React.FC<{
  open: boolean;
  data: DeviceNew | null;
  closeFunction: any;
  page: string;
}> = ({ open, data, closeFunction, page }) => {
  const navigate = useNavigate();

  return (
    <div
      className={` ${page === "home" ? "card-home" : "card-map"} ${page === "map-psl" ? "card-map-psl" : "card-map"} ${data?.sensor.length === 5 ? "card-map-psl" : "card-map-psl-4"} ${data?.name === "มหาวิทยาลัยราชภัฏกำแพงเพชร" ? "card-home-kpru" : "card-home"} ${data?.status === 'offline' ? "card-home-offline" : "card-home"}  ${open ? "" : "hidden"
        }`}
    >
      <div className="text-right">
        <CloseIcon
          sx={{ cursor: "pointer", color: "#888888" }}
          onClick={closeFunction}
        />
      </div>

      {/* <div>{devicesData.data[0].airQuality.AQI.aqi}</div> */}
      <div className="flex flex-row">
        <div className="basis-1/4"></div>

      </div>


      {data?.environmentInformation.aqi.AQI.aqi != null ? (
        // <div
        //   className={`${
        //     data?.environmentInformation.aqi.AQI.Level === 1
        //       ? "bg-[#3BCCFF]"
        //       : data?.environmentInformation.aqi.AQI.Level === 2
        //       ? "bg-[#92D050] "
        //       : data?.environmentInformation.aqi.AQI.Level === 3
        //       ? "bg-[#FFFF00] "
        //       : data?.environmentInformation.aqi.AQI.Level === 4
        //       ? "bg-[#FFA200] "
        //       : "bg-red-500 "
        //   }  rounded-md w-[90%] mx-auto pb-4`}
        // >
        //   {" "}
        //   <p className="text-2xl">
        //     {data?.environmentInformation.aqi.AQI.aqi}{" "}
        //     <span className="text-lg">AQI</span>{" "}
        //   </p>
        //   {data?.environmentInformation.PM25 != null && (
        //     <div className="bg-white">
        //       <p>
        //         PM2.5 {data?.environmentInformation.PM25}{" "}
        //         <b className="font-bold">µg/m³</b>
        //       </p>
        //     </div>
        //   )}

        // </div>
        <div className="flex">
          <div className="basis-1/4 mr-2">
            {
              data?.name === "มหาวิทยาลัยราชภัฏกำแพงเพชร" ? (
                <div className="flex justify-center xl:mt-[20%] sm:mt-[20%] lg:mt-[20%] md:mt-[20%]  mt-[120%]  ">
                  {
                    data?.environmentInformation.aqi.AQI.Level === 1 ? (
                      <img src={blue} alt="blue" className="xl:w-24 w-12" />
                    ) : data?.environmentInformation.aqi.AQI.Level === 2 ? (
                      <img src={green} alt="green" className="xl:w-24 w-12" />
                    ) : data?.environmentInformation.aqi.AQI.Level === 3 ? (
                      <img src={yellow} alt="yellow" className="xl:w-24 w-12" />
                    ) : data?.environmentInformation.aqi.AQI.Level === 4 ? (
                      <img src={orange} alt="orange" className="xl:w-24 w-12" />
                    ) : (
                      <img src={red} alt="red" className="xl:w-24 w-12" />
                    )
                  }
                </div>
              ) : data.sensor.length == 4 ? (
                <div className="flex justify-center xl:mt-[20%] sm:mt-[20%] lg:mt-[20%] md:mt-[20%]  mt-[8%]">
                  {
                    data?.environmentInformation.aqi.AQI.Level === 1 ? (
                      <img src={blue} alt="blue" className="xl:w-24 w-12" />
                    ) : data?.environmentInformation.aqi.AQI.Level === 2 ? (
                      <img src={green} alt="green" className="xl:w-24 w-12" />
                    ) : data?.environmentInformation.aqi.AQI.Level === 3 ? (
                      <img src={yellow} alt="yellow" className="xl:w-24 w-12" />
                    ) : data?.environmentInformation.aqi.AQI.Level === 4 ? (
                      <img src={orange} alt="orange" className="xl:w-24 w-12" />
                    ) : (
                      <img src={red} alt="red" className="xl:w-24 w-12" />
                    )
                  }
                </div>
              ) :  (
                <div className="flex justify-center xl:mt-[20%] sm:mt-[20%] lg:mt-[20%] md:mt-[20%]  mt-[25%]">
                  {
                    data?.environmentInformation.aqi.AQI.Level === 1 ? (
                      <img src={blue} alt="blue" className="xl:w-24 w-12" />
                    ) : data?.environmentInformation.aqi.AQI.Level === 2 ? (
                      <img src={green} alt="green" className="xl:w-24 w-12" />
                    ) : data?.environmentInformation.aqi.AQI.Level === 3 ? (
                      <img src={yellow} alt="yellow" className="xl:w-24 w-12" />
                    ) : data?.environmentInformation.aqi.AQI.Level === 4 ? (
                      <img src={orange} alt="orange" className="xl:w-24 w-12" />
                    ) : (
                      <img src={red} alt="red" className="xl:w-24 w-12" />
                    )
                  }
                </div>
              )
            }

            <div className="text-center mt-2">
              { page !== "map-psl" ? (
                data?.environmentInformation.aqi.AQI.Level === 1 ? (
                  <h2 className="text-[#47B5FF]">อากาศดีมาก</h2>
                ) : data?.environmentInformation.aqi.AQI.Level === 2 ? (
                  <h2 className='text-[#81CD47]'>อากาศดี</h2>
                ) : data?.environmentInformation.aqi.AQI.Level === 3 ? (
                  <h2 className='text-[#EAD600]'>อากาศปานกลาง</h2>
                ) : data?.environmentInformation.aqi.AQI.Level === 4 ? (
                  <h2 className='text-[#FE841F]'>อากาศเริ่มมีผลกระทบ</h2>
                ) : (
                  <h2 className='text-[#E34545]'>อากาศมีผลกระทบ</h2>
                ) ) : (
                  data?.environmentInformation.aqi.AQI.Level === 1 ? (
                    <><div className="badge text-center p-3 text-white bg-[#47B5FF] border-[#47B5FF] ">{data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div><h2 className="text-[#47B5FF]">อากาศดีมาก</h2><div className=" text-xs text-center">อากาศดีมากแบบนี้ น่าจะออกไปเดินเล่น
                      นอกบ้านนะคะ</div></>
                  ) : data?.environmentInformation.aqi.AQI.Level === 2 ? (
                    <><div className="badge text-center p-3 text-white bg-[#81CD47] border-[#81CD47]">{data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div><h2 className='text-[#81CD47]'>อากาศดี</h2><div className="text-xs text-center">อากาศดี แจ่มใส สามารถทำกิจกรรมได้ค่ะ</div></>
                  ) : data?.environmentInformation.aqi.AQI.Level === 3 ? (
                    <><div className="badge text-center p-3 text-white bg-[#EAD600] border-[#EAD600]">{data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div><h2 className='text-[#EAD600]'>อากาศปานกลาง</h2><div className="text-xs text-center">อากาศยังปกติ สามารถทำกิจกรรมได้ค่ะ</div></>
                  ) : data?.environmentInformation.aqi.AQI.Level === 4 ? (
                    <><div className="badge text-center p-3 text-white bg-[#FE841F] border-[#FE841F]">{data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div><h2 className='text-[#FE841F]'>อากาศเริ่มมีผลกระทบ</h2><div className="text-xs text-center">ควรงดกิจกรรมกลางแจ้ง และสวมหน้ากากป้องกัน</div></>
                  ) : (
                    <><div className="badge text-center p-3 text-white bg-[#E34545] border-[#E34545]">{data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div><h2 className='text-[#E34545]'>อากาศมีผลกระทบ</h2><div className="text-xs text-center">หลีกเลี่ยงการทำกิจกรรมภายนอก และควรสวมใส่หน้ากาก N95</div></>
                  )
                )
              }
            </div>

            <div className="flex justify-center  mt-2 m">

              {
                data?.environmentInformation.aqi.AQI.Level === 1 ? (
                  <div className="card w-24  bg-[#47B5FF] text-white shadow-xl">

                  </div>

                ) : data?.environmentInformation.aqi.AQI.Level === 2 ? (
                  <div className="card w-24  bg-[#81CD47] text-white shadow-xl">
                    {data?.environmentInformation.aqi.AQI.aqi}{' '}AQI
                  </div>
                ) : data?.environmentInformation.aqi.AQI.Level === 3 ? (
                  <div className="card w-24  bg-[#EAD600] text-white shadow-xl">
                    {data?.environmentInformation.aqi.AQI.aqi}{' '}AQI
                  </div>
                ) : data?.environmentInformation.aqi.AQI.Level === 4 ? (
                  <div className="card w-24  bg-[#FE841F] text-white shadow-xl">
                    {data?.environmentInformation.aqi.AQI.aqi}{' '}AQI
                  </div>
                ) : (
                  <div className="card w-24  bg-[#E34545] text-white shadow-xl">
                    {data?.environmentInformation.aqi.AQI.aqi}{' '}AQI
                  </div>
                )
              }
            </div>





          </div>

          {
            data?.name === "มหาวิทยาลัยราชภัฏกำแพงเพชร" ?
              (
                <div className="flex-1">
                  <div className="text-left ml-10 mt-1">
                    <h2 className="xl:text-2xl text-sm  text-black">{data?.name}</h2>
                    <h3 className="uppercase text-[14px] font-semibold text-[#888888]">
                      {data?.addressSubDistrict} {data?.addressDistrict},{" "}
                      {data?.addressProvince}
                    </h3>
                    <h3 className="text-[#000000] text-[14px] mb-2">
                      {data?.environmentInformation.datetime}
                    </h3>
                  </div>

                  {/* <div className="justify-start grid grid-cols-5 gap-4"> */}
                  {/* <div className="card   bg-[#FFFFFF80] shadow-xl">
<div className="mt-2 w-auto ml-4">
<h2 className='text-left font-bold text-sm'>PM 2.5</h2>
<p className="text-base">{data?.environmentInformation.PM25}{' '}µg/m³</p>
<div className="card-actions justify-end">
</div>
</div>
</div> */}

                  {/* <div className="card  bg-[#FFFFFF80] shadow-xl">
<div className="mt-2 w-auto ml-4">
<h2 className='text-left font-bold text-sm'>PM 10</h2>
<p className="text-base">{data?.environmentInformation.PM10}{' '}µg/m³</p>
<div className="card-actions justify-end">
</div>
</div>
</div> */}

                  {/* <div className="card  bg-[#FFFFFF80] shadow-xl">
<div className="mt-2 w-auto ml-4">
<h2 className='text-left font-bold text-sm'>อุณหภูมิ</h2>
<p className="text-base">{data?.environmentInformation.temp}{' '}°C</p>
<div className="card-actions justify-end">
</div>
</div>
</div> */}

                  {/* <div className="card  bg-[#FFFFFF80] shadow-xl">
<div className="mt-2 w-auto ml-4">
<h2 className='text-left font-bold text-sm'>ความชื้น</h2>
<p className="text-base">{data?.environmentInformation.hum}{' '}%</p>
<div className="card-actions justify-end">
</div>
</div>
</div> */}

                  {/* <div className="card  bg-[#FFFFFF80] shadow-xl">
              <div className="mt-2 w-auto ml-4">
                <h2 className='text-left font-bold text-sm'>คาร์บอนมอนนอกไซด์</h2>
                <p className="text-base">{data?.environmentInformation.CO}{' '}ppm</p>
                <div className="card-actions justify-end">
                </div>
              </div>
            </div> */}

                  {/* <div className="card  bg-[#FFFFFF80] shadow-xl">
                <div className="mt-2 w-auto ml-4">
                  <h2 className='text-left font-bold text-sm'>ทิศทางลม</h2>
                  <p className="text-base">{data?.environmentInformation.windDr}{' '}degree</p>
                  <div className="card-actions justify-end">
                  </div>
                </div>
              </div> */}

                  {/* <div className="card  bg-[#FFFFFF80] shadow-xl">
                <div className="mt-2 w-auto ml-4">
                  <h2 className='text-left font-bold text-sm'>ความเร็วลม</h2>
                  <p className="text-base">{data?.environmentInformation.windSp}{' '}km/h</p>
                  <div className="card-actions justify-end">
                  </div>
                </div>
              </div> */}

                  {/* <div className="card  bg-[#FFFFFF80] shadow-xl">
                <div className="mt-2 w-auto ml-4">
                  <h2 className='text-left font-bold text-sm'>แสง</h2>
                  <p className="text-base">{data?.environmentInformation.light}{' '}lux</p>
                  <div className="card-actions justify-end">
                  </div>
                </div>
              </div> */}

                  {/* <div className="card  bg-[#FFFFFF80] shadow-xl">
                <div className="mt-2 w-auto ml-4">
                  <h2 className='text-left font-bold text-sm'>UV</h2>
                  <p className="text-base">{data?.environmentInformation.UV}{' '}W/m²</p>
                  <div className="card-actions justify-end">
                  </div>
                </div>
              </div> */}




                  {/* </div> */}

                  <div className="grid grid-cols-3 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {
                      data?.environmentInformation.PM25 != null ?
                        (
                          <div className="card  bg-[#FFFFFF80] shadow-xl">
                            <div className=" w-auto m-1 ">
                              <h2 className='text-left font-bold text-sm'>PM 2.5</h2>
                              <p className="text-base">{data?.environmentInformation.PM25}{' '}µg/m³</p>
                              <div className="card-actions justify-end">
                              </div>
                            </div>
                          </div>
                        ) : null
                    }
                    {
                      data?.environmentInformation.PM10 != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className=" w-auto m-1 ">
                            <h2 className='text-left font-bold text-sm'>PM 10</h2>
                            <p className="text-base">{data?.environmentInformation.PM10}{' '}µg/m³</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.temp != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className=" w-auto m-1 ">
                            <h2 className='text-left font-bold text-sm'>อุณหภูมิ</h2>
                            <p className="text-base">{data?.environmentInformation.temp}{' '}°C</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.hum != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className=" w-auto m-1 ">
                            <h2 className='text-left font-bold text-sm'>ความชื้น</h2>
                            <p className="text-base">{data?.environmentInformation.hum}{' '}%</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.CO2 != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className=" w-auto m-1 ">
                            <h2 className='text-left font-bold text-sm'>คาร์บอนมอนนอกไซด์</h2>
                            <p className="text-base">{data?.environmentInformation.CO2}{' '}ppm</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.CO != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className=" w-auto m-1 ">
                            <h2 className='text-left font-bold text-sm'>คาร์บอนมอนนอกไซด์</h2>
                            <p className="text-base">{data?.environmentInformation.CO}{' '}ppm</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }

                    {
                      data?.environmentInformation.windDr != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className=" w-auto m-1 ">
                            <h2 className='text-left font-bold text-sm'>ทิศทางลม</h2>
                            <p className="text-base">{data?.environmentInformation.windDr}{' '}degree</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }

                    {
                      data?.environmentInformation.windSp != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className=" w-auto m-1 ">
                            <h2 className='text-left font-bold text-sm'>ความเร็วลม</h2>
                            <p className="text-base">{data?.environmentInformation.windSp}{' '}km/h</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }

                    {
                      data?.environmentInformation.light != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className=" w-auto m-1 ">
                            <h2 className='text-left font-bold text-sm'>แสง</h2>
                            <p className="text-base">{data?.environmentInformation.light}{' '}lux</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }

                    {
                      data?.environmentInformation.UV != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className=" w-auto m-1 ">
                            <h2 className='text-left font-bold text-sm'>รังสียูวี</h2>
                            <p className="text-base">{data?.environmentInformation.UV}{' '}W/m²</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                  </div>






                </div>
              ) : page == 'map-psl' ? (
                <div className="flex-1">
                  <div className="text-left ml-1 mt-1">
                    <h2 className=" text-xs text-black font-bold">{data?.name}</h2>
                    <h3 className="uppercase text-xs font-semibold text-[#888888]">
                      {data?.addressSubDistrict} {data?.addressDistrict},{" "}
                      {data?.addressProvince}
                    </h3>
                    <h3 className="text-[#000000] text-xs mb-2">
                      {data?.environmentInformation.datetime}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1">
                    {
                      data?.environmentInformation.PM25 != null ? (
                        <div className="card w-36   bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2  ml-4 m-2">
                            <h2 className='text-left font-bold text-xs'>PM 2.5</h2>
                            <p className="text-xs text-right">{data?.environmentInformation.PM25}{' '}µg/m³</p>
                           
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.PM10 != null ? (
                        <div className="card w-36 bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2  ml-4 m-2">
                            <h2 className='text-left font-bold text-xs'>PM 10</h2>
                            <p className="text-xs text-right">{data?.environmentInformation.PM10}{' '}µg/m³</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.temp != null ? (
                        <div className="card w-36  bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2  ml-4 m-2">
                            <h2 className='text-left font-bold text-xs'>อุณหภูมิ</h2>
                            <p className="text-xs text-right">{data?.environmentInformation.temp}{' '}°C</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.hum != null ? (
                        <div className="card w-36  bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2  ml-4 m-2">
                            <h2 className='text-left font-bold text-xs'>ความชื้น</h2>
                            <p className="text-xs text-right">{data?.environmentInformation.hum}{' '}%</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }

                    {
                      data?.environmentInformation.CO2 != null  ? (
                        <div className="card w-36  bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2  ml-4 m-2">
                            <h2 className='text-left font-bold text-xs'>คาร์บอนไดออกไซด์</h2>
                            <p className="text-xs text-right">{data?.environmentInformation.CO2}{' '}ppm</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) :   null
                    }

{
                      data?.environmentInformation.CO != null  ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2 w-auto ml-4 m-2">
                            <h2 className='text-left font-bold text-xs'>คาร์บอนมอนนอกไซด์</h2>
                            <p className="text-xs text-right">{data?.environmentInformation.CO}{' '}ppm</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) :   null
                    }



                  </div>




                </div>
              ) : (
                <div className="flex-1">
                  <div className="text-left ml-10 mt-1">
                    <h2 className="text-sm text-black">{data?.name}</h2>
                    <h3 className="uppercase text-[14px] font-semibold text-[#888888]">
                      {data?.addressSubDistrict} {data?.addressDistrict},{" "}
                      {data?.addressProvince}
                    </h3>
                    <h3 className="text-[#000000] text-[14px] mb-2">
                      {data?.environmentInformation.datetime}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {
                      data?.environmentInformation.PM25 != null ? (
                        <div className="card   bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2 w-auto ml-4 m-4">
                            <h2 className='text-left font-bold text-sm'>PM 2.5</h2>
                            <p className="text-base">{data?.environmentInformation.PM25}{' '}µg/m³</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.PM10 != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2 w-auto ml-4 m-4">
                            <h2 className='text-left font-bold text-sm'>PM 10</h2>
                            <p className="text-base">{data?.environmentInformation.PM10}{' '}µg/m³</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.temp != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2 w-auto ml-4 m-4">
                            <h2 className='text-left font-bold text-sm'>อุณหภูมิ</h2>
                            <p className="text-base">{data?.environmentInformation.temp}{' '}°C</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      data?.environmentInformation.hum != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2 w-auto ml-4 m-4">
                            <h2 className='text-left font-bold text-sm'>ความชื้น</h2>
                            <p className="text-base">{data?.environmentInformation.hum}{' '}%</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }

                    {
                      data?.environmentInformation.CO2 != null ? (
                        <div className="card  bg-[#FFFFFF80] shadow-xl">
                          <div className="card mt-2 w-auto ml-4 m-4">
                            <h2 className='text-left font-bold text-sm'>คาร์บอนไดออกไซด์</h2>
                            <p className="text-base">{data?.environmentInformation.CO2}{' '}ppm</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }



                  </div>




                </div>
              )
          }

        </div>

      ) : (
        <><div className="text-left ml-10 mt-1">
          <h2 className="text-2xl text-black">{data?.name}</h2>
          <h3 className="uppercase text-[14px] font-semibold text-[#888888]">
            {data?.addressSubDistrict} {data?.addressDistrict},{" "}
            {data?.addressProvince}
          </h3>
          <h3 className="text-[#000000] text-[14px] mb-2">
            {data?.environmentInformation.datetime}
          </h3>
        </div><p className="text-[#888888] text-4xl mt-4">ไม่สามารถแสดงข้อมูลได้</p></>
      )}


      <div className="grid grid-cols-2 gap-4">
        <div className=""></div>
        {
          data?.name === "มหาวิทยาลัยราชภัฏกำแพงเพชร" ? (
            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/device/${data?.stationid}`)}
                className="bg-[#7C0DEB] mt-3 mb-2  mr-2 ml- py-1 px-4   text-xl rounded-md shadow-lg text-white hover:bg-[#7C0DEB1A]"
              >
                รายละเอียด
              </button>
            </div>
          ) : data?.status === 'offline' ? (
            <div className="flex justify-end ">
              <button
                onClick={() => navigate(`/device/${data?.stationid}`)}
                className="bg-[#7C0DEB]  mr-2  py-1 px-4   text-xl rounded-md shadow-lg text-white hover:bg-[#7C0DEB1A]"
              >
                รายละเอียด
              </button>
            </div>
          )
            : page == 'map-psl' ? (
              <div className="flex justify-end ">
                {/* <button
                  onClick={() => navigate(`/device/${data?.stationid}`)}
                  className="bg-[#00CC99] btn btn-sm mr-1  mt-2  py-1 px-4  text-xs rounded-md shadow-lg text-white hover:bg-[#7C0DEB1A]"
                >
                  รายละเอียด
                </button> */}
              </div>
            )
            :
            (
              <div className="flex justify-end ">
              <button
                onClick={() => navigate(`/device/${data?.stationid}`)}
                className="bg-[#7C0DEB]  mr-2 mb-2   py-1 px-4   text-xl rounded-md shadow-lg text-white hover:bg-[#7C0DEB1A]"
              >
                รายละเอียด
              </button>
            </div>
            )
        }


      </div>

    </div>
  );
};

export default NewCardDeviceDetails;
