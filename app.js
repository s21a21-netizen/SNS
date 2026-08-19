const SUPABASE_URL = 'https://pldrljxrlrlggwnxnogy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZHJsanhybHJsZ2d3bnhub2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2NTcsImV4cCI6MjEwMjcxNDY1N30.Fa1yYP4vC3d6H2fXQxg6AEsFNvRIkqOqMYg-U54Djws';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 投稿を取得して表示
async function fetchPosts() {
  const { data, error } = await db
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error(error);

  const timeline = document.getElementById('timeline');
  timeline.innerHTML = data.map(post => `
    <div class="post">
      <div class="user">${escapeHtml(post.username || '名無し')}</div>
      <div class="text">${escapeHtml(post.content)}</div>
      <div class="date">${new Date(post.created_at).toLocaleString('ja-JP')}</div>
    </div>
  `).join('');
}

// 投稿ボタンの処理
document.getElementById('post-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const content = document.getElementById('content').value.trim();

  if (!content) {
    alert('文字を入力してね');
    return;
  }
  if (content.length > 140) {
    alert('140文字以内で入力してね');
    return;
  }

  const { error } = await db.from('posts').insert([{ username, content }]);

  if (error) {
    alert('投稿に失敗しました');
  } else {
    document.getElementById('content').value = '';
    fetchPosts();
  }
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

fetchPosts();
