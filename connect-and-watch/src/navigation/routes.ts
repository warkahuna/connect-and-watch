import LoginPage from "../pages/Auth/LoginPage";
import SignUpPage from "../pages/Auth/SignUpPage";
import HistoryPage from "../pages/History/HistoryPage";
import HomeScreen from "../pages/Home/HomePage";
import JoinRoomPage from "../pages/Room/JoinRoomPage";
import RoomCreationPage from "../pages/Room/RoomCreationPage";
import RoomPage from "../pages/Room/RoomPage";
import UsernamePage from "../pages/Room/UsernamePage";
import VideoPlayerPage from "../pages/Video/VideoPlayerPage";

const routes = [
  { path: "/", component: HomeScreen },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignUpPage },
  { path: "/create-room", component: RoomCreationPage },
  { path: "/join-room", component: JoinRoomPage },
  {
    path: "/room/:roomId",
    component: RoomPage,
  },
  {
    path: "/username",
    component: UsernamePage,
  },
  {
    path: "/video/:videoId",
    component: VideoPlayerPage,
  },
  {
    path: "/history",
    component: HistoryPage,
    private: true,
  },
  // Add more routes as needed
];

export default routes;
