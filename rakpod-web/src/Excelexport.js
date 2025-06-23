import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

const Excelexport = ({excelData, fileName}) => {

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.csv';

const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);

};

return (
    <button className=" btn btn-sm bg-[#7C0DEB] text-white font-bold border-white" onClick={exportToExcel}>ส่งออกข้อมูลตาราง</button>
);

}

export default Excelexport;