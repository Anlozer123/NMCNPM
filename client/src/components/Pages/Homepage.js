import React from 'react';

import homepage_1 from '../../assets/images/Homepage_1.png';
import homepage_2 from '../../assets/images/Homepage_2.png';
import laser from '../../assets/images/Laser.png';
import domat from '../../assets/images/DoMat.png';
import sieuam from '../../assets/images/Sieuam.png';
import dat from '../../assets/images/Dat.png';
import an from '../../assets/images/An.png';
import tuan from '../../assets/images/Tuan.png';

const Homepage = () => {
    const featuredDoctors = [
        { name: "BS. ĐẠT", dept: "Khoa thần kinh", img: dat },
        { name: "BS. AN", dept: "Khoa da liễu", img: an },
        { name: "BS. TUẤN", dept: "Khoa tim mạch", img: tuan },
    ];

    const equipments = [
        { name: "MÁY LASER", img: laser },
        { name: "MÁY ĐO MẮT", img: domat },
        { name: "MÁY SIÊU ÂM", img: sieuam },
    ];

    return (
        <div className="homepage-content">
            {/* HERO SECTION */}
            <header className="hero-section">
                <div className="hero-content">
                    <span className="sub-title">CHĂM SÓC SỨC KHOẺ</span>
                    <h1 className="hero-title">Từ những bác sĩ<br />đầu ngành trong y khoa</h1>
                </div>
                <div className="hero-image-container">
                    <img src={homepage_1} alt="Doctor" className="hero-img" />
                </div>
            </header>

            {/* WELCOME SECTION */}
            <section className="welcome-section" style={{textAlign: 'center', padding: '60px 0'}}>
                <p className="welcome-text" style={{color: '#0284c7', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px'}}>
                    CHÀO MỪNG ĐẾN VỚI TÂM ANH
                </p>
                <h2 className="section-title-blue" style={{fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#1e3a8a', fontWeight: '700'}}>
                    Đẳng cấp 5 sao
                </h2>
                <div style={{marginTop: '40px'}}>
                    <img src={homepage_2} alt="Team" style={{maxWidth: '100%', borderRadius: '10px'}} />
                </div>
            </section>

            {/* EQUIPMENT SECTION */}
            <section className="equipment-section" style={{padding: '60px 0', background: '#f8faff'}}>
                <div className="header-wrapper">
                     <div style={{textAlign: 'center', marginBottom: '40px'}}>
                        <p className="welcome-text" style={{color: '#0284c7', fontWeight: '700'}}>CHÚNG TÔI ĐẦU TƯ</p>
                        <h2 className="section-title-blue">TRANG THIẾT BỊ HIỆN ĐẠI</h2>
                    </div>
                    <div className="doctors-grid">
                        {equipments.map((item, index) => (
                            <div key={index} className="doctor-card">
                                <div className="doc-img-box" style={{height: '300px'}}>
                                    <img src={item.img} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                </div>
                                <div className="doc-info" style={{backgroundColor: '#dbeafe', padding: '20px', textAlign: 'center'}}>
                                    <h3 className="doc-name">{item.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED DOCTORS */}
            <section className="doctors-section" style={{padding: '60px 0'}}>
                <div className="header-wrapper">
                     <div style={{textAlign: 'center', marginBottom: '40px'}}>
                        <p className="welcome-text" style={{color: '#0284c7', fontWeight: '700'}}>TIN TƯỞNG CHĂM SÓC BỞI</p>
                        <h2 className="section-title-blue">ĐỘI NGŨ BÁC SĨ CỦA CHÚNG TÔI</h2>
                    </div>
                    <div className="doctors-grid">
                        {featuredDoctors.map((doc, index) => (
                            <div key={index} className="doctor-card">
                                <div className="doc-img-box"><img src={doc.img} alt={doc.name} /></div>
                                <div className="doc-info">
                                    <p className="doc-dept">{doc.dept}</p>
                                    <h3 className="doc-name">{doc.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Homepage;