import React from "react";
import Navbar from "../components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HospitalDetailPage from "./HospitalDetailPage";
import HospitalAddPage from "./HospitalAddPage";
import PatientAddPage from "./PatientAddPage";
import PatientDetailPage from "./PatientDetailPage";
import Footer from "../components/Footer"
import { ToastContainer } from "react-toastify";

export default function MainScreen() {
  return (
    <div >
      <ToastContainer position="bottom-right"/>
      <BrowserRouter>
      <Navbar/>
      <Routes>
         <Route path="/" element={<HospitalDetailPage />}></Route>
        <Route path="/hospitalAddPage" element={<HospitalAddPage />}></Route>
        <Route path="/hospitalDetailPage" element={<HospitalDetailPage />}></Route>
        <Route path="/patientDetailPage" element={<PatientDetailPage />}></Route>
        <Route path="/patientAddPage" element={<PatientAddPage />}></Route>
      </Routes>
     <Footer/>
    </BrowserRouter>

    </div>
  );
}