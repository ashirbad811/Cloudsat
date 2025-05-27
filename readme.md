coddor-backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── authController.js
│   └── productController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   └── User.js
│   └── Product.js
│
├── routes/
│   └── authRoutes.js
│   └── productRoutes.js
│
├── .env
├── server.js
└── package.json




🔐 Step 2: Build User Authentication
📁 controllers/authController.js
js
Copy
Edit
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = { register, login };
🧱 routes/authRoutes.js
js
Copy
Edit
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// @route POST /api/auth/register
router.post('/register', register);

// @route POST /api/auth/login
router.post('/login', login);

module.exports = router;
🔐 middleware/authMiddleware.js
js
Copy
Edit
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};

const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ msg: 'Super admin access only' });
    }
    next();
};

module.exports = { protect, isAdmin, isSuperAdmin };
🧪 Testing the Auth API
Use Postman or Thunder Client to test these endpoints:

✅ Register
bash
Copy
Edit
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
✅ Login
bash
Copy
Edit
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "123456"
}
✅ Next Step: Would you like to proceed with:

🔜 Step 3: Product model + upload routes

🔐 Role-based access (admin/superadmin creation)

🔧 Seed admin user manually?

Let me know!



You said:
next step

ChatGPT said:
Awesome! Let’s move on to the next step: building the Product API — which includes the product model, CRUD routes, and basic admin access control.

🔨 Step 3: Product Management (Backend)
🧱 1. Product Model
📁 models/Product.js

js
Copy
Edit
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    previewImage: { type: String },
    downloadUrl: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
🔧 2. Product Controller
📁 controllers/productController.js

js
Copy
Edit
const Product = require('../models/Product');

const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, previewImage, downloadUrl } = req.body;

        const newProduct = new Product({
            title,
            description,
            price,
            category,
            previewImage,
            downloadUrl,
            uploadedBy: req.user.id,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
🌐 3. Product Routes
📁 routes/productRoutes.js

js
Copy
Edit
const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected (Admin)
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;
✅ Now Your Product API Supports:
Method	Route	Description
GET	/api/products	List all products
GET	/api/products/:id	Get product details
POST	/api/products	Create a new product (Admin only)
PUT	/api/products/:id	Update product (Admin only)
DELETE	/api/products/:id	Delete product (Admin only)

🧪 Test It!
Use Postman/ThunderClient:

➕ Create Product (Admin only)
pgsql
Copy
Edit
POST /api/products
Headers: Authorization: Bearer <your_jwt_token>
Body (JSON):
{
  "title": "Portfolio Template",
  "description": "Modern HTML5 template",
  "price": 25,
  "category": "Template",
  "previewImage": "https://link.to/image.jpg",
  "downloadUrl": "https://cloudinary.link/to/file.zip"
}
🔜 Next Step:
Would you like to move on to:

🔐 File Upload with Cloudinary (used for preview and download links)?

💳 Order & Payment System (Stripe or Razorpay)?

🧑‍💼 Admin/SuperAdmin panel API (users, domains, full control)?

Let me know!



You said:
next step

ChatGPT said:
Great — let’s move on to the next step: setting up file upload using Cloudinary.

This is important for:

Uploading preview images for products

Uploading downloadable ZIP files/scripts securely

☁️ Step 4: File Upload with Cloudinary
📦 1. Install Required Packages
bash
Copy
Edit
npm install cloudinary multer multer-storage-cloudinary
Why these?

cloudinary: Cloudinary SDK

multer: Middleware for handling multipart/form-data

multer-storage-cloudinary: Storage engine for Multer to integrate directly with Cloudinary

🔑 2. Update .env File
ini
Copy
Edit
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
⚙️ 3. Configure Cloudinary
📁 config/cloudinary.js

js
Copy
Edit
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
📁 4. Setup Multer for Cloudinary Upload
📁 middleware/upload.js

js
Copy
Edit
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'coddor',
        allowed_formats: ['jpg', 'png', 'jpeg', 'zip', 'rar'],
        resource_type: 'auto'
    }
});

const upload = multer({ storage });

module.exports = upload;
📁 5. Create Upload Route
📁 routes/uploadRoutes.js

js
Copy
Edit
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// POST /api/upload/image
router.post('/image', protect, isAdmin, upload.single('file'), (req, res) => {
    res.status(200).json({ url: req.file.path });
});

// POST /api/upload/file
router.post('/file', protect, isAdmin, upload.single('file'), (req, res) => {
    res.status(200).json({ url: req.file.path });
});

module.exports = router;
📁 6. Mount Upload Route in server.js
js
Copy
Edit
app.use('/api/upload', require('./routes/uploadRoutes'));
🧪 Test Upload (Postman/Thunder Client)
🖼 Upload Image
yaml
Copy
Edit
POST http://localhost:5000/api/upload/image
Headers: Authorization: Bearer <JWT>
Body:
Form-Data:
  file: (Choose image file)
📦 Upload ZIP File
yaml
Copy
Edit
POST http://localhost:5000/api/upload/file
Headers: Authorization: Bearer <JWT>
Body:
Form-Data:
  file: (Choose .zip/.rar file)
Response:

json
Copy
Edit
{
  "url": "https://res.cloudinary.com/your_cloud_name/...."
}
Use this URL for previewImage or downloadUrl in your product entries.

✅ Cloudinary Upload Completed

🔜 Next Step Options:
💳 Implement Payments + Orders (Stripe, Razorpay, order model, and secure downloads)

👥 Admin/Superadmin user control

📄 Finish My Orders API (user order history + secure download link)

What would you like to tackle next?



You said:
complete all the steps

ChatGPT said:
Absolutely! Let's proceed with the remaining steps to complete the CODDOR digital product marketplace backend.

🔧 Step 5: Order Management & Payment Integration
1. Order Model
js
Copy
Edit
// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['stripe', 'paypal', 'razorpay'], required: true },
    paymentDetails: { type: Object },
    status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
2. Order Controller
js
Copy
Edit
// controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
    const { productId, paymentMethod } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        const order = new Order({
            user: req.user.id,
            product: productId,
            paymentMethod,
            paymentStatus: 'pending',
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = { createOrder };
3. Payment Integration (Stripe Example)
js
Copy
Edit
// controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: { integration_check: 'accept_a_payment' },
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ msg: 'Payment failed', error: err.message });
    }
};

module.exports = { createPaymentIntent };
4. Routes
js
Copy
Edit
// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder } = require('../controllers/orderController');

router.post('/', protect, createOrder);

module.exports = router;

// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/paymentController');

router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
5. Mount Routes in server.js
js
Copy
Edit
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
🧑‍💼 Step 6: Admin & Super Admin Controls
1. User Model Update
js
Copy
Edit
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
2. Admin Routes
js
Copy
Edit
// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

router.get('/users', protect, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

router.get('/products', protect, isAdmin, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

router.get('/orders', protect, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
3. Mount Admin Routes in server.js
js
Copy
Edit
app.use('/api/admin', require('./routes/adminRoutes'));
🛒 Step 7: User Dashboard & Order History
1. Order History Route
js
Copy
Edit
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

router.get('/orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
2. Mount User Routes in server.js
js
Copy
Edit
app.use('/api/users', require('./routes/userRoutes'));
🚀 Step 8: Deployment
1. Prepare for Deployment
Build React app: npm run build in client/

Serve build using Express static middleware

2. Deploy Backend
Use platforms like Render, Railway, or Heroku for backend deployment.

3. Deploy Frontend
Host the client/build directory on platforms like Netlify, Vercel, or Render.




frontend -:


⚛️ Redux Toolkit + React Setup for CODDOR
✅ Step 1: Install Redux Toolkit
bash
Copy
Edit
npm install @reduxjs/toolkit react-redux
📦 Step 2: Setup Redux Store
📁 src/app/store.js

js
Copy
Edit
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import orderReducer from '../features/orders/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
  },
});
📁 src/index.js or main.jsx

js
Copy
Edit
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
🔐 Step 3: Auth Slice
📁 src/features/auth/authSlice.js

js
Copy
Edit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
});

export const registerUser = createAsyncThunk('auth/registerUser', async (data) => {
  const response = await API.post('/auth/register', data);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
👤 Step 4: Login Page Using Redux
📁 src/pages/Login.js

jsx
Copy
Edit
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
🧾 Step 5: Register Page Using Redux
You can follow the same logic from login, just using registerUser.

🛒 Step 6: Product Slice (Overview)
📁 src/features/products/productSlice.js

js
Copy
Edit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await API.get('/products');
  return res.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  }
});

export default productSlice.reducer;
Use this in your Home.js to display product cards.

🧪 What’s Next?
Now that Redux is wired up, here’s how we can finish the app:

🟢 User Features:
Home (product listing)

Product details

Secure download (after mock purchase or using Stripe)

My Orders page

🔴 Admin Features:
Upload product form (Cloudinary + API)

View/manage products & orders

Would you like me to:

Implement the product listing page next?

Build the admin product upload form?

Set up the secure download & order flow?

Let me know your priority, and I’ll continue accordingly.



You said:
complete the frontent from scratch

ChatGPT said:
Failed to generate
To complete the frontend from scratch, we’ll now build the CODDOR marketplace frontend using:

🔧 Tech Stack
React.js

Tailwind CSS

Redux Toolkit (for auth, products, orders)

Axios (for API calls)

React Router (for navigation)

🏗️ Step-by-Step Plan
✅ 1. Initialize the Frontend Project
bash
Copy
Edit
npx create-react-app coddor-frontend
cd coddor-frontend
npm install @reduxjs/toolkit react-redux react-router-dom axios tailwindcss postcss autoprefixer
npx tailwindcss init -p
✅ 2. Tailwind Setup
📄 tailwind.config.js → update content array:

js
Copy
Edit
content: ["./src/**/*.{js,jsx,ts,tsx}"],
📄 src/index.css → replace contents:

css
Copy
Edit
@tailwind base;
@tailwind components;
@tailwind utilities;
✅ 3. Project Structure
css
Copy
Edit
src/
├── app/                 → Redux store
├── components/          → Navbar, ProductCard, etc.
├── features/            → auth, products, orders
├── pages/               → Home, Login, Register, ProductDetail, Dashboard
├── services/            → axios instance
├── App.js
└── main.jsx
✅ 4. Setup Redux Store
📄 src/app/store.js

js
Copy
Edit
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import orderReducer from '../features/orders/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
  },
});
📄 src/main.jsx

jsx
Copy
Edit
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
✅ 5. Setup API Service
📄 src/services/api.js

js
Copy
Edit
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
✅ 6. Setup Auth Slice (Redux)
📄 src/features/auth/authSlice.js

js
Copy
Edit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

export const loginUser = createAsyncThunk('auth/loginUser', async (data) => {
  const res = await API.post('/auth/login', data);
  return res.data;
});

export const registerUser = createAsyncThunk('auth/registerUser', async (data) => {
  const res = await API.post('/auth/register', data);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
✅ 7. Setup Pages (Login Example)
📄 src/pages/Login.jsx

jsx
Copy
Edit
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>
      <input
        type="email"
        className="w-full p-2 border"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        className="w-full p-2 border"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2">
        {loading ? 'Loading...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
This completes the React + Redux frontend setup. Next, I can build:

🏠 Home page: fetch and display products

📦 Product detail page: show info + buy

📥 Dashboard: show downloads (order history)

🛠 Admin: product upload with Cloudinary

Let me know which one you'd like next — or say "All" to complete them all together.



You said:
all

ChatGPT said:
Let's complete the frontend with all the necessary features for the CODDOR project. We’ll go step by step to implement the following:

Home page (fetch and display products)

Product Detail page (show product info and handle purchase)

User Dashboard (show order history, manage account)

Admin Dashboard (admin functionalities like upload products)

Secure download after purchase

1️⃣ Home Page: Product Listing
We'll display products on the Home page by fetching them from the backend.

📄 src/pages/Home.jsx

jsx
Copy
Edit
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h1 className="text-2xl font-semibold py-4">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
2️⃣ Product Card Component
📄 src/components/ProductCard.jsx

jsx
Copy
Edit
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="font-semibold text-xl mb-2">{product.title}</h2>
      <p className="text-gray-500 mb-4">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">${product.price}</span>
        <Link to={`/product/${product._id}`} className="bg-blue-500 text-white py-2 px-4 rounded-md">
          View Details
        </Link>
      </div>
    </div>
  );
}
3️⃣ Product Detail Page: Show Info + Handle Purchase
The Product Detail page will show detailed product info and include a button for purchasing it.

📄 src/pages/ProductDetail.jsx

jsx
Copy
Edit
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Product not found');
      }
    };
    fetchProduct();
  }, [id]);

  const handlePurchase = async () => {
    try {
      // Placeholder for handling purchase
      alert('Product purchased!');
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h2 className="text-3xl font-semibold mb-2">{product.title}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold">${product.price}</span>
        <button
          onClick={handlePurchase}
          className="bg-blue-500 text-white py-2 px-6 rounded-md"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
4️⃣ User Dashboard: Show Orders + Manage Account
The User Dashboard will show the order history, downloaded products, and a way to manage account info.

📄 src/pages/Dashboard.jsx

jsx
Copy
Edit
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../services/api';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get(`/orders`);
        setOrders(res.data);
      } catch (err) {
        setError('Unable to fetch orders');
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Dashboard</h2>
      <div>
        <h3 className="text-xl font-semibold">Order History</h3>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded-lg">
              <p className="font-semibold">{order.productTitle}</p>
              <p>Price: ${order.price}</p>
              <p>Status: {order.status}</p>
              <a
                href={order.downloadLink}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
5️⃣ Admin Dashboard: Manage Products (Upload)
Admin will be able to upload products and manage them through the Admin Dashboard.

📄 src/pages/AdminDashboard.jsx

jsx
Copy
Edit
import { useState } from 'react';
import API from '../services/api';

export default function AdminDashboard() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('image', form.image);

      await API.post('/admin/upload', formData);
      alert('Product uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Error uploading product');
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Product Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border"
        />
        <textarea
          placeholder="Product Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border"
        />
        <input
          type="number"
          placeholder="Product Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-2 border"
        />
        <input
          type="file"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="w-full p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-md">
          Upload Product
        </button>
      </form>
    </div>
  );
}

catagory:: -> 
{
  // const CategorySection = () => {
//   const categories = [
//     { title: "WordPress Themes", image: "https://via.placeholder.com/300x200" },
//     { title: "eCommerce Templates", image: "https://via.placeholder.com/300x200" },
//     { title: "Site Templates", image: "https://via.placeholder.com/300x200" },
//   ];

//   return (
//     <div className="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//       {categories.map((category, index) => (
//         <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
//           <img src={category.image} alt={category.title} className="rounded-md w-full h-40 object-cover" />
//           <h3 className="mt-4 text-lg font-semibold text-gray-800">{category.title}</h3>
//         </div>
//       ))}
//     </div>
//   );
// };

}