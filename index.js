const container = document.querySelector(".container");
const loading = document.querySelector(".loading");

// store last document retrieved
let latestDoc = null;

const getNextReviews = async (doc) => {
  loading.classList.add("active");

  const ref = db
    .collection("Posts")
    .orderBy("createdAt")
    .startAfter(doc || 0)
    .limit(6);
  const data = await ref.get();

  // output docs
  let template = "";
  data.docs.forEach((doc) => {
    const post = doc.data();
    template += `
      <div class="card">
        <h2>Title ${post.title}</h2>
        <p>Content ${post.content}</p>
        <p>Tab ${post.topic}</p>
      </div>
    `;
  });
  container.innerHTML += template;
  loading.classList.remove("active");

  // update latest doc
  latestDoc = data.docs[data.docs.length - 1];

  // unattach event listeners if no more docs
  if (data.empty) {
    loadMore.removeEventListener("click", handleClick);
    container.removeEventListener("scroll", handleScroll);
  }
};

// load data on DOM loaded
window.addEventListener("DOMContentLoaded", () => getNextReviews());

// load more docs (button)
const loadMore = document.querySelector(".load-more button");

const handleClick = () => {
  getNextReviews(latestDoc);
};

loadMore.addEventListener("click", handleClick);

// load more books (scroll)
const handleScroll = () => {
  let triggerHeight = container.scrollTop + container.offsetHeight;
  if (triggerHeight >= container.scrollHeight) {
    getNextReviews(latestDoc);
  }
};

container.addEventListener("scroll", handleScroll);
