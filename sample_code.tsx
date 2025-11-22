<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Oat & Matcha | Build Your Own Bowl</title>
  <link href="https://fonts.googleapis.com/css2?family=Satoshi:wght@700;900&family=Lora:ital,wght@0,400;0,500;1,400&family=Noto+Serif+JP:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --clay: #E9E5D6;
      --oat: #D7C9B0;
      --matcha-light: #A8C3B1;
      --matcha-deep: #6B8E79;
      --terracotta: #C77966;
      --charcoal: #2D2D2D;
      --soft-gray: #5A5A5A;
      --off-white: #FDFCFB;
      --paper: url("image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d7c9b0' fill-opacity='0.06' fill-rule='evenodd'/%3E%3C/svg%3E");
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Lora', serif;
      background-color: var(--off-white);
      color: var(--charcoal);
      line-height: 1.6;
      background-image: var(--paper);
    }

    h1, h2, h3, h4 {
      font-family: 'Satoshi', sans-serif;
      font-weight: 900;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* HEADER */
    header {
      background-color: rgba(253, 252, 251, 0.95);
      backdrop-filter: blur(4px);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 16px 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-family: 'Satoshi', sans-serif;
      font-weight: 700;
      font-size: 1.4rem;
      color: var(--charcoal);
    }

    nav ul {
      display: flex;
      list-style: none;
      gap: 24px;
    }

    nav a {
      text-decoration: none;
      color: var(--charcoal);
      font-size: 0.95rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    nav a:hover {
      color: var(--terracotta);
    }

    .order-btn {
      background: var(--terracotta);
      color: white;
      padding: 8px 20px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.3s;
    }

    .order-btn:hover {
      background: #b46555;
    }

    /* HERO - SPLIT LAYOUT */
    .hero {
      display: flex;
      min-height: 80vh;
      padding: 80px 0;
      position: relative;
      overflow: hidden;
    }

    .hero-image {
      flex: 1;
      background: url('https://placehold.co/600x800/D7C9B0/2D2D2D?text=Artisan+Oat+Bowl') center/cover no-repeat;
      border-radius: 0 0 0 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }

    .hero-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px 60px 60px 40px;
      background: var(--off-white);
      border-radius: 0 0 20px 0;
    }

    .tag {
      display: inline-block;
      background: var(--matcha-light);
      color: var(--charcoal);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 20px;
      font-family: 'Satoshi', sans-serif;
    }

    .hero-content h1 {
      font-size: 2.8rem;
      line-height: 1.25;
      margin-bottom: 20px;
      max-width: 90%;
    }

    .hero-content p {
      font-size: 1.1rem;
      margin-bottom: 30px;
      color: var(--soft-gray);
      max-width: 90%;
    }

    .hero-cta {
      display: flex;
      gap: 16px;
      margin-top: 10px;
    }

    .btn-primary {
      background: var(--terracotta);
      color: white;
      padding: 12px 28px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-primary:hover {
      background: #b46555;
    }

    .btn-outline {
      background: transparent;
      color: var(--charcoal);
      padding: 12px 28px;
      border: 1px solid var(--charcoal);
      border-radius: 30px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-outline:hover {
      background: var(--charcoal);
      color: white;
    }

    /* STEAM ANIMATION */
    .steam {
      position: absolute;
      bottom: 60px;
      left: 60px;
      width: 24px;
      height: 60px;
      opacity: 0.8;
      z-index: 2;
    }

    .steam path {
      fill: white;
      animation: float 3s ease-in-out infinite;
    }

    .steam path:nth-child(2) {
      animation-delay: 0.5s;
    }

    .steam path:nth-child(3) {
      animation-delay: 1s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
      50% { transform: translateY(-20px) scale(1.1); opacity: 0.4; }
    }

    /* NOVEMBER SPECIALS */
    .november-specials {
      padding: 100px 0;
      background-color: var(--clay);
      background-blend-mode: overlay;
      background-image: var(--paper);
    }

    .section-title {
      text-align: center;
      margin-bottom: 60px;
      font-size: 2.4rem;
      position: relative;
    }

    .section-title:after {
      content: '';
      display: block;
      width: 60px;
      height: 2px;
      background: var(--terracotta);
      margin: 16px auto;
    }

    .specials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .special-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .special-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    }

    .special-image {
      height: 200px;
      background-size: cover;
      background-position: center;
    }

    .special-content {
      padding: 24px;
    }

    .special-tag {
      display: inline-block;
      background: var(--matcha-light);
      color: var(--charcoal);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 12px;
      font-family: 'Satoshi', sans-serif;
    }

    .special-card h3 {
      font-size: 1.4rem;
      margin-bottom: 12px;
      color: var(--charcoal);
    }

    .special-card p {
      color: var(--soft-gray);
      margin-bottom: 16px;
      font-size: 0.95rem;
    }

    .special-price {
      font-weight: 700;
      color: var(--terracotta);
      font-size: 1.2rem;
    }

    /* MENU */
    .menu {
      padding: 100px 0;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
    }

    .menu-column {
      padding: 30px;
      border-radius: 16px;
      background: white;
      box-shadow: 0 6px 25px rgba(0,0,0,0.06);
    }

    .menu-column h2 {
      margin-bottom: 28px;
      font-size: 1.8rem;
      color: var(--terracotta);
      padding-bottom: 16px;
      border-bottom: 1px solid var(--oat);
    }

    .menu-item {
      padding: 18px 0;
      border-bottom: 1px dashed #eee;
    }

    .menu-item:last-child {
      border-bottom: none;
    }

    .menu-item h4 {
      font-size: 1.25rem;
      margin-bottom: 6px;
      color: var(--charcoal);
    }

    .menu-item p {
      color: var(--soft-gray);
      font-style: italic;
      font-size: 0.95rem;
    }

    /* WHY US */
    .why-us {
      padding: 100px 0;
      background-color: var(--off-white);
      background-image: var(--paper);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }

    .card {
      text-align: center;
      padding: 40px 20px;
      border-radius: 16px;
      background: white;
      box-shadow: 0 6px 20px rgba(0,0,0,0.05);
    }

    .card h3 {
      margin: 20px 0 14px;
      font-size: 1.35rem;
      color: var(--matcha-deep);
    }

    /* TESTIMONIALS */
    .testimonials {
      padding: 100px 0;
      background: var(--matcha-light);
      position: relative;
    }

    .testimonial-container {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      position: relative;
      padding: 40px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .testimonial {
      font-size: 1.3rem;
      font-style: italic;
      line-height: 1.7;
      color: var(--charcoal);
    }

    .testimonial-author {
      margin-top: 24px;
      font-weight: 700;
      color: var(--terracotta);
      font-family: 'Satoshi', sans-serif;
      font-size: 1.1rem;
    }

    /* FOOTER */
    footer {
      background: var(--charcoal);
      color: white;
      padding: 60px 0 30px;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }

    .footer-section h3 {
      margin-bottom: 20px;
      font-size: 1.4rem;
      font-family: 'Satoshi', sans-serif;
    }

    .footer-section p, .footer-section a {
      color: #ccc;
      text-decoration: none;
      margin-bottom: 10px;
      display: block;
    }

    .newsletter input {
      width: 100%;
      padding: 12px;
      margin-top: 12px;
      border: none;
      border-radius: 6px;
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .newsletter input::placeholder {
      color: #aaa;
    }

    .newsletter button {
      background: var(--terracotta);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 6px;
      margin-top: 12px;
      cursor: pointer;
      font-weight: 600;
      width: 100%;
    }

    .copyright {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #444;
      color: #aaa;
      font-size: 0.95rem;
    }

    /* RESPONSIVE */
    @media (max-width: 900px) {
      .hero {
        flex-direction: column;
        min-height: auto;
        padding: 40px 20px;
      }

      .hero-image {
        width: 100%;
        border-radius: 20px 20px 0 0;
        height: 400px;
      }

      .hero-content {
        padding: 40px 30px;
        border-radius: 0 0 20px 20px;
      }

      .hero-content h1 {
        font-size: 2.2rem;
        max-width: 100%;
      }

      .hero-content p {
        max-width: 100%;
      }

      .hero-cta {
        flex-direction: column;
        gap: 12px;
      }

      .cards, .footer-content {
        grid-template-columns: 1fr;
        gap: 25px;
      }

      .menu-grid {
        grid-template-columns: 1fr;
      }

      .specials-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <header>
    <div class="container header-content">
      <div class="logo">OAT & MATCHA</div>
      <nav>
        <ul>
          <li><a href="#">Bowls</a></li>
          <li><a href="#">Matcha</a></li>
          <li><a href="#">November Specials</a></li>
          <li><a href="#">Locations</a></li>
        </ul>
      </nav>
      <a href="#" class="order-btn">Order Online</a>
    </div>
  </header>

  <!-- HERO - SPLIT LAYOUT -->
  <section class="hero">
    <div class="hero-image">
      <svg class="steam" viewBox="0 0 24 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0 C10 5, 8 10, 12 15 C16 10, 14 5, 12 0" opacity="0.7"/>
        <path d="M10 10 C8 15, 6 20, 10 25 C14 20, 12 15, 10 10" opacity="0.6"/>
        <path d="M14 20 C12 25, 10 30, 14 35 C18 30, 16 25, 14 20" opacity="0.5"/>
      </svg>
    </div>
    <div class="hero-content">
      <span class="tag">LONDON’S FIRST BYO MATCHA & OAT BAR</span>
      <h1>Handcrafted Bowls.<br>Ceremonial Matcha.</h1>
      <p>Choose your base, load with seasonal produce, pair with stone-ground matcha from Uji, Japan.</p>
      <div class="hero-cta">
        <a href="#" class="btn-primary">Build Your Bowl</a>
        <a href="#" class="btn-outline">View The Ceremony</a>
      </div>
    </div>
  </section>

  <!-- NOVEMBER SPECIALS -->
  <section class="november-specials">
    <div class="container">
      <h2 class="section-title">November Specials</h2>
      <div class="specials-grid">
        <div class="special-card">
          <div class="special-image" style="background: url('https://placehold.co/600x400/D7C9B0/2D2D2D?text=Autumn+Forest+Bowl') center/cover;"></div>
          <div class="special-content">
            <span class="special-tag">OAT BOWL</span>
            <h3>Autumn Forest</h3>
            <p>Roasted squash, pecans, maple, bee pollen, and warm quinoa base.</p>
            <div class="special-price">£8.50</div>
          </div>
        </div>
        <div class="special-card">
          <div class="special-image" style="background: url('https://placehold.co/600x400/A8C3B1/2D2D2D?text=Spiced+Pumpkin+Matcha') center/cover;"></div>
          <div class="special-content">
            <span class="special-tag">MATCHA</span>
            <h3>Spiced Pumpkin Matcha</h3>
            <p>Ceremonial matcha with house-made pumpkin purée, oat milk, and warming spices.</p>
            <div class="special-price">£6.75</div>
          </div>
        </div>
        <div class="special-card">
          <div class="special-image" style="background: url('https://placehold.co/600x400/C77966/FFFFFF?text=Cranberry+Chia+Delight') center/cover;"></div>
          <div class="special-content">
            <span class="special-tag">OAT BOWL</span>
            <h3>Cranberry Chia Delight</h3>
            <p>Festive chia pudding with poached cranberries, orange zest, and almond crumble.</p>
            <div class="special-price">£7.95</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- MENU -->
  <section class="menu">
    <div class="container">
      <div class="menu-grid">
        <div class="menu-column">
          <h2>OAT BOWLS</h2>
          <div class="menu-item">
            <h4>Build Your Own</h4>
            <p>Start from £6.50 — choose base + 5 toppings</p>
          </div>
          <div class="menu-item">
            <h4>Protein Power</h4>
            <p>Greek yogurt, hemp seeds, blueberries, almond butter</p>
          </div>
          <div class="menu-item">
            <h4>Tropical Escape</h4>
            <p>Mango, coconut flakes, passionfruit, chia</p>
          </div>
        </div>
        <div class="menu-column">
          <h2>MATCHA MENU</h2>
          <div class="menu-item">
            <h4>Ceremonial Grade</h4>
            <p>Traditional foam, 2g matcha from Uji</p>
          </div>
          <div class="menu-item">
            <h4>London Fog Matcha</h4>
            <p>Oat milk, vanilla, lavender</p>
          </div>
          <div class="menu-item">
            <h4>Iced Mint Matcha</h4>
            <p>Refreshing, with lime zest</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- WHY US -->
  <section class="why-us">
    <div class="container">
      <h2 class="section-title">Why Choose Us?</h2>
      <div class="cards">
        <div class="card">
          <h3>🌱 100% Plant-Based</h3>
          <p>Local, organic produce. Zero-waste kitchen.</p>
        </div>
        <div class="card">
          <h3>🎨 Artisan Ceramics</h3>
          <p>Bowls hand-thrown by London potters.</p>
        </div>
        <div class="card">
          <h3>☕ Direct-Trade Matcha</h3>
          <p>Single-origin from Uji, Japan. Stone-ground weekly.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="testimonials">
    <div class="container">
      <h2 class="section-title">Loved by Londoners</h2>
      <div class="testimonial-container">
        <p class="testimonial">
          “My morning ritual! The ‘Build Your Own’ lets me mix seasonal berries with tahini – genius. The matcha tastes like Kyoto.”
        </p>
        <p class="testimonial-author">– Maya, Shoreditch</p>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>OAT & MATCHA</h3>
          <p>Nourish Mindfully</p>
        </div>
        <div class="footer-section">
          <h3>Visit Us</h3>
          <p>Mon–Sun: 7am–5pm</p>
          <p>32 Floral St, London WC2E 9FB</p>
        </div>
        <div class="footer-section newsletter">
          <h3>Seasonal Menu Alerts</h3>
          <p>Get updates on new bowls & matcha infusions</p>
          <input type="email" placeholder="Your email" />
          <button>Subscribe</button>
        </div>
      </div>
      <div class="copyright">
        &copy; 2025 Oat & Matcha. All rights reserved.
      </div>
    </div>
  </footer>
</body>
</html>

