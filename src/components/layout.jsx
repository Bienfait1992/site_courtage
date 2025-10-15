import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "../pages/auth_initializer";
export const Layout = ()=>{
    return(
        
        <>
         <Toaster
              position="top-center"
              toastOptions={{
                // Styles par défaut pour tous les toasts
                className: '',
                style: {
                  background: '#1f2937', // gris foncé
                  color: '#fff',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  fontSize: '14px',
                },
                success: {
                  duration: 3000,
                  icon: '', // icône par défaut
                },
                error: {
                  duration: 4000,
                  icon: '',
                },
              }}
            />
<AuthInitializer />
             
          <Outlet/>
          
          
        </>
    )
}