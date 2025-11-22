const MainContent = () => {
    return (

        <main className="main">
            <div className="container">
                {/* Seoul Section */}
                <section className="listings-section">
                    <div className="section-header">
                        <h2>Popular homes in Seoul</h2>
                        <div className="nav-arrows">
                            <button className="arrow-btn">‹</button>
                            <button className="arrow-btn">›</button>
                        </div>
                    </div>

                    <div className="listings-grid">
                        {["Room in Seoul", "Guesthouse in Seoul", "Room in Mapo-gu", "Room in 종로구", "Room in 종로구", "Room in Jongno-gu", "Guesthouse in Seoul"].map((title, index) => (
                            <div key={index} className="listing-card">
                                <div className="card-image">
                                    <img src="/placeholder.svg?height=300&width=400" alt={title} />
                                    <span className="favorite-badge">Guest favorite</span>
                                    <button className="favorite-btn">♡</button>
                                </div>
                                <div className="card-content">
                                    <h3>{title}</h3>
                                    <p className="price">
                                        <strong>${(56 + index * 10)}</strong> for 2 nights ★ {(4.8 + index * 0.05).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tokyo Section */}
                <section className="listings-section">
                    <div className="section-header">
                        <h2>Available next month in Tokyo</h2>
                        <div className="nav-arrows">
                            <button className="arrow-btn">‹</button>
                            <button className="arrow-btn">›</button>
                        </div>
                    </div>

                    <div className="listings-grid">
                        {["Home in Tokyo", "Room in Tokyo", "Apartment in Tokyo", "Room in Shibuya", "Studio in Tokyo", "Home in Kyoto", "Apartment in Tokyo"].map((title, index) => (
                            <div key={index} className="listing-card">
                                <div className="card-image">
                                    <img src="/placeholder.svg?height=300&width=400" alt={title} />
                                    <span className="favorite-badge">Guest favorite</span>
                                    <button className="favorite-btn">♡</button>
                                    {index === 3 && <span className="price-badge">Prices include all fees</span>}
                                </div>
                                <div className="card-content">
                                    <h3>{title}</h3>
                                    <p className="price">
                                        <strong>${(120 - index * 10)}</strong> for 2 nights ★ {(4.9 - index * 0.02).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
export default MainContent;