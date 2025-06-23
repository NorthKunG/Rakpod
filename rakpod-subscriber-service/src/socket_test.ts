import { io } from "socket.io-client";
const socket = io("http://localhost:2542", {
    path: "/socketio/"
});

// const socket = io("http://localhost:2542", {
//     path: "/socketio/"
// });

// /weather-station/c505faed-ff5d-469d-bef9-6d0dab5cfa2a
// /weather-station/c505faed-ff5d-469d-bef9-6d0dab5cfa2b
// /weather-station/c505faed-ff5d-469d-bef9-6d0dab5cfa2c

socket.on("connect", function () {
    console.log("socket connected");
});
socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("/weather-station/c505faed-ff5d-469d-bef9-6d0dab5cfa2c/data", (count) => {
    console.log(count);
});