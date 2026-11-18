import React from 'react';
import { Pill, Clock, Edit2, Trash2, Check, X, Timer } from 'lucide-react';

const MedicineCard = ({ medicine, onAction, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'taken': return 'badge-taken';
      case 'skipped': return 'badge-skipped';
      default: return 'badge-active';
    }
  };

  return (
    <div className="premium-card flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Pill size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{medicine.name}</h3>
            <p className="text-sm text-slate-500 font-medium">{medicine.dosage} • {medicine.mealType}</p>
          </div>
        </div>
        <span className={`badge ${getStatusClass(medicine.status)}`}>
          {medicine.status || 'Active'}
        </span>
      </div>

      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
        <Clock size={14} />
        <span>Reminder at {medicine.reminderTime}</span>
      </div>

      {medicine.notes && (
        <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
          {medicine.notes}
        </p>
      ) }

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
        <button onClick={() => onAction('taken')} className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 transition-colors">
          <Check size={14} /> Taken
        </button>
        <button onClick={() => onAction('snooze')} className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors">
          <Timer size={14} /> Snooze
        </button>
        <button onClick={() => onAction('skipped')} className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
          <X size={14} /> Skip
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onEdit} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <Edit2 size={16} />
        </button>
        <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
