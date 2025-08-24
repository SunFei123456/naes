import { ReactNode } from "react";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
