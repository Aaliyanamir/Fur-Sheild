const Article = require('../models/Article');
const notificationEngine = require('../utils/notificationEngine');

const DEFAULT_ARTICLES = [
  {
    title: 'Understanding Dog Nutrition: A Complete Guide',
    excerpt: 'Learn the essentials of canine nutrition, from deciphering dog food labels to understanding macronutrients.',
    category: 'Nutrition',
    author: 'Dr. Sarah Jenkins',
    authorRole: 'Veterinarian',
    readTime: '5 min read',
    status: 'APPROVED',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    content: `
      <p class="mb-4">Proper nutrition is the cornerstone of your dog's health and longevity. Just like humans, dogs require a balanced diet of proteins, carbohydrates, fats, vitamins, and minerals to thrive.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">The Role of Protein</h3>
      <p class="mb-4">Proteins are the building blocks of life. They are essential for muscle growth, tissue repair, and a healthy immune system. Look for high-quality animal proteins like chicken, beef, or salmon as the first ingredient in your dog's food.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Deciphering Labels</h3>
      <p>Always read the ingredient list. Avoid foods with excessive fillers like corn or soy, and watch out for artificial colors and preservatives. A good diet translates directly to a shiny coat, clear eyes, and high energy levels.</p>
    `
  },
  {
    title: 'Cat Behavioral Signs: What Is Your Feline Saying?',
    excerpt: 'Decoding your cat’s body language, from tail flicks to purring, to better understand their needs and emotions.',
    category: 'Behavior',
    author: 'Mark Thompson',
    authorRole: 'Behaviorist',
    readTime: '7 min read',
    status: 'APPROVED',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    content: `
      <p class="mb-4">Cats are famously mysterious, but they constantly communicate their feelings through subtle body language. Understanding these cues can drastically improve your bond with your feline friend.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">The Tale of the Tail</h3>
      <p class="mb-4">A cat's tail is an emotional barometer. A high, straight tail indicates confidence and happiness. A puffed-up tail means fear or aggression, while a low, tucked tail signals submission or anxiety.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Ears and Eyes</h3>
      <p>Ears flattened against the head usually mean a cat is frightened or ready to defend itself. Slow blinking, on the other hand, is a sign of ultimate trust and affection—often called a "kitty kiss."</p>
    `
  },
  {
    title: 'Puppy Training 101: The First 30 Days',
    excerpt: 'Set your puppy up for success with positive reinforcement, crate training basics, and a consistent routine.',
    category: 'Training',
    author: 'Dr. Emily Chen',
    authorRole: 'Veterinarian',
    readTime: '6 min read',
    status: 'APPROVED',
    image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=600&q=80',
    content: `
      <p class="mb-4">Bringing a new puppy home is incredibly exciting, but the first 30 days are crucial for establishing a solid foundation for their lifelong behavior.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Establishing Routine</h3>
      <p class="mb-4">Puppies thrive on predictability. Set a strict schedule for meals, potty breaks, play, and naps. Consistency helps them feel secure and accelerates potty training.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Positive Reinforcement</h3>
      <p>Reward good behavior immediately with treats, praise, or play. Never use physical punishment, as it breaks trust and can lead to anxiety-driven behavioral issues later in life.</p>
    `
  },
  {
    title: 'Senior Pet Care: Comfort in the Golden Years',
    excerpt: 'How to adjust your home, diet, and veterinary visits to ensure your aging pet remains comfortable and happy.',
    category: 'Wellness',
    author: 'Dr. Robert Allen',
    authorRole: 'Veterinarian',
    readTime: '8 min read',
    status: 'APPROVED',
    image: 'https://images.unsplash.com/photo-1537151608804-ea2d15a440e2?auto=format&fit=crop&w=600&q=80',
    content: `
      <p class="mb-4">As our pets age, their needs change significantly. Recognizing these changes and adapting your care strategy is the best way to ensure their golden years are comfortable.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Joint Health & Mobility</h3>
      <p class="mb-4">Arthritis is common in older pets. Consider adding joint supplements (like Glucosamine) to their diet. Provide orthopedic beds and use ramps to help them get onto furniture or into the car without jumping.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">More Frequent Vet Visits</h3>
      <p>Senior pets should see the vet twice a year for comprehensive blood work and wellness checks. Early detection of issues like kidney disease or diabetes can significantly extend their quality of life.</p>
    `
  }
];

// @desc    Get all approved articles (Public)
const getApprovedArticles = async (req, res) => {
  try {
    let articles = await Article.find({ status: 'APPROVED' }).sort({ createdAt: -1 });
    
    // Auto-seed if database empty
    if (!articles || articles.length === 0) {
      await Article.insertMany(DEFAULT_ARTICLES);
      articles = await Article.find({ status: 'APPROVED' }).sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all articles including pending (Admin)
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new blog article (User/Vet/Owner/Admin)
const createArticle = async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, image } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, message: 'Title, excerpt, and content are required' });
    }

    const isAdmin = req.user.role === 'SUPER_ADMIN' || req.user.role === 'SYSTEM_ADMIN';
    const initialStatus = isAdmin ? 'APPROVED' : 'PENDING';

    const article = await Article.create({
      title,
      excerpt,
      content,
      category: category || 'General',
      readTime: readTime || '5 min read',
      image: image || '/images/pet-owner.jpg',
      author: req.user.name,
      authorRole: req.user.role || 'User',
      authorUser: req.user._id,
      status: initialStatus
    });

    res.status(201).json({
      success: true,
      message: isAdmin ? 'Article published live!' : 'Article submitted! Pending Admin Approval.',
      data: article
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject article (Admin)
const updateArticleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    article.status = status;
    await article.save();

    // Notify author user if approved
    if (status === 'APPROVED' && article.authorUser) {
      await notificationEngine.createNotification({
        recipient: article.authorUser,
        type: 'SYSTEM',
        title: 'Blog Article Approved! 🎉',
        message: `Your article "${article.title}" has been approved by admin and is now live on Care Hub.`,
        actionUrl: '/care-hub'
      });
    }

    res.status(200).json({ success: true, message: `Article status updated to ${status}`, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete article
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    await article.deleteOne();
    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getApprovedArticles,
  getAllArticles,
  createArticle,
  updateArticleStatus,
  deleteArticle
};
