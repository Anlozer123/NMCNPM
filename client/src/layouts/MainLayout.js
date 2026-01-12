import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Header />
            <main style={{ minHeight: '60vh' }}>
                {/* Outlet là nơi nội dung các trang con (Home, Doctors...) hiển thị */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;