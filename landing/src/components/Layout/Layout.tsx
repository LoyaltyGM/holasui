import * as React from "react";
import classNames from "classnames";

import Header from "./Header";
import Footer from "./Footer";

interface ILayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
    {
        /* pb-20 should be same as a footer height */
    }
    return (
        <>
            <div className="relative min-h-screen">
                <Header />

                <main className={classNames("flex-1 pb-40", className)} {...props}>
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
}
