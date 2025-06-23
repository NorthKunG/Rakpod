
import xlsx from "xlsx";
import path from "path";

const map_name:any = {
    "PM1" : "ค่าฝุ่นละออง PM 1 (µg./m3)",
    "PM10" : "ค่าฝุ่นละออง PM 10 (µg./m3)",
    "PM25": "ค่าฝุ่นละออง PM 2.5 (µg./m3)",
    "CO": "ก๊าซคาร์บอนมอนอกไซด์ CO (ppm)",
    "CO2": "ก๊าซคาร์บอนไดออกไซด์ CO2 (ppm)",
    "O3": "ก๊าซโอโซน O3 (ppb)",
    "NO2": "ก๊าซไนโตรเจนไดออกไซด์ NO2 (ppb)",
    "SO2": "ก๊าซซัลเฟอร์ไดออกไซด์ SO2 (ppb)",
    "UV": "ความเข้มของแสง UV (W/m2)",
    "hum": "ความชื้นในอากาศ (%)",
    "light": "ความเข้มแสง (lux)",
    "rain": "ปริมาณน้ำฝน (mm)",
    "temp": "อุณหภูมิ (°C)",
    "windDr": "ทิศทางลม (degree)",
    "windSp": "ความเร็วลม (km/h)",
    "datetime": "วันที่ และเวลา",
    "aqi_level": "ระดับดัชนีคุณภาพอากาศ AQI",
    "aqi_value": "ค่าดัชนีคุณภาพอากาศ AQI"
}
export const ExportData = async (data: any, export_detail:any ,sensor: string[], filename:string, wsName: string, _filePath: string) => {
    try {
        const filePath: string = !_filePath || _filePath == "" ? `./export_files/${filename}.xlsx` : `${_filePath}/${filename}.xlsx`;
        let key: string[] = Object.keys(data[0]);
        const mapData: any = data.map((item: any) => {
            const lst: any = [];
            for (const i in key) {
                // ! get aqi from data object
                if (key[i] == "aqi" && export_detail.isaqi) {
                    if (item[`${key[i]}`]["AQI"]["Level"] != null) { lst.push(item[`${key[i]}`]["AQI"]["Level"]); } else { lst.push("-") }
                    if (item[`${key[i]}`]["AQI"]["aqi"] != null) { lst.push(item[`${key[i]}`]["AQI"]["aqi"]); } else { lst.push("-") }
                } else {
                    if (sensor.find(element => element == key[i] || key[i] == "datetime")) {
                        if (item[`${key[i]}`] != null) { lst.push(item[`${key[i]}`]); } else { lst.push("-") }
                    }
                }
            }
            return lst;
        });

        // ! adding aqi level and aqi value instead of aqi object
        const _col_header: string[] = key.filter((item: string) => item != "aqi" && sensor.find(element => element == item || item == "datetime"))
        let col_header:string[] = []
        if(export_detail.isaqi){
            _col_header.push("aqi_level", "aqi_value")
        }

        // ! map col name
        for(const j in _col_header){
            
            col_header.push(map_name[`${_col_header[j]}`])
        }
        console.log(_col_header,col_header)

        // ! set header detail
        const header_detail = export_detail
        let detail = ["",`สถานีตรวจวัด : ${export_detail.wstation_id} - ${export_detail.wstation_name}`]
        let export_date = ["",`วันเวลาที่ทำการเรียกข้อมูล : ${export_detail.req_date}`]
        let export_type = ["",`ประเภทข้อมูลส่งออก : ${export_detail.datatype != 'hourly'? (export_detail.datatype == 'daily'? "รายวัน" : "ช่วง 10 นาที") : "รายชั่วโมง"}  ${export_detail.isaqi ? "(ข้อมูลเฉลี่ยย้อนหลังตามการคำนวณดัชนีคุณภาพอากาศ)" : "(ข้อมูลเฉลี่ย ในแต่ละช่วงเวลา)"}`]
        const merge = [
            { s: { r: 0, c: 1 }, e: { r: 0, c: col_header.length -2 } },
            { s: { r: 1, c: 1 }, e: { r: 1, c: col_header.length -2 } },
            { s: { r: 2, c: 1 }, e: { r: 2, c: col_header.length -2} },
        ];
          

        const wb = xlsx.utils.book_new();
        const wsData = [col_header, ...mapData];
        const ws = xlsx.utils.aoa_to_sheet([detail,export_date,export_type,[],...wsData]);

        // * custom style in xlsx
        ws["!merges"] = merge;
        ws["!cols"] = col_header.map((a, i) => ({ wch: Math.max(...wsData.map(a2 => a2[i] ? a2[i].toString().length : 0))}));
        console.log(col_header.map((a, i) => ({ wch: Math.max(...wsData.map(a2 => a2[i] ? a2[i].toString().length : 0)) })))
        xlsx.utils.book_append_sheet(wb, ws, wsName);
        xlsx.writeFile(wb, path.resolve(filePath));
        return true;
    } catch (error) {
        console.log(`exprot error : ${error}`)
        return false
    }

}
