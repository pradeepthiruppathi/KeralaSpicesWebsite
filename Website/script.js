const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const sizeOptions = document.getElementById('size-options');
const closeBtn = document.querySelector('.close');
const productList = document.getElementById('product-list');
const pagination = document.getElementById('pagination');
const productsPerPage = 28;
let allProducts = [];
let currentPage = 1;

// Fetch product data
fetch('Product.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    renderPage(currentPage);
    renderPagination();
  });

function renderPage(page) {
  productList.innerHTML = '';
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const products = allProducts.slice(start, end);

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const name = product['Item'];

    const img = document.createElement('img');
    img.src = `images/${product.image}`;
    img.alt = name;

    const title = document.createElement('h3');
    title.textContent = name;

    const buyBtn = document.createElement('button');
    buyBtn.textContent = "Buy Now";
    buyBtn.className = 'buy-now-btn';
    buyBtn.onclick = () => openModal(product);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(buyBtn);
    productList.appendChild(card);
  });
}

function renderPagination() {
  pagination.innerHTML = '';
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => {
      currentPage = i;
      renderPage(currentPage);
      renderPagination();
    };
    pagination.appendChild(btn);
  }
}

function openModal(product) {
  modal.style.display = 'flex';
  modalTitle.textContent = product['Item'];
  sizeOptions.innerHTML = '';

  Object.entries(product).forEach(([key, value]) => {
    if (!isNaN(value) && key !== 'S.No' && key !== 'Item') {
      const btn = document.createElement('button');
      btn.className = 'size-button';
      btn.textContent = `${key} - ₹${value}`;
      btn.onclick = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ name: product['Item'], size: key, price: value });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product['Item']} (${key}) added to cart!`);
        modal.style.display = 'none';
      };
      sizeOptions.appendChild(btn);
    }
  });
}

closeBtn.onclick = () => {
  modal.style.display = 'none';
};

// Loader
window.onload = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 1000);
    }, 1500);
  }
};
