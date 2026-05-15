import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  LogOut, 
  Plus, 
  ChevronLeft, 
  Check, 
  Share2, 
  User as UserIcon,
  ShoppingBag,
  History,
  Grid,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
type Screen = 'splash' | 'login' | 'register' | 'forgotPassword' | 'home' | 'camera' | 'preview' | 'gallery' | 'craftDetail' | 'profile' | 'settings' | 'productDetail';

interface CategoryInfo {
  name: string;
  location: string;
  icon: string;
  color: string;
  text: string;
  image: string;
  history: string;
  importance: string;
  materials: string;
  techniques: string;
  products: string;
}

interface Product {
  id?: string;
  name: string;
  woodType: string;
  price: string;
  description: string;
  imageUrl: string;
  relatedImages?: string[];
  timestamp: number;
  category?: string;
}

// --- Components ---

const Toast = ({ message, type, onClose }: { message: string, type: 'error' | 'success' | 'info', onClose: () => void }) => (
  <motion.div 
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 50, opacity: 0 }}
    className={cn(
      "fixed bottom-24 left-8 right-8 p-4 rounded-2xl shadow-2xl z-[100] flex items-center justify-between",
      type === 'error' ? "bg-red-500 text-white" : "bg-[#3E2723] text-white"
    )}
  >
    <div className="flex items-center gap-3">
      {type === 'error' ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
    <button onClick={onClose} className="p-1 opacity-50 hover:opacity-100">
      <Plus size={18} className="rotate-45" />
    </button>
  </motion.div>
);

const Button = ({ className, children, isLoading, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }) => (
  <button 
    className={cn(
      "bg-[#8D6E63] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3",
      className
    )} 
    {...props}
  >
    {isLoading ? (
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
        />
    ) : children}
  </button>
);

const Input = ({ label, error, ...props }: { label: string, error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="w-full space-y-2">
    <div className="flex justify-between items-center px-1">
        <label className="text-sm font-medium text-[#3E2723]/60">{label}</label>
        {error && <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">{error}</span>}
    </div>
    <input 
      className={cn(
          "w-full bg-white border-2 rounded-2xl p-4 focus:outline-none transition-all",
          error ? "border-red-500 bg-red-50" : "border-[#8D6E63]/10 focus:border-[#8D6E63]"
      )}
      {...props}
    />
  </div>
);

const DEMO_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Lacware Horse', 
    woodType: 'Channapatna Lacware', 
    price: '1200', 
    description: 'Traditional lacware toy from Channapatna made with ivory wood and natural dyes.', 
    imageUrl: 'https://m.media-amazon.com/images/I/71Y74o-n9uL._AC_UF894,1000_QL80_.jpg', 
    relatedImages: [
      'https://artycraftz.com/cdn/shop/products/IMG_20201017_155606_1024x1024.jpg',
      'https://images.indianexpress.com/2021/04/channapatna-toys.jpg'
    ],
    timestamp: Date.now() 
  },
  { 
    id: '2', 
    name: 'Bidriware Vase', 
    woodType: 'Bidriware (Zinc & Copper)', 
    price: '3500', 
    description: 'Exquisite metal handicraft from Bidar with intricate silver inlay work.', 
    imageUrl: 'https://karnatakatourism.org/wp-content/uploads/2020/06/bidri-work-1.jpg', 
    relatedImages: [
      'https://shilpachakra.in/wp-content/uploads/2021/05/IMG_20210515_181734-scaled.jpg',
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.directcreate.com%2Fnews%2Fwp-content%2Fuploads%2F2017%2F04%2Fbidri.jpg&psig=AOvVaw2-vQ9Y_Y9Z4Q5Y9Z4Q5Y9&ust=1715682977457000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIDQ-v-v-v-vQAAAAAdAAAAABAE'
    ],
    timestamp: Date.now() 
  },
  { 
    id: '3', 
    name: 'Sandalwood Ganesha', 
    woodType: 'SRI Sandalwood', 
    price: '8500', 
    description: 'Fragrant and intricately carved deity statue representing Mysuru heritage.', 
    imageUrl: 'https://shilpakalaacademy.org/wp-content/uploads/2021/01/Sandalwood-Carving.jpg', 
    relatedImages: [
      'https://images.squarespace-cdn.com/content/v1/59df95b3f14aa1c7b1f6d3f2/1531776510360-0K5X5X5X5X5X5X5X5X/Sandalwood+Carving.jpg',
      'https://i.pinimg.com/originals/8a/8d/8a/8a8d8a7c29d0f65c9e6e8e8e8e8e8e8e.jpg'
    ],
    timestamp: Date.now() 
  },
  { 
    id: '4', 
    name: 'Ilkal Silk Saree', 
    woodType: 'Cotton-Silk Blend', 
    price: '4200', 
    description: 'Traditional handloom saree from Ilkal known for its unique Tope Teni pallu.', 
    imageUrl: 'https://karnatakatourism.org/wp-content/uploads/2020/06/ilkal-saree.jpg', 
    relatedImages: [
      'https://www.unnatisilks.com/blog/wp-content/uploads/2016/10/Ilkal-Saree.jpg',
      'https://i.ytimg.com/vi/5q9j8-QpYQU/maxresdefault.jpg'
    ],
    timestamp: Date.now() 
  }
];

const CRAFT_CATEGORIES: CategoryInfo[] = [
  { 
    name: 'Channapatna Toys', 
    location: 'Channapatna, Ramanagara', 
    icon: '🐎', 
    color: 'bg-orange-100', 
    text: 'text-orange-700', 
    image: '',
    history: 'A 200-year-old heritage craft encouraged by Tipu Sultan who invited Persian artisans to teach the locals.',
    importance: 'The toys are safe for children as they use non-toxic vegetable dyes and smooth lacware finish.',
    materials: 'Ivory Wood (Aale Mara), Lacquer, Natural vegetable colors.',
    techniques: 'Hand-turning on a lathe (Khiraadi), finishing with screw-pine leaf.',
    products: 'Spinning tops, math games, rocking horses, dolls.'
  },
  { 
    name: 'Bidriware', 
    location: 'Bidar', 
    icon: '🏺', 
    color: 'bg-zinc-100', 
    text: 'text-zinc-700', 
    image: 'https://karnatakatourism.org/wp-content/uploads/2020/06/bidri-work-1.jpg',
    history: 'Originated in the 14th century during the Bahmani Sultanate, blending Persian and local styles.',
    importance: 'The unique soil of Bidar Fort is used to turn the metal black, creating a stunning contrast with silver.',
    materials: 'Zinc, Copper, Pure Silver wire/sheets.',
    techniques: 'Casting, engraving (Sila), silver inlay (Tarkashi), blackening with Bidar soil.',
    products: 'Vases, bowls, jewelry boxes, hookahs.'
  },
  { 
    name: 'Rosewood Inlay', 
    location: 'Mysuru', 
    icon: '🐘', 
    color: 'bg-stone-100', 
    text: 'text-stone-700', 
    image: 'https://mysticalpalaces.com/wp-content/uploads/2021/04/Rosewood-Inlay-Work-Mysore-1024x683.jpg',
    history: 'Popularized by the Wodeyar kings, these artifacts depict Mysore Dussehra and royal scenery.',
    importance: 'Involves meticulous assembly of multiple wood types to create colorful patterns without paint.',
    materials: 'Rosewood, Ebony, Teak, and colorful wood pieces.',
    techniques: 'Cutting, chiseling, embedding wood pieces into the base surface.',
    products: 'Wall hangings, furniture parts, decorative plates.'
  },
  { 
    name: 'Ilkal Sarees', 
    location: 'Ilkal, Bagalkot', 
    icon: '🧵', 
    color: 'bg-rose-100', 
    text: 'text-rose-700', 
    image: 'https://i.pinimg.com/736x/f6/af/4d/f6af4dac1c695b28d0873be74c3558fe.jpg',
    history: 'Centuries-old handloom tradition, dating back to the 8th century local weaving community.',
    importance: 'Famous for the "Tope Teni" technique where the body and pallu are woven separately and joined.',
    materials: 'Cotton, Silk, Art-silk.',
    techniques: 'Loom-weaving, Tope Teni (pallu-joining), Kasuti embroidery.',
    products: 'Ilkal Sarees, fabrics, traditional drapes.'
  },
  { 
    name: 'Sandalwood Carving', 
    location: 'Mysuru & Sagar', 
    icon: '🪹', 
    color: 'bg-amber-100', 
    text: 'text-amber-700', 
    image: 'https://shilpakalaacademy.org/wp-content/uploads/2021/01/Sandalwood-Carving.jpg',
    history: 'Sandalwood is the state tree of Karnataka; the Gudigar community has practiced this for generations.',
    importance: 'Unique for its fragrance and the extreme detail possible on the soft but sturdy wood.',
    materials: 'Santalum album (Sandalwood).',
    techniques: 'Intricate hand-carving using fine steel tools.',
    products: 'Deity statues, fans, incense holders, boxes.'
  },
  { 
    name: 'Yakshagana Gear', 
    location: 'Coastal Karnataka', 
    icon: '🎭', 
    color: 'bg-red-100', 
    text: 'text-red-700', 
    image: 'https://karnatakatourism.org/wp-content/uploads/2019/05/Yakshagana_Udupi_Tourism.jpg',
    history: 'Yakshagana is a traditional theater form combining mythology, dance, and music.',
    importance: 'The colorful headgear and costumes represent the character\'s class and temperament.',
    materials: 'Wood, mirror work, colored stones, pith (Booruga), gold foil.',
    techniques: 'Bannike (painting), Pagade (headgear making), textile craft.',
    products: 'Kirita (Crowns), Kavacha (Breastplates), ornaments.'
  },
  { 
    name: 'Kinnal Dolls', 
    location: 'Kinnal, Koppal', 
    icon: '🎎', 
    color: 'bg-yellow-100', 
    text: 'text-yellow-700', 
    image: 'https://shilpakalaacademy.org/wp-content/uploads/2021/01/Kinhal-toys.jpg',
    history: 'Handed down from the Vijayanagara Empire artisans who worked on the Hampi temples.',
    importance: 'The paste called "Lajakara" used for bonding is a unique secret formula of the community.',
    materials: 'Pith and tamarind seed paste (Lajakara), light wood.',
    techniques: 'Hand-carving, applying paste, watercolor painting.',
    products: 'Traditional dolls, Gauri-Ganesha idols, religious figures.'
  },
  { 
    name: 'Kasuti Embroidery', 
    location: 'Dharwad', 
    icon: '🪡', 
    color: 'bg-purple-100', 
    text: 'text-purple-700', 
    image: 'https://shilpakalaacademy.org/wp-content/uploads/2021/01/Kasuti-Embroidery.jpg',
    history: 'Originated in the Chalukya period, traditionally practiced by women in North Karnataka.',
    importance: 'It is a tedious form of hand embroidery that looks identical on both sides of the cloth.',
    materials: 'Cotton thread, vibrant silk fabrics.',
    techniques: 'Ganti (knot), Murgi (zigzag), Neygi (running stitch), Menthi (cross stitch).',
    products: 'Embroidered sarees, cushion covers, kurtas.'
  },
  { 
    name: 'Stone Carving', 
    location: 'Shivarapatna', 
    icon: '🗿', 
    color: 'bg-gray-100', 
    text: 'text-gray-700', 
    image: 'https://shilpakalaacademy.org/wp-content/uploads/2021/01/Stone-Carving.jpg',
    history: 'Influenced by the Hoysala and Kadamba architectural styles found in Belur and Halebidu.',
    importance: 'The artisans follow "Shilpa Shastra" (ancient architectural science) for every proportion.',
    materials: 'Soapstone, Black granite.',
    techniques: 'Chiseling, polishing, detailed microscopic carving.',
    products: 'Temple idols, monolithic statues, decorative pillars.'
  },
  { 
    name: 'Bronze Metal Craft', 
    location: 'Udupi & Mangaluru', 
    icon: '🔔', 
    color: 'bg-orange-100', 
    text: 'text-orange-900', 
    image: 'https://shilpakalaacademy.org/wp-content/uploads/2021/01/Metal-Bronze-Craft.jpg',
    history: 'Udupi is center for "Pancha Loha" (Five Metal) casting for temple icons.',
    importance: 'The "Lost Wax" technique used ensures each piece is a unique one-of-a-kind creation.',
    materials: 'Copper, Zinc, Lead, Tin, Silver (Panchaloha).',
    techniques: 'Lost-wax casting (Cire perdue), hammering, fine engraving.',
    products: 'Temple bells, lamps (Deepas), idols, ritual vessels.'
  }
];

const ActionSheet = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (type: 'camera' | 'gallery') => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="relative w-full max-w-[400px] bg-[#F5F5DC] rounded-[2.5rem] p-6 space-y-3 shadow-2xl"
        >
          <div className="w-12 h-1.5 bg-[#8D6E63]/20 rounded-full mx-auto mb-4" />
          <h3 className="text-center font-serif font-bold text-[#3E2723] text-lg mb-4">Choose Creation Source</h3>
          <button 
            onClick={() => onSelect('camera')}
            className="w-full bg-white p-5 rounded-2xl flex items-center gap-4 text-[#3E2723] font-bold active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-[#8D6E63] text-white rounded-xl flex items-center justify-center">
              <Camera size={20} />
            </div>
            <span>Take Photo with Camera</span>
          </button>
          <button 
            onClick={() => onSelect('gallery')}
            className="w-full bg-white p-5 rounded-2xl flex items-center gap-4 text-[#3E2723] font-bold active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-[#8D6E63] text-white rounded-xl flex items-center justify-center">
              <Upload size={20} />
            </div>
            <span>Choose from Gallery</span>
          </button>
          <button 
            onClick={onClose}
            className="w-full p-4 text-[#8D6E63] font-bold text-sm"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function ShilpaKalaApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shilpakala_products');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('shilpakala_products', JSON.stringify(products));
  }, [products]);

  const handleCreateProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    setCurrentScreen('home');
    setToast({ message: 'Masterpiece added to collection!', type: 'success' });
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
    setEditingProduct(null);
    setToast({ message: 'Craft details updated.', type: 'success' });
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteProduct = (id: string) => {
    if (user?.uid === 'guest_user') {
        setToast({ message: "You are not authorized to delete this item.", type: 'error' });
        return;
    }
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
        setProducts(products.filter(p => p.id !== deleteId));
        setDeleteId(null);
        setToast({ message: 'Product removed from collection.', type: 'success' });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.woodType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' | 'info' } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CRAFT_CATEGORIES[0].name);
  const [activeCategory, setActiveCategory] = useState<CategoryInfo | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
            showToast("Unsupported file. Please use JPG, PNG or WEBP.", 'error');
            return;
        }
        
        setSelectedFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setCapturedImage(reader.result as string);
            setCurrentScreen('preview');
            setLoading(false);
            showToast("Image selected successfully!", 'success');
        };
        reader.readAsDataURL(file);
    }
  };

  // Validation Logic
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Navigation & Seeding Logic
  useEffect(() => {
    // Seed default user if none exists
    const existingUsers = JSON.parse(localStorage.getItem('shilpakala_local_users') || '[]');
    if (existingUsers.length === 0) {
        const defaultUser = { 
            uid: 'artisan_001', 
            name: 'Kavya Artisan', 
            email: 'artisan@shilpakala.in', 
            password: 'artisan123' 
        };
        localStorage.setItem('shilpakala_local_users', JSON.stringify([defaultUser]));
    }

    const storedUser = localStorage.getItem('shilpakala_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (currentScreen === 'splash') {
      setTimeout(() => {
        const u = localStorage.getItem('shilpakala_user');
        if (u) setCurrentScreen('home');
        else setCurrentScreen('login');
      }, 2000);
    }
  }, []);

  const handleForgotPassword = () => {
    showToast("Password reset link sent to your registered email!", 'info');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    const errors: Record<string, string> = {};
    if (!email) errors.email = "Requirement";
    else if (!validateEmail(email)) errors.email = "Invalid format";
    if (!password) errors.password = "Requirement";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      triggerShake();
      return;
    }

    setLoading(true);
    setFormErrors({});
    
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('shilpakala_local_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userObj = { uid: foundUser.uid, email: foundUser.email, name: foundUser.name };
        setUser(userObj);
        localStorage.setItem('shilpakala_user', JSON.stringify(userObj));
        showToast(`Welcome back, ${foundUser.name}!`, 'success');
        setCurrentScreen('home');
      } else {
        showToast("Invalid credentials. Please try again.", 'error');
        triggerShake();
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Requirement";
    if (!email) errors.email = "Requirement";
    else if (!validateEmail(email)) errors.email = "Invalid format";
    if (!password) errors.password = "Requirement";
    else if (password.length < 6) errors.password = "Min 6 chars";
    if (password !== confirmPassword) errors.confirmPassword = "Mismatch";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      triggerShake();
      return;
    }

    setLoading(true);
    setFormErrors({});

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('shilpakala_local_users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        showToast("Email already exists locally.", 'error');
        setLoading(false);
        triggerShake();
        return;
      }

      const newUser = { uid: Math.random().toString(36).substr(2, 9), name, email, password };
      users.push(newUser);
      localStorage.setItem('shilpakala_local_users', JSON.stringify(users));
      
      showToast("Account Created! You can now login.", 'success');
      setCurrentScreen('login');
      setLoading(false);
    }, 1000);
  };

  const handleGuestMode = () => {
    const guestUser = { uid: 'guest_user', email: 'guest@shilpakala.demo', name: 'Guest Artisan', isAnonymous: true };
    setUser(guestUser);
    localStorage.setItem('shilpakala_user', JSON.stringify(guestUser));
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('shilpakala_user');
    setCurrentScreen('login');
  };

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<{ show: boolean, nextScreen: Screen | null }>({ show: false, nextScreen: null });

  // Home Dashboard Exit Confirmation simulation
  useEffect(() => {
    const handleBack = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (currentScreen === 'home' || currentScreen === 'login') {
                setShowExitConfirm(true);
            } else if (currentScreen === 'preview') {
                setShowDiscardConfirm({ show: true, nextScreen: 'camera' });
            } else if (currentScreen === 'register' || currentScreen === 'forgotPassword') {
                setCurrentScreen('login');
            } else if (currentScreen === 'camera' || currentScreen === 'gallery' || currentScreen === 'craftDetail' || currentScreen === 'profile' || currentScreen === 'settings') {
                setCurrentScreen('home');
            }
        }
    };
    window.addEventListener('keydown', handleBack);
    return () => window.removeEventListener('keydown', handleBack);
  }, [currentScreen]);

  const confirmDiscard = () => {
    if (showDiscardConfirm.nextScreen) {
        setCapturedImage(null);
        setSelectedFileName(null);
        setCurrentScreen(showDiscardConfirm.nextScreen);
    }
    setShowDiscardConfirm({ show: false, nextScreen: null });
  };

  // Local Storage Products
  useEffect(() => {
    if (user && currentScreen === 'gallery') {
      const localProducts = JSON.parse(localStorage.getItem(`shilpakala_products_${user.uid}`) || '[]');
      if (localProducts.length > 0) {
        setProducts(localProducts);
      } else {
        setProducts(DEMO_PRODUCTS);
      }
    }
  }, [user, currentScreen]);

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      const googleUser = { uid: 'google_user', email: 'artisan.google@gmail.com', name: 'Google Artisan' };
      setUser(googleUser);
      localStorage.setItem('shilpakala_user', JSON.stringify(googleUser));
      setCurrentScreen('home');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#3E2723] sm:py-8 overflow-y-auto">
      {/* Phone Frame */}
      <div className="relative w-full h-screen sm:h-[932px] max-w-[430px] sm:rounded-[3rem] sm:border-[12px] border-[#1a1a1a] bg-[#F5F5DC] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        
        {/* Dynamic Notch / Status Bar */}
        <div className="absolute top-0 inset-x-0 h-10 bg-[#F5F5DC] z-50 flex items-center px-8 pointer-events-none">
          <div className="text-[10px] font-bold text-[#3E2723]/60">9:41</div>
          <div className="mx-auto w-24 h-6 bg-black rounded-b-[1.2rem]" />
          <div className="flex gap-1">
             <div className="w-4 h-2 bg-[#3E2723]/20 rounded-full" />
             <div className="w-2 h-2 bg-[#8D6E63] rounded-full" />
          </div>
        </div>
        {/* Exit Confirmation Dialog */}
        <AnimatePresence>
          {showExitConfirm && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center px-8">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-md" 
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                 className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center space-y-6 shadow-2xl"
               >
                 <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto">
                    <LogOut size={40} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-[#3E2723]">Exit Shilpa-Kala?</h3>
                    <p className="text-[#8D6E63] mt-2 text-sm">Do you want to exit the application? Your progress is saved locally.</p>
                 </div>
                 <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-4 bg-[#F5F5DC] text-[#3E2723] rounded-2xl font-bold">Cancel</button>
                    <button onClick={() => window.close()} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold">Exit</button>
                 </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Discard Confirmation Dialog */}
        <AnimatePresence>
          {showDiscardConfirm.show && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center px-8">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-md" 
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                 className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center space-y-6 shadow-2xl"
               >
                 <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
                    <ShieldAlert size={40} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-[#3E2723]">Discard Changes?</h3>
                    <p className="text-[#8D6E63] mt-2 text-sm">You have unsaved changes in your creation. Are you sure you want to leave?</p>
                 </div>
                 <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowDiscardConfirm({ show: false, nextScreen: null })} className="flex-1 py-4 bg-[#F5F5DC] text-[#3E2723] rounded-2xl font-bold">Stay</button>
                    <button onClick={confirmDiscard} className="flex-1 py-4 bg-[#8D6E63] text-white rounded-2xl font-bold">Leave</button>
                 </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {deleteId && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center px-8">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-md" 
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                 className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center space-y-6 shadow-2xl"
               >
                 <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto">
                    <Trash2 size={40} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-[#3E2723]">Delete Item?</h3>
                    <p className="text-[#8D6E63] mt-2 text-sm">Are you sure you want to delete this image? This action cannot be undone.</p>
                 </div>
                 <div className="flex gap-3 pt-2">
                    <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-[#F5F5DC] text-[#3E2723] rounded-2xl font-bold">Cancel</button>
                    <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold">Delete</button>
                 </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {currentScreen === 'splash' && (
            <motion.div 
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F5F5DC]"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 bg-[#8D6E63] rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl"
              >
                <div className="text-white text-5xl font-serif font-bold italic">S</div>
              </motion.div>
              <h1 className="text-4xl font-serif font-bold text-[#3E2723]">Shilpa-Kala</h1>
              <p className="text-[#8D6E63] mt-2 font-medium tracking-widest uppercase text-xs flex items-center gap-2">
                <ShieldCheck size={14} /> Offline First Heritage
              </p>
            </motion.div>
          )}

          {currentScreen === 'login' && (
            <motion.div 
              key="login"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="flex-1 p-8 flex flex-col pt-20 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => setShowExitConfirm(true)} className="p-2 -ml-2 text-[#8D6E63]">
                  <ChevronLeft size={24} />
                </button>
                <div className="w-10" />
              </div>

              <h2 className="text-4xl font-serif font-bold text-[#3E2723] mb-2 text-center">Namaskara</h2>
              <p className="text-[#8D6E63] text-center mb-12">Login to your artisan dashboard</p>
              
              <motion.form 
                onSubmit={handleLogin} 
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="space-y-6"
              >
                <Input name="email" type="email" label="Email Address" placeholder="artisan@example.com" error={formErrors.email} />
                <div className="relative">
                    <Input name="password" type={showPassword ? "text" : "password"} label="Password" placeholder="••••••••" error={formErrors.password} />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[44px] text-[#8D6E63]/40"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="flex justify-end -mt-4">
                  <button 
                    type="button"
                    onClick={() => setCurrentScreen('forgotPassword')}
                    className="text-[#8D6E63] text-xs font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <Button type="submit" isLoading={loading} className="w-full">
                  Sign In
                </Button>
              </motion.form>

              <div className="mt-auto pb-8 text-center space-y-4">
                <button onClick={() => { setCurrentScreen('register'); setFormErrors({}); }} className="text-[#3E2723] text-sm underline decoration-[#8D6E63] underline-offset-4">
                  New artisan? Create Account
                </button>
                <div className="flex items-center gap-4 py-4">
                    <div className="flex-1 h-px bg-[#8D6E63]/20" />
                    <span className="text-xs text-[#8D6E63]/60 uppercase font-bold tracking-widest">or</span>
                    <div className="flex-1 h-px bg-[#8D6E63]/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleGoogleSignIn}
                      className="py-4 border-2 border-[#8D6E63] text-[#8D6E63] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#8D6E63]/5 transition-colors text-xs"
                    >
                       Google
                    </button>
                    <button 
                      onClick={handleGuestMode}
                      className="py-4 border-2 border-[#8D6E63] text-[#8D6E63] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#8D6E63]/5 transition-colors text-xs"
                    >
                       Guest Mode
                    </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentScreen === 'register' && (
            <motion.div 
              key="register"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="flex-1 p-8 flex flex-col pt-20 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => setCurrentScreen('login')} className="p-2 -ml-2 text-[#8D6E63]">
                  <ChevronLeft size={24} />
                </button>
                <div className="w-10" />
              </div>

              <h2 className="text-4xl font-serif font-bold text-[#3E2723] mb-2 text-center">Join Us</h2>
              <p className="text-[#8D6E63] text-center mb-10">Start your digital portfolio journey</p>
              
              <motion.form 
                onSubmit={handleRegister} 
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="space-y-4"
              >
                <Input name="name" label="Full Name" placeholder="Vishwakarma" error={formErrors.name} />
                <Input name="email" type="email" label="Email Address" placeholder="artisan@example.com" error={formErrors.email} />
                <Input name="password" type="password" label="Password" placeholder="••••••••" error={formErrors.password} />
                <Input name="confirmPassword" type="password" label="Confirm Password" placeholder="••••••••" error={formErrors.confirmPassword} />
                
                <div className="pt-2">
                    <Button type="submit" isLoading={loading} className="w-full">
                        Create Account
                    </Button>
                </div>
              </motion.form>

              <div className="mt-6 text-center">
                <button onClick={() => { setCurrentScreen('login'); setFormErrors({}); }} className="text-[#3E2723] text-sm underline decoration-[#8D6E63] underline-offset-4">
                  Already have an account? Login
                </button>
              </div>
            </motion.div>
          )}

          {currentScreen === 'forgotPassword' && (
            <motion.div 
              key="forgotPassword"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="flex-1 p-8 flex flex-col pt-20 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => setCurrentScreen('login')} className="p-2 -ml-2 text-[#8D6E63]">
                  <ChevronLeft size={24} />
                </button>
                <div className="w-10" />
              </div>

              <h2 className="text-3xl font-serif font-bold text-[#3E2723] mb-2 text-center">Reset Password</h2>
              <p className="text-[#8D6E63] text-center mb-12">Enter your email to receive a reset link</p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                  setCurrentScreen('login');
                }} 
                className="space-y-6"
              >
                <Input name="email" type="email" label="Email Address" placeholder="artisan@example.com" />
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </form>
            </motion.div>
          )}

          {currentScreen === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col h-full"
            >
              <div className="p-8 pt-16 pb-4 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowExitConfirm(true)} className="bg-white p-3 rounded-2xl shadow-sm text-[#8D6E63]">
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-[#8D6E63] tracking-[0.2em] uppercase mb-1">Local Storage Mode</h3>
                    <h2 className="text-3xl font-serif font-bold text-[#3E2723]">{user?.name || 'Artisan'}</h2>
                  </div>
                </div>
                <button onClick={() => setCurrentScreen('profile')} className="bg-white p-3 rounded-2xl shadow-sm text-[#8D6E63]">
                  <UserIcon size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-24">
                {/* Stats / Welcome */}
                <div className="bg-[#5D4037] rounded-[2.5rem] p-6 text-white shadow-xl flex items-center justify-between overflow-hidden relative border-b-4 border-[#FFD54F]/30">
                  <div className="relative z-10">
                    <p className="text-white/70 text-sm font-medium tracking-wide">Digital Craft Catalog</p>
                    <p className="text-4xl font-serif font-bold mt-1">12 <span className="text-lg font-sans font-normal opacity-60 italic">Pieces</span></p>
                    <div className="mt-4 flex items-center gap-2 bg-[#FFD54F]/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold text-[#FFD54F]">
                        <ShieldCheck size={12} /> VERIFIED KARNATAKA ARTISAN
                    </div>
                  </div>
                  <div className="text-white/5 absolute -right-4 -bottom-4">
                    <ShoppingBag size={140} strokeWidth={1} />
                  </div>
                </div>

                {/* Craft Categories */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-serif font-bold text-[#3E2723]">Karnataka Crafts</h4>
                        <button className="text-[#8D6E63] text-xs font-bold uppercase tracking-widest">Explore</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                        {CRAFT_CATEGORIES.map((cat, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => { setActiveCategory(cat); setCurrentScreen('craftDetail'); }}
                                className="flex-shrink-0 w-32 space-y-2 group cursor-pointer"
                            >
                                <div className={cn(
                                    "aspect-square rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-[#8D6E63]/10 relative overflow-hidden group-active:scale-95 transition-transform",
                                    cat.color
                                )}>
                                    {cat.image ? (
                                        <img src={cat.image} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" alt={cat.name} />
                                    ) : (
                                        <div className="absolute inset-0 bg-[#8D6E63]/5" />
                                    )}
                                    <span className="relative z-10">{cat.icon}</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-bold text-[#3E2723] line-clamp-1">{cat.name}</p>
                                    <p className="text-[9px] text-[#8D6E63] uppercase tracking-tighter">{cat.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setShowActionSheet(true)}
                        className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center gap-3 border border-[#8D6E63]/5 hover:shadow-md transition-all active:scale-95"
                    >
                        <div className="w-14 h-14 bg-[#F5F5DC] rounded-2xl flex items-center justify-center text-[#8D6E63]">
                            <Camera size={28} />
                        </div>
                        <span className="font-bold text-[#3E2723] text-sm">Capture</span>
                    </button>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center gap-3 border border-[#8D6E63]/5 hover:shadow-md transition-all active:scale-95"
                    >
                        <div className="w-14 h-14 bg-[#F5F5DC] rounded-2xl flex items-center justify-center text-[#8D6E63]">
                            <Upload size={28} />
                        </div>
                        <span className="font-bold text-[#3E2723] text-sm">Upload</span>
                    </button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-serif font-bold text-[#3E2723]">Recent Creations</h4>
                        <button onClick={() => setCurrentScreen('gallery')} className="text-[#8D6E63] text-xs font-bold uppercase tracking-widest">See All</button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pb-4">
                        {DEMO_PRODUCTS.map((p, i) => (
                            <div 
                                key={i} 
                                onClick={() => { setActiveProduct(p); setCurrentScreen('productDetail'); }}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-[#8D6E63]/5 active:scale-95 cursor-pointer transition-all"
                            >
                                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                                     {p.imageUrl ? (
                                         <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} referrerPolicy="no-referrer" />
                                     ) : (
                                         <div className="flex flex-col items-center gap-2 opacity-20">
                                             <ImageIcon size={32} />
                                             <span className="text-[10px] font-bold">NO IMAGE</span>
                                         </div>
                                     )}
                                </div>
                                <div className="p-4 bg-white/90 backdrop-blur-sm -mt-12 relative z-10 rounded-t-2xl mx-1 border-t border-[#8D6E63]/10">
                                    <p className="text-sm font-bold text-[#3E2723] truncate">
                                        {p.name}
                                    </p>
                                    <p className="text-[#8D6E63] text-[10px] uppercase font-bold tracking-tighter">Premium Handcrafted</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>

              {/* Bottom Nav Simulation */}
              <div className="h-20 bg-white/80 backdrop-blur-md border-t border-[#8D6E63]/10 px-8 flex items-center justify-between relative mt-auto">
                <button className="text-[#8D6E63] flex flex-col items-center gap-1">
                    <Grid size={24} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">DASH</span>
                </button>
                <button 
                  onClick={() => setShowActionSheet(true)}
                  className="bg-[#8D6E63] p-4 rounded-3xl text-white shadow-xl shadow-[#8D6E63]/30 -mt-14 active:scale-90 transition-transform"
                >
                    <Plus size={32} />
                </button>
                <button 
                  onClick={() => setCurrentScreen('gallery')}
                  className="text-[#3E2723]/40 flex flex-col items-center gap-1"
                >
                    <History size={24} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">GALLERY</span>
                </button>
              </div>
            </motion.div>
          )}

          {currentScreen === 'productDetail' && activeProduct && (
            <motion.div 
              key="productDetail"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="flex-1 flex flex-col h-full bg-white overflow-y-auto"
            >
              <div className="relative h-[300px] bg-[#F5F5DC] flex items-center justify-center">
                {activeProduct.imageUrl ? (
                    <img src={activeProduct.imageUrl} className="w-full h-full object-cover" alt={activeProduct.name} />
                ) : (
                    <div className="flex flex-col items-center gap-4 opacity-20">
                        <ShoppingBag size={80} className="text-[#3E2723]" />
                        <span className="font-serif font-bold text-lg uppercase tracking-widest text-[#3E2723]">Piece of Heritage</span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="absolute top-16 left-6 bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-white hover:text-[#3E2723] transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>

              <div className="px-8 pb-12 -mt-12 relative z-10 space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest">{activeProduct.woodType}</span>
                  <h2 className="text-4xl font-serif font-bold text-[#3E2723] leading-relaxed">{activeProduct.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-[#8D6E63] font-mono">₹{activeProduct.price}</span>
                    <span className="bg-[#8D6E63]/10 text-[#8D6E63] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Expert Crafted</span>
                  </div>
                </div>

                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest">Story & Description</h4>
                  <p className="text-[#3E2723]/70 leading-relaxed text-lg">{activeProduct.description}</p>
                </section>

                {activeProduct.relatedImages && activeProduct.relatedImages.length > 0 && (
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest">Related Views</h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                      {activeProduct.relatedImages.map((img, idx) => (
                        <div key={idx} className="min-w-[140px] h-[140px] rounded-3xl bg-gray-100 overflow-hidden shadow-sm border border-[#8D6E63]/10">
                          <img src={img} className="w-full h-full object-cover" alt={`${activeProduct.name} view ${idx + 1}`} referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className="flex items-center gap-4 bg-[#F5F5DC] p-6 rounded-[2rem]">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <ShieldCheck className="text-[#8D6E63]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#3E2723]">Shilpa Kala Certified</p>
                        <p className="text-[10px] text-[#8D6E63] uppercase font-bold">Authentic Karnataka Heritage</p>
                    </div>
                </div>

                <div className="pt-6 flex gap-3">
                    <button 
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: activeProduct.name,
                                    text: `Check out this beautiful ${activeProduct.name} on Shilpa-Kala!`,
                                    url: window.location.href
                                }).catch(console.error);
                            }
                        }}
                        className="flex-1 bg-[#8D6E63] text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 shadow-xl"
                    >
                        <Share2 size={20} />
                        <span>Share Masterpiece</span>
                    </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentScreen === 'craftDetail' && activeCategory && (
            <motion.div 
              key="craftDetail"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="flex-1 flex flex-col h-full bg-white overflow-y-auto"
            >
              <div className="relative h-[300px] bg-[#F5F5DC] flex items-center justify-center">
                {activeCategory.image ? (
                    <img src={activeCategory.image} className="w-full h-full object-cover" alt={activeCategory.name} />
                ) : (
                    <div className="flex flex-col items-center gap-4 opacity-20">
                        <span className="text-6xl">{activeCategory.icon}</span>
                        <span className="font-serif font-bold text-xl uppercase tracking-widest text-[#3E2723]">Shilpa Kala Heritage</span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="absolute top-16 left-6 bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-white hover:text-[#3E2723] transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>

              <div className="px-8 pb-12 -mt-12 relative z-10 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{activeCategory.icon}</span>
                    <span className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest">{activeCategory.location}</span>
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-[#3E2723] leading-relaxed">{activeCategory.name}</h2>
                </div>

                <div className="space-y-6">
                  <section className="space-y-2">
                    <h4 className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest">Heritage & History</h4>
                    <p className="text-[#3E2723]/70 leading-relaxed italic border-l-2 border-[#8D6E63]/20 pl-4">{activeCategory.history}</p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest">Cultural Significance</h4>
                    <p className="text-[#3E2723]/70 leading-relaxed">{activeCategory.importance}</p>
                  </section>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F5F5DC] p-4 rounded-3xl space-y-1">
                      <h5 className="text-[10px] font-bold text-[#8D6E63] uppercase">Materials</h5>
                      <p className="text-xs text-[#3E2723] font-medium">{activeCategory.materials}</p>
                    </div>
                    <div className="bg-[#F5F5DC] p-4 rounded-3xl space-y-1">
                      <h5 className="text-[10px] font-bold text-[#8D6E63] uppercase">Technique</h5>
                      <p className="text-xs text-[#3E2723] font-medium">{activeCategory.techniques}</p>
                    </div>
                  </div>

                  <section className="space-y-3">
                    <h4 className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest">Signature Products</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeCategory.products.split(', ').map((p, i) => (
                        <span key={i} className="bg-white border-2 border-[#8D6E63]/10 px-4 py-2 rounded-xl text-xs font-bold text-[#3E2723]">{p}</span>
                      ))}
                    </div>
                  </section>

                  <div className="pt-6 flex flex-col gap-3">
                    <Button 
                        onClick={() => { setSelectedCategory(activeCategory.name); setCurrentScreen('camera'); }}
                        className="w-full bg-[#3E2723] text-white py-5 rounded-[2rem] flex items-center justify-center gap-3"
                    >
                        <Camera size={20} />
                        <span>Upload My {activeCategory.name} Piece</span>
                    </Button>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: activeCategory.name,
                                        text: `Learning about the heritage of ${activeCategory.name} on Shilpa-Kala!`,
                                        url: window.location.href
                                    }).catch(console.error);
                                }
                            }}
                            className="flex-1 bg-[#F5F5DC] text-[#3E2723] py-4 rounded-3xl font-bold flex items-center justify-center gap-2"
                        >
                            <Share2 size={18} />
                            <span>Share Story</span>
                        </button>
                        <button 
                            onClick={() => setCurrentScreen('home')}
                            className="flex-1 bg-white border-2 border-[#8D6E63]/10 text-[#8D6E63] py-4 rounded-3xl font-bold"
                        >
                            Explore Market
                        </button>
                    </div>
                  </div>

                  <section className="pt-8 space-y-4">
                    <h4 className="text-sm font-bold text-[#3E2723] uppercase tracking-widest">Related Crafts</h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                        {CRAFT_CATEGORIES.filter(c => c.name !== activeCategory.name).slice(0, 4).map((c, i) => (
                            <div 
                                key={i} 
                                onClick={() => setActiveCategory(c)}
                                className="flex-shrink-0 w-32 space-y-2 group cursor-pointer"
                            >
                                <div className="aspect-square rounded-2xl overflow-hidden relative shadow-sm border border-[#8D6E63]/10 bg-gray-50 flex items-center justify-center">
                                    {c.image ? (
                                        <img src={c.image} className="absolute inset-0 w-full h-full object-cover" alt={c.name} />
                                    ) : (
                                        <span className="text-2xl z-10">{c.icon}</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <p className="text-[10px] font-bold text-[#3E2723] text-center truncate">{c.name}</p>
                            </div>
                        ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {currentScreen === 'camera' && (
              <motion.div 
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-black flex flex-col"
              >
                  <div className="p-8 flex justify-between items-center text-white relative z-10">
                      <button onClick={() => setCurrentScreen('home')} className="bg-white/10 p-2 rounded-2xl backdrop-blur-md">
                          <ChevronLeft size={24} />
                      </button>
                      <span className="text-xs font-bold uppercase tracking-[0.3em]">Live Lens</span>
                      <div className="w-10" />
                  </div>

                  <div className="flex-1 relative flex items-center justify-center">
                       {/* Camera Preview Simulation */}
                       <div className="absolute inset-0 bg-[#3E2723]/20 flex items-center justify-center overflow-hidden">
                           <ImageIcon size={100} className="text-white/10" />
                           <motion.div 
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-x-8 inset-y-24 border-2 border-dashed border-white/30 rounded-[3rem] pointer-events-none" 
                           />
                       </div>
                  </div>

                  <div className="p-12 flex items-center justify-center relative z-10">
                       <button 
                         onClick={() => {
                            setCapturedImage(`https://images.unsplash.com/photo-${['1549465220-1a8b9238cd48', '1590074218314-5d5b78b05615', '1582213726892-23c58850689b', '1533090161767-e6ffed986c88'][Math.floor(Math.random()*4)]}?auto=format&fit=crop&q=80&w=800`);
                            setSelectedFileName('camera_capture.jpg');
                            setCurrentScreen('preview');
                         }}
                         className="w-20 h-20 bg-white rounded-full p-1 border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-90 transition-transform"
                       >
                           <div className="w-full h-full bg-white rounded-full border border-black/10" />
                       </button>
                  </div>
              </motion.div>
          )}

          {currentScreen === 'preview' && (
              <motion.div 
                key="preview"
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                className="flex-1 flex flex-col h-full"
              >
                  <div className="p-4 flex items-center gap-4 border-b border-[#8D6E63]/10 bg-white overflow-x-auto min-h-[64px]">
                      <button onClick={() => setShowDiscardConfirm({ show: true, nextScreen: 'camera' })} className="text-[#8D6E63]">
                          <ChevronLeft size={24} />
                      </button>
                      <h2 className="text-lg font-serif font-bold text-[#3E2723] whitespace-nowrap">Product Branding</h2>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group bg-white">
                          <img src={capturedImage || ''} className="w-full h-auto aspect-[3/4] object-cover" alt="Captured" referrerPolicy="no-referrer" />
                          
                          {/* Branding overlays */}
                          <div className="absolute top-4 right-4 bg-[#8D6E63] text-white py-1 px-3 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
                              <Check size={10} strokeWidth={4} /> KARNATAKA HANDMADE
                          </div>
                          
                          <div className="absolute bottom-6 left-6 text-white drop-shadow-lg">
                              <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 mb-1">Authenticity Guaranteed</p>
                              <h4 className="text-2xl font-serif font-bold italic leading-tight">Heritage Series</h4>
                              {selectedFileName && (
                                  <p className="text-[10px] text-white/50 mt-2 font-mono truncate max-w-[200px]">{selectedFileName}</p>
                              )}
                          </div>

                          <button 
                            onClick={() => {
                                setCapturedImage(null);
                                setSelectedFileName(null);
                                setCurrentScreen('home');
                            }}
                            className="absolute top-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-xl text-white"
                          >
                              <Plus size={16} className="rotate-45" />
                          </button>
                      </div>

                      <div className="space-y-4">
                        <Input name="productName" label="Craft Name" placeholder="e.g. Bidriware Vase" />
                        
                        <div className="w-full space-y-2">
                             <label className="text-sm font-medium text-[#3E2723]/60 px-1">Heritage Category</label>
                             <div className="grid grid-cols-2 gap-2">
                                 {CRAFT_CATEGORIES.map(cat => (
                                     <button 
                                        key={cat.name}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={cn(
                                            "p-3 rounded-2xl text-[10px] font-bold border-2 transition-all text-left flex items-center gap-2",
                                            selectedCategory === cat.name 
                                                ? "border-[#8D6E63] bg-[#8D6E63] text-white shadow-md active:scale-95" 
                                                : "border-[#8D6E63]/10 bg-white text-[#3E2723]"
                                        )}
                                     >
                                         <span className="text-base">{cat.icon}</span>
                                         <span className="truncate">{cat.name}</span>
                                     </button>
                                 ))}
                             </div>
                        </div>

                        <Input name="woodType" label="Material Used" placeholder="Zinc & Copper, Silk, Teak, etc" />
                        <div className="flex gap-4">
                            <div className="flex-1"><Input name="price" label="Price (₹)" placeholder="2,500" /></div>
                            <div className="flex-1"><Input name="stock" label="Stock" placeholder="5" /></div>
                        </div>
                      </div>
                  </div>

                  <div className="p-6 bg-white/80 backdrop-blur-md border-t border-[#8D6E63]/10">
                      <Button 
                        onClick={() => {
                            setLoading(true);
                            setTimeout(() => {
                                const newProduct: Product = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    name: (document.getElementsByName('productName')[0] as HTMLInputElement)?.value || 'Handcrafted Gem',
                                    woodType: (document.getElementsByName('woodType')[0] as HTMLInputElement)?.value || 'Premium Material',
                                    price: (document.getElementsByName('price')[0] as HTMLInputElement)?.value || '2800',
                                    description: 'Heritage masterpiece saved in collection.',
                                    imageUrl: capturedImage || '',
                                    timestamp: Date.now(),
                                    category: selectedCategory
                                };
                                
                                handleCreateProduct(newProduct);
                                setLoading(false);
                                setCurrentScreen('gallery');
                            }, 1500);
                        }}
                        className="w-full flex items-center justify-center gap-3"
                        disabled={loading}
                      >
                         {loading ? 'Saving Locally...' : <><Check size={20} /> Save Portfolio Locally</>}
                      </Button>
                  </div>
              </motion.div>
          )}

          {currentScreen === 'gallery' && (
              <motion.div 
                key="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col h-full"
              >
                  <div className="p-8 pt-16 pb-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentScreen('home')} className="bg-white p-3 rounded-2xl shadow-sm text-[#8D6E63]">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-3xl font-serif font-bold text-[#3E2723]">Collections</h2>
                      </div>
                      <button onClick={() => setCurrentScreen('home')} className="bg-white p-3 rounded-2xl shadow-sm text-[#8D6E63]">
                          <Grid size={20} />
                      </button>
                  </div>

                  <div className="px-6 mb-4">
                      <input 
                        type="text"
                        placeholder="Search your collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/50 border-2 border-[#8D6E63]/10 rounded-2xl p-4 focus:outline-none focus:border-[#8D6E63] font-medium"
                      />
                  </div>

                  <AnimatePresence>
                   {filteredProducts.length === 0 ? (
                       <div key="empty" className="py-24 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                           <ImageIcon size={64} strokeWidth={1} />
                           <p className="font-serif italic text-xl">{searchQuery ? "No matches found" : "Empty Canvas..."}</p>
                           {!searchQuery && (
                               <button 
                                 onClick={() => setCurrentScreen('camera')}
                                 className="text-[#8D6E63] font-bold uppercase tracking-widest text-xs underline underline-offset-8"
                               >
                                   Capture First Creation
                               </button>
                           )}
                       </div>
                   ) : (
                       <div key="list" className="grid grid-cols-1 gap-6 px-6 overflow-y-auto pb-24">
                           {filteredProducts.map((p, i) => (
                               <motion.div 
                                   key={p.id || i}
                                   layout
                                   initial={{ y: 20, opacity: 0 }}
                                   animate={{ y: 0, opacity: 1 }}
                                   transition={{ delay: i * 0.1 }}
                                   onClick={(e) => {
                                       if ((e.target as HTMLElement).closest('button')) return;
                                       setActiveProduct(p);
                                       setCurrentScreen('productDetail');
                                   }}
                                   className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-[#8D6E63]/5 group relative cursor-pointer"
                               >
                                   <div className="h-64 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                       {p.imageUrl ? (
                                           <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                       ) : (
                                           <div className="flex flex-col items-center gap-3 opacity-20">
                                               <ImageIcon size={48} />
                                               <span className="font-bold text-xs">COLLECTION PIECE</span>
                                           </div>
                                       )}
                                       <div className="absolute top-4 right-4 flex gap-2">
                                           <button 
                                               onClick={() => setEditingProduct(p)}
                                               className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-[#3E2723] hover:bg-[#FFD54F] hover:text-white transition-colors"
                                           >
                                               <Plus size={20} className="rotate-45" />
                                           </button>
                                            <button 
                                               onClick={() => handleDeleteProduct(p.id!)}
                                               className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                           >
                                               <Trash2 size={20} />
                                           </button>
                                       </div>
                                   </div>
                                   <div className="p-6">
                                       <div className="flex justify-between items-start mb-2">
                                           <h4 className="text-xl font-serif font-bold text-[#3E2723]">{p.name}</h4>
                                           <div 
                                             onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: p.name,
                                                        text: `Check out my handcrafted masterpiece: ${p.name}! Created using Shilpa-Kala.`,
                                                        url: window.location.href
                                                    }).catch(console.error);
                                                } else {
                                                    alert(`Sharing: ${p.name}`);
                                                }
                                             }}
                                             className="bg-[#F5F5DC] text-[#8D6E63] p-2 rounded-xl cursor-pointer active:scale-90 transition-transform"
                                           >
                                               <Share2 size={16} />
                                           </div>
                                       </div>
                                       <div className="flex items-center gap-2 mb-2">
                                           <span className="text-[#8D6E63] text-xs font-bold font-mono">₹{p.price}</span>
                                           <div className="w-1 h-1 bg-[#8D6E63]/30 rounded-full" />
                                           <span className="text-[#8D6E63]/60 text-[10px] uppercase font-bold">{p.woodType}</span>
                                           {p.category && (
                                               <>
                                                   <div className="w-1 h-1 bg-[#8D6E63]/30 rounded-full" />
                                                   <span className="text-[#8D6E63]/60 text-[10px] uppercase font-bold">{p.category}</span>
                                               </>
                                           )}
                                       </div>
                                       <p className="text-[#3E2723]/60 text-sm line-clamp-2 leading-relaxed">{p.description}</p>
                                   </div>
                               </motion.div>
                           ))}
                       </div>
                   )}
                  </AnimatePresence>
              </motion.div>
          )}

          {currentScreen === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="flex-1 flex flex-col h-full bg-[#F5F5DC]"
            >
              <div className="p-8 pt-16 pb-4 flex items-center justify-between">
                <button onClick={() => setCurrentScreen('home')} className="bg-white p-3 rounded-2xl shadow-sm text-[#8D6E63]">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-serif font-bold text-[#3E2723]">Profile</h2>
                <button onClick={() => setCurrentScreen('settings')} className="bg-white p-3 rounded-2xl shadow-sm text-[#8D6E63]">
                    <Plus size={20} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-[#8D6E63] rounded-[3rem] flex items-center justify-center text-white text-5xl font-serif shadow-xl mb-4">
                    {user?.name?.[0] || 'A'}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#3E2723]">{user?.name}</h3>
                  <p className="text-[#8D6E63] font-medium">{user?.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-[#8D6E63]/10 pb-4">
                      <span className="text-sm font-bold text-[#3E2723]/60">Member Since</span>
                      <span className="text-sm font-bold text-[#3E2723]">May 2024</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#8D6E63]/10 pb-4">
                      <span className="text-sm font-bold text-[#3E2723]/60">Collection Size</span>
                      <span className="text-sm font-bold text-[#3E2723]">{products.length + DEMO_PRODUCTS.length} Pieces</span>
                    </div>
                  </div>

                  <button onClick={handleLogout} className="w-full py-5 bg-red-50 text-red-500 rounded-3xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <LogOut size={20} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentScreen === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="flex-1 flex flex-col h-full bg-[#F5F5DC]"
            >
              <div className="p-8 pt-16 pb-4 flex items-center justify-between">
                <button onClick={() => setCurrentScreen('profile')} className="bg-white p-3 rounded-2xl shadow-sm text-[#8D6E63]">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-serif font-bold text-[#3E2723]">Settings</h2>
                <div className="w-10" />
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <section className="space-y-3">
                  <h4 className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest px-2">Account</h4>
                  <div className="bg-white rounded-3xl overflow-hidden">
                    <button className="w-full p-6 flex justify-between items-center text-sm font-bold text-[#3E2723] border-b border-[#8D6E63]/5">
                      <span>Edit Profile</span>
                      <ChevronLeft size={16} className="rotate-180 opacity-30" />
                    </button>
                    <button className="w-full p-6 flex justify-between items-center text-sm font-bold text-[#3E2723]">
                      <span>Change Password</span>
                      <ChevronLeft size={16} className="rotate-180 opacity-30" />
                    </button>
                  </div>
                </section>

                <section className="space-y-3">
                  <h4 className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest px-2">Preferences</h4>
                  <div className="bg-white rounded-3xl overflow-hidden">
                    <div className="w-full p-6 flex justify-between items-center text-sm font-bold text-[#3E2723] border-b border-[#8D6E63]/5">
                      <span>Notifications</span>
                      <div className="w-10 h-6 bg-[#8D6E63] rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <div className="w-full p-6 flex justify-between items-center text-sm font-bold text-[#3E2723]">
                      <span>Dark Mode</span>
                      <div className="w-10 h-6 bg-[#8D6E63]/10 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <ActionSheet 
          isOpen={showActionSheet} 
          onClose={() => setShowActionSheet(false)} 
          onSelect={(type) => {
            setShowActionSheet(false);
            if (type === 'camera') setCurrentScreen('camera');
            else fileInputRef.current?.click();
          }}
        />

        <AnimatePresence>
            {editingProduct && (
                <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditingProduct(null)}
                        className="absolute inset-0 bg-[#3E2723]/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 shadow-2xl space-y-6"
                    >
                        <h3 className="text-2xl font-serif font-bold text-[#3E2723]">Edit Masterpiece</h3>
                        <div className="space-y-4">
                            <Input 
                                label="Product Name" 
                                defaultValue={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            />
                            <Input 
                                label="Price (₹)" 
                                defaultValue={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#3E2723]/60 px-1">Description</label>
                                <textarea 
                                    className="w-full bg-white border-2 border-[#8D6E63]/10 rounded-2xl p-4 focus:outline-none focus:border-[#8D6E63] min-h-[100px]"
                                    defaultValue={editingProduct.description}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setEditingProduct(null)}
                                className="flex-1 py-4 text-[#8D6E63] font-bold"
                            >
                                Cancel
                            </button>
                            <Button 
                                onClick={() => handleUpdateProduct(editingProduct)}
                                className="flex-1"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </AnimatePresence>

        {/* Notch simulation */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-32 h-7 bg-black rounded-b-[1.5rem] hidden sm:block" />
      </div>
    </div>
  );
}
