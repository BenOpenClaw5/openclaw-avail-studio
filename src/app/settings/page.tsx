'use client';

import { useState } from 'react';
import { Bell, Lock, Palette, Database } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    darkMode: true,
    dataRetention: '90',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    alert('Settings saved!');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="glass rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          👤 Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value="ben@example.com"
              disabled
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Meta Business Name</label>
            <input
              type="text"
              placeholder="Your business name"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="glass rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-sm text-slate-400">Receive alerts for important account activity</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Weekly Digest</p>
              <p className="text-sm text-slate-400">Get a summary of your account performance weekly</p>
            </div>
            <button
              onClick={() => handleToggle('weeklyDigest')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.weeklyDigest ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Display Section */}
      <div className="glass rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Palette size={20} />
          Display
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Dark Mode</p>
            <p className="text-sm text-slate-400">Always use dark theme</p>
          </div>
          <button
            onClick={() => handleToggle('darkMode')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              settings.darkMode ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Section */}
      <div className="glass rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Database size={20} />
          Data & Storage
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Data Retention Period</label>
            <select
              value={settings.dataRetention}
              onChange={(e) => setSettings((prev) => ({ ...prev, dataRetention: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-600"
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </select>
          </div>
          <p className="text-xs text-slate-500">
            Data older than the selected period will be archived. You can still access archived data for reporting.
          </p>
        </div>
      </div>

      {/* Connection Section */}
      <div className="glass rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock size={20} />
          Meta Connection
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div>
              <p className="text-white font-medium">Connected Account</p>
              <p className="text-sm text-slate-400">Your Meta account is securely connected</p>
            </div>
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <button className="w-full px-4 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-900/20 transition">
            Disconnect Meta Account
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Save Changes
        </button>
        <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition">
          Cancel
        </button>
      </div>
    </div>
  );
}
