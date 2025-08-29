// socket.js (create a separate file)
import { io } from "socket.io-client";

const socket = io("https://bhavanaastro.onrender.com", { autoConnect: false });
export default socket;
