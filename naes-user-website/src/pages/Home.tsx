import { useRef } from 'react';
import Hero from "@/home/Hero";
import About from "@/home/About";
import Products from "@/home/Products";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; 

const Home = () => {
    // const [showFullPage, setShowFullPage] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    // const handleClick = (e: MouseEvent) => {
    //     // 检查点击是否发生在Header上
    //     if (!headerRef.current || !headerRef.current.contains(e.target as Node)) {
    //         setShowFullPage(true);
    //     }
    // };

    return (
        <div>
            <div ref={headerRef}>
                <Header />
            </div>
            <><Hero />
                <About />
                <Products />
                <Footer /> 
            </>

        </div>
    );
};

export default Home;