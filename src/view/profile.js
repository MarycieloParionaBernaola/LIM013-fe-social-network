import { currentUser } from '../controller/controller-auth.js';
import {
  updateCurrentUser, updatephotoProfile, updatephotoCover, getPosts,
} from '../controller/controller-firestore.js';

import { sendImgToStorage } from '../controller/controller-storage.js';
import { itemPost } from './post.js';

export default (dataCurrentUser) => {
  const viewProfile = document.createElement('div');
  const userId = currentUser().uid;
  viewProfile.classList.add('profile-container');
  viewProfile.innerHTML = `
  <section class="profile-content">
    <div class="profile-information">
      <div class="cover-page">
        <img class="cover-photo" src="${dataCurrentUser.photoCover}">
      </div>
      <label id="select-cover" for="select-cover-photo">
        <input type="file" id="select-cover-photo" class="hide" accept="image/jpeg, image/png, image/gif">
        <span class="edit-cover"><i class="fas fa-camera edit-photo-btn"><span class="tooltiptext">Select cover photo</span></i></span>
      </label>
      <div class="profile-photo">
        <img class="photo" src="${dataCurrentUser.photo}">
      </div>
      <label id="select-profile" for="select-photo-profile">
        <input type="file" id="select-photo-profile" class="hide" accept="image/jpeg, image/png, image/gif">
        <span class="edit-photo"><i class="fas fa-camera edit-photo-btn"><span class="tooltiptext">Select profile photo</span></i></span>
      </label>
      <div class="user-information">
      <span class = "edit-info" id="btn-editProfile"><i class="fas fa-edit"><span class="tooltiptext">Edit information</span></i></span>
        <h2 class="user-name">${dataCurrentUser.username}</h2>
        <h3>About me</h3>
        <div class="container-grid">
          <div><i class="fas fa-envelope"></i><span>${dataCurrentUser.email}</span></div>
          <div><i class="fas fa-birthday-cake"></i><span>${dataCurrentUser.birthday}</span></div>
          <div><i class="fas fa-mobile-alt"></i><span>${dataCurrentUser.phone}</span></div>
          <div><i class="fas fa-map-marker-alt"></i><span>${dataCurrentUser.country}</span></div>
          <div class="item6"><i class="far fa-id-badge"></i><span>${dataCurrentUser.description}</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class ="container-user-post">
  </section>

  <div class="modal-container">
    <section class="modal-settings">
      <header class="modalHeader">
        <button type="button" class="btn-modalClose"><i class="fa fa-close"></i></button>
        <h3 class="modalTitle">Edit user profile</h2>
        <hr>
      </header>
      <form class="editProfile">
        <div class="grupo">
          <label  for="usernameEdit">User name:</label>
          <input type="text" id="usernameEdit" value="${dataCurrentUser.username}">
        </div>
        <div class="grupo">
          <label  for="emailEdit">Email:</label>
          <input type="text" id="emailEdit" disabled value="${dataCurrentUser.email}">
        </div>
        <div class="grupo">
          <label  for="phoneEdit">Phone number:</label>
          <input type="text" id="phoneEdit" value="${dataCurrentUser.phone}">
        </div>
        <div>
          <label  for="birthdayEdit">Birthday:</label>
          <input type="date" id="birthdayEdit" value="${dataCurrentUser.birthday}">
        </div>
        <div class="grupo">
          <label  for="countryEdit">Country:</label>
          <input type="text" id="countryEdit" value="${dataCurrentUser.country}">
        </div>
        <div class="grupo">
          <label  for="descriptionEdit">Description:</label>
          <textarea id="descriptionEdit">${dataCurrentUser.description}</textarea>
        </div>
        <button type="submit" class="btn-update">UPDATE</button>
      </form>
    </section>
  </div>

  <div class="modal-progress">
    <div class="progress">
      <progress value="0" max="100" id="uploader">0%</progress>
      <p id="messageProgress">0%</p>
    </div>
  </div>
  `;

  // Changing cover photo
  const selectCoverPhoto = viewProfile.querySelector('#select-cover-photo');
  selectCoverPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const refPath = `SN_imgCover/${userId}/${file.name}`;
    const uploadTask = sendImgToStorage(refPath, file);
    const messageProgress = viewProfile.querySelector('#messageProgress');
    const modalProgress = viewProfile.querySelector('.modal-progress');
    const uploader = viewProfile.querySelector('#uploader');
    uploadTask.on('state_changed', (snapshot) => {
      // Handle progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      modalProgress.classList.add('showModal');
      messageProgress.textContent = 'Your cover photo is loading... 🛫';
      uploader.value = progress;
    }, () => {
      // Handle unsuccessful uploads
    }, () => {
      // Handle successful uploads on complete
      uploadTask.snapshot.ref.getDownloadURL()
        .then((downloadURL) => {
          updatephotoCover(currentUser().uid, downloadURL)
            .then(() => window.location.reload());
        });
    });
  });

  // Changing photo profile
  const selectPhotoProfile = viewProfile.querySelector('#select-photo-profile');
  selectPhotoProfile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const refPath = `SN_imgProfile/${userId}/${file.name}`;
    const uploadTask = sendImgToStorage(refPath, file);
    const messageProgress = viewProfile.querySelector('#messageProgress');
    const modalProgress = viewProfile.querySelector('.modal-progress');
    const uploader = viewProfile.querySelector('#uploader');
    uploadTask.on('state_changed', (snapshot) => {
      // Handle progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      modalProgress.classList.add('showModal');
      messageProgress.textContent = 'Your profile photo is loading... 🛫';
      uploader.value = progress;
    }, () => {
      // Handle unsuccessful uploads
    }, () => {
      // Handle successful uploads on complete
      uploadTask.snapshot.ref.getDownloadURL()
        .then((downloadURL) => {
          updatephotoProfile(currentUser().uid, downloadURL)
            .then(() => window.location.reload());
        });
    });
  });

  // Open modal edit user profile
  const formEditProfile = viewProfile.querySelector('.editProfile');
  const modalContainer = viewProfile.querySelector('.modal-container');
  const btnEditProfile = viewProfile.querySelector('#btn-editProfile');
  btnEditProfile.addEventListener('click' || 'touch', () => {
    modalContainer.classList.add('showModal');
  });

  // Close modal edit user profile
  const btnModalClose = viewProfile.querySelector('.btn-modalClose');
  btnModalClose.addEventListener('click' || 'touch', (e) => {
    e.preventDefault();
    modalContainer.classList.remove('showModal');
    formEditProfile.reset();
  });

  // Close modal click outside
  window.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      modalContainer.classList.remove('showModal');
      formEditProfile.reset();
    }
  });

  // Submit modal edit user profile
  formEditProfile.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameEdit = viewProfile.querySelector('#usernameEdit').value;
    const phoneEdit = viewProfile.querySelector('#phoneEdit').value;
    const birthday = viewProfile.querySelector('#birthdayEdit').value;
    const countryEdit = viewProfile.querySelector('#countryEdit').value;
    const descriptionEdit = viewProfile.querySelector('#descriptionEdit').value;
    updateCurrentUser(userId, usernameEdit, phoneEdit, birthday, countryEdit, descriptionEdit)
      .then(() => {
        window.location.reload();
      });
  });

  // Add post to container post
  const containerUserPost = viewProfile.querySelector('.container-user-post');
  getPosts((post) => {
    containerUserPost.innerHTML = '';
    post.forEach((objPost) => {
      if (userId === objPost.userId) {
        containerUserPost.appendChild(itemPost(objPost));
      }
    });
  });
  return viewProfile;
};
