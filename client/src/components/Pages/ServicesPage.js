import React from 'react';

import banner_bs from '../../assets/images/Banner_BS.png';
import tuvan from '../../assets/images/Tuvan.png';
import tiem from '../../assets/images/Tiem.png';
import tongquat from '../../assets/images/Tongquat.png';
import xetnghiem from '../../assets/images/Xetnghiem.png';
import chandoan from '../../assets/images/Chandoan.png';
import chamsoc from '../../assets/images/Chamsoc.png';

const ServicesPage = () => {
    const services = [
        { title: "Tư vấn miễn phí", img: tuvan },
        { title: "Khám tổng quát", img: tongquat },
        { title: "Tiêm chủng", img: tiem },
        { title: "Xét nghiệm", img: xetnghiem },
        { title: "Chẩn đoán hình ảnh", img: chandoan },
        { title: "Chăm sóc tại nhà", img: chamsoc },
    ];

    return (
        <div>
            {/* Banner riêng cho trang Dịch vụ */}
            <div style={{
                backgroundImage: `url(${banner_bs})`,
                height: '300px', backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', paddingLeft: '10%', marginBottom: '50px'
            }}>
                <div>
                    <p style={{color: 'white', opacity: 0.8, marginBottom: '10px'}}>Trang chủ / Dịch vụ</p>
                    <h1 style={{color: 'white', fontFamily: 'Playfair Display', fontSize: '3rem'}}>Dịch vụ của chúng tôi</h1>
                </div>
            </div>

            <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px 20px'}}>
                <div className="services-grid">
                    {services.map((svc, index) => (
                        <div key={index} className="service-card">
                            <div className="svc-img-box"><img src={svc.img} alt={svc.title} /></div>
                            <div className="svc-info" style={{padding: '20px', textAlign: 'center'}}>
                                <h3 style={{color: '#1e3a8a'}}>{svc.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;