import axios, { AxiosRequestConfig } from "axios";
import querystring from "querystring";

export async function postLineNotify(listToken: any[], message: string) {
  let respond: any = {
    success: 0,
    failed: 0
  }
  console.log(message)
  if (listToken.length) {
    for (let i in listToken) {
      const req: AxiosRequestConfig = {
        method: 'POST',
        timeout: 1000,
        url: "https://notify-api.line.me/api/notify",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${listToken[i].acc_token}`
        },
        data: querystring.stringify({
          message: message,
        })
      };
      await axios(req).then(function (res) {
        respond.success += 1;
      })
        .catch(function (err) {
          // console.error(err);
          respond.failed += 1;
        });
    }
  }
  console.log(`Notify SENT : ${respond.success} , FAILED : ${respond.failed}`)


}

