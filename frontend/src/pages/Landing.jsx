
import Back from "./Backtotop";
import Calltoaction from "./Callto";
import Footer from "./Footer";
import Hero from "./Hero";
import Howitworks from "./Howitworks";
import Marquees from "./Marquee";
import Nav from "./Nav";
import Popularcat from "./Popularcat";
import Testimonial from "./Testimonial";

const Landing = () => {



    return(
        <div className="scroll-smooth" >
         <Nav/>
         <Hero/>
         <Marquees/>
         <Howitworks/>
         <Popularcat/>
         <Testimonial/>
         <Calltoaction/>
         <Footer/>
       
        </div>
    )
}

export default Landing;