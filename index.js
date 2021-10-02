$(function () {
  const container = document.querySelector(".container");
  const loading = document.querySelector(".loading");

  // store last document retrieved
  let latestDoc = null;

  const getNextReviews = async (doc) => {
    loading.classList.add("active");

    const ref = db
      // .collection("Posts")
      // //  .where("approved", "==", true)
      // .orderBy("createdAt")
      // .startAfter(doc || 0)
      // .limit(6)
      .collection("Posts")
      // .where("topic", "==", "2")
      //.where("approved", "==", true)
      // .limit(5)
      .orderBy("createdAt", "desc")

      .onSnapshot({
        next: (data) => {
          //const data = await ref.get();

          // output docs
          let template = "";

          data.forEach((doc) => {
            const post = doc.data();
            template += `
      <div class="card">
        <h4>Title : ${post.title}</h4><p>${post.createdAt
              .toDate()
              .toDateString()}</p>
        <p>Content : ${post.content}</p>
        <p>Tab : ${(() => {
          if (post.topic == 1) return "Story";
          if (post.topic == 2) return "Jokes";
          if (post.topic == 3) return "Riddle";
        })()}</p>
        ${
          post.approved
            ? `<button id="approved" class="btn btn-success" data-button=${doc.id} >Unpublish</input>`
            : `<button id="approve" class="btn btn-warning" data-button=${doc.id} >Publish</input>`
        }</p>
      
        <button id="delete" class="btn btn-danger" data-button=${
          doc.id
        } >Delete</input>
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
        },
      });
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
});

$(".container").on("click", "#approve", function () {
  var docId = $(this).attr("data-button");

  // alert(docId);
  db.collection("Posts")
    .doc(docId)
    .set(
      {
        approved: true,
        approvedAt: new Date(),
      },
      { merge: true }
    )
    .then(() => {
      alert("Post Approved");
      location.reload();
    });
});
$(".container").on("click", "#approved", function () {
  var docId = $(this).attr("data-button");
  db.collection("Posts")
    .doc(docId)
    .set(
      {
        approved: false,
        approvedAt: new Date(),
      },
      { merge: true }
    )
    .then(() => {
      alert("Post Unpublished");
      location.reload();
    });
});

$(".container").on("click", "#delete", function () {
  var docId = $(this).attr("data-button");
  //alert(docId);
  if (confirm("Are you sure you want to delete this post?")) {
    db.collection("Posts")
      .doc(docId)
      .delete()
      .then(() => {
        alert("Post Deleted!");
        location.reload();
      })
      .catch((error) => {
        console.log("Error Deleting Post", error);
      });
  }
});
$("#myModal").on("click", "#submitPost", function () {
  // alert("asd");
  db.collection("Posts")
    .add({
      title: $("#postTitle").val(),
      content: $("#postContent").val(),
      topic: $("#postTopic :selected").val(),
      createdAt: new Date(),
      approved: false,
    })
    .then(() => {
      alert("Post Added Successfully!!!");
      location.reload();
    });
});
