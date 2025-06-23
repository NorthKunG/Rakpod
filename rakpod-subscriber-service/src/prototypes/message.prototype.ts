class MessagePrototype {
  id: number;
  uuid: string;
  title: string;
  message: any;
  start_date: Date | null;
  end_date: Date | null;
  wstation: number | null;
  station: any | null;

  constructor(data: any) {
    this.id = data["id"];
    this.uuid = data["uuid"];
    this.title = data["title"];
    this.message = JSON.parse(data["message"])["text"];
    this.start_date = data["start_date"] ? new Date(data["start_date"]) : null;
    this.end_date = data["end_date"] ? new Date(data["end_date"]) : null;
    this.wstation = data["wstation"] || null;
  }

  toString(): string {
    return `{
        "id": ${this.id},
        "uuid": "${this.uuid}",
        "title": "${this.title}",
        "message": ${JSON.stringify(this.message)},
        "start_date": ${
          this.start_date ? `"${this.start_date.toISOString()}"` : null
        },
        "end_date": ${
          this.end_date ? `"${this.end_date.toISOString()}"` : null
        },
        "wstation": ${this.wstation}
      }`;
  }
}

interface MessageContent {
  text: string;
  [key: string]: any; // Additional properties if needed
}

class MessagePrototypeDB {
  title: string;
  message: MessageContent;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  wstation: number | null;

  constructor(data: any) {
    this.title = data["title"];
    this.message = {
      text: data["message"],
    };
    this.start_date = data["start_date"]
      ? new Date(data["start_date"]).toISOString().split("T")[0]
      : null;
    this.end_date = data["end_date"]
      ? new Date(data["end_date"]).toISOString().split("T")[0]
      : null;
    this.start_time = data["start_time"]
      ? this.formatTime(data["start_time"])
      : null;
    this.end_time = data["end_time"] ? this.formatTime(data["end_time"]) : null;
    this.wstation = data["wstation"] || null;
  }

  // Function to format time from a Date object or a string to HH:mm:ss
  private formatTime(timeInput: string | Date): string {
    const date =
      typeof timeInput === "string"
        ? new Date(`1970-01-01T${timeInput}Z`)
        : timeInput;
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`; // HH:mm:ss format
  }
}

interface messageContentMQTT {
  title: string;
  text: string;
}

interface StationContentMQTT {
  stationuuid: string;
  name: string;
}

class MessagePrototypeMQTT {
  message: messageContentMQTT;
  station: StationContentMQTT;

  constructor(data: any) {
    this.message = data["message"];
    this.station = data["station"];
  }
}

export { MessagePrototype, MessagePrototypeDB, MessagePrototypeMQTT };
