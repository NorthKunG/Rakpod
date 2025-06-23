import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import linelogo from '../linelogo.svg'
import booklogo from '../booklogo.svg'
import bell from '../bell.svg'
import API from "./api";
import RakpodLogo from "../rakpod.svg"


// import { NewGetDataFromAPI } from "../models/new_devices.model";

const API_LINE = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=9aFOPLn2Zktf3pwW14H69Q&redirect_uri=https://api-envy.adcm.co.th/api/notify&scope=notify&state=`;

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [focusSearch, setFocusSearch] = useState(false);
  const [searchValue, setSearchValue] = useState<any[]>([]);
  const [checkValue, setCheckValue] = useState(true);

  const [mobileSearch, setMobileSearch] = useState(false);

  const getDataFromNewAPI = async () => {
    const Url = "weather-station";
    await API.get(Url).then((response: AxiosResponse<any>) => {
      console.log(response.data);
      setSearchValue(response.data.data);
    });
  };
  useEffect(() => {
    getDataFromNewAPI();
  }, []);

  const filterData = (value: string) => {
    const lowerCasedValue = value;
    const checkFilter = searchValue.some((d) => {
      return d.name.toLowerCase().includes(lowerCasedValue.toLowerCase());
    });
    //console.log(checkFilter)
    setCheckValue(checkFilter);
  };
  const handleChange = (value: string) => {
    setSearchText(value);
    filterData(value);
  };

  const navigate = useNavigate();
  return (
    <nav className="h-[75px]  flex items-center justify-between px-4 bg-white shadow-md ">
      <h1
        onClick={() => window.location.replace("/")}
        className=" font-bold text-2xl  iphoneSE:text-sm  ipad:text-2xl cursor-pointer  "
      >
       <div
       className="flex items-center gap-2"
       >
       <img src={RakpodLogo} alt="RAKPODLOGO" width={80} />
        <div className="36px">RAKPOD</div>
       </div>

      </h1>
      <div className="flex items-center  ipad:text-[12px]  desktop:text-lg  ipad:gap-4 iphoneSE:gap-1 justify-between iphoneSE:text-xs ">
        <NavLink
          to={"/full-map"}
          className={({ isActive }) =>
            ` ${isActive
              ? "bg-[#7C0DEB26]  text-[#7C0DEB]"
              : "text-black border-white hover:text-[#7C0DEB] hover:bg-[#7C0DEB26] "
            }    px-3 py-1 rounded-full text-center flex items-center `
          }
        >
          <i className="text-[20px] ipad:text-lg   ipad:mr-1  bx bx-map-alt"></i>
          <span className="hidden ipad:block">แผนที่</span>
        </NavLink>
        <NavLink
          to={"/place"}
          className={({ isActive }) =>
            `   ${isActive
              ? "bg-[#7C0DEB26]  text-[#7C0DEB]"
              : "text-black border-white hover:text-[#7C0DEB] hover:bg-[#7C0DEB26] "
            }    px-3 py-1 rounded-full text-center flex items-center    `
          }
        >
          <i className="text-[20px] ipad:text-lg   ipad:mr-1  bx bx-map "></i>

          <span className="hidden ipad:block">ข้อมูลจุดตรวจวัดคุณภาพอากาศ</span>
        </NavLink>
        <NavLink
          to={"/export"}
          className={({ isActive }) =>
            `${isActive
              ? "bg-[#7C0DEB26]  text-[#7C0DEB]"
              : "text-black border-white hover:text-[#7C0DEB] hover:bg-[#7C0DEB26] "
            }    px-3 py-1 rounded-full text-center flex items-center   `
          }
        >
          <i className="text-[20px] ipad:text-lg   ipad:mr-1 bx bx-data  "></i>
          <span className="hidden ipad:block">บริการข้อมูล</span>
        </NavLink>
        <div className="group inline-block relative z-[99999]">
          {/* <button className="bg-[#00CC99] rounded-xl  px-3 py-1 text-white shadow-md inline-flex items-center">
            <i className="text-[20px] ipad:text-lg   ipad:mr-1 bx bx-bell"></i>
            <span className="hidden ipad:block  mr-0 ipad:mr-1">
              บริการการแจ้งเตือน
            </span>
          </button>
          <ul className="bg-white absolute hidden text-gray-700 pt-1 group-hover:block  right-0 w-[180px] ipad:text-[14px]   ipad:w-[200px] transition duration-200 delay-100">
            <li >
              <a
                className="rounded-t bg-gray-100 hover:bg-[#00CC991A] py-2 px-4 block whitespace-no-wrap "
                href={API_LINE + "warning"}
              >
                <span>แจ้งเตือนมลพิษ</span>
              </a>
            </li>
            <li >
              <a
                className="rounded-t bg-gray-100 hover:bg-[#00CC991A] py-2 px-4 block whitespace-no-wrap "
                href={API_LINE + "warning"}
              >
                <span>คู่มือรับการแจ้งเตือน</span>

              </a>
            </li>
           
          </ul> */}

      {/* <details className="dropdown ">
  <summary className="text-[16px] font-semibold m-1 btn btn-sm bg-[#00CC99] rounded-full  border-[#00CC99] px-3 py-1 text-white shadow-md inline-flex items-center  font hover:bg-[#00CC991A] hover:text-[#00CC99] hover:border-[#00CC991A]"

  ><div className="bx bx-bell "> </div><div
  className="iphoneSE:overflow-auto ipad:overflow-auto hidden ipad:block"
  >บริการการแจ้งเตือน</div></summary>
  <ul className="p-2 shadow menu dropdown-content z-[1] bg-white rounded-box w-52 md:w-32 lg:w-48
  ">
  <li >
              <a
                className="rounded-t bg-white hover:bg-[#00CC991A] py-2 px-4 block whitespace-no-wrap "
                href={API_LINE + "warning"}
              >
              
                
                <span className="flex"><img src={linelogo} className="pr-2" />แจ้งเตือนมลพิษ</span>
              </a>
            </li>
            <li >
              <a
                className="rounded-t bg-white hover:bg-[#00CC991A] py-2 px-4 block whitespace-no-wrap "
                href="Notification_service.pdf"
              >
                 
                <span className="flex"><img src={booklogo} className="pr-2" />คู่มือรับการแจ้งเตือน</span>

              </a>
            </li>
  </ul>
</details> */}

<div className="navbar bg-white rounded-box">
  {/* <div className="flex-1 px-2 lg:flex-none">
    <a className="text-lg font-bold">daisyUI</a>
  </div>  */}
  <div className="flex justify-end flex-1 px-2">
    <div className="flex items-stretch">
      {/* <a className="btn btn-ghost rounded-btn">Button</a> */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="text-[16px] font-semibold m-1 btn btn-sm bg-[#7C0DEB] rounded-full  border-[#7C0DEB] px-3 py-1 text-white shadow-md inline-flex items-center  font hover:bg-[#7C0DEB1A] hover:text-[#7C0DEB] hover:border-[#7C0DEB]">
        <div className="bx bx-bell "> </div>
        <div
  className=" hidden ipad:block"
  >บริการการแจ้งเตือน</div>
        </div>
        <ul tabIndex={0} className="p-2 shadow menu dropdown-content z-[1] bg-white rounded-box w-52">
        <li >
              <a
                className="rounded-t bg-white hover:bg-[#7C0DEB26] py-2 px-4 block whitespace-no-wrap "
                href={API_LINE + "warning"}
              >
              
                
                <span className="flex"><img src={linelogo} className="pr-2" />แจ้งเตือนมลพิษ</span>
              </a>
            </li>
            <li >
              <a
                className="rounded-t bg-white hover:bg-[#7C0DEB26] py-2 px-4 block whitespace-no-wrap "
                href="Notification_service.pdf"
              >
                 
                <span className="flex"><img src={booklogo} className="pr-2" />คู่มือรับการแจ้งเตือน</span>

              </a>
            </li>
        </ul>
      </div>
    </div>
  </div>
</div>

        </div>

        <div className="ml-2 ipad:m-0  relative">
          <div className="  group  flex items-center  iphoneSE:px-2  ipad:px-4 py-2  iphoneSE:rounded-full  ipad:rounded-3xl bg-white  border-2 border-[#7C0DEB]   text-sm    ">
            <input
              onFocus={() => setFocusSearch(true)}
              onBlur={() => setTimeout(() => setFocusSearch(false), 1000)}
              value={searchText}
              onChange={(e) => handleChange(e.target.value)}
              type="text"
              name="name"
              placeholder="ค้นหาสถานที่ของคุณ ..."
              className=" ipad:block ipad:rounded-none iphoneSE:hidden iphoneSE:rounded-full    outline-none bg-white   "
            />

            <svg
              onClick={() => setMobileSearch(!mobileSearch)}


              xmlns="http://www.w3.org/2000/svg"
              className=" iphoneSE:w-4 iphoneSE:h-4  ipad:w-6 ipad:h-6   "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className={`absolute z-[1001]  top-14 bg-white p-2 rounded-sm shadow-md w-[200px] right-0 text-[14px] ${mobileSearch ? "block" : "hidden"} ipad:hidden `}>
            <div className="mb-1">
              <input
                value={searchText}

                onChange={(e) => handleChange(e.target.value)}
                type="text"
                name="name"
                placeholder="ค้นหาสถานที่ของคุณ ..."
                className="  w-full bg-gray-100 text-center outline-none  p-1  "
              />
            </div>

            {searchText.length === 0 ? (
              <p className=" text-center">กรุณาระบุการค้นหาสถานที่</p>
            ) : !checkValue ? (
              <p className=" text-center">ไม่พบข้อมูลสถานที่</p>
            ) : (
              searchValue
                .filter((d: any) => {
                  return searchText.toLowerCase() === ""
                    ? d
                    : d.name.toLowerCase().includes(searchText);
                })
                .map((d: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/device/${d.stationid}`)}
                    className="cursor-pointer hover:bg-slate-200 py-1 "
                  >
                    {d.name}
                  </div>
                ))
            )}
          </div>
          {focusSearch && (
            <div className="absolute z-[1001] top-14 bg-white p-2 rounded-sm shadow-md w-full text-[14px] ">
              {searchText.length === 0 ? (
                <p className=" text-center">กรุณาระบุการค้นหาสถานที่</p>
              ) : !checkValue ? (
                <p className=" text-center">ไม่พบข้อมูลสถานที่</p>
              ) : (
                searchValue
                  .filter((d: any) => {
                    return searchText.toLowerCase() === ""
                      ? d
                      : d.name.toLowerCase().includes(searchText);
                  })
                  .map((d: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/device/${d.stationid}`)}
                      className="cursor-pointer hover:bg-slate-200 py-1 "
                    >
                      {d.name}
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
