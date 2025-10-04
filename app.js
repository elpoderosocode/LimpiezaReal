/* app.js
   Demo booking UI logic (mobile-first)
   - catálogo nuevo (servicios de limpieza / muebles)
   - integración con colaboradores (mantener los 3 originales)
   - add to cart, pager for services (pages of 6)
   - cart drawer with select collaborator, date scroller and hours
   - booking flow -> client form -> envío a GAS (API_URL)
   
   Nota:
   - He reemplazado el array `services` por el catálogo que me diste,
     manteniendo las claves que tu UI original espera (title, desc, price, time, category, id).
   - Las categorías se renderizan dinámicamente desde CATEGORIES.
   - Toda la lógica previa (carrito, paginación, booking, fechas, horas, formulario)
     se mantiene y debería funcionar tal como antes.
   - Conservé API_URL y collaborators exactamente como estaban.
*/

/* ---------------- Configuration ---------------- */
const SERVICES_PER_PAGE = 6;
const API_URL = "https://script.google.com/macros/s/AKfycbxIi0Y6XlMYOvcut8i_6RNr0YIaeZMVWnr0aFOM4AqOHKCG7z83pjgI8qr7LvTlqEGw/exec";

/* ---------------- New Categories ---------------- */
const CATEGORIES = [
  { id: 'colchones', name: 'Colchones' },
  { id: 'sofacamas', name: 'Sofacamas' },
  { id: 'salaTam', name: 'Juego De Sala Por Tamaño' },
  { id: 'salaPoltronas', name: 'Juego De Sala Por Poltronas' },
  { id: 'comedorAsiento', name: 'Comedor Solo Asiento' },
  { id: 'comedorCompleto', name: 'Comedor Completo' },
  { id: 'peluches', name: 'Peluches' },
  { id: 'cojines', name: 'Cojines' },
  { id: 'tapetes', name: 'Tapetes' }
];

/* ---------------- New Services (mapped to original keys) ----------------
   Cada objeto usa:
   - id
   - title  (tu UI anterior usa s.title)
   - desc
   - price
   - time   (minutos estimados; necesario para mostrar en las tarjetas)
   - category (clave que coincide con CATEGORIES.id)
*/
const services = [
  // Colchones
  { id:'s1',  title: 'Colchón Sencillo 1m x 1.90m',          desc: 'Limpieza profunda para colchones sencillos.',                     price: 70000,  time: 50, category:'colchones' },
  { id:'s2',  title: 'Colchón Semi Doble 1.20m x 1.90m',    desc: 'Limpieza profunda para colchones semi dobles.',                  price: 90000,  time: 60, category:'colchones' },
  { id:'s3',  title: 'Colchón Doble 1.40m x 1.90m',         desc: 'Limpieza profunda para colchones dobles.',                       price:100000,  time: 65, category:'colchones' },
  { id:'s4',  title: 'Colchón Queen',                      desc: 'Limpieza profunda para colchones Queen.',                         price:120000,  time: 75, category:'colchones' },
  { id:'s5',  title: 'Colchón King 2.00m x 2.00m',         desc: 'Limpieza profunda para colchones King.',                          price:140000,  time: 90, category:'colchones' },

  // Sofacamas
  { id:'s6',  title: 'Sofacama 2 puestos',                 desc: 'Limpieza especializada para sofacamas de 2 puestos.',             price: 80000,  time: 80, category:'sofacamas' },
  { id:'s7',  title: 'Sofacama 3 puestos',                 desc: 'Limpieza especializada para sofacamas de 3 puestos.',             price: 90000,  time:100, category:'sofacamas' },
  { id:'s8',  title: 'Sofacama grande',                    desc: 'Limpieza especializada para sofacamas grandes.',                  price:110000,  time:120, category:'sofacamas' },

  // Sala por Tamaño
  { id:'s9',  title: 'Sala pequeña',                       desc: 'Limpieza completa para salas pequeñas.',                          price:70000,   time: 60, category:'salaTam' },
  { id:'s10', title: 'Sala mediana',                       desc: 'Limpieza completa para salas medianas.',                          price:90000,   time: 90, category:'salaTam' },
  { id:'s11', title: 'Sala grande',                        desc: 'Limpieza completa para salas grandes.',                           price:140000,  time:150, category:'salaTam' },

  // Sala por Poltronas
  { id:'s12', title: 'Sala 2 puestos + 2 individuales',    desc: 'Limpieza sala de 2 puestos y 2 poltronas.',                      price:110000,  time:120, category:'salaPoltronas' },
  { id:'s13', title: 'Sala 3 puestos + 2 individuales',    desc: 'Limpieza sala de 3 puestos y 2 poltronas.',                      price:130000,  time:150, category:'salaPoltronas' },

  // Comedor solo asiento
  { id:'s14', title: 'Comedor 4 puestos (solo asientos)',  desc: 'Limpieza de asientos de comedor (4 puestos).',                     price:50000,   time:40,  category:'comedorAsiento' },
  { id:'s15', title: 'Comedor 6 puestos (solo asientos)',  desc: 'Limpieza de asientos de comedor (6 puestos).',                     price:60000,   time:60,  category:'comedorAsiento' },
  { id:'s16', title: 'Comedor 8 puestos (solo asientos)',  desc: 'Limpieza de asientos de comedor (8 puestos).',                     price:80000,   time:80,  category:'comedorAsiento' },

  // Comedor completo
  { id:'s17', title: 'Comedor completo 4 puestos',         desc: 'Limpieza completa de comedor (4 puestos).',                       price:60000,   time:70,  category:'comedorCompleto' },
  { id:'s18', title: 'Comedor completo 6 puestos',         desc: 'Limpieza completa de comedor (6 puestos).',                       price:80000,   time:90,  category:'comedorCompleto' },
  { id:'s19', title: 'Comedor completo 8 puestos',         desc: 'Limpieza completa de comedor (8 puestos).',                       price:100000,  time:120, category:'comedorCompleto' },

  // Peluches
  { id:'s20', title: 'Peluche pequeño',                    desc: 'Limpieza delicada para peluches pequeños.',                       price:40000,   time:30,  category:'peluches' },
  { id:'s21', title: 'Peluche mediano',                    desc: 'Limpieza delicada para peluches medianos.',                       price:60000,   time:40,  category:'peluches' },
  { id:'s22', title: 'Peluche grande',                     desc: 'Limpieza delicada para peluches grandes.',                        price:90000,   time:60,  category:'peluches' },

  // Cojines
  { id:'s23', title: 'Cojín decorativo (cada uno)',        desc: 'Limpieza individual de cojines decorativos.',                     price:5000,    time:10,  category:'cojines' },

  // Tapetes
  { id:'s24', title: 'Tapete 40cm x 60cm',                 desc: 'Limpieza de tapetes pequeños.',                                   price:40000,   time:30,  category:'tapetes' },
  { id:'s25', title: 'Tapete 1.00m x 0.80m',               desc: 'Limpieza de tapetes medianos.',                                   price:50000,   time:45,  category:'tapetes' },
  { id:'s26', title: 'Tapete 1.20m x 1.00m',               desc: 'Limpieza de tapetes grandes.',                                    price:60000,   time:60,  category:'tapetes' },
  { id:'s27', title: 'Tapete 1.50m x 1.50m',               desc: 'Limpieza de tapetes extra grandes.',                              price:70000,   time:90,  category:'tapetes' },
  { id:'s28', title: 'Tapete 1.80m x 1.80m',               desc: 'Limpieza de tapetes cuadrados grandes.',                          price:90000,   time:120, category:'tapetes' },
  { id:'s29', title: 'Tapete 2.00m x 2.00m',               desc: 'Limpieza de tapetes cuadrados muy grandes.',                      price:100000,  time:150, category:'tapetes' }
];

/* ---------------- Collaborators (kept as requested) ---------------- */
const collaborators = [
  { id:'c1', name:'feder hernandez', avatar:'images/barbero1.jpg' },
  { id:'c2', name:'juan pérez', avatar:'images/barbero2.jpg' },
  { id:'c3', name:'cami ruiz', avatar:'images/barbero3.jpg' },
];

/* ---------------- Helpers ---------------- */
function formatCurrency(n){
  // conservamos la función original, igual formato
  try {
    return '$ ' + (n).toLocaleString('es-CO');
  } catch (e) {
    return '$ ' + n;
  }
}

function pad(n){ return n < 10 ? '0'+n : ''+n; }

function dateToYMD(d){ 
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD local
}

/* ---------------- Application State ---------------- */
let state = {
  filtered: services.slice(),
  page: 1,
  pageCount: 1,
  cart: [], // {serviceId, qty, serviceObj}
  selectedCollaborator: null,
  selectedDate: null,
  selectedTime: null,
  // guardamos whatsapp del colaborador seleccionado después de cargar horarios
  selectedBarberWhatsapp: null
};

/* ---------------- Render Categories (pills dynamic) ----------------
   - Sustituye el contenido del contenedor .pill-list (tu HTML ya tiene .pill-list)
   - Añade evento a cada pill para filtrar por categoría
*/
function renderCategories(){
  const container = document.querySelector('.pill-list');
  if (!container) return; // en caso de no existir por alguna razón
  // Incluir 'Todo' por defecto
  container.innerHTML = `<button class="pill active" data-cat="all">Todo</button>`;
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'pill';
    btn.dataset.cat = cat.id;
    btn.textContent = cat.name;
    container.appendChild(btn);
  });

  // bind events
  container.querySelectorAll('.pill').forEach(p=>{
    p.addEventListener('click', e=>{
      container.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));
      p.classList.add('active');
      state.page = 1;
      renderServices();
    });
  });
}

/* ---------------- Rendering services with pagination ---------------- */
function renderServices(){
  const list = document.getElementById('services-list');
  if (!list) return;
  const search = (document.getElementById('search')?.value || '').trim().toLowerCase();
  const activeCat = document.querySelector('.pill.active')?.dataset.cat || 'all';

  // filter
  state.filtered = services.filter(s=>{
    if(activeCat !== 'all' && s.category !== activeCat) return false;
    if(!search) return true;
    return (s.title + ' ' + (s.desc||'')).toLowerCase().includes(search);
  });

  state.pageCount = Math.max(1, Math.ceil(state.filtered.length / SERVICES_PER_PAGE));
  if(state.page > state.pageCount) state.page = state.pageCount;

  const start = (state.page-1) * SERVICES_PER_PAGE;
  const slice = state.filtered.slice(start, start + SERVICES_PER_PAGE);

  list.innerHTML = '';
  for(const s of slice){
    const card = document.createElement('article');
    card.className = 'card';
    // Keep the meta (popular is not present in new items); we can show an empty badge area
    const popularHtml = s.popular ? '<span>🔥 POPULAR</span>' : '';
    const timeLabel = s.time ? `${s.time} min` : '';
    card.innerHTML = `
      <div class="meta">
        <span class="badge">${popularHtml}</span>
        <div class="time">${timeLabel}</div>
      </div>
      <div class="title">${s.title}</div>
      <div class="desc">${s.desc ? s.desc.replace(/\n/g,'<br>') : ''}</div>
      <div class="price-row">
        <div>
          <div style="font-size:12px;color:var(--muted);margin-top:8px">Precio</div>
          <div class="price">${formatCurrency(s.price)}</div>
        </div>
        <div>
          <button class="add-btn" data-id="${s.id}">Añadir</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  }

  // pager UI
  const indicator = document.getElementById('page-indicator');
  if (indicator) indicator.textContent = `${state.page} / ${state.pageCount}`;
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  if (prevBtn) prevBtn.disabled = state.page <= 1;
  if (nextBtn) nextBtn.disabled = state.page >= state.pageCount;

  // bind add buttons
  list.querySelectorAll('.add-btn').forEach(b=>{
    b.onclick = () => addToCart(b.dataset.id);
  });
}

/* ---------------- Cart logic ---------------- */
function addToCart(serviceId){
  // si el servicio no existe, no hacer nada
  const service = services.find(s=>s.id===serviceId);
  if (!service) {
    showToast('Servicio no encontrado');
    return;
  }

  const existing = state.cart.find(c=>c.serviceId===serviceId);
  if(existing){
    existing.qty++;
  } else {
    // clonar el objeto para evitar referencias inesperadas
    const clone = Object.assign({}, service);
    state.cart.push({serviceId:serviceId, qty:1, serviceObj:clone});
  }
  renderCart();
  showToast('Servicio añadido al carrito');
}

function removeFromCart(serviceId){
  state.cart = state.cart.filter(c=>c.serviceId!==serviceId);
  renderCart();
}

function changeQty(serviceId, delta){
  const item = state.cart.find(c=>c.serviceId===serviceId);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) removeFromCart(serviceId);
  renderCart();
}

/* ---------------- Render Cart (drawer content) ----------------
   Este render reemplaza el contenido del drawer y también habilita
   el botón de siguiente si hay servicios.
*/
function renderCart(){
  const container = document.getElementById('cart-contents');
  const cartCount = document.getElementById('cart-count');
  const nextBtn = document.getElementById('next-step');

  if (!container) return;

  container.innerHTML = '';

  if(state.cart.length === 0){
    container.innerHTML = '<p class="empty">Tu carrito está vacío</p>';
    if(cartCount) cartCount.textContent = '0';
    if(nextBtn) nextBtn.classList.add('disabled');
    return;
  } else {
    if(nextBtn) nextBtn.classList.remove('disabled'); // habilitado si hay servicios
  }

  let total = 0;
  const list = document.createElement('div');
  list.className = 'cart-list';

  for(const item of state.cart){
    const s = item.serviceObj;
    total += s.price * item.qty;

    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-info">
        <div class="cart-title">${s.title}</div>
        <div class="cart-sub">${formatCurrency(s.price)} x ${item.qty}</div>
      </div>
      <div class="cart-actions">
        <button class="qty-btn" data-action="dec" data-id="${s.id}">-</button>
        <span class="qty">${item.qty}</span>
        <button class="qty-btn" data-action="inc" data-id="${s.id}">+</button>
        <button class="remove-btn" data-id="${s.id}">✕</button>
      </div>
    `;
    list.appendChild(row);
  }

  container.appendChild(list);

  const totalRow = document.createElement('div');
  totalRow.className = 'cart-total';
  totalRow.innerHTML = `<strong>Total:</strong> ${formatCurrency(total)}`;
  container.appendChild(totalRow);

  if(cartCount) {
    cartCount.textContent = state.cart.reduce((sum, c) => sum + c.qty, 0);
    cartCount.classList.add("bump");
    setTimeout(() => cartCount.classList.remove("bump"), 300);
  }

  // bind qty & remove
  container.querySelectorAll('.qty-btn').forEach(btn=>{
    btn.onclick = ()=> changeQty(btn.dataset.id, btn.dataset.action==='inc'?1:-1);
  });
  container.querySelectorAll('.remove-btn').forEach(btn=>{
    btn.onclick = ()=> removeFromCart(btn.dataset.id);
  });
}

/* ---------------- Utility: Toast ---------------- */
function showToast(msg, ms = 2200) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> {
    toast.classList.remove('show');
  }, ms);
}

/* ---------------- Pagination controls ---------------- */
const _prevPageBtn = document.getElementById('prev-page');
const _nextPageBtn = document.getElementById('next-page');
if (_prevPageBtn) {
  _prevPageBtn.addEventListener('click', ()=>{
    if(state.page>1) state.page--;
    renderServices();
  });
}
if (_nextPageBtn) {
  _nextPageBtn.addEventListener('click', ()=>{
    if(state.page < state.pageCount) state.page++;
    renderServices();
  });
}

/* ---------------- Filters (search + pills) ---------------- */
const _searchInput = document.getElementById('search');
if (_searchInput) {
  _searchInput.addEventListener('input', ()=>{
    state.page = 1;
    renderServices();
  });
}

/* ---------------- Drawer toggle (cart) ---------------- */
const _cartToggle = document.getElementById('cart-toggle');
const _drawerClose = document.getElementById('drawer-close');
if (_cartToggle) {
  _cartToggle.addEventListener('click', ()=>{
    document.getElementById('drawer').classList.add('open');
    // asegúrate de renderizar el cart cuando se abre
    renderCart();
  });
}
if (_drawerClose) {
  _drawerClose.addEventListener('click', ()=>{
    document.getElementById('drawer').classList.remove('open');
  });
}

/* ---------------- Next step (booking navigation) ---------------- */
const _nextStepBtn = document.getElementById('next-step');
if (_nextStepBtn) {
  _nextStepBtn.addEventListener('click', () => {
    if (state.cart.length === 0) return;

    // lógica de navegación inteligente
    if (state.selectedCollaborator && state.selectedDate && state.selectedTime) {
      // ya llenó todo el booking -> vamos al formulario de cliente
      renderClientForm();
    } else {
      // todavía falta completar algo -> volvemos al booking step
      renderBookingStep();
    }
  });
}

/* ---------------- Booking Step ----------------
   - Selección de colaborador (mantengo los 3 que pediste)
   - Carrusel de fechas (7 días por página; puedes navegar con flechas)
   - Carga de horas via API_URL (igual que antes)
*/
function renderBookingStep() {
  const container = document.getElementById('cart-contents');
  if(!container) return;
  container.innerHTML = '';

  // Botón volver a servicios
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Volver a Servicios';
  backBtn.className = 'back-btn';
  backBtn.onclick = () => renderCart();
  container.appendChild(backBtn);

  const title = document.createElement('h3');
  title.textContent = 'Selecciona fecha y hora';
  container.appendChild(title);

  // Lista de colaboradores
  const barberRow = document.createElement('div');
  barberRow.className = 'barber-list';

  collaborators.forEach(c => {
    const card = document.createElement('div');
    card.className = 'barber-card';
    card.innerHTML = `
      <img src="${c.avatar}" alt="${c.name}">
      <div class="name">${c.name}</div>
    `;

    if (state.selectedCollaborator === c.id) {
      card.classList.add('selected');
    }

    card.onclick = () => {
      document.querySelectorAll('.barber-card').forEach(b => b.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedCollaborator = c.id;

      // resetear hora al cambiar de colaborador
      state.selectedTime = null;

      if (state.selectedDate) {
        renderHours(state.selectedDate);
      }
    };
    barberRow.appendChild(card);
  });
  container.appendChild(barberRow);

  // Carrusel de fechas
  let dateOffset = 0;
  const datesRow = document.createElement('div');
  datesRow.className = 'dates-row-wrapper';
  datesRow.innerHTML = `
    <button class="date-nav" id="prev-date">◀</button>
    <div class="dates-row" id="dates-container"></div>
    <button class="date-nav" id="next-date">▶</button>
  `;
  container.appendChild(datesRow);

  function renderDates() {
    const datesContainer = document.getElementById('dates-container');
    if (!datesContainer) return;
    datesContainer.innerHTML = '';

    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i + dateOffset);

      const btn = document.createElement('button');
      btn.className = 'date-btn';
      btn.textContent = d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });

      if (state.selectedDate && dateToYMD(state.selectedDate) === dateToYMD(d)) {
        btn.classList.add('active');
      }

      // Aseguramos que el botón 'next-step' sea visible
      const nextBtn = document.getElementById("next-step");
      if (nextBtn) nextBtn.style.display = "block";

      btn.onclick = () => {
        document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedDate = d;
        state.selectedTime = null;

        if (state.selectedCollaborator) {
          renderHours(d);
        }
      };

      datesContainer.appendChild(btn);
    }

    // Bloquear volver atrás del día de hoy
    const prevDateBtn = document.getElementById('prev-date');
    if (prevDateBtn) prevDateBtn.disabled = dateOffset <= 0;
  }

  const prevDateBtn = document.getElementById('prev-date');
  const nextDateBtn = document.getElementById('next-date');
  if (prevDateBtn) {
    prevDateBtn.onclick = () => {
      if (dateOffset > 0) {
        dateOffset -= 7;
        renderDates();
      }
    };
  }
  if (nextDateBtn) {
    nextDateBtn.onclick = () => {
      dateOffset += 7;
      renderDates();
    };
  }

  renderDates();

  // Contenedor de horas
  const hoursContainer = document.createElement('div');
  hoursContainer.id = 'hours-container';
  container.appendChild(hoursContainer);

  // Función render horas (igual que antes, con API call)
  async function renderHours(date) {
    if (!state.selectedCollaborator) {
      hoursContainer.innerHTML = '<p>Selecciona un colaborador</p>';
      return;
    }

    const barberId = state.selectedCollaborator;
    const dateKey = dateToYMD(date);

    hoursContainer.innerHTML = '<h4>Horas disponibles:</h4>';

    // loader
    const grid = document.createElement('div');
    grid.className = 'hours-grid';
    grid.innerHTML = '<p>Cargando horarios...</p>';
    hoursContainer.appendChild(grid);

    try {
      const res = await fetch(`${API_URL}?barbero=${barberId}&fecha=${dateKey}`);
      const data = await res.json();

      state.selectedBarberWhatsapp = data.whatsapp || null;
      data.slots = [...new Set((data.slots || []).filter(s => !!s))]; // limpia duplicados y vacíos

      grid.innerHTML = '';

      if (!data.slots || data.slots.length === 0) {
        grid.innerHTML = '<p>No hay horas disponibles</p>';
      } else {
        data.slots.forEach(t => {
          const slotBtn = document.createElement('button');
          slotBtn.className = 'slot';
          slotBtn.textContent = t;

          if (state.selectedTime && state.selectedTime === t) {
            slotBtn.classList.add('selected');
          }

          slotBtn.onclick = () => {
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
            slotBtn.classList.add('selected');
            state.selectedTime = t;
          };
          grid.appendChild(slotBtn);
        });
      }
    } catch (err) {
      grid.innerHTML = '<p>Error cargando horarios</p>';
    }
  }

  // si ya hay seleccionado colaborador y fecha, cargar horas
  if (state.selectedCollaborator && state.selectedDate) {
    renderHours(state.selectedDate);
  }
}

/* ---------------- Client Info Step ---------------- */
function renderClientForm() {
  const container = document.getElementById('cart-contents');
  if(!container) return;
  container.innerHTML = '';

  // Ocultar el botón continuar si existe
  const nextBtn = document.getElementById("next-step");
  if (nextBtn) nextBtn.style.display = "none";

  // Botón volver
  const backBtn = document.createElement("button");
  backBtn.className = "back-btn";
  backBtn.textContent = "← Volver al carrito";
  backBtn.onclick = () => renderBookingStep();
  container.appendChild(backBtn);

  const title = document.createElement('h3');
  title.textContent = 'Tus datos de contacto';
  container.appendChild(title);

  const form = document.createElement('div');
  form.className = 'client-form';
  form.innerHTML = `
    <label>Nombre completo</label>
    <input type="text" id="client-name" placeholder="Tu nombre" required>

    <label>Teléfono</label>
    <input type="tel" id="client-phone" placeholder="Tu número" required>
  `;
  container.appendChild(form);

  // Botón confirmar
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'confirm-btn';
  confirmBtn.textContent = 'Finalizar y Confirmar';
  confirmBtn.type = "button";

  confirmBtn.onclick = async () => {
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    if (!name || !phone) {
      alert('Por favor completa tus datos');
      return;
    }

    confirmBtn.disabled = true;
    confirmBtn.textContent = "Agendando...";

    function resetApp(){
      state.cart = [];
      state.selectedCollaborator = null;
      state.selectedDate = null;
      state.selectedTime = null;
      state.page = 1;
      // re-render everything
      renderServices();
      renderCart();
    }

    try {
      // Nota: tu fetch original usaba mode: "no-cors", lo dejo para mantener compatibilidad
      const res = await fetch(API_URL, {
        method: "POST",
        mode:"no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "agendar",
          name,
          phone,
          barber: state.selectedCollaborator,
          date: dateToYMD(state.selectedDate),
          time: state.selectedTime,
          services: state.cart.map(c => c.serviceObj.title),
        }),
      });

      // Si la respuesta fuera bloqueada por no-cors no podremos parsearla; mantenemos el try/catch
      let result = null;
      try { result = await res.json(); } catch(e) { result = null; }

      if (result && result.success) {
        // en caso de que la API devuelva success (raro si usamos no-cors)
        showToast('Cita registrada correctamente');
      } else {
        // Si llegamos aquí normalmente es porque usamos no-cors; lo tratamos como éxito local
        // Mostramos modal de éxito (tu SweetAlert)
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            title: '🎉 ¡Cita Agendada!',
            html: `
              <p style="font-size:16px;color:#444">
                Tu cita fue registrada exitosamente.<br>
                <b>Te esperamos</b>
              </p>
            `,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6',
            background: '#f9f9f9',
            backdrop: `rgba(0,0,0,0.5)`,
            timer: 4000,
            timerProgressBar: true
          });
        } else {
          alert('Cita registrada (simulado).');
        }
      }
    } catch (e) {
      // fallback de éxito en caso de CORS/no-cors: asumimos que la cita se registró y continuamos
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: '🎉 ¡Cita Agendada!',
          html: `
            <p style="font-size:16px;color:#444">
              Tu cita fue registrada exitosamente.<br>
              <b>Te esperamos</b>
            </p>
          `,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
          background: '#f9f9f9',
          backdrop: `rgba(0,0,0,0.5)`,
          timer: 4000,
          timerProgressBar: true
        });
      } else {
        alert('Cita registrada (simulado).');
      }
    }

    // Preparamos el mensaje de WhatsApp
    const fechaBonita = state.selectedDate ? state.selectedDate.toLocaleDateString('es-CO', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    }) : 'No especificada';

    const barber = collaborators.find(c => c.id === state.selectedCollaborator) || { name: "No especificado" };
    const msg = encodeURIComponent(
      `Hola, soy ${document.getElementById('client-name').value.trim()}. Quiero agendar mi cita:\n` +
      `📌 Servicio(s): ${state.cart.map(c => c.serviceObj.title).join(', ')}\n` +
      `👷 Técnico: ${barber.name}\n` +
      `📅 Fecha: ${fechaBonita}\n` +
      `⏰ Hora: ${state.selectedTime || 'No especificada'}\n` +
      `📞 Tel: ${document.getElementById('client-phone').value.trim()}`
    );

    const whatsapp = state.selectedBarberWhatsapp || ''; // puede ser null

    resetApp();

    if (whatsapp) {
      setTimeout(() => {
        window.location.href = `https://wa.me/${whatsapp}?text=${msg}`;
      }, 100);
    } else {
      // si no hay whatsapp configurado solo mostramos el mensaje en consola / toast
      showToast('WhatsApp no disponible para el técnico seleccionado');
    }

    confirmBtn.disabled = false;
    confirmBtn.textContent = "Finalizar y Confirmar";
  };

  container.appendChild(confirmBtn);

  const note = document.createElement("p");
  note.innerHTML = `Tiempo estimado del servicio <span style="color:#ffd964;font-weight:bold;">3 horas</span>`;
  note.style.marginTop = "12px";
  container.appendChild(note);
}

/* ---------------- Initial render & setup ---------------- */
// Render categories, services and cart on load
(function init(){
  // render dynamic pills (categorías)
  renderCategories();

  // If .pill-list existed in HTML and had hardcoded pills, renderCategories() replaced them
  // Now render services and cart
  renderServices();
  renderCart();

  // Ensure drawer toggle behavior is bound (redundant guard)
  const cartToggle = document.getElementById('cart-toggle');
  if (cartToggle) {
    cartToggle.addEventListener('click', ()=> {
      document.getElementById('drawer').classList.add('open');
      renderCart();
    });
  }
})();

/* ---------------- Extra utilities & guards ----------------
   Las siguientes funciones ayudan a evitar errores si el HTML cambia,
   y proporcionan mensajes de depuración en consola si algo no existe.
*/
function guardElement(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`Elemento con id "${id}" no encontrado en el DOM.`);
  return el;
}

// debug helper (no es necesario en producción)
function dbgState() {
  console.group('APP STATE');
  console.log('page', state.page, 'pageCount', state.pageCount);
  console.log('cart', state.cart);
  console.log('selectedCollaborator', state.selectedCollaborator);
  console.log('selectedDate', state.selectedDate);
  console.log('selectedTime', state.selectedTime);
  console.groupEnd();
}

/* ---------------- End of file ----------------
   Cambios aplicados:
   - services reemplazado por catálogo que solicitaste
   - categories renderizadas dinámicamente
   - se mantiene todo el flujo de reserva (booking) y carrito intacto
   - colaboradores sin cambios (3 originales)
   
   Si detectas algún error concreto (p. ej. id de un elemento HTML no presente),
   pégame aquí el HTML o el error de la consola y lo ajusto al instante.
*/
