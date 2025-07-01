import blue from '../blue.svg'
import green from '../green.svg'
import orange from '../orange.svg'
import red from '../red.svg'
import yellow from '../yellow.svg'

const CardInfo: React.FC = () => {
  const Label = [
    {
      color: "#47B5FF",
      text: "ดีมาก",
    },
    {
      color: "#82CD47",
      text: "ดี",
    },
    {
      color: "#FFEA11",
      text: "ปานกลาง",
    },
    {
      color: "#FD841F",
      text: "เริ่มมีผลกระทบต่อสุขภาพ",
    },
    {
      color: "#E64848",
      text: "มีผลกระทบต่อสุขภาพ",
    },
  ];

  return (
    <div className="rounded-lg shadow-sm bg-[#FFFFFF90] bg-opacity-50 backdrop-filter backdrop-blur   px-6 py-2 space-y-6  ">
      <div className=" font-bold text-2xl ">คุณภาพอากาศ</div>
      {/* {Label.map((l, i) => {
        return (
          <div
            key={i}
            className="flex items-center gap-4  text-base  ipad:text-xl  font-light "
          >
            <div className={`bg-${[l.color]} w-14 h-5 rounded-lg`} />
            <p>{l.text}</p>
            <p>{`bg-[${l.color}]`}</p>
          </div>
        );
      })} */}

      <div className="flex items-center gap-4  text-base  ipad:text-xl  font-light ">
        {/* <div className={`bg-[#47B5FF] w-14 h-5 rounded-lg`} /> */}
        <img src={blue} />
        <p>ดีมากกกกกกกกกก</p>
      </div>
      <div className="flex items-center gap-4  text-base  ipad:text-xl  font-light ">
        {/* <div className={`bg-[#82CD47] w-14 h-5 rounded-lg`} /> */}
        <img src={green} />
        <p>ดี</p>
      </div>
      <div className="flex items-center gap-4  text-base  ipad:text-xl  font-light ">
        {/* <div className={`bg-[#FFEA11] w-14 h-5 rounded-lg`} /> */}
        <img src={yellow} />
        <p>ปานกลาง</p>
      </div>
      <div className="flex items-center gap-4  text-base  ipad:text-xl  font-light ">
        {/* <div className={`bg-[#FD841F] w-14 h-5 rounded-lg`} /> */}
        <img src={orange} />
        <p>เริ่มมีผลกระทบต่อสุขภาพ</p>
      </div>
      <div className="flex items-center gap-4  text-base  ipad:text-xl  font-light ">
        {/* <div className={`bg-[#E64848] w-14 h-5 rounded-lg`} /> */}
        <img src={red} />
        <p>มีผลกระทบต่อสุขภาพ</p>
      </div>
    </div>
  );
};

export default CardInfo;
