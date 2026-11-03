import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Plus,
  CheckCircle2,
  Trash2,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GroceryCategory, GroceryItem } from '../../types';
import { formatCurrency } from '../../utils/financials';
import { PantryBasket } from '../illustrations/PantryBasket';

export const SmartPantryView: React.FC = () => {
  const {
    groceryItems,
    addGroceryItem,
    updateGroceryItem,
    markGroceryPurchased,
    deleteGroceryItem,
    currency,
  } = useApp();

  // Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<GroceryCategory>('Produce');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('Kg');
  const [newItemPrice, setNewItemPrice] = useState(120);

  // Edit State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editQty, setEditQty] = useState<number>(1);
  const [editUnit, setEditUnit] = useState('Kg');

  const totalSpentInGroceries = groceryItems
    .filter((g) => g.isPurchased)
    .reduce((sum, g) => sum + (g.actualPrice || g.estimatedPrice || 0), 0);

  const totalPendingGroceries = groceryItems
    .filter((g) => !g.isPurchased)
    .reduce((sum, g) => sum + (g.estimatedPrice || 0), 0);

  const handleAddGrocery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    await addGroceryItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: Number(newItemQuantity) || 1,
      unit: newItemUnit || 'Kg',
      estimatedPrice: Number(newItemPrice) || 0,
    });

    setNewItemName('');
  };

  const startEdit = (item: GroceryItem) => {
    setEditingItemId(item.id);
    setEditName(item.name);
    setEditPrice(item.actualPrice || item.estimatedPrice || 0);
    setEditQty(item.quantity);
    setEditUnit(item.unit);
  };

  const saveEdit = async (item: GroceryItem) => {
    await updateGroceryItem(item.id, {
      name: editName.trim() || item.name,
      estimatedPrice: Number(editPrice),
      quantity: Number(editQty),
      unit: editUnit,
    });
    setEditingItemId(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* SmartPantry Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <PantryBasket size={90} />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] font-bold text-xs uppercase tracking-wider mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span>SHOPPING LIST MANAGER</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#242139] font-heading">Smart Pantry</h2>
            <p className="text-sm text-[#77748B] mt-1 max-w-2xl">
              Organize your household shopping list, mark purchased groceries, and track total grocery spending.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left sm:text-right">
            <span className="text-[11px] font-bold text-[#77748B] uppercase block">Purchased Total</span>
            <div className="text-xl sm:text-2xl font-black text-[#10B981] font-mono mt-0.5">
              {formatCurrency(totalSpentInGroceries, currency)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-gray-200 shadow-sm text-left sm:text-right">
            <span className="text-[11px] font-bold text-[#7557E8] uppercase block">Estimated Remaining</span>
            <div className="text-xl sm:text-2xl font-black text-[#4B35A8] font-mono mt-0.5">
              {formatCurrency(totalPendingGroceries, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      <form
        onSubmit={handleAddGrocery}
        className="glass-card rounded-2xl p-5 border border-white grid grid-cols-1 sm:grid-cols-6 gap-3 shadow-sm"
      >
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-[#77748B] mb-1">Item Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Milk, Rice, Tomatoes"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#77748B] mb-1">Category</label>
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as GroceryCategory)}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
          >
            <option value="Produce">🥬 Produce</option>
            <option value="Dairy">🥛 Dairy</option>
            <option value="Meat & Fish">🥩 Meat & Fish</option>
            <option value="Pantry">🥫 Pantry</option>
            <option value="Bakery">🍞 Bakery</option>
            <option value="Beverages">🧃 Beverages</option>
            <option value="Household">🧼 Household</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-16">
            <label className="block text-[11px] font-bold text-[#77748B] mb-1">Qty</label>
            <input
              type="number"
              min="1"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] text-center font-mono"
            />
          </div>
          <div className="w-16">
            <label className="block text-[11px] font-bold text-[#77748B] mb-1">Unit</label>
            <input
              type="text"
              placeholder="Unit"
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#77748B] mb-1">Est. Price ({currency})</label>
          <input
            type="number"
            min="0"
            step="10"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#75D9B0] text-[#242139] font-extrabold text-xs hover:bg-[#059669] hover:text-white transition flex items-center justify-center gap-1 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </form>

      {/* Grocery List Items Table */}
      <div className="glass-card rounded-2xl p-6 border border-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#242139] font-heading">Current Shopping List</h3>
          <span className="text-xs font-bold text-[#77748B]">
            {groceryItems.length} {groceryItems.length === 1 ? 'Item' : 'Items'} Total
          </span>
        </div>

        {groceryItems.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#242139]">Your shopping list is empty</p>
            <p className="text-xs text-[#77748B]">
              Add your own shopping items above to start tracking your groceries.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {groceryItems.map((item) => {
              const isEditing = editingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition ${
                    item.isPurchased
                      ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                      : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => markGroceryPurchased(item.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                        item.isPurchased
                          ? 'bg-[#059669] border-[#059669] text-white'
                          : 'border-gray-300 hover:border-[#059669]'
                      }`}
                      title={item.isPurchased ? 'Mark Unpurchased' : 'Mark Purchased'}
                    >
                      {item.isPurchased && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="p-1 rounded-lg border border-[#7557E8] text-xs font-bold"
                          />
                          <input
                            type="number"
                            value={editQty}
                            onChange={(e) => setEditQty(Number(e.target.value))}
                            className="w-12 p-1 rounded-lg border border-[#7557E8] text-xs font-bold font-mono"
                          />
                          <input
                            type="text"
                            value={editUnit}
                            onChange={(e) => setEditUnit(e.target.value)}
                            className="w-12 p-1 rounded-lg border border-[#7557E8] text-xs font-bold"
                          />
                        </div>
                      ) : (
                        <>
                          <span
                            className={`text-sm font-bold ${
                              item.isPurchased ? 'line-through text-gray-500' : 'text-[#242139]'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="ml-2 text-xs font-semibold text-[#77748B]">
                            ({item.quantity} {item.unit}) • {item.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-20 p-1 rounded-lg border border-[#7557E8] text-xs font-mono font-bold"
                      />
                    ) : (
                      <span className={`font-mono text-sm font-bold ${item.isPurchased ? 'text-emerald-700' : 'text-[#7557E8]'}`}>
                        {formatCurrency(item.actualPrice || item.estimatedPrice, currency)}
                      </span>
                    )}

                    {item.isPurchased && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hidden sm:inline-block">
                        Purchased ✓
                      </span>
                    )}

                    {isEditing ? (
                      <button
                        onClick={() => saveEdit(item)}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                        title="Save Changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#7557E8]"
                        title="Edit Item"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteGroceryItem(item.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
