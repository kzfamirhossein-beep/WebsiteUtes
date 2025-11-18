"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  price: string;
  image: string;
  featured: boolean;
  category?: string;
}

interface HomeContent {
  hero: {
    h1: string;
    h1Fa: string;
    p: string;
    pFa: string;
  };
  about: {
    title: string;
    titleFa: string;
    body: string;
    bodyFa: string;
  };
  mission: {
    title: string;
    titleFa: string;
    body: string;
    bodyFa: string;
  };
  vision: {
    title: string;
    titleFa: string;
    body: string;
    bodyFa: string;
  };
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  addressFa?: string;
  instagram?: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "home" | "contact" | "reviews">("products");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const isAuth = sessionStorage.getItem("admin_authenticated");
    if (isAuth === "true") {
      setAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, homeRes, contactRes, messagesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/home"),
        fetch("/api/contact"),
        fetch("/api/messages"),
      ]);
      
      const productsData = await productsRes.json();
      const homeData = await homeRes.json();
      const contactData = await contactRes.json();
      const messagesData = await messagesRes.json();
      
      setProducts(productsData);
      setHomeContent(homeData);
      setContactInfo(contactData);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        sessionStorage.setItem("admin_authenticated", "true");
        setError("");
        loadData();
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1f1f1f] px-6">
        <div className="max-w-md w-full space-y-6">
          <h1 className="text-3xl font-bold text-gray-200 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full btn-3d rounded-md bg-gold px-5 py-2.5 text-black hover:opacity-90"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-gray-200">
      <div className="border-b border-gold/30 bg-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="btn-3d rounded-md bg-red-600 px-4 py-2 text-white hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gold/30">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium ${
              activeTab === "products"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("home")}
            className={`px-4 py-2 font-medium ${
              activeTab === "home"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Home Content
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2 font-medium ${
              activeTab === "contact"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Contact Info
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 font-medium ${
              activeTab === "reviews"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Reviews ({messages.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <ProductsManager
            products={products}
            setProducts={setProducts}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            showProductForm={showProductForm}
            setShowProductForm={setShowProductForm}
          />
        )}

        {/* Home Content Tab */}
        {activeTab === "home" && homeContent && (
          <HomeContentManager
            homeContent={homeContent}
            setHomeContent={setHomeContent}
          />
        )}

        {/* Contact Info Tab */}
        {activeTab === "contact" && contactInfo && (
          <ContactInfoManager
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
          />
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <MessagesManager
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </div>
    </div>
  );
}

// Products Manager Component
function ProductsManager({
  products,
  setProducts,
  editingProduct,
  setEditingProduct,
  showProductForm,
  setShowProductForm,
}: {
  products: Product[];
  setProducts: (products: Product[]) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
}) {
  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: "",
    nameFa: "",
    description: "",
    descriptionFa: "",
    price: "",
    image: "",
    featured: false,
    category: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
      setShowProductForm(true);
      // Scroll to the edit form when editing starts
      setTimeout(() => {
        const editForm = document.getElementById("product-edit-form");
        if (editForm) {
          editForm.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [editingProduct, setShowProductForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updated = await res.json();
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        // Create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setFormData({
        id: 0,
        name: "",
        nameFa: "",
        description: "",
        descriptionFa: "",
        price: "",
        image: "",
        featured: false,
        category: "",
      });
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Failed to upload image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              id: 0,
              name: "",
              nameFa: "",
              description: "",
              descriptionFa: "",
              price: "",
              image: "",
              featured: false,
              category: "",
            });
            setShowProductForm(true);
          }}
          className="btn-3d rounded-md bg-gold px-4 py-2 text-black hover:opacity-90"
        >
          Add New Product
        </button>
      </div>

      {showProductForm && (
        <div id="product-edit-form" className="bg-[#2a2a2a] rounded-lg p-6 border border-gold/30">
          <h3 className="text-xl font-semibold mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name (English)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name (Persian)</label>
                <input
                  type="text"
                  value={formData.nameFa}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Description (English)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Persian)</label>
                <textarea
                  value={formData.descriptionFa}
                  onChange={(e) => setFormData({ ...formData, descriptionFa: e.target.value })}
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price ($)</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">None</option>
                  <option value="suits">Suits</option>
                  <option value="pants">Pants</option>
                  <option value="weave">Weave</option>
                  <option value="shirt">Shirt</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                placeholder="/uploads/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm font-medium">Featured Product</label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="btn-3d rounded-md bg-gold px-5 py-2 text-black hover:opacity-90"
              >
                {editingProduct ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                className="btn-3d rounded-md border border-gold/40 px-5 py-2 text-gray-200 hover:bg-gold/10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#2a2a2a] rounded-lg p-4 border border-gold/30"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{product.description}</p>
            <p className="text-gold font-semibold mb-3">${product.price}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="flex-1 btn-3d rounded-md bg-gold/20 px-3 py-2 text-sm text-gray-200 hover:bg-gold/30"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 btn-3d rounded-md bg-red-600/20 px-3 py-2 text-sm text-red-400 hover:bg-red-600/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Home Content Manager Component
function HomeContentManager({
  homeContent,
  setHomeContent,
}: {
  homeContent: HomeContent;
  setHomeContent: (content: HomeContent) => void;
}) {
  const [formData, setFormData] = useState<HomeContent>(homeContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(homeContent);
  }, [homeContent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const updated = await res.json();
      setHomeContent(updated);
      alert("Home content saved successfully!");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save home content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Home Content</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-3d rounded-md bg-gold px-4 py-2 text-black hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gold/30">
          <h3 className="text-xl font-semibold mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Heading (English)</label>
              <input
                type="text"
                value={formData.hero.h1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, h1: e.target.value },
                  })
                }
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Heading (Persian)</label>
              <input
                type="text"
                value={formData.hero.h1Fa}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, h1Fa: e.target.value },
                  })
                }
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Paragraph (English)</label>
              <textarea
                value={formData.hero.p}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, p: e.target.value },
                  })
                }
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Paragraph (Persian)</label>
              <textarea
                value={formData.hero.pFa}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, pFa: e.target.value },
                  })
                }
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gold/30">
          <h3 className="text-xl font-semibold mb-4">About Section</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (English)</label>
                <input
                  type="text"
                  value={formData.about.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, title: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title (Persian)</label>
                <input
                  type="text"
                  value={formData.about.titleFa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, titleFa: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Body (English)</label>
                <textarea
                  value={formData.about.body}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, body: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Body (Persian)</label>
                <textarea
                  value={formData.about.bodyFa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, bodyFa: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gold/30">
          <h3 className="text-xl font-semibold mb-4">Mission Section</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (English)</label>
                <input
                  type="text"
                  value={formData.mission.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mission: { ...formData.mission, title: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title (Persian)</label>
                <input
                  type="text"
                  value={formData.mission.titleFa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mission: { ...formData.mission, titleFa: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Body (English)</label>
                <textarea
                  value={formData.mission.body}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mission: { ...formData.mission, body: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Body (Persian)</label>
                <textarea
                  value={formData.mission.bodyFa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mission: { ...formData.mission, bodyFa: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gold/30">
          <h3 className="text-xl font-semibold mb-4">Vision Section</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (English)</label>
                <input
                  type="text"
                  value={formData.vision.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vision: { ...formData.vision, title: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title (Persian)</label>
                <input
                  type="text"
                  value={formData.vision.titleFa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vision: { ...formData.vision, titleFa: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Body (English)</label>
                <textarea
                  value={formData.vision.body}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vision: { ...formData.vision, body: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Body (Persian)</label>
                <textarea
                  value={formData.vision.bodyFa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vision: { ...formData.vision, bodyFa: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Info Manager Component
function ContactInfoManager({
  contactInfo,
  setContactInfo,
}: {
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
}) {
  const [formData, setFormData] = useState<ContactInfo>(contactInfo);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(contactInfo);
  }, [contactInfo]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const updated = await res.json();
      setContactInfo(updated);
      alert("Contact info saved successfully!");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save contact info");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Contact Information</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-3d rounded-md bg-gold px-4 py-2 text-black hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gold/30">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address (English)</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address (Persian/Farsi)</label>
            <textarea
              value={formData.addressFa || ""}
              onChange={(e) => setFormData({ ...formData, addressFa: e.target.value })}
              className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <InstagramIcon />
              Instagram Username
            </label>
            <input
              type="text"
              value={formData.instagram || ""}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-gold"
              placeholder="utes.ir"
            />
            <p className="text-xs text-gray-400 mt-1">Enter username without @ symbol</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Messages Manager Component
function MessagesManager({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((msg) => msg.id !== id));
      } else {
        alert("Failed to delete message");
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert("Failed to delete message");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Reviews & Messages</h2>
        <span className="text-gray-400 text-sm">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="bg-[#2a2a2a] rounded-lg p-8 border border-gold/30 text-center">
          <p className="text-gray-400">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-[#2a2a2a] rounded-lg p-6 border border-gold/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-200 mb-1">
                    {msg.name}
                  </h3>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-gold hover:text-gold/80 text-sm block mb-1"
                  >
                    {msg.email}
                  </a>
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-gold/80 hover:text-gold text-sm"
                    >
                      {msg.phone}
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-2">
                    {formatDate(msg.createdAt)}
                  </p>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="btn-3d rounded-md bg-red-600/20 px-3 py-1.5 text-sm text-red-400 hover:bg-red-600/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gold/20">
                <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Instagram Icon Component for Admin Panel
function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-gray-300"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

