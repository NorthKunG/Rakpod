export const card = (
    img: string,
    aqi: string,
    color: string,
    status: string,
    suggest: string,
    name: string
  ) => ({
    type: "flex",
    altText: "ข้อมูลสภาพอากาศ",
    contents: {
      "type": "bubble",
      "hero": {
        "type": "image",
        "url": img
        ,
        "size": "full",
        "aspectRatio": "20:13",
        "aspectMode": "cover"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "action": {
          "type": "uri",
          "uri": "https://linecorp.com"
        },
        "contents": [
          {
            "type": "text",
            "text": name,
            "size": "xxl",
            "weight": "bold",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "ดัชนีคุณภาพอากาศ (AQI)",
                    "weight": "bold",
                    "margin": "sm",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": aqi,
                    "size": "xl",
                    "align": "end",
                    "color": color,
                    "weight": "bold"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "สถานะ",
                    "weight": "bold",
                    "margin": "sm",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": status,
                    "size": "sm",
                    "align": "end",
                    "color": "#aaaaaa"
                  }
                ]
              }
            ]
          },
          {
            "type": "text",
            "text": suggest,
            "wrap": true,
            "color": "#aaaaaa",
            "size": "xxs"
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "style": "primary",
            "color": "#2e3192",
            "margin": "none",
            "action": {
              "type": "uri",
              "label": "ดูข้อมูลเพิ่มเติม",
              "uri": "https://0c6e77ae.smart-environment-react.pages.dev/full-map/psl"
            }
          }
        ],
        "spacing": "none",
        "margin": "none"
      }
    }
  });
  
  export const template = (array: any) => ({
    type: "template",
    altText: "this is a carousel template",
    template: {
      type: "carousel",
      imageSize: "contain",
      columns: array,
    },
  });
  