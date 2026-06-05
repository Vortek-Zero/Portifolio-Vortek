import Header from "./Header";
import Footer from "./Footer";
import Particles from "./Particles";

export default function Layout({ children }) {
  return (
    <>
      <div className="bg-grid" />
      <Particles />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
