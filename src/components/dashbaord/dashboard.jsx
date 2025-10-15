// import React, { useEffect, useState } from "react";
// import { Sidebar } from "../sidebar";
// import { useAuthStore } from "../../provider/useAuthStore";
// import { CACard } from "./graphiques/CACard";
// import { TopProductsCard } from "./graphiques/TopProductsCard";
// import { ClientStatsCard } from "./graphiques/ClientStatsCard";
// import { useDashboardStore } from "./store_dashboard";
// // import classNames from "classnames";
// import { HeaderDashboard } from "./header_dashboard";
// import { RemunerationsKPI } from "./remunerations_table";
// import { AuditLogs } from "./Audit/auditLogs ";
// import { StockKPI } from "./stock/stock";
// import { ClientsKPI } from "./Clients/clents";
// import { InvoicesTable } from "./Invoices/Invoices";
// import { OrdersTable } from "./order/orders";
// import { Outlet } from "react-router-dom";
// import { Footer } from "../footer";



// export const Dashboard = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   const authStore = useAuthStore();
//   const user = authStore.user;


//   return (
//     <div className="flex h-screen w-full">
//         {/* flex h-screen */}
        
//      <Sidebar className="h-screen"/>
//      <div className="">
//      <HeaderDashboard isOpen={isOpen} setIsOpen={setIsOpen} />
        
   
//     <Outlet/>
//     <Footer/>



//     </div>
//     </div>
//   );
//   }


import React, { useState }from"react" ;
import { Sidebar }from"../sidebar" ;
import{ useAuthStore }from"../../provider/useAuthStore" ; 
import{ HeaderDashboard }from"./header_dashboard" ; 
import {Outlet} from"react-router-dom" ;
import { Footer } from"../footer" ; 

export const Dashboard = () => { 
    const [isOpen, setIsOpen] = useState(true); 
    const authStore = useAuthStore(); 
    const utilisateur = authStore.user ; 
    return (
         <div className="flex h-screen w-full"> 
    {/* Sidebar */} 
    <Sidebar className="h-screen" isOpen={isOpen}/> 
    {/* Contenu principal */} 
    <div className="flex flex-col w-full"> 
        {/* Header */} 
        <HeaderDashboard isOpen={isOpen} setIsOpen={setIsOpen} /> 

        {/* Contenu dynamique */} 
        <div className="flex-1 overflow-auto p-4"> 
            <Outlet /> </div> 

            {/* Pied de page */} 
            <Footer/> </div> 
            </div> 
            );
            
        } ;