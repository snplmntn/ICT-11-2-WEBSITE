let userName = localStorage.getItem("userName");

const name = document.querySelector("#user-name");
name.textContent = userName;

const logOut = document.querySelector("#logout-button");
const logOutLink = document.querySelector("#logout-link");
const exitBtn = document.querySelector('.btn-close');

logOut.addEventListener("click", function () {
  localStorage.removeItem("userName");
});

function toggleModal() {
  document.querySelector('.overlay').classList.toggle('hidden');
  document.querySelector('.logout-modal').classList.toggle('hidden');
}

logOutLink.addEventListener('click', toggleModal);

exitBtn.addEventListener('click', toggleModal);

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelector('.overlay').classList.add('hidden');
    document.querySelector('.logout-modal').classList.add('hidden');
  }
})