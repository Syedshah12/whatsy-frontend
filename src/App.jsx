// import React,{useEffect} from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import {useDispatch} from "react-redux";

// import {initChatSocket}
// from "./features/chats/chatSocket";
// import Login from "./pages/Login";
// import ChatPage from "./pages/User/ChatPage";
// import MainLayout from "./layouts/MainLayout";
// import CampaignsList from "./pages/User/CampaignsList";
// import CampaignDetails from "./pages/User/CampaignDetails";

// const App = () => {

// const dispatch = useDispatch();


// useEffect(()=>{
// initChatSocket(dispatch);
// },[]);


//   return (
//     <BrowserRouter>
//       <Routes>

//         <Route 
//           path="/login" 
//           element={<Login />} 
//         />
//         <Route 
//           path="/dashboard" 
//           element={<MainLayout />} 
//         />

// {/* Campaigns Registry Path -> /dashboard/campaigns */}
//           <Route path="campaigns" element={<CampaignsList />} />
          
//           {/* Campaign Audit Path -> /dashboard/campaigns/:campaignId */}
//           <Route path="campaigns/:campaignId" element={<CampaignDetails />} />

//         {/* <Route 
//           path="/chats" 
//           element={<ChatPage />} 
//         /> */}

//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { initChatSocket } from "./features/chats/chatSocket";
import { selectIsAuthenticated } from "./features/auth/authSlice";

import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import CampaignsList from "./pages/User/CampaignsList";
import CampaignDetails from "./pages/User/CampaignDetails";
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    initChatSocket(dispatch);
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* /login → if already logged in, go straight to dashboard */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
   <Route path="campaigns" element={<CampaignsList />} />
            <Route path="campaigns/:campaignId" element={<CampaignDetails />} />
        {/* All protected pages live under this guard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<MainLayout />}>
         
          </Route>
        </Route>

        {/* Catch-all: unknown URLs → smart redirect */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;