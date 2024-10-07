function r_e(id) {
  return document.querySelector(`#${id}`);
}

function configure_msg_bar(msg) {
  // display message
  r_e("message_bar").innerHTML = msg;
  r_e("message_bar").classList.remove("is-hidden");

  // hide after 3 seconds
  setTimeout(() => {
    r_e("message_bar").classList.add("is-hidden");
    r_e("message_bar").innerHTML = "";
  }, 3000);
}

function del_doc(id, city) {
  com_user = db
    .collection("comments")
    .get()
    .then((data) => {
      let docs = data.docs;
      let user = {};
      docs.forEach((d) => {
        if (d.id == id) {
          user = d.data().user;
          return;
        }
      });
      // deletes if the user wrote the comments
      if (auth.currentUser.email == user) {
        db.collection("comments")
          .doc(`${id}`)
          .delete()
          .then(() => {
            configure_msg_bar("Comment deleted!");
            show_comments(city);
          });
      } else {
        alert("You can only delete your own comments!");
      }
    });
}

function show_comments(city) {
  // input so that refreshes comments specific to city
  db.collection("comments")
    .get()
    .then((data) => {
      city_com = r_e(`${city}_com`);
      let docs = data.docs;
      let city_docs = [];
      docs.forEach((d) => {
        if (d.data().city == city) {
          city_docs.push(d);
        }
      });
      let html = ``;
      city_docs.forEach((d) => {
        html += `<div class="has-background-warning-light" id="${d.id}">
          <button onclick="del_doc('${
            d.id
          }', '${city}')" class="button is-small is-pulled-right has-background-white">X</button>
          <p class="my-2"> ${d.data().user} (${d.data().rating}): ${
          d.data().review
        }</p>
          </div>`;

        city_com.innerHTML = html;
        city_com.classList.remove("is-hidden");
      });
      if (city_docs.length == 0) {
        city_com.innerHTML = `<p class="has-background-warning-light">No comments</p>`;
        city_com.classList.remove("is-hidden");
      }
    });
}

let signupbtn = document.querySelector("#signupbtn");
let signup_modal = document.querySelector("#signup_modal");
let signup_modalbg = document.querySelector("#signup_modalbg");

let signinbtn = document.querySelector("#signinbtn");
let signin_modal = document.querySelector("#signin_modal");
let signin_modalbg = document.querySelector("#signin_modalbg");

r_e("home").addEventListener("click", () => {
  location.reload();
});

r_e("contactus").addEventListener("click", () => {
  ddiv.innerHTML = ` 
  <main class="wrapper">
  <div class="content">
    <div class="columns is-left is-flex is-flex-wrap-wrap is-vcentered">
      <div class="column is-three-quarters-desktop is-full-mobile">
        <form id="response_form" class="box">
          <h2 class="title">Leave Us a Message!</h2>
          <div class="field">
            <label class="label">Name</label>
            <div class="control" id="email_details">
              <input  class="input" type="text" placeholder="Your name" />
            </div>
          </div>
          <div class="field">
            <label class="label">Message</label>
            <div class="control" id="feedback">
              <textarea 
                class="textarea block"
                style="height: 310px"
                placeholder="Your message..."
              ></textarea>
            </div>
          </div>
          <button id="feedback_submit" class="button" type="button">Submit</button>
        </form>
      </div>

      <div id="contactDetails" class="column is-one-quarter">
        <div class="wrapper has-text-centered">
          <div class="phone">
            <i class="fa-solid fa-phone"></i>
            715-257-8326
          </div>
          <div>
            <br />
          </div>
          <div class="email">
            <i class="fa-solid fa-envelope"></i>
            <a href="mailto:help@travelguides.com">help@travelguides.com</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
    `;
});

r_e("plane").addEventListener("click", () => {
  alert("nyoooooom!");
});

function configure_nav_bar(email) {
  let signedinlinks = document.querySelectorAll(".signedin");
  let signedoutlinks = document.querySelectorAll(".signedout");

  if (email) {
    signedinlinks.forEach((l) => {
      l.classList.remove("is-hidden");
    });
    signedoutlinks.forEach((l) => {
      l.classList.add("is-hidden");
    });
  } else {
    signedoutlinks.forEach((l) => {
      l.classList.remove("is-hidden");
    });
    signedinlinks.forEach((l) => {
      l.classList.add("is-hidden");
    });
  }
}

// viewing comments

function comment_buttons(city) {
  r_e(`${city}_button`).addEventListener("click", () => {
    show_comments(city);
    r_e(`${city}_button`).classList.add("is-hidden");
    r_e(`${city}_close`).classList.remove("is-hidden");
  });

  r_e(`${city}_close`).addEventListener("click", () => {
    r_e(`${city}_com`).classList.add("is-hidden");
    r_e(`${city}_close`).classList.add("is-hidden");
    r_e(`${city}_button`).classList.remove("is-hidden");
  });
}

comment_buttons("Mexico_City");
comment_buttons("Istanbul");
comment_buttons("Cancun");
comment_buttons("Kyoto");
comment_buttons("Queenstown");
comment_buttons("Santorini");
comment_buttons("Munich");
comment_buttons("Paris");
comment_buttons("Milan");
comment_buttons("Cairo");
comment_buttons("RioDeJaneiro");

// FILTER AND SEARCH
// the checkboxes and cards
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const cards = document.querySelectorAll(".box");
const close_cities = document.querySelectorAll(".hide");

function updateCardVisibility() {
  let anyChecked = false;

  checkboxes.forEach((checkbox, index) => {
    if (auth.currentUser != null) {
      close_cities.forEach((d) => {
        d.click();
      });
    }
    const card = cards[index];
    if (checkbox.checked) {
      card.classList.remove("is-hidden");
      anyChecked = true;
    } else {
      // card.style.display = "none";
      card.classList.add("is-hidden");
    }
  });

  // Show all cards if no checkboxes are checked
  if (!anyChecked) {
    cards.forEach((card) => {
      card.classList.remove("is-hidden");
    });
  }
}

// SIGN IN / NAVBAR ELEMENTS
r_e("signup_form").addEventListener("submit", (e) => {
  // prevent page from auto-refresh
  e.preventDefault();

  // capture user email and password
  let email = r_e("email").value;
  let pass = r_e("password").value;

  // finish user authentication
  auth
    .createUserWithEmailAndPassword(email, pass)
    .then(() => {
      close_cities.forEach((d) => {
        d.click();
      });
      configure_msg_bar(`user ${auth.currentUser.email} has been created`);

      // hide the modal and clear content
      signup_modal.classList.remove("is-active");
      r_e("signup_form").reset();
      r_e("signup_error").innerHTML = "";
    })
    .catch((error) => {
      r_e("signup_error").innerHTML = error;
      r_e("password").value = "";
    });
});

// on auth state changed
auth.onAuthStateChanged((user) => {
  if (user) {
    r_e("user_email").innerHTML = `${auth.currentUser.email}`;
    configure_nav_bar(auth.currentUser.email);
  } else {
    // alert("no current user")
    r_e("user_email").innerHTML = "";
    configure_nav_bar();
    r_e("reviewForm").reset();

    let hide_rev = document.querySelectorAll(".hide");
    hide_rev.forEach((i) => {
      i.classList.add("is-hidden");
    });
  }
});

// sign out
r_e("signoutbtn").addEventListener("click", () => {
  uncheckAll();
  updateCardVisibility();
  auth.signOut().then(() => {
    // display a message that user signed out
    configure_msg_bar("You are now signed out!");
  });
});

// SIGN IN/UP MODAL ACTIVE BUTTONS
signupbtn.addEventListener("click", () => {
  signup_modal.classList.add("is-active");
});
signup_modalbg.addEventListener("click", () => {
  signup_modal.classList.remove("is-active");
});
signinbtn.addEventListener("click", () => {
  signin_modal.classList.add("is-active");
});
signin_modalbg.addEventListener("click", () => {
  signin_modal.classList.remove("is-active");
});

// interact with sign in form
r_e("signin_form").addEventListener("submit", (e) => {
  e.preventDefault();

  let email = r_e("email_").value;
  let pass = r_e("password_").value;

  auth
    .signInWithEmailAndPassword(email, pass)
    .then((user) => {
      close_cities.forEach((d) => {
        d.click();
      });
      configure_msg_bar(`${auth.currentUser.email} signed in`);

      signin_modal.classList.remove("is-active");
      r_e("signin_form").reset();
      r_e("signin_error").innerHTML = "";
    })
    .catch((error) => {
      if (
        error.code == "auth/internal-error"
        // "Error: {'error':{'code':400,'message':'INVALID_LOGIN_CREDENTIALS','errors':[{'message':'INVALID_LOGIN_CREDENTIALS','domain':'global','reason':'invalid'}]}}"
      ) {
        error = "Error: invalid login credentials";
      }
      r_e("signin_error").innerHTML = error;
      r_e("password_").value = "";
    });
});

// CODE FOR CONTACT US PAGE
document.getElementById("ddiv").addEventListener("click", function (e) {
  // Check if the clicked element is the one we want (e.g., the submit button)
  if (e.target && e.target.id === "feedback_submit") {
    e.preventDefault();

    // Collect the email and message from the form
    let email = document.querySelector("#email_details input").value;
    let feedback = document.querySelector("#feedback textarea").value;

    let message = {
      name: email,
      feedback: feedback,
      timestamp: new Date().toISOString(),
    };

    // Save the feedback message to the database
    db.collection("feedback")
      .add(message)
      .then(() => {
        // Feedback saved successfully
        configure_msg_bar("Your feedback has been submitted successfully!");
        // alert("Your feedback has been submitted successfully!");
        // Reset the form after submission
        document.getElementById("response_form").reset();
      })
      .catch((error) => {
        // Handle any errors here
        // console.error("Error writing document: ", error);
      });
  }
});

function uncheckAll() {
  // Get all checkboxes using querySelectorAll
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // Loop through each checkbox
  checkboxes.forEach(function (checkbox) {
    // Uncheck the checkbox
    checkbox.checked = false;
  });
}

// Filter Search button
r_e("filter_search").addEventListener("click", updateCardVisibility);

// COMMENTS CODE
// submitting review
r_e("review_submit").addEventListener("click", (e) => {
  let review_city = r_e("filterDropdown").value;
  let review = r_e("reviewMessage").value;
  let review_rating = document.querySelector(
    'input[type="radio"][name="rating"]:checked'
  ).value;

  let user_review = {
    city: review_city,
    review: review,
    rating: review_rating,
    user: `${auth.currentUser.email}`,
  };

  db.collection("comments")
    .add(user_review)
    .then(() => {
      configure_msg_bar(`Your review of ${user_review.city} was added!`);
      r_e("reviewForm").reset();
      if (!r_e(`${user_review.city}_close`).classList.contains("is-hidden")) {
        show_comments(review_city);
      }
    });
});
