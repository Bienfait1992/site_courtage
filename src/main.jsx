import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout";
import { Login } from "./pages/Auth/login";
import { LandingPage } from "./pages/landing_page";
import { ContactPage } from "./pages/contact_page";
import { SignUp } from "./pages/Auth/signup";
import { ProfilePage } from "./pages/profile";
import SuperAdminDashboard from "./components/dashbaord/superadmin/super_admin_dashboard";
import { AproposPage } from "./pages/apropos_page";
import { GuestOnly } from "./components/guest_only";
import { RequireAuth } from "./components/require_auth";
import AnnoncesList from "./pages/annonces/annonce_liste_page";
import CreateAnnonceForm from "./pages/annonces/create_annonce_form";
import AnnonceDetail from "./pages/annonces/annonce_detail";
import SouscriptionsAnnonces from "./pages/annonces/souscriptions_annonces_user_page";
import SouscriptionAnnonce from "./pages/annonces/souscription_annonce";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
         children: [
          {
            index: true, 
            element: <AnnoncesList />,
          },
          
          { path: "contact_page", element: <ContactPage/> },
          { path: "listeannonces", element: <AnnoncesList/> },
          { path: "/annonce_form", element: <CreateAnnonceForm/> },
          { path: "/annonces/:id", element: <AnnonceDetail /> },
          { path: "/souscriptions-annonces-user", element: <SouscriptionsAnnonces /> },
          { path: "/souscriptions-form", element: <SouscriptionAnnonce /> },

         

          
           // Routes protégées pour les visiteurs uniquement
          {
            element: <GuestOnly />,
            children: [
              { path: "/signup", element: <SignUp /> },
              { path: "/login", element: <Login /> },
            ],
          },

          { path: "/apropos", element: <AproposPage/> },

        ],
      },




{
        path: "/profile",
        // element: <ProfilePage/>,   
        element: <RequireAuth role="USER" />,
        children: [
          {
            index: true, // ← page par défaut de /dashboard
            element: <ProfilePage/>,
          },
          // { path: "homedashboard", element: <HomeDashboard/> },
        ],
      },

      {
        path: "/dashboard_admin",
        // element: <SuperAdminDashboard/>,   
        element: <RequireAuth role="ADMIN" />,
        children: [
          {
            index: true, // ← page par défaut de /dashboard
            element: <SuperAdminDashboard/>,
          },
          // { path: "homedashboard", element: <HomeDashboard/> },
        ],
      },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


