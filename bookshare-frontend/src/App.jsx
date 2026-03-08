import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Books from "./pages/Books";
import ProfilePage from "./pages/Profilepage";
import BookDetails from "./pages/BookDetails";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminDashboard from "./pages/AdminDashboard";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Hero />
      <Home />
      <Footer />
    </>
  );
}

function BooksLayout() {
  return (
    <>
      <Navbar />
      <Books />
      <Footer />
    </>
  );
}

function BookDetailsLayout() {
  return (
    <>
      <Navbar />
      <BookDetails />
      <Footer />
    </>
  );
}

function AddressLayout() {
  return (
    <>
      <Navbar />
      <Address />
      <Footer />
    </>
  );
}

function PaymentLayout() {
  return (
    <>
      <Navbar />
      <Payment />
      <Footer />
    </>
  );
}

function OrderConfirmationLayout() {
  return (
    <>
      <Navbar />
      <OrderConfirmation />
      <Footer />
    </>
  );
}

function ProfileLayout() {
  return (
    <>
      <Navbar />
      <ProfilePage />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/books" element={<BooksLayout />} />
      <Route path="/book/:id" element={<BookDetailsLayout />} />
      <Route path="/address" element={<AddressLayout />} />
      <Route path="/payment" element={<PaymentLayout />} />
      <Route path="/order-confirmation" element={<OrderConfirmationLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProfileLayout />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
