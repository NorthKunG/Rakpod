import moment from 'moment';
var days = 7;
let dateArr: Array<any> = [];
var date = new Date();
// console.log(date.getDate() - 23)
// console.log(moment(date.setDate(date.getDate() - 23)).format('YYYY-MM-DD'))
// console.log(date.setDate(date.getDate() - 7))
// for (let i = days; i >= 1; i--) {
//     // console.log(i)
//     var date = new Date();
//     let dateBefore = moment(date.setDate(date.getDate() - i)).format('YYYY-MM-DD');
//     dateArr.push(dateBefore);
// }

// console.log(dateArr)


function daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
}

// July
console.log(daysInMonth(7, 2009)); // 31
// February
console.log(daysInMonth(2, 2009)); // 28
console.log(daysInMonth(2, 2008)); // 29

