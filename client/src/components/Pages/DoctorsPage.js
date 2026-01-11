import React from 'react';

import dat from '../../assets/images/Dat.png';
import an from '../../assets/images/An.png';
import tuan from '../../assets/images/Tuan.png';
import tien from '../../assets/images/Tien.png';
import tri from '../../assets/images/Tri.png';
import mai from '../../assets/images/Mai.png';
import banner from '../../assets/images/Banner.png';


const DoctorsPage = () => {
    const doctors = [
        { name: "BS. ĐẠT", dept: "Khoa thần kinh", img: dat },
        { name: "BS. AN", dept: "Khoa da liễu", img: an },
        { name: "BS. TUẤN", dept: "Khoa tim mạch", img: tuan },
        { name: "BS. TIẾN", dept: "Khoa nội", img: tien },
        { name: "BS. TRÍ", dept: "Khoa ngoại", img: tri },
        { name: "BS. MAI", dept: "Khoa sản", img: mai },
    ];

    return (
        <div>
            {/* Banner riêng cho trang Bác sĩ */}
            <div style={{
                backgroundImage: `url(${banner})`,
                height: '300px', backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', paddingLeft: '10%', marginBottom: '50px'
            }}>
                <div>
                    <p style={{color: 'white', opacity: 0.8, marginBottom: '10px'}}>Trang chủ / Bác sĩ</p>
                    <h1 style={{color: 'white', fontFamily: 'Playfair Display', fontSize: '3rem'}}>Đội ngũ bác sĩ</h1>
                </div>
            </div>

            <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px 20px'}}>
                <div className="doctors-grid">
                    {doctors.map((doc, index) => (
                        <div key={index} className="doctor-card">
                            <div className="doc-img-box"><img src={doc.img} alt={doc.name} /></div>
                            <div className="doc-info" style={{backgroundColor: '#dbeafe', padding: '20px', textAlign: 'center'}}>
                                <p className="doc-dept" style={{color: '#555', marginBottom: '5px'}}>{doc.dept}</p>
                                <h3 className="doc-name" style={{color: '#1e3a8a', fontWeight: '800'}}>{doc.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorsPage;