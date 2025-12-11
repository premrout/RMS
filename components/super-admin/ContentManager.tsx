
import React from 'react';
import { LayoutTemplate, FileText, Edit, Eye, Plus } from 'lucide-react';
import DataTable from '../ui/DataTable';

const ContentManager: React.FC = () => {
  const pages = [
      { id: 1, title: 'Landing Page', slug: '/', status: 'Published', lastUpdated: '2 days ago' },
      { id: 2, title: 'Pricing Page', slug: '/pricing', status: 'Published', lastUpdated: '1 week ago' },
      { id: 3, title: 'Terms of Service', slug: '/terms', status: 'Published', lastUpdated: '1 month ago' },
      { id: 4, title: 'Privacy Policy', slug: '/privacy', status: 'Draft', lastUpdated: 'Yesterday' },
  ];

  const columns = [
      { key: 'title', label: 'Page Title', render: (row: any) => <span className="font-bold text-slate-800">{row.title}</span> },
      { key: 'slug', label: 'URL Slug', render: (row: any) => <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{row.slug}</span> },
      { key: 'status', label: 'Status', render: (row: any) => (
          <span className={`text-xs font-bold px-2 py-1 rounded ${row.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {row.status}
          </span>
      )},
      { key: 'lastUpdated', label: 'Last Updated' },
      { key: 'actions', label: 'Actions', render: () => (
          <div className="flex gap-2 justify-end">
              <button className="p-2 text-slate-400 hover:text-indigo-600"><Eye size={16}/></button>
              <button className="p-2 text-slate-400 hover:text-indigo-600"><Edit size={16}/></button>
          </div>
      )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Content Management</h2>
           <p className="text-sm text-slate-500">Manage public facing pages and resources.</p>
        </div>
      </div>

      <DataTable 
        title="Web Pages"
        data={pages}
        columns={columns}
        onAdd={() => alert("CMS Editor Mock")}
        addButtonLabel="Create Page"
      />
    </div>
  );
};

export default ContentManager;
