import { useState, useEffect } from 'react'
import api from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks?status=${filter}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post('/tasks', { title });
      setTitle('');
      fetchTasks();
    } catch (error) {
      console.error("Gagal menambah task", error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Gagal mengubah status", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus task ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Gagal menghapus task", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:py-10 sm:px-6">
      {/* Container utama dengan batas lebar dan padding responsif */}
      <div className="max-w-xl mx-auto bg-white shadow-md sm:shadow-lg rounded-xl p-4 sm:p-8 w-full">
        
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 text-center">
          Mini Task Management
        </h2>
        
        {/* Form Input: Menyesuaikan jadi kolom bertumpuk di HP kecil, sejajar di layar sedang ke atas */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
          <input 
            type="text" 
            placeholder="Judul atau deskripsi task..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 text-sm sm:text-base rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
          >
            Tambah
          </button>
        </form>

        {/* Filter Status: Fleksibel dan rapi di semua layar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4 sm:mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-sm font-medium text-slate-600">Filter Status:</span>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="px-3 py-1.5 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="all">Semua</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Daftar Task */}
        {tasks.length === 0 ? (
          <p className="text-center text-slate-400 py-6 text-sm sm:text-base">Belum ada task tersedia.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li 
                key={task.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start sm:items-center gap-3 flex-1 w-full sm:mr-4 overflow-hidden">
                  <input 
                    type="checkbox" 
                    checked={task.status === 'completed'} 
                    onChange={() => handleToggleStatus(task.id)}
                    className="w-4 h-4 mt-1 sm:mt-0 text-blue-600 rounded focus:ring-blue-500 cursor-pointer shrink-0"
                  />
                  <span className={`text-sm sm:text-base text-slate-700 break-words w-full ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(task.id)} 
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer self-end sm:self-auto shrink-0"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}
export default App;