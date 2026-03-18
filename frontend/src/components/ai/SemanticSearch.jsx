import { useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';

export default function SemanticSearch({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 light:text-slate-600" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects semantically..."
        className="w-full bg-white/5 light:bg-white border border-white/10 light:border-gray-300 rounded-pill pl-12 pr-4 py-3 text-sm text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-accent-indigo transition-colors"
      />
    </form>
  );
}
