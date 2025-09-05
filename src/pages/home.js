// src/pages/Home.jsx
import Navbar from "../HomeComponents/Navbar";
import HeroImage from "../HomeComponents/HeroImage";
import Content1 from "../HomeComponents/Content1";
import Content2 from "../HomeComponents/Content2";
import Content3 from "../HomeComponents/Content3";
import MovingSportsList from "../HomeComponents/MovingSportsList";
import InstaContent from "../HomeComponents/InstaContent";
import Footer from "../HomeComponents/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="w-full">
        <HeroImage />
      </div>

      <div className="my-12">
        <MovingSportsList />
      </div>

      <div className="my-12">
        <Content1 />
      </div>

      <div className="my-12">
        <Content2/>
      </div>

      <div className="my-12">
        <Content3/>
      </div>

      <div className="p-4 w-2/3 mx-auto my-10">
        <InstaContent/>
      </div>

      <div>
        <Footer/>
      </div>
    </div>
  );
}
