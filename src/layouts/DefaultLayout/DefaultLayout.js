import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <div>
                <div>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
