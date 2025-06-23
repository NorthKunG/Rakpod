import React, { useState } from 'react';

interface Device {
  stationid: string;
  name: string;
}

interface DeviceSelectorProps {
  devicesData: Device[];
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ devicesData }) => {
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedDeviceIds(selectedOptions);
  };

  console.log(selectedDeviceIds);

  return (
    <select
      multiple
      value={selectedDeviceIds}
      onChange={handleSelectChange}
      className="bg-white outline-none w-full block py-1 px-2 rounded-md text-lg text-[12px] ipad:text-[16px]"
    >
      <option value="" disabled>กรุณาเลือกสถานที่</option>
      {devicesData.map((d, i) => (
        <option key={i} value={d.stationid}>
          {d.name}
        </option>
      ))}
    </select>
  );
};

export default DeviceSelector;
