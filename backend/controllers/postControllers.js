const posts = [{
        id: 1,
        title: "Post One",
        body: "Body One Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus recusandae quas, asperiores quidem atque odit quia blanditiis quis, consectetur suscipit veritatis sed! Dolorum dolore cumque nostrum minus dicta vel voluptatem",
        author: "admin",
        date: new Date(),
        views: 4,
        comments: [{
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
            {
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
        ],
        category: ["fashion"],
    },
    {
        id: 2,
        title: "Post Two",
        body: "Body Two ipisicing elitorem ipsum dolor sit amet consectetur ad. Possimus recusandae quas, asperiores quidem atque odit quia blanditiis quis, consectetur suscipit veritatis sed! Dolorum dolore cumque nostrum minus dicta vel voluptatem!",
        author: "admin",
        date: new Date(),
        views: 4,
        comments: [{
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
            {
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
        ],
        category: ["technology"],
    },
    {
        id: 3,
        title: "Post Three",
        body: "Body Three amet conse ipsum dolor sitLoremctetur adipisicing elit. Possimus recusandae quas, asperiores quidem atque odit quia blanditiis quis, consectetur suscipit veritatis sed! Dolorum dolore cumque nostrum minus dicta vel voluptatem!",
        author: "admin",
        date: new Date(),
        views: 4,
        comments: [{
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
            {
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
        ],
        category: ["lifestyle"],
    },
    {
        id: 4,
        title: "Post Four",
        body: "Body Four amet conse ipsum dolor sitLoremctetur adipisicing elit. Possimus recusandae quas, asperiores quidem atque odit quia blanditiis quis, consectetur suscipit veritatis sed! Dolorum dolore cumque nostrum minus dicta vel voluptatem!",
        author: "admin",
        date: new Date(),
        views: 4,
        comments: [{
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
            {
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
        ],
        category: ["fashion"],
    },
    {
        id: 5,
        title: "Post Five",
        body: "Body Five amet conse ipsum dolor sitLoremctetur adipisicing elit. Possimus recusandae quas, asperiores quidem atque odit quia blanditiis quis, consectetur suscipit veritatis sed! Dolorum dolore cumque nostrum minus dicta vel voluptatem!",
        author: "admin",
        date: new Date(),
        views: 4,
        comments: [{
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
            {
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
        ],
        category: ["politics"],
    },
    {
        id: 8,
        title: "Post Eight",
        body: "Body Eight amet conse ipsum dolor sitLoremctetur adipisicing elit. Possimus recusandae quas, asperiores quidem atque odit quia blanditiis quis, consectetur suscipit veritatis sed! Dolorum dolore cumque nostrum minus dicta vel voluptatem!",
        author: "admin",
        date: new Date(),
        views: 4,
        comments: [{
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
            {
                id: Math.floor(Math.random() * 344),
                user: "Alexa",
                body: "Two ipisicing elitorem",
            },
        ],
        category: ["lifestyle"],
    },
];

const getFeatured = (req, res) => {
    res.json({
        latest: posts.slice(0, 3),
        popular: posts.slice(3, 6),
    });
};

const getPosts = (req, res) => {
    res.json(posts);
};

const getCategory = (req, res) => {
    const category = req.params.category;

    const catPosts = posts.filter((post) =>
        post.category.some((cat) => cat === category)
    );
    res.json(catPosts);
};

const getPost = (req, res) => {
    const id = req.params.id;
    const post = posts.find((post) => post.id === +id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.json({
        post,
        more: posts.slice(0, 3),
    });
};

module.exports = { getPosts, getPost, getFeatured, getCategory };