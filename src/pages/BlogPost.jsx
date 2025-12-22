import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogById, deleteBlog, createComment, deleteComment, updateComment } from '../services/blog.service';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, User, Share2, Bookmark, Send, MessageCircle, Trash2, Edit } from 'lucide-react';
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch blog post", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlog(id);
        navigate('/');
      } catch (error) {
        console.error("Failed to delete blog", error);
        alert("Failed to delete blog. You may not have permission.");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await createComment({
        comment: comment,
        blogId: id,
        userId: user.idUser
      });
      const data = await getBlogById(id);
      setPost(data);
      setComment('');
    } catch (error) {
      console.error("Failed to post comment", error);
      alert("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await deleteComment(commentId);
        const data = await getBlogById(id);
        setPost(data);
      } catch (error) {
        console.error("Failed to delete comment", error);
        alert("Failed to delete comment.");
      }
    }
  };

  const startEditingComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await updateComment(commentId, { comment: editingCommentText });
      const data = await getBlogById(id);
      setPost(data);
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (error) {
      console.error("Failed to update comment", error);
      alert("Failed to update comment.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Blog post not found</h2>
          <Link to="/" className="mt-4 text-indigo-600 hover:text-indigo-500">Return to Home</Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.idUser === post.user?.idUser;
const isAdmin = user?.role === 'Admin';

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all posts
          </Link>
          
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-96 w-full">
            <img 
              src={'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1679&q=80'} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white w-full">
              <div className="flex justify-between items-end">
                <div>
                  <span className="inline-block bg-indigo-600 rounded-full px-3 py-1 text-sm font-semibold mb-4">
                    {post.category?.categoria || 'General'}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown Date'}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      5 min read
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
              {(isOwner || isAdmin) && (
  <div className="flex space-x-2">
    {isOwner && (
      <Link 
        to={`/edit-blog/${post.idBlog}`}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors"
        title="Edit Blog"
      >
        <Edit className="h-5 w-5" />
      </Link>
    )}

    <button 
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
      title="Delete Blog"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  </div>
)}
          <div className="p-8 md:p-12">
            <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full" src={'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} alt={post.user?.name} />
                <div className="ml-4">
                  <p className="text-lg font-bold text-gray-900">{post.user?.name || 'Unknown Author'}</p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="prose prose-indigo prose-lg max-w-none text-gray-600 mb-12">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="border-t border-gray-200 pt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Comments ({post.comments ? post.comments.length : 0})</h3>
              
              {/* Comment List */}
              <div className="space-y-8 mb-10">
  {post.comments && post.comments.map((comment) => {

    // Permisos
    const isCommentOwner = user?.idUser === comment.user?.idUser;
    const isBlogOwner = user?.idUser === post.user?.idUser;
    const isAdmin = user?.role === 'Admin';

    return (
      <div key={comment.idComment} className="flex space-x-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {comment.user?.name
              ? comment.user.name.charAt(0).toUpperCase()
              : 'U'}
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900">
              {comment.user?.name || 'Unknown'}
            </h4>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {comment.createdAt
                  ? new Date(comment.createdAt).toLocaleDateString()
                  : ''}
              </span>

              {/*  Editar → SOLO autor del comentario */}
              {isCommentOwner && (
                <button
                  onClick={() =>
                    startEditingComment(comment.idComment, comment.comment)
                  }
                  className="text-indigo-600 hover:text-indigo-800 p-1"
                  title="Edit comment"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}

              {/* Eliminar → autor, dueño del blog o admin */}
              {(isCommentOwner || isBlogOwner || isAdmin) && (
                <button
                  onClick={() => handleDeleteComment(comment.idComment)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete comment"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Texto o edición */}
          {editingCommentId === comment.idComment ? (
            <div className="mt-2">
              <textarea
                value={editingCommentText}
                onChange={(e) => setEditingCommentText(e.target.value)}
                className="w-full border rounded p-2 text-sm"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleUpdateComment(comment.idComment)}
                  className="text-sm text-white bg-indigo-600 px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="text-sm text-gray-600 px-3 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-600">
              {comment.comment}
            </p>
          )}
        </div>
      </div>
    );
  })}

  {(!post.comments || post.comments.length === 0) && (
    <p className="text-gray-500 italic">
      No comments yet. Be the first to share your thoughts!
    </p>
  )}
</div>


              {user ? (
                <form onSubmit={handleCommentSubmit} className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Leave a comment</h4>
                  <div className="mb-4">
                    <textarea
                      rows="4"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      placeholder="What are your thoughts?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600 mb-4">Please sign in to leave a comment.</p>
                  <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 border-indigo-600">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
