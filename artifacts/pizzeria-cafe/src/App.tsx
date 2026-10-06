import { useEffect, useMemo, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import {
  Clock3, Heart, MapPin, Menu as MenuIcon,
  Minus, Plus, Search, ShoppingBag, UtensilsCrossed, Vegan, X, Phone,
  MessageCircle, Navigation, ChevronLeft, ChevronRight, Maximize2,
} from 'lucide-react';
import {
  formatPrice, gallery, menuCategories, menuItems, navigation, offers,
  restaurant, whatsappLink, type MenuItem,
} from '@/data/restaurant';

type CartEntry = { key: string; item: MenuItem; sizeName?: string; price: number; quantity: number };

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const categories = ['All', ...menuCategories];

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menuItems.filter((item) =>
      (activeCategory === 'All' || item.category === activeCategory) &&
      (!query || `${item.name} ${item.category} ${item.note ?? ''}`.toLowerCase().includes(query)),
    );
  }, [activeCategory, search]);

  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const cartTotal = cart.reduce((sum, entry) => sum + entry.quantity * entry.price, 0);

  useEffect(() => {
    if (selectedItem) setSelectedSize(selectedItem.sizes?.[0]?.name ?? '');
  }, [selectedItem]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItem(null);
        setCartOpen(false);
        setLightboxIndex(null);
        setMobileOpen(false);
      }
      if (lightboxIndex !== null && event.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % gallery.length);
      if (lightboxIndex !== null && event.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [lightboxIndex]);

  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: restaurant.name,
      description: `${restaurant.name} is a 100% vegetarian cafe in Ghukna, Ghaziabad, serving pizza, burgers, pasta and snacks.`,
      telephone: `+91${restaurant.phone}`,
      servesCuisine: 'Vegetarian',
      address: {
        '@type': 'PostalAddress',
        streetAddress: restaurant.address,
        addressLocality: 'Ghukna, Ghaziabad',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
    };
    const existing = document.getElementById('restaurant-jsonld') as HTMLScriptElement | null;
    const script: HTMLScriptElement = existing ?? document.createElement('script');
    script.id = 'restaurant-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    if (!existing) document.head.appendChild(script);
  }, []);

  const addToCart = (item: MenuItem, sizeName?: string) => {
    if (item.verify) return;
    const price = item.sizes?.find((size) => size.name === sizeName)?.price ?? item.price;
    if (price === undefined) return;
    const key = `${item.id}:${sizeName ?? 'single'}`;
    setCart((previous) => {
      const existing = previous.find((entry) => entry.key === key);
      return existing
        ? previous.map((entry) => entry.key === key ? { ...entry, quantity: entry.quantity + 1 } : entry)
        : [...previous, { key, item, sizeName, price, quantity: 1 }];
    });
    setSelectedItem(null);
  };

  const changeQuantity = (key: string, change: number) => {
    setCart((previous) => previous
      .map((entry) => entry.key === key ? { ...entry, quantity: entry.quantity + change } : entry)
      .filter((entry) => entry.quantity > 0));
  };

  const makeOrderMessage = () => {
    const details = cart.map(({ item, sizeName, quantity, price }) =>
      `• ${item.name}${sizeName ? ` (${sizeName})` : ''} x ${quantity} — ${formatPrice(price * quantity)}`,
    ).join('\n');
    return `Hi Pizzeria Cafe, I would like to place an order:\n\n${details}\n\nTotal: ${formatPrice(cartTotal)}\n\nPlease confirm availability and delivery.`;
  };

  const menuAnchor = (e?: MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault();
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToGallery = (index: number) => setLightboxIndex(index);
  const activeGallery = lightboxIndex === null ? null : gallery[lightboxIndex];

  return (
    <div>
      <header className="site-nav">
        <div className="nav-inner">
          <a className="brand-lockup" href="#home" aria-label="Pizzeria Cafe home">
            <span className="brand-mark">P</span>
            <span className="brand-name">{restaurant.name}<small>Ghukna · Ghaziabad</small></span>
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            {navigation.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>
          <button className="button button-primary nav-order" onClick={() => setCartOpen(true)} data-testid="button-open-cart">
            <ShoppingBag size={16} /> Order {cartCount ? `(${cartCount})` : 'Now'}
          </button>
          <button className="menu-toggle" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} data-testid="button-mobile-navigation">
            {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
        {mobileOpen && <nav className="mobile-menu" aria-label="Mobile navigation">
          {navigation.map((link) => <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>{link.label}</a>)}
          <a href="#menu" onClick={() => setMobileOpen(false)}>Browse the menu</a>
        </nav>}
      </header>

      <main>
        <section className="hero texture" id="home">
          <div className="hero-content">
            <span className="hero-kicker"><Vegan size={15} /> 100% Vegetarian · Ghukna, Ghaziabad</span>
            <h1>Pizzeria<br /><span>Cafe.</span></h1>
            <p className="hero-tagline">{restaurant.tagline}</p>
            <p className="hero-copy">Your neighborhood stop for pizza, burgers, pasta and more. Come by, find your favourite, and make a meal of it.</p>
            <div className="hero-actions">
              <a href="#menu" onClick={menuAnchor} className="button button-cream"><UtensilsCrossed size={17} /> Explore the menu</a>
              <a className="button button-outline" href={whatsappLink('Hi Pizzeria Cafe, I would like to place an order.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Order on WhatsApp</a>
              <a className="button button-outline" href={restaurant.directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={16} /> Get directions</a>
            </div>
            <div className="hero-footnote"><span><i /> Fresh ingredients</span><span><i /> Great taste</span><span><i /> Happy you</span></div>
          </div>
          <div className="hero-side">A little happiness, around the corner</div>
        </section>

        <div className="strip" aria-label="Cafe highlights">
          <div className="strip-inner">
            <div className="strip-item"><span className="strip-icon"><Vegan size={18} /></span><div><b>100% Veg</b><small>A fully vegetarian menu</small></div></div>
            <div className="strip-item"><span className="strip-icon"><Heart size={18} /></span><div><b>Made with love</b><small>A neighborhood cafe feel</small></div></div>
            <div className="strip-item"><span className="strip-icon"><UtensilsCrossed size={18} /></span><div><b>Pizza & more</b><small>Plenty to find on the menu</small></div></div>
            <div className="strip-item"><span className="strip-icon"><Navigation size={18} /></span><div><b>Delivery available</b><small>Free from Rs. 300/-</small></div></div>
          </div>
        </div>

        <section id="about" className="section-pad">
          <div className="section-wrap about-grid">
            <div className="about-copy">
              <span className="eyebrow">A neighborhood cafe</span>
              <h2 className="section-heading">More than<br />just pizza.</h2>
              <p>Pizzeria Cafe is a vegetarian neighborhood cafe in Ghukna, Ghaziabad. The menu goes beyond pizza, with burgers, pasta, fries, sides and combo meals to make choosing your next bite easy.</p>
              <p>Step inside the colorful dining room, browse the blackboard-style menu, and settle in—or order for home.</p>
              <a href="#menu" onClick={menuAnchor} className="button button-primary"><UtensilsCrossed size={16} /> Explore our menu</a>
            </div>
            <div className="about-image-wrap">
              <img className="about-image" src="/images/cafe-interior-seating.jpeg" alt="The real colorful dining room at Pizzeria Cafe in Ghukna" width="1024" height="576" />
              <div className="image-stamp"><b>100%</b><span>vegetarian<br />cafe</span></div>
            </div>
          </div>
        </section>

        <section className="menu-section section-pad" id="menu">
          <div className="section-wrap">
            <div className="menu-top">
              <div><span className="eyebrow">The printed menu, made easy</span><h2 className="section-heading">Find your<br />next favourite.</h2>
                <p className="section-intro">Choose a category, search an item, pick your size, then build an order for WhatsApp.</p>
              </div>
              <button className="button button-cream" onClick={() => setCartOpen(true)} data-testid="button-view-order"><ShoppingBag size={17} /> Your order {cartCount > 0 && `· ${cartCount}`}</button>
            </div>
            <div className="menu-controls">
              <label className="search-box"><Search size={18} /><input aria-label="Search menu" type="search" placeholder="Search pizza, burger, pasta…" value={search} onChange={(event) => setSearch(event.target.value)} data-testid="input-menu-search" /></label>
            </div>
            <div className="category-row" aria-label="Menu categories">
              {categories.map((category) => <button key={category} className={`category-chip ${activeCategory === category ? 'active' : ''}`} onClick={() => setActiveCategory(category)} data-testid={`filter-category-${category.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{category}</button>)}
            </div>
            <p className="menu-count" aria-live="polite" data-testid="text-menu-result-count">{visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}</p>
            <div className="menu-grid">
              {visibleItems.map((item) => {
                const price = item.sizes?.[0]?.price ?? item.price;
                return <article className="menu-card" key={item.id} data-testid={`card-menu-item-${item.id}`}>
                  <button className="item-detail-button" aria-label={`View ${item.name} details`} onClick={() => setSelectedItem(item)} data-testid={`button-details-${item.id}`} />
                  <div className="menu-card-top">
                    <div><h3>{item.name}</h3><p className="item-note">{item.note ?? item.category}</p></div>
                    <span className="veg-marker" aria-label="Vegetarian" />
                  </div>
                  {item.verify && <span className="verify-chip">Price / name needs confirmation</span>}
                  <div className="item-meta"><span className="price-display">{item.verify ? 'Confirm price' : price !== undefined ? formatPrice(price) : 'Confirm price'}<small>{item.sizes && !item.verify ? ' / from' : ''}</small></span>
                    <button className="card-add" aria-label={`Add ${item.name} to order`} disabled={Boolean(item.verify)} onClick={(event) => { event.stopPropagation(); addToCart(item, item.sizes?.[0]?.name); }} data-testid={`button-add-${item.id}`}><Plus size={18} /></button>
                  </div>
                </article>;
              })}
              {visibleItems.length === 0 && <div className="menu-empty"><Search size={24} /><h3>No menu items found</h3><p>Try another search or choose a different category.</p><button className="button button-soft" onClick={() => { setSearch(''); setActiveCategory('All'); }}>Show all menu items</button></div>}
            </div>
            <p className="menu-foot"><strong>Menu note:</strong> Sizes and prices are transcribed from the cafe’s printed menu. A variety name that could not be read confidently is marked for confirmation and cannot be added to your order.</p>
          </div>
        </section>

        <section className="promo-band texture" id="offers">
          <div className="section-wrap promo-inner">
            <div>
              <span className="offer-label">From the cafe menu</span>
              <h2><span>Buy 1</span><br />Get 1 Free</h2>
              <p>{offers[0].description}</p>
              <div className="promo-days"><span>Tuesday</span><span>Thursday</span></div>
            </div>
            <div className="promo-side">
              <img src="/images/pizzeria-branding.jpeg" alt="Pizzeria Cafe's original pizza and cafe branding" loading="lazy" width="720" height="480" />
              <strong>Pizza plans? Sorted.</strong>
              <small>Buy 1 Get 1 Free on Veg Special & Veg Feast Pizza on Tuesday & Thursday. Please confirm offer details when ordering.</small>
            </div>
          </div>
        </section>

        <section className="delivery-row" aria-label="Home delivery information">
          <div className="section-wrap delivery-content">
            <div><h3>{restaurant.delivery.label}</h3><p>Enjoy Pizzeria Cafe at home. Delivery minimum shown on the cafe’s branding.</p></div>
            <div className="delivery-tag"><Navigation size={22} /><span>Minimum order<br /><strong>{restaurant.delivery.minimumLabel}</strong></span></div>
          </div>
        </section>

        <section className="combo-section section-pad" aria-labelledby="combos-title">
          <div className="section-wrap">
            <div className="combo-header">
              <div><span className="eyebrow">Good things together</span><h2 className="section-heading" id="combos-title">Combos on the menu.</h2></div>
              <p className="section-intro">Combo names, inclusions and prices are listed as printed. Browse the full menu above to add a combo to your order.</p>
            </div>
            <div className="combo-grid">
              {menuItems.filter((item) => item.category.startsWith('Combo') || item.category === 'Set of Four' || item.category === 'Meal for Family').map((item) => (
                <article className="combo-card" key={item.id}><div><small>{item.category}</small><h3>{item.name}</h3><p>{item.note}</p></div><div className="combo-price">{formatPrice(item.price ?? 0)}</div></article>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-wrap">
            <div className="gallery-header">
              <div><span className="eyebrow">A peek inside</span><h2 className="section-heading">Come hungry.<br />Look around.</h2></div>
              <p className="section-intro">Real photos from Pizzeria Cafe, alongside the cafe’s original printed menu and branding.</p>
            </div>
            <div className="gallery-grid">
              {gallery.map((image, index) => <button key={image.src} className="gallery-tile" onClick={() => goToGallery(index)} aria-label={`Open image: ${image.label}`} data-testid={`button-gallery-image-${index}`}>
                <img src={image.src} alt={image.alt} loading="lazy" width="1024" height="576" />
                <span className="expand-icon"><Maximize2 size={16} /></span><span className="gallery-caption">{image.label}</span>
              </button>)}
            </div>
          </div>
        </section>

        <section className="visit-section" id="visit">
          <div className="section-wrap">
            <div className="visit-grid">
              <div className="visit-card">
                <span className="eyebrow">Find the cafe</span>
                <h2>See you<br />in Ghukna.</h2>
                <div className="info-line"><MapPin size={19} /><p><b>Address</b>{restaurant.address}</p></div>
                <div className="info-line"><Clock3 size={19} /><p><b>Daily hours</b>{restaurant.hours}</p></div>
                <div className="info-line"><Phone size={18} /><p><b>Call</b><a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a></p></div>
                <div className="visit-actions">
                  <a className="button button-primary" href={restaurant.directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={16} /> Get directions</a>
                  <a className="button button-outline" href={`tel:${restaurant.phone}`}><Phone size={16} /> Call now</a>
                </div>
              </div>
              <div className="map-panel" aria-label="Directions panel for Pizzeria Cafe">
                <div className="map-mapbox" />
                <div className="map-label"><MapPin size={25} /><b>Pizzeria Cafe</b><span>Near Auto Stand<br />Ghukna, Ghaziabad</span></div>
                <a className="button button-primary map-action" href={restaurant.directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={16} /> Open in Google Maps</a>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-strip" id="contact">
          <div className="section-wrap contact-inner">
            <div><h2>Let’s make it a good meal.</h2><p>Call the cafe, visit us in Ghukna or start your order on WhatsApp.</p></div>
            <div className="contact-quick">
              <a className="button button-cream" href={`tel:${restaurant.phone}`}><Phone size={16} /> Call {restaurant.phone}</a>
              <a className="button button-outline" href={whatsappLink('Hi Pizzeria Cafe, I would like to place an order.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> Chat on WhatsApp</a>
              <a className="button button-outline" href={restaurant.directionsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16} /> Directions</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-wrap">
          <div className="footer-grid">
            <div><a className="brand-lockup" href="#home"><span className="brand-mark">P</span><span className="brand-name">{restaurant.name}<small>{restaurant.tagline}</small></span></a><p className="footer-copy">A 100% vegetarian neighborhood cafe in Ghukna, Ghaziabad. Pizza, burgers, pasta and more.</p></div>
            <div><h3>Explore</h3><nav className="footer-links" aria-label="Footer navigation">{navigation.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</nav></div>
            <div><h3>Come by</h3><p className="footer-detail">{restaurant.address}</p><p className="footer-detail"><a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a> · Daily {restaurant.hours}</p></div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} {restaurant.name}. All Rights Reserved.</span><span>100% Vegetarian · Ghukna, Ghaziabad</span></div>
        </div>
      </footer>

      <nav className="mobile-quick" aria-label="Quick actions">
        <a href="#menu" onClick={menuAnchor}><UtensilsCrossed size={18} /><span>Menu</span></a>
        <button className="quick-order" onClick={() => setCartOpen(true)} data-testid="button-mobile-cart"><ShoppingBag size={18} /><span>Order{cartCount ? ` · ${cartCount}` : ''}</span></button>
        <a href={whatsappLink('Hi Pizzeria Cafe, I would like to place an order.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /><span>WhatsApp</span></a>
        <a href={`tel:${restaurant.phone}`}><Phone size={18} /><span>Call</span></a>
        <a href={restaurant.directionsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={18} /><span>Directions</span></a>
      </nav>

      {selectedItem && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedItem(null); }}>
        <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <button className="dialog-close" onClick={() => setSelectedItem(null)} aria-label="Close item details"><X size={19} /></button>
          <div className="detail-image" style={{ background: 'linear-gradient(115deg,#d94a22,#f2b840)', display: 'grid', placeItems: 'center', color: '#fff4df' }}><UtensilsCrossed size={44} /></div>
          <span className="eyebrow">{selectedItem.category}</span><h2 id="detail-title">{selectedItem.name}</h2>
          <p>{selectedItem.note ?? 'A vegetarian choice from the Pizzeria Cafe menu.'}</p>
          <span className="veg-marker" aria-label="Vegetarian" />
          {selectedItem.verify ? <p className="verify-chip">{selectedItem.verify} No price shown; please confirm with the cafe.</p> : <>
            {selectedItem.sizes && <div className="size-options" aria-label="Choose size">{selectedItem.sizes.map((size) => <button key={size.name} className={`size-option ${selectedSize === size.name ? 'active' : ''}`} onClick={() => setSelectedSize(size.name)}>{size.name} · {formatPrice(size.price)}</button>)}</div>}
            <div className="dialog-price">{formatPrice(selectedItem.sizes?.find((size) => size.name === selectedSize)?.price ?? selectedItem.price ?? 0)}</div>
            <div className="dialog-actions"><button className="button button-primary" onClick={() => addToCart(selectedItem, selectedSize || undefined)}><Plus size={17} /> Add to order</button><button className="button button-soft" onClick={() => setSelectedItem(null)}>Keep browsing</button></div>
          </>}
        </section>
      </div>}

      {cartOpen && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
        <aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="cart-head"><h2 id="cart-title">Your order <span style={{ color: '#efb53f' }}>{cartCount ? `(${cartCount})` : ''}</span></h2><button className="dialog-close" style={{ position: 'static' }} onClick={() => setCartOpen(false)} aria-label="Close order"><X size={19} /></button></div>
          <div className="cart-body">
            {cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={30} /><h3>Your order starts here.</h3><p>Pick something from the menu and it’ll show up here.</p><button className="button button-cream" onClick={() => { setCartOpen(false); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>Browse the menu</button></div> :
              cart.map((entry) => <article className="cart-item" key={entry.key}><div><h3>{entry.item.name}</h3><small>{entry.sizeName ? `${entry.sizeName} · ` : ''}{formatPrice(entry.price)} each</small></div><span className="cart-item-price">{formatPrice(entry.price * entry.quantity)}</span><div className="qty-controls"><button onClick={() => changeQuantity(entry.key, -1)} aria-label={`Decrease ${entry.item.name} quantity`}><Minus size={14} /></button><span>{entry.quantity}</span><button onClick={() => changeQuantity(entry.key, 1)} aria-label={`Increase ${entry.item.name} quantity`}><Plus size={14} /></button><button className="remove" onClick={() => changeQuantity(entry.key, -entry.quantity)}>Remove</button></div></article>)}
          </div>
          {cart.length > 0 && <div className="cart-footer"><div className="cart-total"><span>Order total</span><strong>{formatPrice(cartTotal)}</strong></div><a className="button button-primary" href={whatsappLink(makeOrderMessage())} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Order via WhatsApp</a><p className="cart-note">Your order details and total will be included. Free home delivery is shown for orders of Rs. 300/- or more; confirm availability with the cafe.</p></div>}
        </aside>
      </div>}

      {activeGallery && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Image preview: ${activeGallery.label}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxIndex(null); }} onTouchStart={(event: TouchEvent<HTMLDivElement>) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event: TouchEvent<HTMLDivElement>) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        if (start !== null && end !== undefined && Math.abs(end - start) > 45) {
          setLightboxIndex((current) => current === null ? null : (current + (end < start ? 1 : -1) + gallery.length) % gallery.length);
        }
        touchStartX.current = null;
      }}>
        <button className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close image"><X size={21} /></button>
        <button className="lightbox-prev" onClick={() => setLightboxIndex((lightboxIndex! - 1 + gallery.length) % gallery.length)} aria-label="Previous image"><ChevronLeft size={23} /></button>
        <img src={activeGallery.src} alt={activeGallery.alt} />
        <button className="lightbox-next" onClick={() => setLightboxIndex((lightboxIndex! + 1) % gallery.length)} aria-label="Next image"><ChevronRight size={23} /></button>
        <span className="lightbox-caption">{activeGallery.label} · {lightboxIndex! + 1} / {gallery.length}</span>
      </div>}
    </div>
  );
}

export default App;
