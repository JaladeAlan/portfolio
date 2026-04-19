'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut, Plus, Edit, Trash2, X, Save, Upload, Eye, EyeOff,
  FolderOpen, Wrench, MessageSquare, ChevronDown, ChevronUp, LayoutDashboard
} from 'lucide-react';
import api from '@/lib/api';
import { Project, Skill, ContactMessage, Admin } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'projects' | 'skills' | 'messages';

interface ProjectForm {
  title: string;
  summary: string;
  description: string;
  stack: string;
  github: string;
  website: string;
  image: File | null;
}

interface SkillForm {
  name: string;
  category: string;
  level: number;
}

const emptyProject: ProjectForm = {
  title: '', summary: '', description: '', stack: '', github: '', website: '', image: null,
};

const emptySkill: SkillForm = { name: '', category: '', level: 80 };

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Modal states
  const [projectModal, setProjectModal] = useState<{ open: boolean; editing: Project | null }>({ open: false, editing: null });
  const [skillModal, setSkillModal] = useState<{ open: boolean; editing: Skill | null }>({ open: false, editing: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: 'project' | 'skill'; id: number } | null>(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // ─── Auth check ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/admin/login'); return; }

    api.get('/auth/me')
      .then((res) => setAdmin(res.data?.data || res.data))
      .catch(() => { localStorage.removeItem('token'); router.replace('/admin/login'); });
  }, [router]);

  // ─── Load data ──────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const [pRes, sRes, mRes] = await Promise.all([
        api.get('/projects'),
        api.get('/skills'),
        api.get('/contact'),
      ]);
      setProjects(Array.isArray(pRes.data) ? pRes.data : pRes.data?.data || []);
      setSkills(Array.isArray(sRes.data) ? sRes.data : sRes.data?.data || []);
      setMessages(Array.isArray(mRes.data) ? mRes.data : mRes.data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0804]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-600/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-stone-500 text-sm font-mono">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'projects', label: 'Projects', icon: FolderOpen, count: projects.length },
    { key: 'skills', label: 'Skills', icon: Wrench, count: skills.length },
    { key: 'messages', label: 'Messages', icon: MessageSquare, count: messages.length },
  ];

  return (
    <div className="min-h-screen bg-[#0a0804]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0804]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-amber-600/40 bg-amber-600/10 flex items-center justify-center">
              <LayoutDashboard size={14} className="text-amber-500" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Dashboard</p>
              {admin && <p className="text-stone-600 text-xs">{admin.name}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-stone-400 hover:text-white text-xs transition-colors"
            >
              <Eye size={12} /> View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-900/10 text-red-400 hover:text-red-300 text-xs transition-colors"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`p-4 rounded-xl border transition-all text-left ${
                activeTab === t.key
                  ? 'border-amber-600/30 bg-amber-600/8'
                  : 'border-white/5 bg-white/2 hover:border-white/10'
              }`}
            >
              <t.icon size={16} className={`mb-2 ${activeTab === t.key ? 'text-amber-500' : 'text-stone-600'}`} />
              <p className={`text-2xl font-bold font-mono ${activeTab === t.key ? 'text-amber-400' : 'text-white'}`}>
                {t.count}
              </p>
              <p className="text-stone-500 text-xs mt-0.5">{t.label}</p>
            </button>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/3 border border-white/5 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.key
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'projects' && (
          <ProjectsTab
            projects={projects}
            onAdd={() => setProjectModal({ open: true, editing: null })}
            onEdit={(p) => setProjectModal({ open: true, editing: p })}
            onDelete={(id) => setDeleteModal({ open: true, type: 'project', id })}
          />
        )}
        {activeTab === 'skills' && (
          <SkillsTab
            skills={skills}
            onAdd={() => setSkillModal({ open: true, editing: null })}
            onEdit={(s) => setSkillModal({ open: true, editing: s })}
            onDelete={(id) => setDeleteModal({ open: true, type: 'skill', id })}
          />
        )}
        {activeTab === 'messages' && <MessagesTab messages={messages} />}
      </div>

      {/* Modals */}
      {projectModal.open && (
        <ProjectModal
          editing={projectModal.editing}
          saving={saving}
          error={formError}
          onClose={() => { setProjectModal({ open: false, editing: null }); setFormError(''); }}
          onSave={async (formData) => {
            setSaving(true);
            setFormError('');
            try {
              if (projectModal.editing) {
                await api.post(`/projects/${projectModal.editing.id}`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
              } else {
                await api.post('/projects', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
              }
              await loadData();
              setProjectModal({ open: false, editing: null });
            } catch (e: any) {
              setFormError(e?.response?.data?.message || 'Failed to save project.');
            } finally {
              setSaving(false);
            }
          }}
        />
      )}

      {skillModal.open && (
        <SkillModal
          editing={skillModal.editing}
          saving={saving}
          error={formError}
          onClose={() => { setSkillModal({ open: false, editing: null }); setFormError(''); }}
          onSave={async (data) => {
            setSaving(true);
            setFormError('');
            try {
              if (skillModal.editing) {
                await api.put(`/skills/${skillModal.editing.id}`, data);
              } else {
                await api.post('/skills', data);
              }
              await loadData();
              setSkillModal({ open: false, editing: null });
            } catch (e: any) {
              setFormError(e?.response?.data?.message || 'Failed to save skill.');
            } finally {
              setSaving(false);
            }
          }}
        />
      )}

      {deleteModal?.open && (
        <DeleteModal
          type={deleteModal.type}
          onCancel={() => setDeleteModal(null)}
          onConfirm={async () => {
            try {
              if (deleteModal.type === 'project') {
                await api.delete(`/projects/${deleteModal.id}`);
              } else {
                await api.delete(`/skills/${deleteModal.id}`);
              }
              await loadData();
            } catch {}
            setDeleteModal(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────
function ProjectsTab({ projects, onAdd, onEdit, onDelete }: {
  projects: Project[];
  onAdd: () => void;
  onEdit: (p: Project) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold">Projects ({projects.length})</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderOpen} message="No projects yet. Add your first project!" />
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition-colors"
            >
              {p.image_url && (
                <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              )}
              {!p.image_url && (
                <div className="w-12 h-12 rounded-lg bg-stone-800 flex items-center justify-center flex-shrink-0">
                  <FolderOpen size={16} className="text-stone-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{p.title}</p>
                {p.stack && <p className="text-amber-600 font-mono text-xs truncate">{p.stack}</p>}
                <p className="text-stone-600 text-xs truncate mt-0.5">{p.summary}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.website && (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-stone-500 hover:text-stone-300 transition-colors"
                    title="View live"
                  >
                    <Eye size={14} />
                  </a>
                )}
                <button
                  onClick={() => onEdit(p)}
                  className="p-1.5 text-stone-500 hover:text-amber-400 transition-colors"
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Skills Tab ───────────────────────────────────────────────────────────────
function SkillsTab({ skills, onAdd, onEdit, onDelete }: {
  skills: Skill[];
  onAdd: () => void;
  onEdit: (s: Skill) => void;
  onDelete: (id: number) => void;
}) {
  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold">Skills ({skills.length})</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={14} /> Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <EmptyState icon={Wrench} message="No skills yet. Add your first skill!" />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <p className="text-stone-500 text-xs uppercase tracking-widest font-mono mb-3">{category}</p>
              <div className="space-y-2">
                {items.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-stone-200 text-sm font-medium">{s.name}</p>
                        <span className="text-amber-500 font-mono text-xs">{s.level}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onEdit(s)}
                        className="p-1.5 text-stone-500 hover:text-amber-400 transition-colors"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
                        className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────
function MessagesTab({ messages }: { messages: ContactMessage[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold">Messages ({messages.length})</h2>
      </div>

      {messages.length === 0 ? (
        <EmptyState icon={MessageSquare} message="No messages yet." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-white/5 bg-white/2 overflow-hidden"
            >
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/3 transition-colors"
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              >
                <div className="w-9 h-9 rounded-full bg-amber-600/15 border border-amber-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-500 text-xs font-bold uppercase">
                    {m.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-stone-200 text-sm font-medium">{m.name}</p>
                  <p className="text-stone-500 text-xs truncate">{m.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-stone-600 text-xs hidden sm:block">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                  {expanded === m.id ? (
                    <ChevronUp size={14} className="text-stone-500" />
                  ) : (
                    <ChevronDown size={14} className="text-stone-500" />
                  )}
                </div>
              </button>
              {expanded === m.id && (
                <div className="px-4 pb-4 pt-0 border-t border-white/5">
                  <p className="text-stone-400 text-sm leading-relaxed mt-3">{m.message}</p>
                  <a
                    href={`mailto:${m.email}?subject=Re: Your message`}
                    className="inline-flex items-center gap-1.5 mt-4 text-amber-500 hover:text-amber-400 text-xs font-medium transition-colors"
                  >
                    Reply via Email →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Project Modal ────────────────────────────────────────────────────────────
function ProjectModal({ editing, saving, error, onClose, onSave }: {
  editing: Project | null;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (fd: FormData) => void;
}) {
  const [form, setForm] = useState<ProjectForm>({
    title: editing?.title || '',
    summary: editing?.summary || '',
    description: editing?.description || '',
    stack: editing?.stack || '',
    github: editing?.github || '',
    website: editing?.website || '',
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(editing?.image_url || null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, v as any);
    });
    onSave(fd);
  };

  return (
    <Modal title={editing ? 'Edit Project' : 'New Project'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-400 text-xs p-3 rounded-lg bg-red-900/10 border border-red-500/20">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title *">
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className={inputCls} placeholder="Project title" />
          </Field>
          <Field label="Stack">
            <input value={form.stack} onChange={e => setForm({ ...form, stack: e.target.value })}
              className={inputCls} placeholder="React, Laravel, MySQL" />
          </Field>
        </div>

        <Field label="Summary *">
          <textarea required rows={2} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })}
            className={`${inputCls} resize-none`} placeholder="One-line description" />
        </Field>

        <Field label="Full Description">
          <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className={`${inputCls} resize-none`} placeholder="Detailed description..." />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="GitHub URL">
            <input type="url" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })}
              className={inputCls} placeholder="https://github.com/..." />
          </Field>
          <Field label="Live Site URL">
            <input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
              className={inputCls} placeholder="https://..." />
          </Field>
        </div>

        {/* Image */}
        <Field label="Project Image">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-white/8 border-dashed bg-white/2 hover:border-amber-600/30 cursor-pointer transition-colors">
            <Upload size={14} className="text-stone-500 flex-shrink-0" />
            <span className="text-stone-500 text-xs">{form.image ? form.image.name : 'Click to upload image'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          {preview && (
            <div className="relative mt-2 h-28 rounded-lg overflow-hidden border border-white/8">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/8 text-stone-400 hover:text-white text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold disabled:opacity-50 transition-colors">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14} /> Save</>}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Skill Modal ──────────────────────────────────────────────────────────────
function SkillModal({ editing, saving, error, onClose, onSave }: {
  editing: Skill | null;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (data: SkillForm) => void;
}) {
  const [form, setForm] = useState<SkillForm>({
    name: editing?.name || '',
    category: editing?.category || '',
    level: editing?.level ?? 80,
  });

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'];

  return (
    <Modal title={editing ? 'Edit Skill' : 'New Skill'} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
        {error && <p className="text-red-400 text-xs p-3 rounded-lg bg-red-900/10 border border-red-500/20">{error}</p>}

        <Field label="Skill Name *">
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className={inputCls} placeholder="e.g. React, Laravel, PostgreSQL" />
        </Field>

        <Field label="Category">
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className={`${inputCls} appearance-none`}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label={`Proficiency Level — ${form.level}%`}>
          <input
            type="range" min={0} max={100} value={form.level}
            onChange={e => setForm({ ...form, level: +e.target.value })}
            className="w-full accent-amber-500"
          />
          <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all"
              style={{ width: `${form.level}%` }} />
          </div>
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/8 text-stone-400 hover:text-white text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold disabled:opacity-50 transition-colors">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14} /> Save</>}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ type, onCancel, onConfirm }: {
  type: 'project' | 'skill';
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <p className="text-stone-400 text-sm mb-6">
        Are you sure you want to delete this {type}? This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-white/8 text-stone-400 hover:text-white text-sm transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors">
          Delete
        </button>
      </div>
    </Modal>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/8 bg-[#0e0c09] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="font-display text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-stone-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-stone-400 text-xs font-medium mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="text-center py-16 border border-white/5 rounded-xl border-dashed">
      <Icon size={32} className="text-stone-700 mx-auto mb-3" />
      <p className="text-stone-600 text-sm">{message}</p>
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl bg-white/3 border border-white/8 text-white placeholder-stone-700 focus:outline-none focus:border-amber-600/50 focus:bg-white/5 transition-all text-sm";
