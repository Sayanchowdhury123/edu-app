
import Hero from "./Hero";
import Howitworks from "./Howitworks";
import Marquees from "./Marquee";
import Nav from "./Nav";
import Popularcat from "./Popularcat";
import Testimonial from "./Testimonial";

const Landing = () => {



    return(
        <div >
         <Nav/>
         <Hero/>
         <Marquees/>
         <Howitworks/>
         <Popularcat/>
         <Testimonial/>

        </div>
    )
}

export default Landing;