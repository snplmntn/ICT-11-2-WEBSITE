let userName = localStorage.getItem("userName");

const name = document.querySelector("#user-name");
name.textContent = userName;

const logOut = document.querySelector("#logout-button");
const logOutLink = document.querySelector("#logout-link");
const exitBtn = document.querySelectorAll('.btn-close');
const announce = document.querySelector('#add-announcement');

logOut.addEventListener("click", function () {
  localStorage.removeItem("userName");
});

function toggleModal() {
  document.querySelector('.overlay').classList.add('hidden');
  document.querySelector('.logout-modal').classList.add('hidden');
  document.querySelector('.announce-container').classList.add('hidden');
}

logOutLink.addEventListener('click', function () {
  document.querySelector('.overlay').classList.remove('hidden');
  document.querySelector('.logout-modal').classList.remove('hidden');
});

exitBtn.forEach(btn => {
  btn.addEventListener('click', toggleModal);
});
// exitBtn.addEventListener('click', toggleModal);

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelector('.overlay').classList.add('hidden');
    document.querySelector('.logout-modal').classList.add('hidden');
    document.querySelector('.announce-container').classList.add('hidden');
  }
})

announce.addEventListener('click', function () {
  document.querySelector('.announce-container').classList.remove('hidden');
  document.querySelector('.overlay').classList.toggle('hidden');
});


//add new announcement
const submitAnnounce = document.querySelector('#submit-btn');
const announceContainer = document.querySelector('#new-announcements');


submitAnnounce.addEventListener('click', function () {
  //CREATE NEW ELEMENTS
  const divCreate = document.createElement('div');
  const titleCreate = document.createElement('h2');
  const contentCreate = document.createElement('p');

  const titleValue = document.querySelector('#title');
  const contentValue = document.querySelector('#content');
  const titleArrays = [];
  const contentArrays = [];
  let i = 0;
  titleArrays.push(titleValue.value);
  contentArrays.push(contentValue.value);

  titleCreate.innerHTML = titleArrays[i];
  contentCreate.innerHTML = contentArrays[i];
  i++;

  announceContainer.appendChild(divCreate);
  divCreate.appendChild(titleCreate);
  divCreate.appendChild(contentCreate);
  titleValue.value = ''
  contentValue.value = ''
  toggleModal();
});