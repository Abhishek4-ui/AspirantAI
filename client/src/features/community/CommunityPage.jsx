import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Heart, Send, Sparkles, AlertCircle, Share2 } from 'lucide-react';

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [examTag, setExamTag] = useState('General');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community/posts');
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await api.post('/community/posts', { title, content, examTag });
      if (res.data.success) {
        setPosts([res.data.post, ...posts]);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/community/posts/${postId}/like`);
      if (res.data.success) {
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/community/posts/${postId}/comment`, { content: commentText });
      if (res.data.success) {
        setCommentText('');
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Aspirant Community Hub</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
          Discuss strategies, book recommendations, and exam questions with verified aspirants across India.
        </p>
      </div>

      {/* Create Post */}
      <form onSubmit={handleCreatePost} className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Start a Discussion</h3>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Topic title or question (e.g. Best strategy for CSAT math?)..."
          className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
        />
        <textarea
          rows={3}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your doubt, experience, or study tip..."
          className="w-full p-4 rounded-xl glass-input text-xs"
        />
        <div className="flex items-center justify-between pt-1">
          <select
            value={examTag}
            onChange={(e) => setExamTag(e.target.value)}
            className="px-3 py-1.5 rounded-xl glass-input text-xs"
          >
            <option value="General">General Discussion</option>
            <option value="Civil Services">Civil Services (UPSC/BPSC)</option>
            <option value="SSC">SSC</option>
            <option value="Railway">Railway</option>
            <option value="Banking">Banking</option>
            <option value="Boards">Class 10/12 Boards</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Post Discussion
          </button>
        </div>
      </form>

      {/* Feed */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading discussions...</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{post.authorName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-neon-cyan border border-slate-200 dark:border-slate-700">
                    {post.examTag}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px]">
                  {new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{post.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <Heart className="w-4 h-4" /> {post.likes?.length || 0} Likes
                </button>
                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)}
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-neon-cyan transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> {post.comments?.length || 0} Replies
                </button>
              </div>

              {/* Comment Thread */}
              {activeCommentPostId === post._id && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                  {post.comments?.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="font-bold text-neon-cyan mb-1">{c.authorName}</div>
                      <p className="text-slate-700 dark:text-slate-300">{c.content}</p>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a helpful response..."
                      className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="px-4 py-2 rounded-xl bg-electric-blue text-white text-xs font-bold"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
