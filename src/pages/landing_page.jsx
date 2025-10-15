import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Footer } from "../components/footer";
import { SectionMenu } from "./section_menu";
import { PublicitePage } from "./publicité";
import { Carousel } from "../components/caroussel";
import Ticker from "./ticker";

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col ">

      <SectionMenu />
        <Carousel className="md:px-48"/>
        {/* <Ticker /> */}
      <Outlet />
      <Footer />
    </div>
  );
};

