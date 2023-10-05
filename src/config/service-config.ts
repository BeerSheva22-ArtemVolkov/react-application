import AuthService from "../service/auth/AuthService";
import AuthServiceJwt from "../service/auth/AuthServiceJwt";
import ChatRoom from "../service/crud/ChatRoomService";
import ChatRoomServiceRest from "../service/crud/ChatRoomServiceRest";

export const authService: AuthService = new AuthServiceJwt('http://localhost:8080/users');
export const chatRoomService: ChatRoom = new ChatRoomServiceRest("localhost:8080");