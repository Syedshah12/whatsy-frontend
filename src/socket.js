import { io } from "socket.io-client";


export const socket = io(
    "https://whatsy-backend-production.up.railway.app",
    {
        transports:["websocket"]
    }
);
// export const socket = io(
//     "http://localhost:3000",
//     {
//         transports:["websocket"]
//     }
// );