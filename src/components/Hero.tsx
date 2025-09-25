function Hero() {
  // bikin grid kotak-kotak: 16 kolom x 16 baris (256 span)
  const cells = Array.from({ length: 16 * 16 });

  return (
    <section className="hero-grid" id="home">
      {/* background grid */}
      {cells.map((_, i) => (
        <span key={i} />
      ))}

      {/* teks di tengah */}
      <div className="hero-text">
        <h1>ANDY SAPUTRA PORTOFOLIO</h1>
        <p className="subhead">“Whatever your hand finds to do, do it with your might.”</p>
       
      {/* aksi di bawah heading */}
      <div className="hero-actions">
        <a href="#about" className="hero-cta">
          <span>Explore Portfolio</span>
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </a>
      </div>

      </div>

    </section>
  );
}
export default Hero;
