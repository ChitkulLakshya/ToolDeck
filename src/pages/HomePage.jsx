import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import ToolsSection from "../components/ToolsSection";

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      scroller.scrollTo(location.state.scrollTo, {
        duration: 800,
        smooth: "easeInOutQuart",
        offset: -64,
      });
    }
  }, [location.state]);

  return (
    <div>
      <div id="home">
        <HeroSection />
        <StatsSection />
        <ToolsSection />
      </div>
    </div>
  );
};

export default HomePage;
